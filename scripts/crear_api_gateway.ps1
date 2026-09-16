# ============================================================
# Script PowerShell: Crear AWS HTTP API Gateway para RecicLaGo
# Usa la API REST de AWS directamente (sin necesitar AWS CLI)
# ============================================================

param(
    [string]$AccessKeyId     = $env:AWS_ACCESS_KEY_ID,
    [string]$SecretAccessKey = $env:AWS_SECRET_ACCESS_KEY,
    [string]$SessionToken    = $env:AWS_SESSION_TOKEN,
    [string]$Region          = $(if ($env:AWS_DEFAULT_REGION) { $env:AWS_DEFAULT_REGION } else { "us-east-1" })
)

# ── VARIABLES DEL PROYECTO ─────────────────────────────────
$EC2_IP       = "54.226.18.43"
$EC2_PORT     = "8080"
$API_NAME     = "reciclago-api-gateway"
$ENTRA_TENANT = "5625266d-cae0-4070-a7ea-b5e88273580f"
$ENTRA_CLIENT = "9a946a0b-5350-4fe1-a79e-ca332612f60d"
$ENTRA_ISSUER = "https://login.microsoftonline.com/$ENTRA_TENANT/v2.0"
$ENTRA_AUD    = "api://$ENTRA_CLIENT"

# ── FUNCIONES AWS SIGV4 ────────────────────────────────────
function Get-HmacSha256 {
    param([byte[]]$Key, [string]$Data)
    $hmac = New-Object System.Security.Cryptography.HMACSHA256
    $hmac.Key = $Key
    return $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($Data))
}

function Get-Sha256Hash {
    param([string]$Data)
    $sha256 = [System.Security.Cryptography.SHA256]::Create()
    $bytes = $sha256.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($Data))
    return ($bytes | ForEach-Object { $_.ToString("x2") }) -join ""
}

function Invoke-AwsRequest {
    param(
        [string]$Method,
        [string]$Service,
        [string]$Path,
        [hashtable]$Body = @{},
        [hashtable]$QueryParams = @{}
    )

    $host_ = "$Service.$Region.amazonaws.com"
    $uri   = "https://$host_$Path"
    if ($QueryParams.Count -gt 0) {
        $qs = ($QueryParams.GetEnumerator() | Sort-Object Key | ForEach-Object { "$($_.Key)=$([Uri]::EscapeDataString($_.Value))" }) -join "&"
        $uri += "?$qs"
    }

    $now        = [DateTime]::UtcNow
    $amzDate    = $now.ToString("yyyyMMddTHHmmssZ")
    $dateStamp  = $now.ToString("yyyyMMdd")
    $bodyJson   = if ($Body.Count -gt 0) { $Body | ConvertTo-Json -Compress } else { "" }
    $bodyHash   = Get-Sha256Hash -Data $bodyJson

    $canonicalHeaders = "content-type:application/json`nhost:$host_`nx-amz-date:$amzDate`nx-amz-security-token:$SessionToken`n"
    $signedHeaders    = "content-type;host;x-amz-date;x-amz-security-token"
    $canonicalUri     = $Path
    $canonicalQS      = if ($QueryParams.Count -gt 0) { ($QueryParams.GetEnumerator() | Sort-Object Key | ForEach-Object { "$($_.Key)=$([Uri]::EscapeDataString($_.Value))" }) -join "&" } else { "" }
    $canonicalRequest = "$Method`n$canonicalUri`n$canonicalQS`n$canonicalHeaders`n$signedHeaders`n$bodyHash"

    $credentialScope = "$dateStamp/$Region/$Service/aws4_request"
    $stringToSign    = "AWS4-HMAC-SHA256`n$amzDate`n$credentialScope`n$(Get-Sha256Hash -Data $canonicalRequest)"

    $signingKey = Get-HmacSha256 -Key ([System.Text.Encoding]::UTF8.GetBytes("AWS4$SecretAccessKey")) -Data $dateStamp
    $signingKey = Get-HmacSha256 -Key $signingKey -Data $Region
    $signingKey = Get-HmacSha256 -Key $signingKey -Data $Service
    $signingKey = Get-HmacSha256 -Key $signingKey -Data "aws4_request"
    $signature  = (Get-HmacSha256 -Key $signingKey -Data $stringToSign | ForEach-Object { $_.ToString("x2") }) -join ""

    $authHeader = "AWS4-HMAC-SHA256 Credential=$AccessKeyId/$credentialScope, SignedHeaders=$signedHeaders, Signature=$signature"

    $headers = @{
        "x-amz-date"           = $amzDate
        "x-amz-security-token" = $SessionToken
        "Authorization"        = $authHeader
        "Content-Type"         = "application/json"
    }

    try {
        $response = Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $bodyJson -ErrorAction Stop
        return $response
    } catch {
        $msg = $_.Exception.Response
        if ($msg) {
            $reader = New-Object System.IO.StreamReader($msg.GetResponseStream())
            $errBody = $reader.ReadToEnd()
            Write-Error "AWS Error: $errBody"
        } else {
            Write-Error "Error: $_"
        }
        throw
    }
}

# ══════════════════════════════════════════════════════════
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🌐 RecicLaGo — Creación de AWS HTTP API Gateway" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ── PASO 1: Crear HTTP API ─────────────────────────────────
Write-Host "📡 Paso 1/5: Creando HTTP API '$API_NAME'..." -ForegroundColor Yellow
$apiBody = @{
    Name         = $API_NAME
    ProtocolType = "HTTP"
    CorsConfiguration = @{
        AllowOrigins = @(
            "https://reciclago-frontend-puertovaras.s3.us-east-1.amazonaws.com"
            "http://reciclago-frontend-puertovaras.s3-website-us-east-1.amazonaws.com"
            "http://localhost:4200"
        )
        AllowMethods     = @("GET","POST","PUT","PATCH","DELETE","OPTIONS")
        AllowHeaders     = @("Authorization","Content-Type","Accept")
        AllowCredentials = $true
        MaxAge           = 300
    }
}
$apiResult = Invoke-AwsRequest -Method POST -Service apigateway -Path "/v2/apis" -Body $apiBody
$API_ID = $apiResult.ApiId
Write-Host "✅ HTTP API creada: $API_ID" -ForegroundColor Green

# ── PASO 2: Crear integración HTTP_PROXY ──────────────────
Write-Host "`n🔗 Paso 2/5: Creando integración → http://$EC2_IP`:$EC2_PORT..." -ForegroundColor Yellow
$intBody = @{
    IntegrationType   = "HTTP_PROXY"
    IntegrationMethod = "ANY"
    IntegrationUri    = "http://$EC2_IP`:$EC2_PORT/{proxy}"
    PayloadFormatVersion = "1.0"
}
$intResult = Invoke-AwsRequest -Method POST -Service apigateway -Path "/v2/apis/$API_ID/integrations" -Body $intBody
$INTEGRATION_ID = $intResult.IntegrationId
Write-Host "✅ Integración creada: $INTEGRATION_ID" -ForegroundColor Green

# ── PASO 3: Crear JWT Authorizer ──────────────────────────
Write-Host "`n🔑 Paso 3/5: Creando JWT Authorizer (Entra ID)..." -ForegroundColor Yellow
$authBody = @{
    AuthorizerType   = "JWT"
    IdentitySource   = '$request.header.Authorization'
    Name             = "EntraIdAuthorizer"
    JwtConfiguration = @{
        Issuer   = $ENTRA_ISSUER
        Audience = @($ENTRA_AUD)
    }
}
$authResult = Invoke-AwsRequest -Method POST -Service apigateway -Path "/v2/apis/$API_ID/authorizers" -Body $authBody
$AUTHORIZER_ID = $authResult.AuthorizerId
Write-Host "✅ JWT Authorizer creado: $AUTHORIZER_ID" -ForegroundColor Green

# ── PASO 4: Crear rutas ───────────────────────────────────
Write-Host "`n🛤️  Paso 4/5: Creando rutas..." -ForegroundColor Yellow

# OPTIONS (CORS preflight — sin autenticación)
$r1 = Invoke-AwsRequest -Method POST -Service apigateway -Path "/v2/apis/$API_ID/routes" -Body @{
    RouteKey = "OPTIONS /{proxy+}"
    Target   = "integrations/$INTEGRATION_ID"
}
Write-Host "  ✅ OPTIONS /{proxy+}  [sin auth — CORS preflight]" -ForegroundColor Green

# ANY /api/{proxy+} — CON JWT Authorizer
$r2 = Invoke-AwsRequest -Method POST -Service apigateway -Path "/v2/apis/$API_ID/routes" -Body @{
    RouteKey          = "ANY /api/{proxy+}"
    Target            = "integrations/$INTEGRATION_ID"
    AuthorizationType = "JWT"
    AuthorizerId      = $AUTHORIZER_ID
}
Write-Host "  ✅ ANY /api/{proxy+}  [JWT Authorizer Entra ID]" -ForegroundColor Green

# GET /actuator/health — sin autenticación
$r3 = Invoke-AwsRequest -Method POST -Service apigateway -Path "/v2/apis/$API_ID/routes" -Body @{
    RouteKey = "GET /actuator/health"
    Target   = "integrations/$INTEGRATION_ID"
}
Write-Host "  ✅ GET /actuator/health  [sin auth — health check]" -ForegroundColor Green

# ── PASO 5: Crear stage $default ─────────────────────────
Write-Host "`nPaso 5/5: Desplegando stage default..." -ForegroundColor Yellow
$stageResult = Invoke-AwsRequest -Method POST -Service apigateway -Path "/v2/apis/$API_ID/stages" -Body @{
    StageName  = "`$default"
    AutoDeploy = $true
}
Write-Host "Stage desplegado con auto-deploy activado" -ForegroundColor Green

# ── RESULTADO FINAL ───────────────────────────────────────
$API_URL = "https://$API_ID.execute-api.$Region.amazonaws.com"
Write-Host "" 
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "   API GATEWAY CREADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "   URL del API Gateway:" -ForegroundColor White
Write-Host "   $API_URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "   PROXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "   1. GitHub Secrets -> agregar: APIGW_URL = $API_URL" -ForegroundColor Cyan
Write-Host "   2. Re-run pipeline frontend -> compilara Angular con esta URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Prueba (sin token):" -ForegroundColor White
Write-Host "   Invoke-RestMethod $API_URL/actuator/health" -ForegroundColor DarkGray
Write-Host ""
Write-Host "   API_ID = $API_ID" -ForegroundColor DarkGray

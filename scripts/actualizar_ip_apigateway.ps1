# ============================================================
# Script: Actualizar IP de EC2 en API Gateway y comprobación
# ============================================================

param(
    [string]$NewIp           = "100.62.97.86",
    [string]$ApiId           = "t6qzw3wx3f",
    [string]$AccessKeyId     = $env:AWS_ACCESS_KEY_ID,
    [string]$SecretAccessKey = $env:AWS_SECRET_ACCESS_KEY,
    [string]$SessionToken    = $env:AWS_SESSION_TOKEN,
    [string]$Region          = "us-east-1"
)

if (-not $AccessKeyId -or -not $SecretAccessKey -or -not $SessionToken) {
    Write-Host "⚠️  Faltan credenciales de AWS. Pásalas por parámetros o variables de entorno:" -ForegroundColor Yellow
    Write-Host "   .\scripts\actualizar_ip_apigateway.ps1 -AccessKeyId '...' -SecretAccessKey '...' -SessionToken '...'" -ForegroundColor Cyan
    exit 1
}

function Get-HmacSha256Bytes {
    param([byte[]]$Key, [string]$Data)
    $hmac = New-Object System.Security.Cryptography.HMACSHA256
    $hmac.Key = $Key
    return $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($Data))
}
function Get-Sha256Hex {
    param([string]$Data)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    return ($sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($Data)) | ForEach-Object { $_.ToString("x2") }) -join ""
}
function Invoke-AwsApiGW {
    param([string]$Method, [string]$Path, [object]$Body = $null)
    $svc     = "apigateway"
    $awsHost = "apigateway.$Region.amazonaws.com"
    $uri     = "https://$awsHost$Path"
    $now     = [DateTime]::UtcNow
    $amzDate   = $now.ToString("yyyyMMddTHHmmssZ")
    $dateStamp = $now.ToString("yyyyMMdd")
    $bodyJson  = if ($Body) { $Body | ConvertTo-Json -Depth 10 -Compress } else { "" }
    $bodyHash  = Get-Sha256Hex -Data $bodyJson

    $canonicalHeaders = "content-type:application/json`nhost:$awsHost`nx-amz-date:$amzDate`nx-amz-security-token:$SessionToken`n"
    $signedHeaders    = "content-type;host;x-amz-date;x-amz-security-token"
    $canonicalRequest = "$Method`n$Path`n`n$canonicalHeaders`n$signedHeaders`n$bodyHash"

    $scope = "$dateStamp/$Region/$svc/aws4_request"
    $stringToSign = "AWS4-HMAC-SHA256`n$amzDate`n$scope`n$(Get-Sha256Hex -Data $canonicalRequest)"

    $kDate    = Get-HmacSha256Bytes -Key ([System.Text.Encoding]::UTF8.GetBytes("AWS4$SecretAccessKey")) -Data $dateStamp
    $kRegion  = Get-HmacSha256Bytes -Key $kDate -Data $Region
    $kService = Get-HmacSha256Bytes -Key $kRegion -Data $svc
    $kSigning = Get-HmacSha256Bytes -Key $kService -Data "aws4_request"
    $signature = (Get-HmacSha256Bytes -Key $kSigning -Data $stringToSign | ForEach-Object { $_.ToString("x2") }) -join ""

    $authHeader = "AWS4-HMAC-SHA256 Credential=$AccessKeyId/$scope, SignedHeaders=$signedHeaders, Signature=$signature"
    $headers = @{
        "x-amz-date"           = $amzDate
        "x-amz-security-token" = $SessionToken
        "Authorization"        = $authHeader
        "Content-Type"         = "application/json"
    }

    if ($bodyJson) {
        return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $bodyJson
    } else {
        return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers
    }
}

Write-Host "Obteniendo integraciones del API Gateway ($ApiId)..." -ForegroundColor Yellow
$ints = Invoke-AwsApiGW -Method GET -Path "/v2/apis/$ApiId/integrations"
$intId = $ints.items[0].integrationId
Write-Host "Integración encontrada: $intId" -ForegroundColor DarkGray
Write-Host "URI anterior: $($ints.items[0].integrationUri)" -ForegroundColor DarkGray

$newUri = "http://$NewIp`:8080/{proxy}"
Write-Host "Actualizando a: $newUri ..." -ForegroundColor Yellow

$res = Invoke-AwsApiGW -Method PATCH -Path "/v2/apis/$ApiId/integrations/$intId" -Body @{ IntegrationUri = $newUri }
Write-Host "✅ Integración actualizada exitosamente a: $($res.integrationUri)" -ForegroundColor Green

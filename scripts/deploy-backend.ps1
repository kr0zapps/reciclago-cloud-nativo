# ==============================================================================
# Script de Despliegue Manual Backend a AWS ECR (PowerShell - DEV 2)
# Proyecto: RecicLaGo Cloud Native -- Municipalidad de Puerto Varas
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  DESPLIEGUE MANUAL BACKEND RECICLAGO -> AWS ECR          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$REGION = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }

Write-Host "Verificando credenciales de AWS..." -ForegroundColor Yellow
try {
    $ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
    $CALLER_ARN = (aws sts get-caller-identity --query Arn --output text)
    Write-Host "Autenticado como: $CALLER_ARN (Cuenta: $ACCOUNT_ID)" -ForegroundColor Green
} catch {
    Write-Error "Error: No se pudieron obtener las credenciales de AWS. Configura tus variables de entorno AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY y AWS_SESSION_TOKEN."
    exit 1
}

$REGISTRY = "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

Write-Host "`nAutenticando Docker en Amazon ECR ($REGISTRY)..." -ForegroundColor Yellow
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REGISTRY

# 1. Asegurar creacion de repositorios en ECR
$repos = @("reciclago/ms-bff", "reciclago/ms-catalog", "reciclago/ms-pickups", "reciclago/ms-routes")
foreach ($repo in $repos) {
    Write-Host "Verificando repositorio ECR: $repo..." -ForegroundColor Yellow
    $null = aws ecr describe-repositories --repository-names $repo --region $REGION 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creando repositorio ECR: $repo..." -ForegroundColor Cyan
        aws ecr create-repository --repository-name $repo --region $REGION | Out-Null
    }
}

# 2. Construir y Subir BFF
Write-Host "`n[1/4] Compilando y subiendo ms-bff..." -ForegroundColor Yellow
docker build -t "$REGISTRY/reciclago/ms-bff:latest" ./ms-reciclago-bff
docker push "$REGISTRY/reciclago/ms-bff:latest"

# 3. Construir y Subir Catalogo
Write-Host "`n[2/4] Compilando y subiendo ms-catalog..." -ForegroundColor Yellow
docker build -t "$REGISTRY/reciclago/ms-catalog:latest" ./ms-reciclago-catalog
docker push "$REGISTRY/reciclago/ms-catalog:latest"

# 4. Construir y Subir Retiros
Write-Host "`n[3/4] Compilando y subiendo ms-pickups..." -ForegroundColor Yellow
docker build -t "$REGISTRY/reciclago/ms-pickups:latest" ./ms-reciclago-pickups
docker push "$REGISTRY/reciclago/ms-pickups:latest"

# 5. Construir y Subir Rutas
Write-Host "`n[4/4] Compilando y subiendo ms-routes..." -ForegroundColor Yellow
docker build -t "$REGISTRY/reciclago/ms-routes:latest" ./ms-reciclago-routes
docker push "$REGISTRY/reciclago/ms-routes:latest"

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  TODAS LAS IMAGENES PUBLICADAS EXITOSAMENTE EN ECR       " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "`nPara levantar los servicios en tu maquina o en EC2 ejecuta:"
Write-Host "  docker compose up -d" -ForegroundColor Cyan

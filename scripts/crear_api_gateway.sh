#!/bin/bash
# ============================================================
# Script: crear_api_gateway.sh
# Descripción: Crea el AWS HTTP API Gateway con JWT Authorizer
#              de Microsoft Entra ID para RecicLaGo
#
# USO:
#   1. Configura tus credenciales AWS antes de ejecutar:
#      export AWS_ACCESS_KEY_ID="ASIA..."
#      export AWS_SECRET_ACCESS_KEY="..."
#      export AWS_SESSION_TOKEN="..."
#      export AWS_DEFAULT_REGION="us-east-1"
#
#   2. Edita las variables de EC2 abajo si cambió la IP
#   3. Ejecuta: bash crear_api_gateway.sh
# ============================================================

set -e

# ── VARIABLES ────────────────────────────────────────────────
EC2_IP="54.226.18.43"
EC2_PORT="8080"
EC2_URL="http://${EC2_IP}:${EC2_PORT}"
REGION="${AWS_DEFAULT_REGION:-us-east-1}"
API_NAME="reciclago-api-gateway"

# Microsoft Entra ID (Azure AD) — no cambiar
ENTRA_TENANT_ID="5625266d-cae0-4070-a7ea-b5e88273580f"
ENTRA_CLIENT_ID="9a946a0b-5350-4fe1-a79e-ca332612f60d"
ENTRA_ISSUER="https://login.microsoftonline.com/${ENTRA_TENANT_ID}/v2.0"
ENTRA_AUDIENCE="api://${ENTRA_CLIENT_ID}"

# CORS — orígenes permitidos (S3)
S3_ORIGIN_STATIC="https://reciclago-frontend-puertovaras.s3.us-east-1.amazonaws.com"
S3_ORIGIN_WEBSITE="http://reciclago-frontend-puertovaras.s3-website-us-east-1.amazonaws.com"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "   🌐 RecicLaGo — Creación de AWS HTTP API Gateway"
echo "═══════════════════════════════════════════════════════"
echo ""

# ── PASO 1: Verificar identidad AWS ─────────────────────────
echo "🔍 Verificando credenciales AWS..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ Cuenta AWS: $ACCOUNT_ID | Región: $REGION"
echo ""

# ── PASO 2: Crear la HTTP API ─────────────────────────────
echo "📡 Paso 1/5: Creando HTTP API '${API_NAME}'..."

# Verificar si ya existe
EXISTING_API=$(aws apigatewayv2 get-apis \
  --region "$REGION" \
  --query "Items[?Name=='${API_NAME}'].ApiId" \
  --output text 2>/dev/null || echo "")

if [ -n "$EXISTING_API" ] && [ "$EXISTING_API" != "None" ]; then
  API_ID="$EXISTING_API"
  echo "ℹ️  La API '${API_NAME}' ya existe con ID: $API_ID"
else
  API_ID=$(aws apigatewayv2 create-api \
    --name "$API_NAME" \
    --protocol-type HTTP \
    --region "$REGION" \
    --cors-configuration \
      AllowOrigins="$S3_ORIGIN_STATIC","$S3_ORIGIN_WEBSITE","http://localhost:4200",\
"https://reciclago-frontend-puertovaras.s3.amazonaws.com" \
      ,AllowMethods="GET,POST,PUT,PATCH,DELETE,OPTIONS" \
      ,AllowHeaders="Authorization,Content-Type,Accept" \
      ,AllowCredentials=true \
      ,MaxAge=300 \
    --query "ApiId" \
    --output text)
  echo "✅ HTTP API creada con ID: $API_ID"
fi
echo ""

# ── PASO 3: Crear la integración HTTP_PROXY → EC2 ────────
echo "🔗 Paso 2/5: Creando integración HTTP_PROXY hacia ${EC2_URL}..."

INTEGRATION_ID=$(aws apigatewayv2 create-integration \
  --api-id "$API_ID" \
  --integration-type HTTP_PROXY \
  --integration-method ANY \
  --integration-uri "${EC2_URL}/{proxy}" \
  --payload-format-version "1.0" \
  --region "$REGION" \
  --query "IntegrationId" \
  --output text)

echo "✅ Integración creada con ID: $INTEGRATION_ID"
echo ""

# ── PASO 4: Crear el JWT Authorizer (Entra ID) ───────────
echo "🔑 Paso 3/5: Creando JWT Authorizer para Microsoft Entra ID..."

AUTHORIZER_ID=$(aws apigatewayv2 create-authorizer \
  --api-id "$API_ID" \
  --authorizer-type JWT \
  --identity-source '$request.header.Authorization' \
  --name "EntraIdAuthorizer" \
  --jwt-configuration \
    Issuer="$ENTRA_ISSUER",Audience="$ENTRA_AUDIENCE" \
  --region "$REGION" \
  --query "AuthorizerId" \
  --output text)

echo "✅ JWT Authorizer creado con ID: $AUTHORIZER_ID"
echo ""

# ── PASO 5: Crear rutas ───────────────────────────────────
echo "🛤️  Paso 4/5: Creando rutas..."

# Ruta pública OPTIONS (preflight CORS — sin autenticación)
echo "  → OPTIONS /{proxy+}  [SIN authorizer — CORS preflight]"
aws apigatewayv2 create-route \
  --api-id "$API_ID" \
  --route-key "OPTIONS /{proxy+}" \
  --target "integrations/$INTEGRATION_ID" \
  --region "$REGION" \
  --output text > /dev/null

# Ruta protegida: ANY /api/{proxy+} con JWT Authorizer
echo "  → ANY /api/{proxy+}  [CON JWT Authorizer de Entra ID]"
aws apigatewayv2 create-route \
  --api-id "$API_ID" \
  --route-key "ANY /api/{proxy+}" \
  --target "integrations/$INTEGRATION_ID" \
  --authorization-type JWT \
  --authorizer-id "$AUTHORIZER_ID" \
  --region "$REGION" \
  --output text > /dev/null

# Ruta de health check pública (sin token)
echo "  → GET /actuator/health  [SIN authorizer — health check]"
aws apigatewayv2 create-route \
  --api-id "$API_ID" \
  --route-key "GET /actuator/health" \
  --target "integrations/$INTEGRATION_ID" \
  --region "$REGION" \
  --output text > /dev/null

echo "✅ Rutas creadas correctamente"
echo ""

# ── PASO 6: Crear y desplegar el stage $default ──────────
echo "🚀 Paso 5/5: Desplegando stage '\$default'..."

STAGE_NAME="\$default"
aws apigatewayv2 create-stage \
  --api-id "$API_ID" \
  --stage-name "$STAGE_NAME" \
  --auto-deploy \
  --region "$REGION" \
  --output text > /dev/null

echo "✅ Stage '\$default' desplegado con auto-deploy activado"
echo ""

# ── RESULTADO FINAL ───────────────────────────────────────
API_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com"

echo "═══════════════════════════════════════════════════════"
echo "   ✅ API GATEWAY CREADO EXITOSAMENTE"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "   🌐 URL del API Gateway:"
echo "   ${API_URL}"
echo ""
echo "   📋 PRÓXIMOS PASOS:"
echo "   1. Copia la URL de arriba"
echo "   2. Actualiza el secret 'EC2_HOST' en GitHub por:"
echo "      ${API_ID}.execute-api.${REGION}.amazonaws.com"
echo "      (sin https:// y sin puerto)"
echo "   3. O actualiza APIGW_URL con el valor completo."
echo "   4. Vuelve a correr el pipeline del frontend."
echo ""
echo "   🧪 Prueba rápida (sin token — health check):"
echo "   curl ${API_URL}/actuator/health"
echo ""
echo "   🔐 Prueba con token JWT:"
echo "   curl -H 'Authorization: Bearer <TOKEN>' ${API_URL}/api/catalog/residuos"
echo ""
echo "   📊 ID de la API (guardar este valor):"
echo "   API_ID = ${API_ID}"
echo ""

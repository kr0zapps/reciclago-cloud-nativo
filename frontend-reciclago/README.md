# RecicLaGo - Frontend Web (Angular 18 SPA)

Portal ciudadano y administrativo municipal para la gestion del reciclaje puerta a puerta en Puerto Varas.

## Tecnologias Principales
- **Framework:** Angular 18 (Standalone Components, Control Flow `@if/@for`, View Transitions).
- **Estilos:** Tailwind CSS con paleta civica municipal (Lago Llanquihue y Volcan Osorno).
- **Autenticacion:** `@azure/msal-browser` y `@azure/msal-angular` 3.x (OAuth2 / OIDC).
- **Seguridad Cloud:** Arquitectura de Doble Aplicacion (Double App) con Microsoft Entra ID.

---

## Configuracion Microsoft Entra ID (Doble Aplicacion)

El frontend interactua con dos registros de aplicacion en Azure Entra ID:

| Aplicacion | Client ID | Rol en la Arquitectura |
|---|---|---|
| **App 1 (Frontend SPA)** | `20ae8f6f-ef82-48a6-a4ae-897d36212b4b` | Cliente publico (SPA) con flujo PKCE. |
| **App 2 (Backend API)** | `9a946a0b-5350-4fe1-a79e-ca332612f60d` | Resource Server. Expone el scope y los roles. |

- **Tenant ID:** `5625266d-cae0-4070-a7ea-b5e88273580f`
- **Scope Solicitado:** `api://9a946a0b-5350-4fe1-a79e-ca332612f60d/access_as_user`
- **Redirect URIs Autorizadas:**
  - `http://localhost:4200` (desarrollo local)
  - `https://reciclago-frontend-puertovaras.s3.us-east-1.amazonaws.com/index.html` (despliegue AWS S3)

---

## Comandos de Desarrollo

### Instalar dependencias
```bash
npm install
```

### Ejecutar localmente
```bash
npm start
# o
ng serve
```
Disponible en `http://localhost:4200/`.

### Compilar para produccion
```bash
npm run build
```
Genera los archivos compilados en `dist/frontend-reciclago/browser`.

---

## Despliegue en AWS S3
El despliegue esta automatizado mediante GitHub Actions en `.github/workflows/deploy-frontend.yml` al hacer push a la rama `main`.
URL de produccion:
`http://reciclago-frontend-puertovaras.s3-website-us-east-1.amazonaws.com`

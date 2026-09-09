# ♻️ RecicLaGo - Plataforma Cloud Native

Plataforma unificada para la gestión, solicitud y coordinación de retiros de residuos reciclables para municipios y vecinos, implementada bajo una arquitectura de microservicios orientada a eventos.

---

## 📋 Pauta de Evaluación EP1 - DSY1107 (Resumen)

> **Ponderación:** 16% de la nota final | **Modalidad:** Parejas | **Plazo:** 2 semanas

### Indicadores de Evaluación

| Indicador | Peso | Qué Evalúa |
|:---|:---:|:---|
| **Indicador 1** | **60%** | Angular + MSAL: login/logout funcional, `MsalGuard` en rutas, `MsalInterceptor` adjunta JWT, obtención de tokens para consumir API Gateway, lectura de roles y scopes desde claims |
| **Indicador 2** | **40%** | BFF valida JWT: verifica `issuer` y `audience`, firma criptográfica, vigencia/expiración (`exp`), autorización por rol, códigos HTTP de error adecuados (401/403) |

### Escala de Desempeño
- **100%** → Todo funcional, sin errores
- **80%** → Funcional con detalles menores
- **60%** → Funciona pero con fallas intermitentes
- **30%** → Se muestra pero no funciona correctamente
- **0%** → No implementado

### Requisitos Técnicos Adicionales (de la pauta)
- Backend con microservicios en Java + Spring Boot que compile sin errores
- Base de datos cloud integrada con entidades, repositorios y conexión configurada
- Frontend modular en Angular, sin errores de compilación, con vistas funcionales
- `.gitignore` correctamente configurado (sin `node_modules`, `target`, binarios ni credenciales)
- Entrega vía enlaces a repositorios GitHub en plataforma AVA + correo al docente

---

## 🌳 Estrategia de Ramas (Git Branching)

```text
main                      (Rama productiva / Entrega final al docente)
  ▲
  │ (Merge de integración final)
develop                   (Rama de desarrollo común e integración continua)
  ▲                     ▲
  │                     │
dev1-frontend-bff       dev2-backend-core
(Desarrollador 1)       (Desarrollador 2)
```

---

## ✅ Estado Actual del Proyecto (Auditoría Completa)

### Lo que YA está hecho y funcionando:

| Componente | Estado | Detalle |
|:---|:---:|:---|
| **MSAL en Angular** | 🟢 100% | `@azure/msal-angular` v6.2 + `@azure/msal-browser` v5.21 configurados con Tenant y ClientId |
| **MsalGuard en rutas** | 🟢 100% | `/dashboard` protegido con `MsalGuard` en `app.routes.ts` |
| **MsalInterceptor** | 🟢 100% | Interceptor registrado, mapea `http://localhost:8080/api/*` con scope de API |
| **Visualización de claims** | 🟢 100% | Dashboard muestra nombre, correo, roles, scopes y tabla completa de claims JWT |
| **Dashboard con botones de prueba** | 🟢 100% | Botones para `/api/me`, `/api/pickups/summary`, `/api/admin/dashboard` con visualización HTTP |
| **BFF OAuth2 Resource Server** | 🟢 100% | Spring Security 6 con `NimbusJwtDecoder.fromIssuerLocation` |
| **Validación JWT completa** | 🟢 100% | Valida firma, vigencia (`exp`), emisor (tenant) y audiencia |
| **Mapeo de roles Azure AD** | 🟢 100% | Extrae claim `roles` → `ROLE_<rol>`, fallback `ROLE_Vecino`, scopes → `SCOPE_<scope>` |
| **RBAC en endpoints** | 🟢 100% | `/public/**` permitAll, `/api/admin/**` requiere Admin, `/api/coordinador/**` requiere Admin/Coordinador |
| **Error handlers 401/403** | 🟢 100% | Respuestas JSON estructuradas para Unauthorized y Forbidden |
| **CORS configurado** | 🟢 100% | Origen `http://localhost:4200`, métodos y headers correctos |
| **docker-compose.yml** | 🟢 90% | PostgreSQL, RabbitMQ, Kafka+Zookeeper con healthchecks y volúmenes |
| **ms-reciclago-catalog CRUDs** | 🟢 100% | Endpoints completos para Residuo, Camión (con PATCH capacidad) y Tarifa |
| **ms-reciclago-pickups ciclo de vida** | 🟡 80% | Los 6 estados implementados con emisión de eventos Kafka + RabbitMQ |
| **Kafka integration** | 🟢 100% | Tópicos `pickups.events` y `audit.timeline` operativos |
| **RabbitMQ integration** | 🟢 95% | 3 colas con DLQs y publicación de DTOs JSON |
| **Java 17 compatible** | 🟢 100% | Ambos microservicios compilan con `BUILD SUCCESS` |

---

## ⚠️ Lo que FALTA por hacer (Plan de Trabajo)

---

## 👨‍💻 DESARROLLADOR 1 — Frontend + BFF (Rama: `dev1-frontend-bff`)

> **Responsable de:** `frontend-reciclago/` y `ms-reciclago-bff/`
> **Impacto en la nota:** Indicador 1 (60%) + Indicador 2 (40%) — ambos indicadores dependen directamente de tu trabajo

### 🔴 Tareas Críticas (afectan directamente la nota)

#### 1. Inicialización segura de MSAL con `APP_INITIALIZER`
- **Archivo:** `frontend-reciclago/src/app/app.config.ts`
- **Problema:** `instance.initialize()` se ejecuta en `ngOnInit()` de `AppComponent`. Si el usuario navega directo a `/dashboard`, `MsalGuard` se dispara antes de que termine `initialize()`, generando error `uninitialized_public_client_application`.
- **Solución:** Agregar un `APP_INITIALIZER` que espere la promesa de `initialize()` antes de bootstrap.
- **Impacto en nota:** Indicador 1 → diferencia entre 100% y 80%

#### 2. Registrar `MsalRedirectComponent` para flujo de redirección
- **Archivo:** `frontend-reciclago/src/app/app.routes.ts`
- **Problema:** No hay ruta dedicada de retorno para cuando Azure AD redirige de vuelta con el hash del token. Puede generar parpadeo.
- **Solución:** Agregar ruta `{ path: 'auth', component: MsalRedirectComponent }` en las rutas.
- **Impacto en nota:** Indicador 1 → estabilidad del flujo login/logout

#### 3. Agregar endpoint de prueba para `/api/coordinador/**`
- **Archivo:** `ms-reciclago-bff/.../BffController.java`
- **Problema:** `SecurityConfig` define regla para `/api/coordinador/**` con `hasAnyRole("Admin", "Coordinador")` pero NO existe ningún endpoint en el controlador.
- **Solución:** Agregar al menos `GET /api/coordinador/dashboard` que retorne un JSON de prueba.
- **Impacto en nota:** Indicador 2 → demuestra que RBAC funciona con múltiples roles

#### 4. Agregar botón de prueba de Coordinador en el Dashboard
- **Archivo:** `frontend-reciclago/.../dashboard/dashboard.component.ts`
- **Solución:** Agregar botón `🏗️ GET /api/coordinador/dashboard` similar al de Admin para demostrar RBAC.

### 🟡 Tareas Importantes (mejoran la calidad)

#### 5. Exponer endpoints PATCH de retiros en el BFF
- **Archivo:** `ms-reciclago-bff/.../BffController.java`
- **Problema:** El BFF solo proxia `GET` y `POST` de pickups. Los endpoints de cambio de estado (`/programar`, `/en-ruta`, `/retirado`, `/pesado`, `/cancelar`) no están expuestos.
- **Solución:** Agregar métodos `PATCH` que proxien hacia `ms-reciclago-pickups`.

#### 6. Exponer endpoint de camiones en el BFF
- **Archivo:** `ms-reciclago-bff/.../BffController.java`
- **Problema:** `ms-reciclago-catalog` tiene `/api/catalog/camiones` pero el BFF no tiene proxy.
- **Solución:** Agregar `GET /api/catalog/camiones` que proxie hacia el catálogo.

#### 7. Declarar URLs de backend en `application.properties`
- **Archivo:** `ms-reciclago-bff/src/main/resources/application.properties`
- **Acción:** Agregar explícitamente:
  ```properties
  reciclago.services.catalog-url=http://localhost:8081
  reciclago.services.pickups-url=http://localhost:8083
  ```

### 🟢 Tareas de Limpieza

#### 8. Eliminar archivo muerto `app.component.html`
- **Archivo:** `frontend-reciclago/src/app/app.component.html`
- Es el boilerplate de Angular CLI (337 líneas), no se usa porque `AppComponent` tiene template inline.

#### 9. Corregir nombre de carpeta `enviroments` → `environments`
- **Directorio:** `frontend-reciclago/src/enviroments/`
- Falta la segunda 'n'. Requiere actualizar los imports en `app.config.ts`.

#### 10. Actualizar pruebas unitarias del frontend
- **Archivo:** `frontend-reciclago/src/app/app.component.spec.ts`
- Las aserciones por defecto del CLI buscan textos que ya no existen. `npm test` fallará.

---

## 👨‍💻 DESARROLLADOR 2 — Backend Core + Infra (Rama: `dev2-backend-core`)

> **Responsable de:** `docker-compose.yml`, `ms-reciclago-catalog/` y `ms-reciclago-pickups/`
> **Impacto en la nota:** Requisitos técnicos de backend (compilación, BD cloud, pruebas)

### 🔴 Tareas Críticas

#### 1. Completar validaciones de máquina de estados en Pickups
- **Archivo:** `ms-reciclago-pickups/.../service/PickupService.java`
- **Problema:** Solo `cambiarEstadoEnRuta()` valida el estado anterior (`PROGRAMADO`). Las demás transiciones no validan:
  - `programarRetiro()` → debería exigir estado `SOLICITADO`
  - `marcarRetirado()` → debería exigir estado `EN_RUTA`
  - `registrarPesaje()` → debería exigir estado `RETIRADO`
  - `cancelarRetiro()` → NO debería permitirse si ya está `RETIRADO` o `PESADO`
- **Impacto:** Sin estas validaciones, el ciclo de vida del retiro no es robusto y permite transiciones inválidas.

#### 2. Completar pruebas unitarias del Catálogo
- **Archivos a crear:**
  - `ms-reciclago-catalog/src/test/.../controller/CamionControllerTest.java`
  - `ms-reciclago-catalog/src/test/.../controller/TarifaControllerTest.java`
- **Problema:** Solo existe `ResiduoControllerTest`. Faltan pruebas para Camión y Tarifa.
- **Mínimo:** Probar listar, obtener por ID y crear para cada controlador.

#### 3. Completar pruebas de Pickups
- **Archivos a modificar:**
  - `ms-reciclago-pickups/src/test/.../controller/PickupControllerTest.java` → Agregar tests de endpoints PATCH
  - `ms-reciclago-pickups/src/test/.../service/PickupServiceTest.java` → Agregar test para `cancelarRetiro`
- **Problema:** No se prueban los endpoints de cambio de estado ni la cancelación.

### 🟡 Tareas Importantes

#### 4. Agregar `@RestControllerAdvice` global para manejo de excepciones
- **Archivos a crear:**
  - `ms-reciclago-catalog/src/main/java/.../config/GlobalExceptionHandler.java`
  - `ms-reciclago-pickups/src/main/java/.../config/GlobalExceptionHandler.java`
- **Problema:** Si se intenta guardar un residuo con código duplicado o un camión con patente duplicada (`unique=true`), se genera un `500 Internal Server Error` genérico.
- **Solución:** Atrapar `DataIntegrityViolationException` → retornar `409 Conflict`, `IllegalArgumentException` → `400 Bad Request`, etc.

#### 5. Crear DTO específico para `q.cmd.certificate` (RabbitMQ)
- **Archivo:** `ms-reciclago-pickups/.../dto/CertificateEventDto.java`
- **Problema:** `notificarCertificadoRabbitMQ()` envía la entidad JPA completa `Pickup` a la cola en vez de un DTO.
- **Solución:** Crear `CertificateEventDto` con los campos relevantes (código, peso, fecha).

#### 6. Corregir inconsistencias de documentación vs docker-compose
- **Archivo:** `EXPLICACION_PROYECTO.md`
- **Problema:** La tabla de puertos indica PostgreSQL en `5432` con user `postgres`/`postgres123` y RabbitMQ con `reciclago`/`reciclago123`, pero el compose real usa puerto `5433` con user `reciclago`/`reciclagopass` y RabbitMQ `guest`/`guest`.

### 🟢 Tareas Opcionales (valor agregado)

#### 7. Mejorar generación de `codigoRetiro`
- **Archivo:** `ms-reciclago-pickups/.../service/PickupService.java`
- **Problema:** Usa `System.currentTimeMillis() % 1000000`, puede colisionar.
- **Solución:** Usar UUID abreviado o correlativo de BD.

#### 8. Agregar documentación OpenAPI/Swagger
- **Archivos:** `pom.xml` de ambos microservicios
- **Dependencia:** `springdoc-openapi-starter-webmvc-ui`
- Permite demostrar endpoints con UI interactiva en `http://localhost:808x/swagger-ui.html`.

---

## 📊 Resumen de Prioridades por Desarrollador

### Dev 1 (Frontend + BFF) — Checklist

```
[x] 1. APP_INITIALIZER para MSAL (CRÍTICO)
[x] 2. MsalRedirectComponent en rutas (CRÍTICO)
[x] 3. Endpoint GET /api/coordinador/dashboard en BFF (CRÍTICO)
[x] 4. Botón de prueba Coordinador en Dashboard (CRÍTICO)
[x] 5. Proxies PATCH de retiros en BFF (IMPORTANTE)
[x] 6. Proxy GET /api/catalog/camiones en BFF (IMPORTANTE)
[x] 7. Declarar URLs de backend en application.properties (IMPORTANTE)
[x] 8. Eliminar app.component.html muerto (LIMPIEZA)
[x] 9. Renombrar carpeta enviroments → environments (LIMPIEZA)
[x] 10. Actualizar app.component.spec.ts (LIMPIEZA)
```

### Dev 2 (Backend Core + Infra) — Checklist

```
[ ] 1. Validaciones de máquina de estados en PickupService (CRÍTICO)
[ ] 2. Tests para CamionController y TarifaController (CRÍTICO)
[ ] 3. Tests PATCH en PickupControllerTest + cancelar en ServiceTest (CRÍTICO)
[ ] 4. GlobalExceptionHandler en ambos microservicios (IMPORTANTE)
[ ] 5. DTO CertificateEventDto para RabbitMQ (IMPORTANTE)
[ ] 6. Corregir documentación vs docker-compose (IMPORTANTE)
[ ] 7. Mejorar generación de codigoRetiro (OPCIONAL)
[ ] 8. Agregar Swagger/OpenAPI (OPCIONAL)
```

---

## 🚀 Guía de Ejecución Local

### Paso 1: Levantar los Servicios de Infraestructura
```powershell
docker compose up -d postgres rabbitmq kafka
```

### Paso 2: Ejecutar los Microservicios Spring Boot
Abrir una terminal por cada servicio:

- **BFF (Puerto 8080):**
  ```powershell
  cd ms-reciclago-bff
  .\mvnw.cmd spring-boot:run
  ```

- **Catálogo (Puerto 8081):**
  ```powershell
  cd ms-reciclago-catalog
  .\mvnw.cmd spring-boot:run
  ```

- **Retiros (Puerto 8083):**
  ```powershell
  cd ms-reciclago-pickups
  .\mvnw.cmd spring-boot:run
  ```

### Paso 3: Ejecutar el Frontend Angular (Puerto 4200)
```powershell
cd frontend-reciclago
npm start
```
Acceder en el navegador a `http://localhost:4200`.

---

## 🧪 Comandos de Verificación Rápida

```powershell
# BFF - Endpoint público
curl http://localhost:8080/public/status

# BFF - Endpoint protegido (espera 401)
curl -i http://localhost:8080/api/pickups/summary

# Catálogo - Listar residuos
curl http://localhost:8081/api/catalog/residuos

# Catálogo - Listar camiones
curl http://localhost:8081/api/catalog/camiones

# Retiros - Listar retiros
curl http://localhost:8083/api/pickups

# Compilar y testear catálogo
cd ms-reciclago-catalog; .\mvnw.cmd test

# Compilar y testear retiros
cd ms-reciclago-pickups; .\mvnw.cmd test
```

---

## 📝 Convención de Mensajes de Commit

Para mantener un historial limpio y profesional en GitHub, se utiliza el estándar **Conventional Commits**:

- `feat(modulo): descripcion` → Para nuevas funcionalidades (ej: `feat(security): integracion de msal guard y claims`).
- `fix(modulo): descripcion` → Para corrección de errores (ej: `fix(backend): compatibilidad java 17 en pom.xml`).
- `docs: descripcion` → Para documentación (ej: `docs: guia unica con division de trabajo`).
- `refactor(modulo): descripcion` → Para mejoras de código sin cambiar funcionalidad.
- `test(modulo): descripcion` → Para pruebas (ej: `test(catalog): agregar tests para CamionController`).

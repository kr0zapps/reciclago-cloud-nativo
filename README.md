# ♻️ RecicLaGo - Plataforma Cloud Native

Plataforma unificada para la gestión, solicitud y coordinación de retiros de residuos reciclables para municipios y vecinos, implementada bajo una arquitectura de microservicios orientada a eventos.

---

## 🌳 1. Estrategia de Ramas (Git Branching)

El flujo de trabajo del repositorio se organiza bajo el siguiente esquema de ramas:

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

- **`main`**: Código estable y funcional listo para evaluación.
- **`develop`**: Rama base donde convergen los cambios de ambos desarrolladores.
- **`dev1-frontend-bff`**: Rama exclusiva de trabajo para el Desarrollador 1.
- **`dev2-backend-core`**: Rama exclusiva de trabajo para el Desarrollador 2.

---

## 👥 2. División de Trabajo

### 🧑‍💻 Desarrollador 1: Frontend, BFF y Seguridad
- **Módulos a cargo:** `frontend-reciclago/` y `ms-reciclago-bff/`
- **Rama:** `dev1-frontend-bff`

#### Tareas y Entregables (Pauta EP1 - 100% de la nota):
1. **Frontend en Angular (`frontend-reciclago`)**:
   - Integración de la librería `@azure/msal-angular` para autenticación con Microsoft Entra ID (Azure AD).
   - Implementación de `MsalGuard` en el enrutador (`app.routes.ts`) para proteger rutas privadas como `/dashboard`.
   - Lectura y decodificación de claims del token (`account.idTokenClaims`): visualización de roles (`roles`), scopes (`scp`), nombre y correo del usuario.
   - Implementación de `MsalInterceptor` para inyectar automáticamente el header `Authorization: Bearer <token>` en llamadas HTTP hacia el BFF.
   - Vistas funcionales: Portal público de inicio (`/`) y Panel de control con botones para probar consumo de endpoints.

2. **Backend For Frontend (`ms-reciclago-bff`)**:
   - Configuración de Spring Security 6 como OAuth2 Resource Server.
   - Validación estricta de tokens JWT: firma criptográfica, emisor (`issuer-uri`), audiencia (`audiences`) y vigencia (`exp`).
   - Mapeo de roles de Azure AD (`roles`) a autoridades de Spring Security (`ROLE_Admin`, `ROLE_Coordinador`, `ROLE_Vecino`).
   - Control de acceso por rol en endpoints (`/api/admin/**`, `/api/coordinador/**`, `/api/pickups/**`).
   - Manejadores de error adecuados con respuestas JSON: `401 Unauthorized` (token inválido/ausente) y `403 Forbidden` (rol insuficiente).
   - Controladores para exponer el perfil autenticado y servir de puente hacia los microservicios de dominio.

---

### 🧑‍💻 Desarrollador 2: Backend Core, Infraestructura y Base de Datos
- **Módulos a cargo:** `docker-compose.yml`, `ms-reciclago-catalog/` y `ms-reciclago-pickups/`
- **Rama:** `feature/dev2-backend-core`

#### Tareas y Entregables:
1. **Infraestructura Base (`docker-compose.yml`)**:
   - Contenedor de base de datos relacional (PostgreSQL en puerto 5433, con esquema compatible para Oracle).
   - Clúster de RabbitMQ (puerto AMQP 5672 y Management UI en puerto 15672).
   - Entorno Apache Kafka (Zookeeper en 2181 y Broker Kafka en 9092 / 29092).

2. **Microservicio Catálogo (`ms-reciclago-catalog`) - Puerto 8081**:
   - Modelado de entidades JPA: `Residuo`, `Camion`, `Tarifa`.
   - Repositorios Spring Data JPA y conexión a base de datos relacional.
   - Endpoints REST para CRUD de tipos de residuo, capacidad de flota y tarifas asociadas.
   - Pruebas unitarias/integración básicas para validar que `mvn test` ejecute con éxito.

3. **Microservicio Retiros (`ms-reciclago-pickups`) - Puerto 8083**:
   - Entidad JPA `Pickup` con control de ciclo de vida de estados (`SOLICITADO` → `PROGRAMADO` → `EN_RUTA` → `RETIRADO` → `PESADO` / `CANCELADO`).
   - Endpoints REST para solicitar retiros, consultar historial y actualizar estados.
   - Publicación asíncrona de mensajes en RabbitMQ (`q.cmd.email`, `q.cmd.route`) al programar o iniciar rutas.
   - Emisión de eventos en Kafka (tópico `pickups.events`) en cada cambio de estado para reportería y auditoría.
   - Compatibilidad de compilación con Java 17 para ejecución limpia en entornos de evaluación.

---

## 🚀 3. Guía de Ejecución Local

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

## 📝 4. Convención de Mensajes de Commit

Para mantener un historial limpio y profesional en GitHub, se utiliza el estándar **Conventional Commits**:

- `feat(modulo): descripcion` -> Para nuevas funcionalidades (ej: `feat(security): integracion de msal guard y claims`).
- `fix(modulo): descripcion` -> Para corrección de errores (ej: `fix(backend): compatibilidad java 17 en pom.xml`).
- `docs: descripcion` -> Para documentación (ej: `docs: guia unica con division de trabajo`).
- `refactor(modulo): descripcion` -> Para mejoras de código sin cambiar funcionalidad.

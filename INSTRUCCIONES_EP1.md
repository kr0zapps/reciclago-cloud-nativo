# 📋 Plan de Acción EP1 - DSY1107: Desarrollo Cloud Native I
> **Objetivo:** Cumplir al 100% con la Pauta de Evaluación Parcial N° 1 (`EP1_DSY1107_Estudiante_encargo.pdf`).

---

## 🎯 Resumen de la Rúbrica de Evaluación

| Indicador | Ponderación | Requisito para 100% (Muy Buen Desempeño) | Responsable Principal |
| :--- | :---: | :--- | :--- |
| **Indicador 1: Angular + MSAL** | **60%** | MSAL operativo (login/logout). **Guards y MsalInterceptor operando sin fallas**. **Lectura de roles y scopes desde claims** del token. Consumo efectivo del API con vistas funcionales. | 🧑‍💻 **Desarrollador 1** |
| **Indicador 2: BFF y Validación JWT** | **40%** | Valida `issuer` y `audience` correctamente. Verifica firma y vigencia (expiración). **Aplica autorización por rol** cuando corresponde y responde con **códigos de error adecuados** (401/403). | 🧑‍💻 **Desarrollador 1** |
| **Requisito Transversal** | **Obligatorio** | **El código debe compilar sin errores**, seguir buenas prácticas y responder a pruebas básicas. Conexión a BD configurada. `.gitignore` limpio. | 🧑‍💻 **Desarrollador 2** |

---

## 🧑‍💻 Desarrollador 1: Frontend (Angular) y BFF (`ms-reciclago-bff`)

Tu foco es asegurar el **60% del Indicador 1** y el **40% del Indicador 2**.

### 📌 Tareas de Frontend (`frontend-reciclago`)

- [ ] **1.1. Configuración de Rutas y Guards (`MsalGuard`)**
  - **Archivo:** `src/app/app.routes.ts`
  - **Problema actual:** El arreglo de rutas está vacío (`routes: Routes = []`).
  - **Acción:** Definir rutas públicas y rutas protegidas:
    ```typescript
    import { Routes } from '@angular/router';
    import { MsalGuard } from '@azure/msal-angular';
    import { HomeComponent } from './pages/home/home.component';
    import { DashboardComponent } from './pages/dashboard/dashboard.component';
    import { PickupsComponent } from './pages/pickups/pickups.component';

    export const routes: Routes = [
      { path: '', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [MsalGuard] },
      { path: 'pickups', component: PickupsComponent, canActivate: [MsalGuard] },
      { path: '**', redirectTo: '' }
    ];
    ```

- [ ] **1.2. Lectura y Despliegue de Roles y Scopes desde los Claims del Token**
  - **Archivo:** `src/app/app.component.ts` (o servicio de autenticación)
  - **Problema actual:** Solo se verifica si hay cuentas (`getAllAccounts().length > 0`), pero no se leen los claims de roles ni scopes.
  - **Acción:** Extraer los claims del usuario autenticado:
    ```typescript
    const activeAccount = this.authService.instance.getActiveAccount();
    if (activeAccount && activeAccount.idTokenClaims) {
      const claims = activeAccount.idTokenClaims as any;
      this.userRoles = claims.roles || []; // Roles asignados en Azure AD
      this.userScopes = claims.scp ? claims.scp.split(' ') : [];
      this.userName = claims.name || activeAccount.username;
    }
    ```
  - Mostrar en la interfaz gráfica el usuario conectado y sus roles (`Admin`, `Coordinador`, `Vecino`).

- [ ] **1.3. Consumo del Backend mediante `MsalInterceptor`**
  - **Archivos:** `src/app/services/pickup.service.ts` y componentes de vista.
  - **Problema actual:** `MsalInterceptor` está registrado en `app.config.ts`, pero no hay ninguna llamada HTTP para demostrar que adjunta el header `Authorization: Bearer <token>`.
  - **Acción:** Crear un servicio en Angular que consuma endpoints del BFF (`http://localhost:8080/api/...`) usando `HttpClient` y listar datos en una vista funcional (ej: listado de retiros o datos de perfil).

---

### 📌 Tareas de Backend for Frontend (`ms-reciclago-bff`)

- [ ] **1.4. Corrección de Versiones en `pom.xml` (Java y Spring Boot)**
  - **Archivo:** `ms-reciclago-bff/pom.xml`
  - **Problema actual:** Tiene `parent` versión `4.1.1` (inexistente) y `java.version` 21 (falla en JDK 18).
  - **Acción:**
    - Cambiar parent a Spring Boot `3.2.5` (igual a los otros microservicios).
    - Cambiar `<java.version>17</java.version>`.

- [ ] **1.5. Configuración de `application.properties` con Valores de Azure AD**
  - **Archivo:** `ms-reciclago-bff/src/main/resources/application.properties`
  - **Problema actual:** Contiene `TU_TENANT_ID` y `TU_CLIENT_ID`.
  - **Acción:** Reemplazar por los identificadores reales de Azure AD:
    ```properties
    server.port=8080
    spring.security.oauth2.resourceserver.jwt.issuer-uri=https://login.microsoftonline.com/5625266d-cae0-4070-a7ea-b5e88273580f/v2.0
    spring.security.oauth2.resourceserver.jwt.audiences=api://20ae8f6f-ef82-48a6-a4ae-897d36212b4b
    ```

- [ ] **1.6. Autorización por Roles y Manejo de Errores (401 / 403)**
  - **Archivo:** `ms-reciclago-bff/src/main/java/com/duoc/ms_reciclago_bff/SecurityConfig.java`
  - **Problema actual:** No valida roles (`.hasRole(...)`) ni tiene `JwtAuthenticationConverter` para claims de Azure AD (`roles`), ni handlers de error adecuados.
  - **Acción:**
    - Configurar un `JwtAuthenticationConverter` que convierta el claim `roles` de Azure AD en `GrantedAuthority` con prefijo `ROLE_`.
    - Proteger rutas por rol (ej: `/api/admin/**` requiere rol `Admin`, `/api/pickups/**` requiere `Admin` o `Coordinador`).
    - Configurar `AuthenticationEntryPoint` para retornar HTTP 401 en JSON y `AccessDeniedHandler` para retornar HTTP 403 en JSON cuando el rol no coincida.

- [ ] **1.7. Controladores / Endpoints en el BFF**
  - **Problema actual:** No existe ningún `@RestController` en `ms-reciclago-bff`, por lo que cualquier petición responde `404 Not Found`.
  - **Acción:** Crear controladores que reciban las peticiones autenticadas del frontend y las reenvíen a los microservicios de dominio (`ms-reciclago-pickups` puerto 8082 y `ms-reciclago-catalog` puerto 8081).

---

## 🧑‍💻 Desarrollador 2: Backend Core, Infraestructura y Base de Datos

Tu foco es garantizar que **los microservicios compilen**, la **base de datos funcione correctamente** y los endpoints de negocio respondan a pruebas básicas.

### 📌 Tareas de Compatibilidad y Compilación (¡Crítico!)

- [x] **2.1. Ajuste de Java 17 en `pom.xml` de Catálogo y Pickups**
  - **Archivos:** 
    - `ms-reciclago-catalog/pom.xml`
    - `ms-reciclago-pickups/pom.xml`
  - **Problema actual:** Tienen `<java.version>21</java.version>`. En los laboratorios de Duoc (Taite 7) y máquinas con JDK 18, `mvn compile` falla con error: `release version 21 not supported`.
  - **Acción:** Cambiar en ambos archivos a `<java.version>17</java.version>`.
  - **Verificación:** Ejecutar `./mvnw.cmd clean compile` en ambos microservicios y verificar que el resultado sea `BUILD SUCCESS`.

---

### 📌 Tareas de Base de Datos y Endpoints de Dominio

- [ ] **2.2. Validar Conexión de Base de Datos con Docker Compose**
  - **Archivos:** `docker-compose.yml`, `application.properties` de catalog y pickups.
  - **Acción:**
    - Levantar los contenedores de PostgreSQL:
      ```powershell
      docker compose up -d postgres rabbitmq kafka
      ```
    - Verificar que `ms-reciclago-catalog` (puerto 8081) y `ms-reciclago-pickups` (puerto 8082) creen sus tablas automáticamente mediante Hibernate (`ddl-auto=update`).
    - Probar que los drivers de PostgreSQL y Oracle estén disponibles según lo requerido por la pauta.

- [ ] **2.3. Endpoints Funcionales y Pruebas Básicas de la Pauta**
  - **Pauta:** *"El código de todos los componentes del backend debe compilar, seguir buenas prácticas y responder a pruebas básicas."*
  - **Acción:**
    - Crear al menos 1 clase de prueba unitaria/integración básica en cada microservicio (ej: `PickupControllerTest.java`, `ResiduoControllerTest.java`) para que `mvn test` ejecute y pase exitosamente.
    - Asegurar que los endpoints principales respondan datos de prueba:
      - `GET /api/catalog/residuos`
      - `POST /api/catalog/residuos`
      - `GET /api/pickups`
      - `POST /api/pickups`

---

### 📌 Tareas de Limpieza y Repositorio (.gitignore)

- [ ] **2.4. Sanitización del Repositorio**
  - **Pauta:** *"Para ambos contextos, front y back, solo debe subirse a los repositorios lo que corresponda a la tecnología utilizada, configurando los archivos .gitignore necesarios..."*
  - **Acción:**
    - Verificar que el `.gitignore` de la raíz ignore carpetas de compilación y librerías (`node_modules/`, `target/`, `.angular/`, `dist/`, `.env`).
    - Comprobar con `git status` que no se suban ejecutables ni archivos temporales.

---

## 📅 Matriz de Dependencia entre Ambos Desarrolladores

```text
[Dev 2] Ajusta Java 17 en pom.xml  ──► [Dev 2] Compila Catalog y Pickups
                                               │
                                               ▼
[Dev 1] Ajusta Java 17 en pom.xml  ──► [Dev 1] Configura BFF (JWT, Roles, 401/403)
                                               │
                                               ▼
[Dev 1] Conecta BFF a Pickups/Catalog (Ruteo / Forwarding)
                                               │
                                               ▼
[Dev 1] Implementa Guards, Claims y Vistas en Angular consumiendo el BFF
                                               │
                                               ▼
[Ambos] Prueba Integral de Flujo Completo:
        Login MSAL ──► Token con Roles ──► Guard OK ──► Interceptor ──► BFF valida JWT y Rol ──► Respuesta 200 OK
```

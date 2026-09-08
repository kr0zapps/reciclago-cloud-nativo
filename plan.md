# Implementation Plan (Trabajo en Equipo)

> ⚠️ **Documento de Entrega EP1**: Ver guía completa y rúbrica para ambos desarrolladores en [INSTRUCCIONES_EP1.md](INSTRUCCIONES_EP1.md).

## 🧑‍💻 Desarrollador 1: Frontend, BFF y Seguridad

- [x] Task 1.1: Configurar el Tenant de Azure AD y registrar la aplicación (Obtener clientId y tenantId).
- [x] Task 1.2: Scaffold del proyecto Frontend en Angular con librería MSAL.
- [ ] Task 1.3: Proteger rutas con `MsalGuard` y leer roles/claims desde el token en Angular.
- [ ] Task 1.4: Configurar `ms-reciclago-bff` con validación JWT real (issuer, audience), autorización por rol (`roles`) y códigos de error (401/403).
- [ ] Task 1.5: Conectar pantallas de Angular al BFF usando `MsalInterceptor` para adjuntar el Bearer Token.

## 🧑‍💻 Desarrollador 2: Backend Core, Infraestructura y Base de Datos

- [x] Task 2.1: Configurar el `docker-compose.yml` base para la infraestructura (RabbitMQ, Kafka, Zookeeper, DB).
- [ ] Task 2.2: Ajustar compatibilidad Java 17 en los `pom.xml` para asegurar compilación limpia en laboratorios Duoc.
- [x] Task 2.3: Implementar `ms-reciclago-catalog` (REST + JPA) para tipos de residuos y camiones.
- [x] Task 2.4: Implementar `ms-reciclago-pickups` (REST + JPA + RabbitMQ publisher + Kafka producer) para gestión de retiros.
- [ ] Task 2.5: Asegurar pruebas básicas en backend (`mvn test`) y validar persistencia de datos.


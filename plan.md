# Implementation Plan (Trabajo en Equipo)

## 🧑‍💻 Desarrollador 1: Frontend, BFF y Seguridad

- [x] Task 1.1: Configurar el Tenant de Azure AD y registrar la aplicación (Obtener clientId y tenantId).
- [x] Task 1.2: Scaffold del proyecto Frontend en Angular.
- [x] Task 1.3: Integración de MSAL en Angular para el Login público y protección de rutas.
- [x] Task 1.4: Implementar `ms-reciclago-bff` con Spring Boot y Spring Security (Validador de JWT).
- [ ] Task 1.5: Creación de Pantallas (Dashboard, Retiros, Catálogo, Reportes, Auditoría) conectadas al BFF.

## 🧑‍💻 Desarrollador 2: Backend Core, Infraestructura y Eventos

- [ ] Task 2.1: Configurar el `docker-compose.yml` base para la infraestructura (RabbitMQ, Kafka, Zookeeper, DB).
- [ ] Task 2.2: Implementar `ms-reciclago-catalog` (REST + DB) para tipos de residuos y camiones.
- [ ] Task 2.3: Implementar `ms-reciclago-pickups` (REST + DB + RabbitMQ publisher + Kafka producer) para gestión de retiros.
- [ ] Task 2.4: Implementar `ms-reciclago-notify` (consumidor RabbitMQ para emails/tickets).
- [ ] Task 2.5: Implementar `ms-reciclago-audit` (consumidor Kafka para el timeline).
- [ ] Task 2.6: Implementar `ms-reciclago-report` (consumidor Kafka para KPIs).

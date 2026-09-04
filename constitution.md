# Project Constitution

## 1. Project Overview
**Name**: RecicLaGo
**Description**: Plataforma para retiro domiciliario de residuos reciclables. Permite a los vecinos solicitar retiros, a los coordinadores armar rutas, y generar métricas mediante streaming en tiempo real y arquitectura orientada a eventos.

## 2. Tech Stack
- **Frontend**: Angular (con MSAL para Azure AD).
- **Backend**: Spring Boot (Java).
- **Security**: Azure AD (IDaaS) + AWS API Gateway + Spring Security (JWT Validator).
- **Messaging & Streaming**: RabbitMQ para comunicación asíncrona (colas de trabajo) y Apache Kafka para streaming de eventos de analítica y auditoría.
- **Database**: Oracle DB (o equivalente relacional para los microservicios principales).
- **Infrastructure**: AWS EC2 con despliegue basado en Docker Compose (contenedores aislados para aplicaciones, mq y kafka).

## 3. Architecture Rules
1. **API Gateway First**: Todo flujo de cliente debe pasar primero por el API Gateway. 
2. **BFF Pattern**: El Frontend se comunica con el API Gateway, y este delega a `ms-reciclago-bff`, el cual rutea a los microservicios de dominio (pickups, catalog).
3. **Event-Driven**: Los microservicios no se bloquean mutuamente de forma síncrona, sino que publican eventos (ej. a RabbitMQ para emails, a Kafka para auditoría).
4. **Security**: MSAL interceptará las peticiones Angular para adjuntar el `Bearer Token` JWT. Spring Security verificará el issuer (`security.oauth2.resourceserver.jwt.issuer-uri`).
5. **No Shared DB**: Cada microservicio (pickups, catalog) tiene su propia base de datos (o esquema separado) en Oracle.

## 4. Development Workflow (Spec-Driven)
- Siempre actualizar `spec.md` y `plan.md` antes de escribir código.
- Cada tarea de `.specify/tasks.md` (o `tasks/`) debe ser implementada, revisada y testeada mediante Docker Compose.

## 5. Security & Credentials
- No comitear secretos (client id, tenant id de Azure). Usar variables de entorno o archivos `.env` ignorados en `.gitignore`.

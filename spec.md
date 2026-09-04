# Specification: RecicLaGo Platform

## 1. Context & Business Value
Una red de 20 municipios necesita una plataforma unificada para solicitar retiros por la web, coordinar rutas de recolección, notificar a los vecinos y auditar eventos de recolección.

## 2. Actors & Roles
- **Admin**: Administra tipos de residuo, capacidad de flota y ve KPIs.
- **Coordinador de rutas (Operador)**: Programa retiros, asigna camión y cierra recolección.
- **Vecino (Cliente)**: Solicita y sigue sus retiros.
- **Auditor**: Consulta el timeline (solo lectura).

## 3. Core Capabilities (Módulos)
1. **Gestión de retiros**: CRUD de retiros y cambio de estado (SOLICITADO → PROGRAMADO → EN_RUTA → RETIRADO → PESADO / CANCELADO). *Regla*: No se puede pasar a EN_RUTA sin estar en PROGRAMADO.
2. **Catálogo**: CRUD de tipos de residuo y capacidad de camiones (Admin). *Regla*: La capacidad del camión disminuye al programar el retiro.
3. **Notificaciones**: Email/push asíncrono (RabbitMQ).
4. **Reportería**: Panel de KPIs por Kafka.
5. **Auditoría**: Timeline de eventos (solo lectura por Kafka).

## 4. Microservices Definitions
1. **ms-reciclago-pickups**: CRUD retiros. Expone `/api/pickups/*`. (BD: Oracle)
2. **ms-reciclago-catalog**: CRUD residuos y flota. Expone `/api/catalog/*`. (BD: Oracle)
3. **ms-reciclago-notify**: Consumidor RabbitMQ. Sin BD.
4. **ms-reciclago-audit**: Consumidor Kafka (read-only endpoints). (BD: Oracle)
5. **ms-reciclago-report**: Consumidor Kafka (read-only endpoints). (BD: Oracle)
6. **ms-reciclago-bff**: BFF Spring Boot + Spring Security protegido detrás del API Gateway.

## 5. Message Broker Topologies
### RabbitMQ (3 flujos + 3 DLQ)
- **q.cmd.email**: Para envío de emails. (DLQ: q.cmd.email.dlq)
- **q.cmd.route**: Para el ticket de ruta. (DLQ: q.cmd.route.dlq)
- **q.cmd.certificate**: Para generación de PDF. (DLQ: q.cmd.certificate.dlq)

### Kafka (Tópicos)
- **pickups.events**: Fuente de verdad. 3 particiones, retención 3-7 días.
- **audit.timeline**: Historial. Retención 14-30 días, política compact,delete.

## 6. Screens / Frontend
- `/login` (Público, MSAL)
- `/dashboard` (Autenticado, según rol)
- `/pickups` (Admin, Coordinador, Vecino)
- `/catalog` (Admin, Coordinador)
- `/reports` (Admin)
- `/audit` (Admin, Auditor)

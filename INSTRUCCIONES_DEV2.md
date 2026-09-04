# 🚀 Instrucciones para Desarrollador 2 (Backend Core & Infra)

¡Hola! Si estás leyendo esto, es tu turno de tomar la batuta en el proyecto **RecicLaGo**. 

Tu compañero (Desarrollador 1) ya dejó configurado el esqueleto del Frontend en Angular con Login de Microsoft (MSAL) y el cascarón del Backend For Frontend (`ms-reciclago-bff`) con la seguridad JWT activada. El objetivo ahora es construir el "motor" que guardará la información y procesará los eventos.

## 📌 Tus Tareas (Fase 2 del Plan)

### 1. Infraestructura Base (Task 2.1)
Debes crear un archivo `docker-compose.yml` en la raíz del proyecto para levantar localmente:
- Base de datos (Ej: Oracle o PostgreSQL, según lo que prefieran usar para el desarrollo local).
- Clúster de **RabbitMQ** (con Management UI expuesto).
- Entorno de **Kafka** (Zookeeper + Kafka Broker).

### 2. Microservicio `ms-reciclago-catalog` (Task 2.2)
Crear este proyecto Spring Boot.
- **Responsabilidad:** CRUD de tipos de residuo, capacidad de flota y tarifas.
- **Base de datos:** Oracle (o la configurada en Docker).
- **Rutas base:** `/api/catalog/*`

### 3. Microservicio `ms-reciclago-pickups` (Task 2.3)
Crear este proyecto Spring Boot (Es el más importante).
- **Responsabilidad:** CRUD de retiros, cambio de estados, coordinación de capacidad.
- **Base de datos:** Oracle.
- **Rutas base:** `/api/pickups/*`
- **Integración RabbitMQ:** Cuando un retiro cambie a PROGRAMADO o EN_RUTA, debe publicar un mensaje en el exchange correspondiente (`q.cmd.email` o `q.cmd.route`).
- **Integración Kafka:** Cada cambio de estado de un retiro debe emitir un evento al tópico `pickups.events` para alimentar la reportería.

## 📖 Referencias Importantes del Caso 7 (PDF)
Asegúrate de revisar el archivo `spec.md` y el PDF original para respetar:
1. **La topología de RabbitMQ:** 3 flujos (email, route, certificate) y sus 3 Dead Letter Queues (DLQ).
2. **La topología de Kafka:** Tópicos `pickups.events` y `audit.timeline` con sus particiones y retención.

## 🔄 Flujo de Trabajo
1. Clona este repositorio y crea tu propia rama (`git checkout -b dev2-backend`).
2. Levanta el Docker Compose para tener los motores de BD y Mensajería corriendo.
3. Desarrolla los microservicios y pruébalos con Postman o Swagger.
4. Cuando el CRUD de retiros funcione, avísale a tu compañero para que él vuelva a entrar y conecte sus pantallas de Angular a tus nuevos endpoints pasando por el BFF.

¡Mucho éxito con el código! 👨‍💻

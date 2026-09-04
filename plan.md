# Implementation Plan

## Phase 1: Infrastructure & Scaffolding
- [ ] Task 1.1: Configurar Docker Compose base (Zookeeper, Kafka, RabbitMQ).
- [ ] Task 1.2: Inicializar repositorios base/módulos para los microservicios Spring Boot y Angular.

## Phase 2: Core Microservices (Pickups & Catalog)
- [ ] Task 2.1: Implementar `ms-reciclago-catalog` (REST + DB).
- [ ] Task 2.2: Implementar `ms-reciclago-pickups` (REST + DB + RabbitMQ publisher + Kafka producer).

## Phase 3: Security & BFF
- [ ] Task 3.1: Configurar Azure AD Tenant y registrar App.
- [ ] Task 3.2: Implementar `ms-reciclago-bff` con Spring Security y validador JWT.

## Phase 4: Event Consumers (Notify, Audit, Report)
- [ ] Task 4.1: Implementar `ms-reciclago-notify` (consumidor RabbitMQ).
- [ ] Task 4.2: Implementar `ms-reciclago-audit` (consumidor Kafka).
- [ ] Task 4.3: Implementar `ms-reciclago-report` (consumidor Kafka).

## Phase 5: Frontend Integration
- [ ] Task 5.1: Scaffold de Angular con MSAL.
- [ ] Task 5.2: Creación de Pantallas y consumo de API via BFF.

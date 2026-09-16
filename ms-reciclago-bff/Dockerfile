# ==============================================================================
# Dockerfile Multi-Stage: Microservicio ms-reciclago-bff (Spring Boot 3 / Java 17)
# RecicLaGo — Ilustre Municipalidad de Puerto Varas
# ==============================================================================

# Etapa 1: Construcción
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src src
RUN mvn clean package -Dmaven.test.skip=true

# Etapa 2: Runtime de Producción Ligero y Seguro
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Usuario sin privilegios (Seguridad Cloud Native)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

# Healthcheck nativo con Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

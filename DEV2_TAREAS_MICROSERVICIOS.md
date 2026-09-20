# 📋 Tareas Pendientes para DEV 2: Microservicios de Catálogo, Rotación Semanal y Flota de Camiones

**Proyecto:** RecicLaGo — Plataforma Cloud Native de Reciclaje Municipal (Puerto Varas)  
**Dirigido a:** DEV 2 (Backend, Microservicios, Persistencia e Infraestructura AWS)  
**Fecha:** 20 de Septiembre de 2026  
**Rama Base:** `main` / `dev2-backend-core`

---

## 🎯 Resumen de las 2 Problemáticas Detectadas

En la última revisión del flujo de negocio y frontend se identificaron dos inconsistencias críticas que deben ser resueltas en los microservicios backend:

1. **Rotación Semanal de Residuos Quemada en Frontend:**
   - **Problema:** En el frontend, el material a retirar (ej. "Vidrio") figuraba como una constante fija (`materialPrincipal: 'VIDRIO'`). Si los microservicios están apagados, el frontend mostraba falsamente "Martes 22 - VIDRIO".
   - **Requerimiento de Negocio Duoc / DIMAO:** El tipo de residuo reciclable domiciliario que se recolecta **debe rotar automáticamente cada semana** (Semana 1: Vidrio, Semana 2: Cartón/Papel, Semana 3: Plásticos PET/PEAD, Semana 4: Latas/Metales). Esta lógica de calendario municipal **debe residir en `ms-reciclago-catalog`** y exponerse vía `ms-reciclago-bff`.

2. **Hardcodeo y Fallback de Camiones ("3 / 3 Camiones Operables"):**
   - **Problema:** En los paneles de Coordinación y Chofer se muestra "3 / 3 camiones disponibles" (`PV-RC-2026`, `PV-RC-2027`, `PV-RC-2028`). Esto ocurre porque cuando `ms-reciclago-catalog` no está corriendo, el frontend cae en un fallback estático (`DEFAULT_CAMIONES`).
   - **Requerimiento de Negocio:** La flota de camiones tolva debe estar persistida en PostgreSQL (`ms-reciclago-catalog`), sus estados (`DISPONIBLE`, `EN_RUTA`, `MANTENIMIENTO`) deben cambiar dinámicamente según la operación en `ms-reciclago-routes` y `ms-reciclago-pickups`, y debe haber consistencia de datos real sin recurrir a mocks estáticos.

---

## 📦 Tarea 1: Rotación Semanal Dinámica de Residuos (`ms-reciclago-catalog`)

### 1.1 Crear el DTO `MaterialSemanaDto.java`
**Ubicación:** `ms-reciclago-catalog/src/main/java/com/duoc/ms_reciclago_catalog/dto/MaterialSemanaDto.java`

```java
package com.duoc.ms_reciclago_catalog.dto;

import com.duoc.ms_reciclago_catalog.model.Residuo;
import java.time.LocalDate;
import java.util.List;

public class MaterialSemanaDto {
    private int numeroSemana;
    private int anio;
    private LocalDate fechaInicioSemana;
    private LocalDate fechaFinSemana;
    private Residuo residuoSemana;
    private List<Residuo> cicloMensual;

    public MaterialSemanaDto() {}

    public MaterialSemanaDto(int numeroSemana, int anio, LocalDate fechaInicioSemana, 
                             LocalDate fechaFinSemana, Residuo residuoSemana, List<Residuo> cicloMensual) {
        this.numeroSemana = numeroSemana;
        this.anio = anio;
        this.fechaInicioSemana = fechaInicioSemana;
        this.fechaFinSemana = fechaFinSemana;
        this.residuoSemana = residuoSemana;
        this.cicloMensual = cicloMensual;
    }

    // Getters y Setters
    public int getNumeroSemana() { return numeroSemana; }
    public void setNumeroSemana(int numeroSemana) { this.numeroSemana = numeroSemana; }

    public int getAnio() { return anio; }
    public void setAnio(int anio) { this.anio = anio; }

    public LocalDate getFechaInicioSemana() { return fechaInicioSemana; }
    public void setFechaInicioSemana(LocalDate fechaInicioSemana) { this.fechaInicioSemana = fechaInicioSemana; }

    public LocalDate getFechaFinSemana() { return fechaFinSemana; }
    public void setFechaFinSemana(LocalDate fechaFinSemana) { this.fechaFinSemana = fechaFinSemana; }

    public Residuo getResiduoSemana() { return residuoSemana; }
    public void setResiduoSemana(Residuo residuoSemana) { this.residuoSemana = residuoSemana; }

    public List<Residuo> getCicloMensual() { return cicloMensual; }
    public void setCicloMensual(List<Residuo> cicloMensual) { this.cicloMensual = cicloMensual; }
}
```

### 1.2 Agregar método en `ResiduoService.java`
**Ubicación:** `ms-reciclago-catalog/src/main/java/com/duoc/ms_reciclago_catalog/service/ResiduoService.java`

```java
import com.duoc.ms_reciclago_catalog.dto.MaterialSemanaDto;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;

public MaterialSemanaDto obtenerMaterialSemana(LocalDate fechaReferencia) {
    if (fechaReferencia == null) {
        fechaReferencia = LocalDate.now();
    }

    // Filtra únicamente residuos estándar activos (excluye especiales como RAEE)
    List<Residuo> estandares = residuoRepository.findByActivoTrue().stream()
            .filter(r -> Boolean.FALSE.equals(r.getRequiereManejoEspecial()))
            .sorted((a, b) -> a.getId().compareTo(b.getId()))
            .toList();

    if (estandares.isEmpty()) {
        throw new RuntimeException("No hay residuos estándar configurados en el catálogo municipal.");
    }

    int numeroSemana = fechaReferencia.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
    int anio = fechaReferencia.get(IsoFields.WEEK_BASED_YEAR);

    LocalDate lunes = fechaReferencia.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    LocalDate domingo = fechaReferencia.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

    // Rotación matemática por semana ISO
    int index = (numeroSemana - 1) % estandares.size();
    Residuo residuoSemana = estandares.get(index);

    return new MaterialSemanaDto(numeroSemana, anio, lunes, domingo, residuoSemana, estandares);
}
```

### 1.3 Exponer Endpoint en `ResiduoController.java`
**Ubicación:** `ms-reciclago-catalog/src/main/java/com/duoc/ms_reciclago_catalog/controller/ResiduoController.java`

```java
import com.duoc.ms_reciclago_catalog.dto.MaterialSemanaDto;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

@GetMapping("/semana-actual")
public ResponseEntity<MaterialSemanaDto> obtenerMaterialSemana(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
    return ResponseEntity.ok(residuoService.obtenerMaterialSemana(fecha));
}
```

### 1.4 Proxy en `ms-reciclago-bff`
**Ubicación:** `ms-reciclago-bff/src/main/java/com/duoc/ms_reciclago_bff/BffController.java`

```java
@GetMapping("/api/catalog/material-semana")
public ResponseEntity<?> getMaterialSemana(
        @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate fecha) {
    try {
        String target = catalogUrl + "/api/catalog/residuos/semana-actual";
        if (fecha != null) {
            target += "?fecha=" + fecha;
        }
        Object result = restClient.get()
                .uri(target)
                .retrieve()
                .body(Object.class);
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        log.warn("ms-reciclago-catalog no disponible para material-semana: {}", e.getMessage());
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Catálogo municipal fuera de línea");
        error.put("details", e.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }
}
```

Asegurar en `SecurityConfig.java` del BFF:
```java
.requestMatchers(HttpMethod.GET, "/api/catalog/material-semana").permitAll()
```

---

## 🚛 Tarea 2: Gestión Real de Flota de Camiones Tolva (`ms-reciclago-catalog` & `ms-reciclago-routes`)

### 2.1 Diagnóstico de por qué sale "3 / 3 Camiones"
1. En `ms-reciclago-catalog`, `DataInitializer.java` siembra 3 camiones iniciales (`PV-RC-2026`, `PV-RC-2027`, `PV-RC-2028`).
2. Si los microservicios backend **no están levantados en local o en EC2**, el frontend no recibe respuesta en `GET /api/catalog/camiones` y recurre a `DEFAULT_CAMIONES` en `sectors.data.ts`.
3. Todos los camiones tienen estado `DISPONIBLE`, por lo que el cálculo de `camiones.filter(c => c.estado !== 'MANTENIMIENTO').length` resulta exactamente `3 / 3`.

### 2.2 Requerimientos de Backend a Resolver por DEV 2:
1. **Persistencia y CRUD de Camiones:**
   - Verificar que los camiones se persistan correctamente en PostgreSQL (`tabla camiones`).
   - Endpoint de actualización de estado: `PATCH /api/catalog/camiones/{id}/estado`:
     ```http
     PATCH /api/catalog/camiones/1/estado
     Content-Type: application/json
     
     { "estado": "EN_RUTA" } // o "MANTENIMIENTO", "DISPONIBLE"
     ```
2. **Sincronización Operativa con `ms-reciclago-routes`:**
   - Cuando un chofer o coordinador inicia una ruta en `ms-reciclago-routes` (`PUT /api/routes/tracking/{patente}`), el estado del camión en el catálogo debe pasar automáticamente a `EN_RUTA`.
   - Cuando entra al taller o termina el turno, debe poder pasarse a `MANTENIMIENTO` o `DISPONIBLE`.
3. **Manejo de Respuestas Limpias en el BFF:**
   - El BFF ya cuenta con `@GetMapping("/api/catalog/camiones")` y `@PatchMapping("/api/catalog/camiones/{id}/estado")`. DEV 2 debe verificar que `ms-reciclago-catalog` responda con código HTTP `200` y lista JSON válida cuando esté conectado a PostgreSQL.

---

## 🐳 Tarea 3: Verificación con Docker Compose en Local / EC2

Para evitar que el frontend caiga en datos simulados, los 4 microservicios y bases de datos deben levantarse en conjunto:

```bash
# 1. Compilar los microservicios con Maven
cd ms-reciclago-catalog && ./mvnw clean package -DskipTests && cd ..
cd ms-reciclago-pickups && ./mvnw clean package -DskipTests && cd ..
cd ms-reciclago-routes  && ./mvnw clean package -DskipTests && cd ..
cd ms-reciclago-bff     && ./mvnw clean package -DskipTests && cd ..

# 2. Levantar la infraestructura completa
docker compose up -d --build
```

### Puertos de los Servicios:
- `8080`: `ms-reciclago-bff` (Puerta de enlace hacia el frontend)
- `8081`: `ms-reciclago-catalog` (Catálogo, Residuos, Camiones, Tarifas)
- `8083`: `ms-reciclago-pickups` (Retiros, Pesaje, Eventos RabbitMQ & Kafka)
- `8084`: `ms-reciclago-routes` (Cuadrantes y Telemetría GPS)
- `5433`: PostgreSQL 15
- `5672` / `15672`: RabbitMQ
- `9092`: Kafka

---

## ✅ Checklist de Entregables para DEV 2
- [ ] DTO `MaterialSemanaDto` creado en `ms-reciclago-catalog`.
- [ ] Método `obtenerMaterialSemana()` implementado en `ResiduoService`.
- [ ] Endpoint `GET /api/catalog/residuos/semana-actual` expuesto en `ResiduoController`.
- [ ] Endpoint proxy `GET /api/catalog/material-semana` habilitado en `ms-reciclago-bff`.
- [ ] Endpoints de camiones (`GET /api/catalog/camiones`, `PATCH /api/catalog/camiones/{id}/estado`) validados contra PostgreSQL.
- [ ] Pruebas locales completadas con Docker Compose.

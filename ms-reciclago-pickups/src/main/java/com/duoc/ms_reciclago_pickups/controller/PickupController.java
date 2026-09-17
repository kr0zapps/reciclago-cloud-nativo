package com.duoc.ms_reciclago_pickups.controller;

import com.duoc.ms_reciclago_pickups.dto.PickupHistoryResponse;
import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.service.PickupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestionar solicitudes de retiro de reciclaje.
 * Expone endpoints CRUD y de transición de estados según la máquina:
 * SOLICITADO → PROGRAMADO → EN_RUTA → RETIRADO → PESADO (y CANCELADO).
 *
 * Las excepciones de negocio (IllegalStateException, IllegalArgumentException)
 * se propagan al GlobalExceptionHandler para respuestas HTTP consistentes.
 */
@RestController
@RequestMapping("/api/pickups")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:4200}")
public class PickupController {

    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    /** Historial paginado de retiros, filtrable por vecino y/o estado. */
    @GetMapping("/history")
    public ResponseEntity<PickupHistoryResponse> obtenerHistorial(
            @RequestParam(required = false) String vecinoEmail,
            @RequestParam(required = false) String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaSolicitud"));
        return ResponseEntity.ok(pickupService.obtenerHistorialPaginado(vecinoEmail, estado, pageable));
    }

    /** Listado general de retiros, filtrable por estado o email de vecino. */
    @GetMapping
    public ResponseEntity<List<Pickup>> listarTodos(@RequestParam(required = false) String estado,
                                                    @RequestParam(required = false) String vecinoEmail) {
        if (estado != null && !estado.isBlank()) {
            return ResponseEntity.ok(pickupService.obtenerPorEstado(estado));
        }
        if (vecinoEmail != null && !vecinoEmail.isBlank()) {
            return ResponseEntity.ok(pickupService.obtenerPorVecino(vecinoEmail));
        }
        return ResponseEntity.ok(pickupService.obtenerTodos());
    }

    /** Consulta de retiro por ID numérico. */
    @GetMapping("/{id}")
    public ResponseEntity<Pickup> obtenerPorId(@PathVariable Long id) {
        return pickupService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Consulta de retiro por código único (ej: RET-PV-A1B2C3D4). */
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Pickup> obtenerPorCodigo(@PathVariable String codigo) {
        return pickupService.obtenerPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Crea una nueva solicitud de retiro en estado SOLICITADO. */
    @PostMapping
    public ResponseEntity<Pickup> crearSolicitud(@Valid @RequestBody Pickup pickup) {
        Pickup nuevaSolicitud = pickupService.crearSolicitud(pickup);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSolicitud);
    }

    /**
     * Transición SOLICITADO/PROGRAMADO → PROGRAMADO.
     * Requiere camionId, camionPatente y fechaProgramada del coordinador (vía params o body JSON).
     */
    @RequestMapping(value = "/{id}/programar", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> programarRetiro(@PathVariable Long id,
                                              @RequestParam(required = false) Long camionId,
                                              @RequestParam(required = false) String camionPatente,
                                              @RequestParam(required = false) String fechaProgramada,
                                              @RequestBody(required = false) Map<String, Object> body) {
        Long effCamionId = camionId != null ? camionId : (body != null && body.get("camionId") != null ? Long.valueOf(body.get("camionId").toString()) : null);
        String effPatente = camionPatente != null ? camionPatente : (body != null && body.get("camionPatente") != null ? body.get("camionPatente").toString() : null);
        String effFecha = fechaProgramada != null ? fechaProgramada : (body != null && body.get("fechaProgramada") != null ? body.get("fechaProgramada").toString() : null);

        if (effCamionId == null || effPatente == null || effPatente.isBlank() || effFecha == null || effFecha.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Los campos camionId, camionPatente y fechaProgramada son obligatorios para programar un retiro"));
        }

        LocalDateTime fecha = parseFechaProgramada(effFecha);
        Pickup actualizado = pickupService.programarRetiro(id, effCamionId, effPatente, fecha);
        return ResponseEntity.ok(actualizado);
    }

    /** Transición PROGRAMADO → EN_RUTA. */
    @RequestMapping(value = "/{id}/en-ruta", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> cambiarEstadoEnRuta(@PathVariable Long id) {
        Pickup actualizado = pickupService.cambiarEstadoEnRuta(id);
        return ResponseEntity.ok(actualizado);
    }

    /** Transición EN_RUTA → RETIRADO. */
    @RequestMapping(value = "/{id}/retirado", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> marcarRetirado(@PathVariable Long id) {
        Pickup actualizado = pickupService.marcarRetirado(id);
        return ResponseEntity.ok(actualizado);
    }

    /** Transición RETIRADO → PESADO con registro del peso real en kg. */
    @RequestMapping(value = "/{id}/pesado", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> registrarPesaje(@PathVariable Long id,
                                              @RequestParam(required = false) Double pesoRealKg,
                                              @RequestBody(required = false) Map<String, Object> body) {
        Double effPeso = pesoRealKg != null ? pesoRealKg : (body != null && body.get("pesoRealKg") != null ? Double.valueOf(body.get("pesoRealKg").toString()) : null);
        if (effPeso == null || effPeso <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "El campo pesoRealKg es obligatorio y debe ser mayor a 0"));
        }
        Pickup actualizado = pickupService.registrarPesaje(id, effPeso);
        return ResponseEntity.ok(actualizado);
    }

    /** Cancela un retiro (solo si no está en PESADO o ya CANCELADO). */
    @RequestMapping(value = "/{id}/cancelar", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> cancelarRetiro(@PathVariable Long id,
                                            @RequestParam(required = false) String motivo,
                                            @RequestBody(required = false) Map<String, Object> body) {
        String effMotivo = motivo != null ? motivo : (body != null && body.get("motivo") != null ? body.get("motivo").toString() : null);
        Pickup actualizado = pickupService.cancelarRetiro(id, effMotivo);
        return ResponseEntity.ok(actualizado);
    }

    // ── Utilidad interna ──────────────────────────────────────────────

    /**
     * Parsea la fecha programada desde el formato ISO 8601.
     * Soporta tanto "2026-09-17T10:30" (16 chars) como "2026-09-17T10:30:00",
     * tolerando además valores decodificados con URL encoding (%3A, %20, etc.).
     */
    private LocalDateTime parseFechaProgramada(String fechaProgramada) {
        if (fechaProgramada == null || fechaProgramada.isBlank()) {
            throw new IllegalArgumentException("La fecha programada es obligatoria");
        }
        String normalized = fechaProgramada.trim();
        try {
            normalized = java.net.URLDecoder.decode(normalized, java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception ignored) {}
        if (normalized.length() == 16) {
            normalized += ":00";
        }
        try {
            return LocalDateTime.parse(normalized);
        } catch (Exception e) {
            throw new IllegalArgumentException("Formato de fecha inválido: " + fechaProgramada
                    + ". Use formato ISO 8601 (ej: 2026-09-17T10:30:00)");
        }
    }
}

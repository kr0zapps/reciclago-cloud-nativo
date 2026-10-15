package com.duoc.ms_reciclago_catalog.controller;

import com.duoc.ms_reciclago_catalog.service.RotacionSemanalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Controller para el calendario de Rotación Semanal de Residuos Domiciliarios.
 *
 * Endpoints:
 *   GET   /api/catalog/rotacion/semanal               - Residuo de la semana activa
 *   GET   /api/catalog/rotacion/config                - Configuración administrativa y estado del ciclo
 *   PUT   /api/catalog/rotacion/config                - Actualizar modo (AUTOMATICO/MANUAL) y anulación
 *   POST  /api/catalog/rotacion/reset                 - Restablecer a modo automático municipal
 *   PATCH /api/catalog/rotacion/sector/{sectorNombre} - Modificar manualmente día o material de un sector
 */
@RestController
@RequestMapping("/api/catalog/rotacion")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:4200}")
public class RotacionSemanalController {

    private final RotacionSemanalService rotacionSemanalService;

    public RotacionSemanalController(RotacionSemanalService rotacionSemanalService) {
        this.rotacionSemanalService = rotacionSemanalService;
    }

    /**
     * Retorna el residuo domiciliario de la semana actual (o de la fecha indicada).
     */
    @GetMapping("/semanal")
    public ResponseEntity<Map<String, Object>> getRotacionSemanal(
            @RequestParam(required = false) String fecha) {
        try {
            LocalDate fechaConsulta = null;
            if (fecha != null && !fecha.isBlank()) {
                fechaConsulta = LocalDate.parse(fecha.trim());
            }
            Map<String, Object> rotacion = rotacionSemanalService.obtenerRotacionParaFecha(fechaConsulta);
            return ResponseEntity.ok(rotacion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Fecha inválida o error al calcular rotación: " + e.getMessage())
            );
        }
    }

    /**
     * Retorna la configuración completa del ciclo de 4 semanas y overrides por sector.
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getConfiguracion() {
        return ResponseEntity.ok(rotacionSemanalService.getConfiguracion());
    }

    /**
     * Actualiza el modo de operación (AUTOMATICO o MANUAL) y el residuo forzado de la semana.
     */
    @PutMapping("/config")
    public ResponseEntity<Map<String, Object>> actualizarConfiguracion(
            @RequestBody Map<String, Object> payload) {
        String modo = (String) payload.get("modo");
        String overrideCodigo = (String) payload.get("overrideCodigoResiduo");
        @SuppressWarnings("unchecked")
        List<String> slots = (List<String>) payload.get("slots");
        Map<String, Object> actualizada = rotacionSemanalService.actualizarConfiguracion(modo, overrideCodigo, slots);
        return ResponseEntity.ok(actualizada);
    }

    /**
     * Restablece la rotación a modo automático por semana ISO.
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> restablecerAutomatico() {
        return ResponseEntity.ok(rotacionSemanalService.restablecerAutomatico());
    }

    /**
     * Modifica manualmente el día de recolección o el material de un sector específico.
     */
    @PatchMapping("/sector/{sectorNombre}")
    public ResponseEntity<Map<String, Object>> actualizarSector(
            @PathVariable String sectorNombre,
            @RequestBody Map<String, String> payload) {
        String dia = payload.get("dia");
        String materialCodigo = payload.get("materialCodigo");
        Map<String, Object> actualizada = rotacionSemanalService.actualizarSector(sectorNombre, dia, materialCodigo);
        return ResponseEntity.ok(actualizada);
    }
}

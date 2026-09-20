package com.duoc.ms_reciclago_catalog.controller;

import com.duoc.ms_reciclago_catalog.service.RotacionSemanalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * Controller para el calendario de Rotación Semanal de Residuos Domiciliarios.
 *
 * Expone el endpoint que el frontend y el BFF consumen para saber qué residuo
 * se recolecta en la semana actual (o en cualquier fecha de consulta).
 *
 * Endpoint principal:
 *   GET /api/catalog/rotacion/semanal
 *   GET /api/catalog/rotacion/semanal?fecha=2026-09-22   (consulta fecha específica)
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
     *
     * @param fecha Opcional. Fecha ISO (yyyy-MM-dd) de consulta. Por defecto: hoy.
     * @return JSON con numSemanaISO, slotSemana, residuoCodigo, residuoNombre,
     *         descripcion, instrucciones, categoria, precioPorKg,
     *         vigenciaDesde, vigenciaHasta.
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
}

package com.duoc.ms_reciclago_pickups.controller;

import com.duoc.ms_reciclago_pickups.dto.PickupHistoryResponse;
import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.service.PickupService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pickups")
@CrossOrigin(origins = "*")
public class PickupController {

    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @GetMapping("/history")
    public ResponseEntity<PickupHistoryResponse> obtenerHistorial(
            @RequestParam(required = false) String vecinoEmail,
            @RequestParam(required = false) String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaSolicitud"));
        return ResponseEntity.ok(pickupService.obtenerHistorialPaginado(vecinoEmail, estado, pageable));
    }

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

    @GetMapping("/{id}")
    public ResponseEntity<Pickup> obtenerPorId(@PathVariable Long id) {
        return pickupService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Pickup> obtenerPorCodigo(@PathVariable String codigo) {
        return pickupService.obtenerPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pickup> crearSolicitud(@Valid @RequestBody Pickup pickup) {
        Pickup nuevaSolicitud = pickupService.crearSolicitud(pickup);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSolicitud);
    }

    @RequestMapping(value = "/{id}/programar", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> programarRetiro(@PathVariable Long id,
                                              @RequestParam(required = false) Long camionId,
                                              @RequestParam(required = false) String camionPatente,
                                              @RequestParam(required = false) String fechaProgramada) {
        try {
            LocalDateTime fecha = LocalDateTime.now().plusDays(1);
            if (fechaProgramada != null && !fechaProgramada.isBlank()) {
                String normalized = fechaProgramada.trim();
                if (normalized.length() == 16) {
                    normalized += ":00";
                }
                try {
                    fecha = LocalDateTime.parse(normalized);
                } catch (Exception e1) {
                    try {
                        fecha = LocalDateTime.parse(normalized, DateTimeFormatter.ISO_DATE_TIME);
                    } catch (Exception e2) {
                        // fallback a fecha por defecto
                    }
                }
            }
            Long effectiveCamionId = camionId != null ? camionId : 1L;
            String effectivePatente = camionPatente != null ? camionPatente : "PV-RC-2026";
            Pickup actualizado = pickupService.programarRetiro(id, effectiveCamionId, effectivePatente, fecha);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @RequestMapping(value = "/{id}/en-ruta", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> cambiarEstadoEnRuta(@PathVariable Long id) {
        try {
            Pickup actualizado = pickupService.cambiarEstadoEnRuta(id);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RequestMapping(value = "/{id}/retirado", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> marcarRetirado(@PathVariable Long id) {
        try {
            Pickup actualizado = pickupService.marcarRetirado(id);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RequestMapping(value = "/{id}/pesado", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> registrarPesaje(@PathVariable Long id, @RequestParam Double pesoRealKg) {
        try {
            Pickup actualizado = pickupService.registrarPesaje(id, pesoRealKg);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RequestMapping(value = "/{id}/cancelar", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> cancelarRetiro(@PathVariable Long id, @RequestParam(required = false) String motivo) {
        try {
            Pickup actualizado = pickupService.cancelarRetiro(id, motivo);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

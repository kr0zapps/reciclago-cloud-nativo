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
import java.util.List;

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

    @PatchMapping("/{id}/programar")
    public ResponseEntity<?> programarRetiro(@PathVariable Long id,
                                              @RequestParam Long camionId,
                                              @RequestParam String camionPatente,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaProgramada) {
        try {
            Pickup actualizado = pickupService.programarRetiro(id, camionId, camionPatente, fechaProgramada);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/en-ruta")
    public ResponseEntity<?> cambiarEstadoEnRuta(@PathVariable Long id) {
        try {
            Pickup actualizado = pickupService.cambiarEstadoEnRuta(id);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/retirado")
    public ResponseEntity<?> marcarRetirado(@PathVariable Long id) {
        try {
            Pickup actualizado = pickupService.marcarRetirado(id);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/pesado")
    public ResponseEntity<?> registrarPesaje(@PathVariable Long id, @RequestParam Double pesoRealKg) {
        try {
            Pickup actualizado = pickupService.registrarPesaje(id, pesoRealKg);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarRetiro(@PathVariable Long id, @RequestParam(required = false) String motivo) {
        try {
            Pickup actualizado = pickupService.cancelarRetiro(id, motivo);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

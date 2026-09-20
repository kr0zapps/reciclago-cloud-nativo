package com.duoc.ms_reciclago_catalog.controller;

import com.duoc.ms_reciclago_catalog.model.Camion;
import com.duoc.ms_reciclago_catalog.service.CamionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog/camiones")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:4200}")
public class CamionController {

    private final CamionService camionService;

    public CamionController(CamionService camionService) {
        this.camionService = camionService;
    }

    @GetMapping
    public ResponseEntity<List<Camion>> listarTodos(@RequestParam(required = false) String estado) {
        if (estado != null && !estado.isBlank()) {
            return ResponseEntity.ok(camionService.obtenerPorEstado(estado));
        }
        return ResponseEntity.ok(camionService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Camion> obtenerPorId(@PathVariable Long id) {
        return camionService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patente/{patente}")
    public ResponseEntity<Camion> obtenerPorPatente(@PathVariable String patente) {
        return camionService.obtenerPorPatente(patente)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Camion> crear(@Valid @RequestBody Camion camion) {
        Camion nuevoCamion = camionService.guardar(camion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCamion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Camion> actualizar(@PathVariable Long id, @Valid @RequestBody Camion camion) {
        try {
            Camion actualizado = camionService.actualizar(id, camion);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/reducir-capacidad")
    public ResponseEntity<Camion> reducirCapacidad(@PathVariable Long id, @RequestParam Double pesoKg) {
        try {
            Camion actualizado = camionService.reducirCapacidad(id, pesoKg);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Camion> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        try {
            com.duoc.ms_reciclago_catalog.model.EstadoCamion estadoEnum = com.duoc.ms_reciclago_catalog.model.Camion.parseEstado(estado);
            Camion actualizado = camionService.actualizarEstado(id, estadoEnum);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualiza el estado de un camión por su patente.
     * Endpoint de sincronización usado por ms-reciclago-pickups cuando
     * el camión transita entre estados operativos (EN_RUTA, DISPONIBLE, etc.).
     *
     * PATCH /api/catalog/camiones/patente/PV-RC-2026/estado?estado=EN_RUTA
     */
    @PatchMapping("/patente/{patente}/estado")
    public ResponseEntity<Camion> actualizarEstadoPorPatente(
            @PathVariable String patente,
            @RequestParam String estado) {
        try {
            com.duoc.ms_reciclago_catalog.model.EstadoCamion estadoEnum = com.duoc.ms_reciclago_catalog.model.Camion.parseEstado(estado);
            Camion actualizado = camionService.actualizarEstadoPorPatente(patente, estadoEnum);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        camionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

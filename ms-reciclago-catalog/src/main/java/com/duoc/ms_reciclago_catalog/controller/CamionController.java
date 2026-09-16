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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        camionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

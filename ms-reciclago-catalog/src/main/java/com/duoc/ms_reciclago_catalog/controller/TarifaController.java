package com.duoc.ms_reciclago_catalog.controller;

import com.duoc.ms_reciclago_catalog.model.Tarifa;
import com.duoc.ms_reciclago_catalog.service.TarifaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog/tarifas")
@CrossOrigin(origins = "*")
public class TarifaController {

    private final TarifaService tarifaService;

    public TarifaController(TarifaService tarifaService) {
        this.tarifaService = tarifaService;
    }

    @GetMapping
    public ResponseEntity<List<Tarifa>> listarTodas(@RequestParam(required = false) String comuna,
                                                    @RequestParam(required = false, defaultValue = "false") boolean soloActivas) {
        if (comuna != null && !comuna.isBlank()) {
            return ResponseEntity.ok(tarifaService.obtenerPorComuna(comuna));
        }
        if (soloActivas) {
            return ResponseEntity.ok(tarifaService.obtenerActivas());
        }
        return ResponseEntity.ok(tarifaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarifa> obtenerPorId(@PathVariable Long id) {
        return tarifaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tarifa> crear(@Valid @RequestBody Tarifa tarifa) {
        Tarifa nuevaTarifa = tarifaService.guardar(tarifa);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarifa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarifa> actualizar(@PathVariable Long id, @Valid @RequestBody Tarifa tarifa) {
        try {
            Tarifa actualizada = tarifaService.actualizar(id, tarifa);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tarifaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

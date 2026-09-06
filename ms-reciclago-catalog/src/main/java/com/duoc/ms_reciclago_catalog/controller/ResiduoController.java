package com.duoc.ms_reciclago_catalog.controller;

import com.duoc.ms_reciclago_catalog.model.Residuo;
import com.duoc.ms_reciclago_catalog.service.ResiduoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog/residuos")
@CrossOrigin(origins = "*")
public class ResiduoController {

    private final ResiduoService residuoService;

    public ResiduoController(ResiduoService residuoService) {
        this.residuoService = residuoService;
    }

    @GetMapping
    public ResponseEntity<List<Residuo>> listarTodos(@RequestParam(required = false, defaultValue = "false") boolean soloActivos) {
        if (soloActivos) {
            return ResponseEntity.ok(residuoService.obtenerActivos());
        }
        return ResponseEntity.ok(residuoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Residuo> obtenerPorId(@PathVariable Long id) {
        return residuoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Residuo> obtenerPorCodigo(@PathVariable String codigo) {
        return residuoService.obtenerPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Residuo> crear(@Valid @RequestBody Residuo residuo) {
        Residuo nuevoResiduo = residuoService.guardar(residuo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoResiduo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Residuo> actualizar(@PathVariable Long id, @Valid @RequestBody Residuo residuo) {
        try {
            Residuo actualizado = residuoService.actualizar(id, residuo);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        residuoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

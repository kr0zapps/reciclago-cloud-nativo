package com.duoc.ms_reciclago_routes.controller;

import com.duoc.ms_reciclago_routes.dto.CuadranteConsultaResponse;
import com.duoc.ms_reciclago_routes.model.CamionTracking;
import com.duoc.ms_reciclago_routes.model.Cuadrante;
import com.duoc.ms_reciclago_routes.service.RouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping("/cuadrantes")
    public ResponseEntity<List<Cuadrante>> listarCuadrantes() {
        return ResponseEntity.ok(routeService.listarCuadrantes());
    }

    @GetMapping("/cuadrantes/{id}")
    public ResponseEntity<Cuadrante> obtenerCuadrantePorId(@PathVariable Long id) {
        return routeService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cuadrante")
    public ResponseEntity<CuadranteConsultaResponse> consultarCuadrante(@RequestParam(required = false) String direccion) {
        return ResponseEntity.ok(routeService.consultarCuadrantePorDireccion(direccion));
    }

    @GetMapping("/{cuadranteId}/tracking")
    public ResponseEntity<CamionTracking> obtenerTrackingPorCuadrante(@PathVariable Long cuadranteId) {
        return routeService.obtenerTrackingPorCuadrante(cuadranteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tracking/{camionId}")
    public ResponseEntity<CamionTracking> obtenerTrackingPorCamion(@PathVariable Long camionId) {
        return routeService.obtenerTrackingPorCamion(camionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/tracking/{camionId}")
    public ResponseEntity<CamionTracking> actualizarTracking(
            @PathVariable Long camionId,
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(required = false) String calle,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) Double velocidad) {
        return ResponseEntity.ok(routeService.actualizarTracking(camionId, lat, lng, calle, estado, velocidad));
    }
}

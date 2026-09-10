package com.duoc.ms_reciclago_routes.service;

import com.duoc.ms_reciclago_routes.dto.CuadranteConsultaResponse;
import com.duoc.ms_reciclago_routes.model.CamionTracking;
import com.duoc.ms_reciclago_routes.model.Cuadrante;
import com.duoc.ms_reciclago_routes.repository.CamionTrackingRepository;
import com.duoc.ms_reciclago_routes.repository.CuadranteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RouteService {

    private final CuadranteRepository cuadranteRepository;
    private final CamionTrackingRepository trackingRepository;

    public RouteService(CuadranteRepository cuadranteRepository, CamionTrackingRepository trackingRepository) {
        this.cuadranteRepository = cuadranteRepository;
        this.trackingRepository = trackingRepository;
    }

    public List<Cuadrante> listarCuadrantes() {
        return cuadranteRepository.findAll();
    }

    public Optional<Cuadrante> obtenerPorId(Long id) {
        return cuadranteRepository.findById(id);
    }

    public CuadranteConsultaResponse consultarCuadrantePorDireccion(String direccion) {
        List<Cuadrante> cuadrantes = cuadranteRepository.findAll();
        if (cuadrantes.isEmpty()) {
            return new CuadranteConsultaResponse(2L, "Costanera Sur y Llanquihue Sur", "Sector Lago",
                    "MARTES", "08:00 - 17:00 hrs", "PV-RC-2026", true);
        }

        Cuadrante seleccionado = null;
        if (direccion != null && !direccion.isBlank()) {
            String dirNorm = direccion.toLowerCase();
            if (dirNorm.contains("guindo") || dirNorm.contains("costanera") || dirNorm.contains("vicente") || dirNorm.contains("imperial") || dirNorm.contains("san francisco")) {
                seleccionado = cuadrantes.stream().filter(c -> c.getNumero() == 2).findFirst().orElse(null);
            } else if (dirNorm.contains("chico") || dirNorm.contains("colo") || dirNorm.contains("decher") || dirNorm.contains("mirador") || dirNorm.contains("colon")) {
                seleccionado = cuadrantes.stream().filter(c -> c.getNumero() == 1).findFirst().orElse(null);
            } else if (dirNorm.contains("ensenada") || dirNorm.contains("colono") || dirNorm.contains("risco")) {
                seleccionado = cuadrantes.stream().filter(c -> c.getNumero() == 3).findFirst().orElse(null);
            } else if (dirNorm.contains("braunau") || dirNorm.contains("otto")) {
                seleccionado = cuadrantes.stream().filter(c -> c.getNumero() == 4).findFirst().orElse(null);
            }
        }

        if (seleccionado == null) {
            // Default al Cuadrante 2 (Costanera/Centro Lago)
            seleccionado = cuadrantes.stream().filter(c -> c.getNumero() == 2).findFirst().orElse(cuadrantes.get(0));
        }

        return new CuadranteConsultaResponse(
                seleccionado.getId(),
                seleccionado.getNombre(),
                seleccionado.getSector(),
                seleccionado.getDiaSemana(),
                seleccionado.getHorario(),
                seleccionado.getCamionPatente() != null ? seleccionado.getCamionPatente() : "PV-RC-2026",
                seleccionado.getCamionEnRuta() != null ? seleccionado.getCamionEnRuta() : true
        );
    }

    public Optional<CamionTracking> obtenerTrackingPorCuadrante(Long cuadranteId) {
        return trackingRepository.findByCuadranteId(cuadranteId);
    }

    public Optional<CamionTracking> obtenerTrackingPorCamion(Long camionId) {
        return trackingRepository.findByCamionId(camionId);
    }

    public CamionTracking actualizarTracking(Long camionId, Double lat, Double lng, String calle, String estado, Double velocidad) {
        CamionTracking tracking = trackingRepository.findByCamionId(camionId)
                .orElse(new CamionTracking(null, camionId, "PV-RC-2026", 2L, lat, lng, calle, estado, velocidad, 1500.0, 0.0, LocalDateTime.now()));

        tracking.setLat(lat);
        tracking.setLng(lng);
        if (calle != null) tracking.setCalleActual(calle);
        if (estado != null) tracking.setEstado(estado);
        if (velocidad != null) tracking.setVelocidadKmH(velocidad);
        tracking.setUltimaActualizacion(LocalDateTime.now());

        return trackingRepository.save(tracking);
    }
}

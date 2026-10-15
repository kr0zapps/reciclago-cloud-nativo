package com.duoc.ms_reciclago_routes.service;

import com.duoc.ms_reciclago_routes.dto.CuadranteConsultaResponse;
import com.duoc.ms_reciclago_routes.model.CamionTracking;
import com.duoc.ms_reciclago_routes.model.Cuadrante;
import com.duoc.ms_reciclago_routes.repository.CamionTrackingRepository;
import com.duoc.ms_reciclago_routes.repository.CuadranteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RouteService {

    private static final String DEFAULT_PATENTE = "PV-RC-2026";

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
                    "MARTES", "08:00 - 17:00 hrs", DEFAULT_PATENTE, true);
        }

        Cuadrante seleccionado = buscarCuadrantePorDireccion(cuadrantes, direccion);

        if (seleccionado == null) {
            seleccionado = cuadrantes.stream().filter(c -> c.getNumero() == 2).findFirst().orElse(cuadrantes.get(0));
        }

        return new CuadranteConsultaResponse(
                seleccionado.getId(),
                seleccionado.getNombre(),
                seleccionado.getSector(),
                seleccionado.getDiaSemana(),
                seleccionado.getHorario(),
                seleccionado.getCamionPatente() != null ? seleccionado.getCamionPatente() : DEFAULT_PATENTE,
                !Boolean.FALSE.equals(seleccionado.getCamionEnRuta())
        );
    }

    private Cuadrante buscarCuadrantePorDireccion(List<Cuadrante> cuadrantes, String direccion) {
        if (direccion == null || direccion.isBlank()) {
            return null;
        }
        String dirNorm = direccion.toLowerCase();
        for (Cuadrante c : cuadrantes) {
            if (coincideConCuadrante(c, dirNorm)) {
                return c;
            }
        }
        return null;
    }

    private boolean coincideConCuadrante(Cuadrante c, String dirNorm) {
        return coincideConCalles(c.getCallesPrincipales(), dirNorm)
                || coincideConTexto(c.getSector(), dirNorm)
                || coincideConTexto(c.getNombre(), dirNorm);
    }

    private boolean coincideConCalles(String callesPrincipales, String dirNorm) {
        if (callesPrincipales == null) {
            return false;
        }
        for (String calle : callesPrincipales.split(",")) {
            String calleTrim = calle.trim().toLowerCase();
            if (!calleTrim.isBlank() && dirNorm.contains(calleTrim)) {
                return true;
            }
        }
        return false;
    }

    private boolean coincideConTexto(String campo, String dirNorm) {
        return campo != null && dirNorm.contains(campo.toLowerCase());
    }

    public Optional<CamionTracking> obtenerTrackingPorCuadrante(Long cuadranteId) {
        return trackingRepository.findByCuadranteId(cuadranteId);
    }

    public Optional<CamionTracking> obtenerTrackingPorCamion(Long camionId) {
        return trackingRepository.findByCamionId(camionId);
    }

    public CamionTracking actualizarTracking(Long camionId, Double lat, Double lng, String calle, String estado, Double velocidad) {
        CamionTracking tracking = trackingRepository.findByCamionId(camionId)
                .orElseGet(() -> CamionTracking.builder()
                        .camionId(camionId)
                        .patente(DEFAULT_PATENTE)
                        .cuadranteId(2L)
                        .lat(lat)
                        .lng(lng)
                        .calleActual(calle)
                        .estado(estado)
                        .velocidadKmH(velocidad)
                        .capacidadTotalKg(1500.0)
                        .kilosCargados(0.0)
                        .ultimaActualizacion(LocalDateTime.now(ZoneId.systemDefault()))
                        .build());

        tracking.setLat(lat);
        tracking.setLng(lng);
        if (calle != null) tracking.setCalleActual(calle);
        if (estado != null) tracking.setEstado(estado);
        if (velocidad != null) tracking.setVelocidadKmH(velocidad);
        tracking.setUltimaActualizacion(LocalDateTime.now(ZoneId.systemDefault()));

        return trackingRepository.save(tracking);
    }
}

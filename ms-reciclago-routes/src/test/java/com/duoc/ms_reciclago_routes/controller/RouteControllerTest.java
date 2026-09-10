package com.duoc.ms_reciclago_routes.controller;

import com.duoc.ms_reciclago_routes.dto.CuadranteConsultaResponse;
import com.duoc.ms_reciclago_routes.model.CamionTracking;
import com.duoc.ms_reciclago_routes.model.Cuadrante;
import com.duoc.ms_reciclago_routes.service.RouteService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RouteController.class)
public class RouteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RouteService routeService;

    @Test
    @DisplayName("GET /api/routes/cuadrantes - Debe listar todos los cuadrantes")
    void testListarCuadrantes() throws Exception {
        Cuadrante c1 = new Cuadrante(1L, 1, "Cuadrante 1: Puerto Chico", "Sector Puerto Chico",
                "LUNES", "08:00 - 17:00 hrs", "Colo Colo", "PV-RC-2027", true);
        Cuadrante c2 = new Cuadrante(2L, 2, "Costanera Sur y Llanquihue Sur", "Sector Lago",
                "MARTES", "08:00 - 17:00 hrs", "Los Guindos", "PV-RC-2026", true);

        when(routeService.listarCuadrantes()).thenReturn(Arrays.asList(c1, c2));

        mockMvc.perform(get("/api/routes/cuadrantes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("Cuadrante 1: Puerto Chico"))
                .andExpect(jsonPath("$[1].nombre").value("Costanera Sur y Llanquihue Sur"));
    }

    @Test
    @DisplayName("GET /api/routes/cuadrante?direccion=Los+Guindos+450 - Debe responder según Contrato 1")
    void testConsultarCuadrantePorDireccion() throws Exception {
        CuadranteConsultaResponse response = new CuadranteConsultaResponse(
                2L, "Costanera Sur y Llanquihue Sur", "Sector Lago",
                "MARTES", "08:00 - 17:00 hrs", "PV-RC-2026", true
        );

        when(routeService.consultarCuadrantePorDireccion("Los Guindos 450")).thenReturn(response);

        mockMvc.perform(get("/api/routes/cuadrante").param("direccion", "Los Guindos 450"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cuadranteId").value(2))
                .andExpect(jsonPath("$.nombre").value("Costanera Sur y Llanquihue Sur"))
                .andExpect(jsonPath("$.sector").value("Sector Lago"))
                .andExpect(jsonPath("$.diaSemana").value("MARTES"))
                .andExpect(jsonPath("$.horario").value("08:00 - 17:00 hrs"))
                .andExpect(jsonPath("$.camionPatente").value("PV-RC-2026"))
                .andExpect(jsonPath("$.camionEnRuta").value(true));
    }

    @Test
    @DisplayName("GET /api/routes/{cuadranteId}/tracking - Debe retornar telemetría del camión en el cuadrante")
    void testObtenerTrackingPorCuadrante() throws Exception {
        CamionTracking tracking = new CamionTracking(1L, 1L, "PV-RC-2026", 2L,
                -41.3204, -72.9856, "Av. Vicente Pérez Rosales", "EN_CIRCULACION",
                24.5, 1500.0, 420.0, LocalDateTime.now());

        when(routeService.obtenerTrackingPorCuadrante(2L)).thenReturn(Optional.of(tracking));

        mockMvc.perform(get("/api/routes/2/tracking"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.patente").value("PV-RC-2026"))
                .andExpect(jsonPath("$.lat").value(-41.3204))
                .andExpect(jsonPath("$.lng").value(-72.9856))
                .andExpect(jsonPath("$.estado").value("EN_CIRCULACION"));
    }
}

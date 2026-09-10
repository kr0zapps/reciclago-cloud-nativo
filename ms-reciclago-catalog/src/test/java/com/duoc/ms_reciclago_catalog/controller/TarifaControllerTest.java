package com.duoc.ms_reciclago_catalog.controller;

import com.duoc.ms_reciclago_catalog.model.Tarifa;
import com.duoc.ms_reciclago_catalog.service.TarifaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TarifaController.class)
public class TarifaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TarifaService tarifaService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/catalog/tarifas - Debe retornar todas las tarifas")
    void testListarTodas() throws Exception {
        Tarifa t1 = new Tarifa(1L, "Tarifa Domiciliaria Costanera", "Puerto Varas", 2000.0, 40.0, true);
        Tarifa t2 = new Tarifa(2L, "Tarifa Comercial Pymes", "Puerto Varas", 4500.0, 30.0, true);

        when(tarifaService.obtenerTodas()).thenReturn(Arrays.asList(t1, t2));

        mockMvc.perform(get("/api/catalog/tarifas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("Tarifa Domiciliaria Costanera"))
                .andExpect(jsonPath("$[1].nombre").value("Tarifa Comercial Pymes"));
    }

    @Test
    @DisplayName("GET /api/catalog/tarifas/{id} - Debe retornar una tarifa por ID")
    void testObtenerPorId() throws Exception {
        Tarifa t1 = new Tarifa(1L, "Tarifa Domiciliaria Costanera", "Puerto Varas", 2000.0, 40.0, true);

        when(tarifaService.obtenerPorId(1L)).thenReturn(Optional.of(t1));

        mockMvc.perform(get("/api/catalog/tarifas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.costoBase").value(2000.0));
    }

    @Test
    @DisplayName("POST /api/catalog/tarifas - Debe crear una nueva tarifa")
    void testCrearTarifa() throws Exception {
        Tarifa nueva = new Tarifa(null, "Tarifa Industrial", "Puerto Varas", 10000.0, 25.0, true);
        Tarifa guardada = new Tarifa(3L, "Tarifa Industrial", "Puerto Varas", 10000.0, 25.0, true);

        when(tarifaService.guardar(any(Tarifa.class))).thenReturn(guardada);

        mockMvc.perform(post("/api/catalog/tarifas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nueva)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.nombre").value("Tarifa Industrial"));
    }
}

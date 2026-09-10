package com.duoc.ms_reciclago_catalog.controller;

import com.duoc.ms_reciclago_catalog.model.Camion;
import com.duoc.ms_reciclago_catalog.service.CamionService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CamionController.class)
public class CamionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CamionService camionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/catalog/camiones - Debe listar todos los camiones")
    void testListarTodos() throws Exception {
        Camion c1 = new Camion(1L, "PV-RC-2026", "Mercedes Sprinter", 1500.0, 1500.0, "DISPONIBLE");
        Camion c2 = new Camion(2L, "PV-RC-2027", "Volvo FL250", 3000.0, 3000.0, "DISPONIBLE");

        when(camionService.obtenerTodos()).thenReturn(Arrays.asList(c1, c2));

        mockMvc.perform(get("/api/catalog/camiones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].patente").value("PV-RC-2026"))
                .andExpect(jsonPath("$[1].patente").value("PV-RC-2027"));
    }

    @Test
    @DisplayName("GET /api/catalog/camiones/{id} - Debe retornar camion por ID")
    void testObtenerPorId() throws Exception {
        Camion c1 = new Camion(1L, "PV-RC-2026", "Mercedes Sprinter", 1500.0, 1500.0, "DISPONIBLE");

        when(camionService.obtenerPorId(1L)).thenReturn(Optional.of(c1));

        mockMvc.perform(get("/api/catalog/camiones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.patente").value("PV-RC-2026"))
                .andExpect(jsonPath("$.capacidadTotalKg").value(1500.0));
    }

    @Test
    @DisplayName("POST /api/catalog/camiones - Debe crear nuevo camion")
    void testCrearCamion() throws Exception {
        Camion nuevo = new Camion(null, "PV-RC-2028", "Isuzu NPR 75", 2000.0, 2000.0, "DISPONIBLE");
        Camion guardado = new Camion(3L, "PV-RC-2028", "Isuzu NPR 75", 2000.0, 2000.0, "DISPONIBLE");

        when(camionService.guardar(any(Camion.class))).thenReturn(guardado);

        mockMvc.perform(post("/api/catalog/camiones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nuevo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.patente").value("PV-RC-2028"));
    }

    @Test
    @DisplayName("PATCH /api/catalog/camiones/{id}/reducir-capacidad - Debe reducir capacidad")
    void testReducirCapacidad() throws Exception {
        Camion actualizado = new Camion(1L, "PV-RC-2026", "Mercedes Sprinter", 1500.0, 1300.0, "DISPONIBLE");

        when(camionService.reducirCapacidad(eq(1L), eq(200.0))).thenReturn(actualizado);

        mockMvc.perform(patch("/api/catalog/camiones/1/reducir-capacidad")
                        .param("pesoKg", "200.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capacidadDisponibleKg").value(1300.0));
    }
}

package com.duoc.ms_reciclago_catalog.controller;

import com.duoc.ms_reciclago_catalog.model.Residuo;
import com.duoc.ms_reciclago_catalog.service.ResiduoService;
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

@WebMvcTest(ResiduoController.class)
public class ResiduoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResiduoService residuoService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/catalog/residuos - Debe retornar lista de residuos")
    void testListarTodos() throws Exception {
        Residuo r1 = new Residuo(1L, "Plástico PET", "PLAS-001", "Botellas plásticas", 150.0, false, true);
        Residuo r2 = new Residuo(2L, "Cartón y Papel", "CART-001", "Cajas de cartón corrugado", 80.0, false, true);

        when(residuoService.obtenerTodos()).thenReturn(Arrays.asList(r1, r2));

        mockMvc.perform(get("/api/catalog/residuos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("Plástico PET"))
                .andExpect(jsonPath("$[1].nombre").value("Cartón y Papel"));
    }

    @Test
    @DisplayName("GET /api/catalog/residuos/{id} - Debe retornar un residuo por ID")
    void testObtenerPorId() throws Exception {
        Residuo r = new Residuo(1L, "Plástico PET", "PLAS-001", "Botellas plásticas", 150.0, false, true);

        when(residuoService.obtenerPorId(1L)).thenReturn(Optional.of(r));

        mockMvc.perform(get("/api/catalog/residuos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.codigo").value("PLAS-001"))
                .andExpect(jsonPath("$.precioPorKg").value(150.0));
    }

    @Test
    @DisplayName("POST /api/catalog/residuos - Debe crear un nuevo residuo")
    void testCrearResiduo() throws Exception {
        Residuo nuevo = new Residuo(null, "Vidrio Verde", "VID-001", "Botellas de vidrio", 100.0, true, true);
        Residuo creado = new Residuo(3L, "Vidrio Verde", "VID-001", "Botellas de vidrio", 100.0, true, true);

        when(residuoService.guardar(any(Residuo.class))).thenReturn(creado);

        mockMvc.perform(post("/api/catalog/residuos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nuevo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.nombre").value("Vidrio Verde"))
                .andExpect(jsonPath("$.requiereManejoEspecial").value(true));
    }
}

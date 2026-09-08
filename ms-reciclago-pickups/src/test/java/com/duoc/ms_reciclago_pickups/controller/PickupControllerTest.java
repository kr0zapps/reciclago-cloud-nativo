package com.duoc.ms_reciclago_pickups.controller;

import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.service.PickupService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PickupController.class)
public class PickupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PickupService pickupService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/pickups - Debe retornar lista de retiros")
    void testListarTodos() throws Exception {
        Pickup p1 = new Pickup(1L, "RET-11112222", "Juan Pérez", "juan@example.com", "Av. Providencia 123",
                "Providencia", 1L, "Plástico PET", null, null,
                15.0, null, "SOLICITADO", LocalDateTime.now(), null, null, "Dejar en conserjería");

        when(pickupService.obtenerTodos()).thenReturn(Arrays.asList(p1));

        mockMvc.perform(get("/api/pickups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].codigoRetiro").value("RET-11112222"))
                .andExpect(jsonPath("$[0].vecinoNombre").value("Juan Pérez"));
    }

    @Test
    @DisplayName("GET /api/pickups/{id} - Debe retornar un retiro por ID")
    void testObtenerPorId() throws Exception {
        Pickup p1 = new Pickup(1L, "RET-11112222", "Juan Pérez", "juan@example.com", "Av. Providencia 123",
                "Providencia", 1L, "Plástico PET", null, null,
                15.0, null, "SOLICITADO", LocalDateTime.now(), null, null, "Dejar en conserjería");

        when(pickupService.obtenerPorId(1L)).thenReturn(Optional.of(p1));

        mockMvc.perform(get("/api/pickups/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.codigoRetiro").value("RET-11112222"));
    }

    @Test
    @DisplayName("POST /api/pickups - Debe crear una solicitud de retiro")
    void testCrearSolicitud() throws Exception {
        Pickup request = new Pickup();
        request.setVecinoNombre("Maria Gonzalez");
        request.setVecinoEmail("maria@example.com");
        request.setDireccion("Calle Los Robles 456");
        request.setComuna("Ñuñoa");
        request.setResiduoId(1L);
        request.setPesoEstimadoKg(20.0);

        Pickup guardado = new Pickup(2L, "RET-99998888", "Maria Gonzalez", "maria@example.com", "Calle Los Robles 456",
                "Ñuñoa", 1L, "Plástico", null, null,
                20.0, null, "SOLICITADO", LocalDateTime.now(), null, null, null);

        when(pickupService.crearSolicitud(any(Pickup.class))).thenReturn(guardado);

        mockMvc.perform(post("/api/pickups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.codigoRetiro").value("RET-99998888"))
                .andExpect(jsonPath("$.estado").value("SOLICITADO"));
    }
}

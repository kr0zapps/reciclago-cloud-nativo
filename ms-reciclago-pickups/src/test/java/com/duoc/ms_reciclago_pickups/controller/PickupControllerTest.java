package com.duoc.ms_reciclago_pickups.controller;

import com.duoc.ms_reciclago_pickups.dto.PickupHistoryDto;
import com.duoc.ms_reciclago_pickups.dto.PickupHistoryResponse;
import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.service.PickupService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
        request.setComuna("Puerto Varas");
        request.setResiduoId(1L);
        request.setPesoEstimadoKg(20.0);

        Pickup guardado = new Pickup(2L, "RET-PV-999988", "Maria Gonzalez", "maria@example.com", "Calle Los Robles 456",
                "Puerto Varas", 1L, "Plástico", null, null,
                20.0, null, "SOLICITADO", LocalDateTime.now(), null, null, null);

        when(pickupService.crearSolicitud(any(Pickup.class))).thenReturn(guardado);

        mockMvc.perform(post("/api/pickups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.codigoRetiro").value("RET-PV-999988"))
                .andExpect(jsonPath("$.estado").value("SOLICITADO"));
    }

    @Test
    @DisplayName("GET /api/pickups/history - Debe retornar historial paginado según contrato")
    void testObtenerHistorial() throws Exception {
        PickupHistoryDto item = new PickupHistoryDto(14L, "2026-09-02", "Miércoles 02 Septiembre",
                "Cartón y Papel", 12.5, "Calle Los Guindos 450", "completado");
        PickupHistoryResponse response = new PickupHistoryResponse(Collections.singletonList(item), 1, 1, 0);

        when(pickupService.obtenerHistorialPaginado(any(), any(), any(Pageable.class))).thenReturn(response);

        mockMvc.perform(get("/api/pickups/history")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].id").value(14))
                .andExpect(jsonPath("$.content[0].residuoNombre").value("Cartón y Papel"))
                .andExpect(jsonPath("$.content[0].kilosRecolectados").value(12.5));
    }

    @Test
    @DisplayName("PATCH /api/pickups/{id}/programar - Debe programar el retiro")
    void testProgramarRetiro() throws Exception {
        Pickup p = new Pickup();
        p.setId(1L);
        p.setEstado("PROGRAMADO");
        p.setCamionPatente("PV-RC-2026");

        when(pickupService.programarRetiro(eq(1L), eq(10L), eq("PV-RC-2026"), any(LocalDateTime.class))).thenReturn(p);

        mockMvc.perform(patch("/api/pickups/1/programar")
                        .param("camionId", "10")
                        .param("camionPatente", "PV-RC-2026")
                        .param("fechaProgramada", "2026-09-15T10:00:00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("PROGRAMADO"))
                .andExpect(jsonPath("$.camionPatente").value("PV-RC-2026"));
    }

    @Test
    @DisplayName("PATCH /api/pickups/{id}/en-ruta - Debe cambiar a EN_RUTA")
    void testCambiarEstadoEnRuta() throws Exception {
        Pickup p = new Pickup();
        p.setId(1L);
        p.setEstado("EN_RUTA");

        when(pickupService.cambiarEstadoEnRuta(1L)).thenReturn(p);

        mockMvc.perform(patch("/api/pickups/1/en-ruta"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("EN_RUTA"));
    }

    @Test
    @DisplayName("PATCH /api/pickups/{id}/retirado - Debe marcar como RETIRADO")
    void testMarcarRetirado() throws Exception {
        Pickup p = new Pickup();
        p.setId(1L);
        p.setEstado("RETIRADO");

        when(pickupService.marcarRetirado(1L)).thenReturn(p);

        mockMvc.perform(patch("/api/pickups/1/retirado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("RETIRADO"));
    }

    @Test
    @DisplayName("PATCH /api/pickups/{id}/pesado - Debe registrar pesaje")
    void testRegistrarPesaje() throws Exception {
        Pickup p = new Pickup();
        p.setId(1L);
        p.setEstado("PESADO");
        p.setPesoRealKg(8.4);

        when(pickupService.registrarPesaje(1L, 8.4)).thenReturn(p);

        mockMvc.perform(patch("/api/pickups/1/pesado")
                        .param("pesoRealKg", "8.4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("PESADO"))
                .andExpect(jsonPath("$.pesoRealKg").value(8.4));
    }

    @Test
    @DisplayName("PATCH /api/pickups/{id}/cancelar - Debe cancelar retiro")
    void testCancelarRetiro() throws Exception {
        Pickup p = new Pickup();
        p.setId(1L);
        p.setEstado("CANCELADO");

        when(pickupService.cancelarRetiro(1L, "Vecino no se encuentra")).thenReturn(p);

        mockMvc.perform(patch("/api/pickups/1/cancelar")
                        .param("motivo", "Vecino no se encuentra"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("CANCELADO"));
    }
}

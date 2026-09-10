package com.duoc.ms_reciclago_routes.controller;

import com.duoc.ms_reciclago_routes.dto.ContactoRequestDto;
import com.duoc.ms_reciclago_routes.dto.ContactoResponseDto;
import com.duoc.ms_reciclago_routes.service.CitizenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CitizenController.class)
public class CitizenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CitizenService citizenService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/citizens/contact - Debe ingresar ticket según Contrato 3")
    void testCrearContacto() throws Exception {
        ContactoRequestDto request = new ContactoRequestDto(
                "Jonathan Vidal",
                "jovise@alumnos.duoc.cl",
                "+56912345678",
                "Consulta retiro de ramas y poda",
                "Estimados, quisiera saber si las podas de árboles nativos entran en el retiro especial de este mes."
        );

        ContactoResponseDto response = new ContactoResponseDto(
                "DIMAO-2026-0941",
                "RECIBIDO",
                "Su solicitud ha sido ingresada a la Dirección de Medio Ambiente de Puerto Varas."
        );

        when(citizenService.registrarContacto(any(ContactoRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/api/citizens/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ticketId").value("DIMAO-2026-0941"))
                .andExpect(jsonPath("$.status").value("RECIBIDO"))
                .andExpect(jsonPath("$.mensaje").value("Su solicitud ha sido ingresada a la Dirección de Medio Ambiente de Puerto Varas."));
    }

    @Test
    @DisplayName("GET /api/citizens/how-it-works - Debe retornar la guía ciudadana")
    void testObtenerGuia() throws Exception {
        when(citizenService.obtenerGuiaCiudadana()).thenReturn(Map.of("comuna", "Puerto Varas"));

        mockMvc.perform(get("/api/citizens/how-it-works"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comuna").value("Puerto Varas"));
    }

    @Test
    @DisplayName("GET /api/citizens/faq - Debe retornar preguntas frecuentes")
    void testObtenerFaq() throws Exception {
        when(citizenService.obtenerFaqs()).thenReturn(Collections.singletonList(Map.of("pregunta", "Test")));

        mockMvc.perform(get("/api/citizens/faq"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}

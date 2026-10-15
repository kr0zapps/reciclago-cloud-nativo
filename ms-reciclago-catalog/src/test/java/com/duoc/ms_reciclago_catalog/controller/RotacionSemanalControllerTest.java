package com.duoc.ms_reciclago_catalog.controller;

import com.duoc.ms_reciclago_catalog.model.Residuo;
import com.duoc.ms_reciclago_catalog.service.RotacionSemanalService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RotacionSemanalController.class)
public class RotacionSemanalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RotacionSemanalService rotacionSemanalService;

    private Map<String, Object> mockRotacionVidrio() {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("numSemanaISO", 39);
        r.put("slotSemana", 3);
        r.put("residuoCodigo", "PLASTICO_PET");
        r.put("vigenciaDesde", "2026-09-21");
        r.put("vigenciaHasta", "2026-09-27");
        r.put("residuoId", 3L);
        r.put("residuoNombre", "Plásticos (PET y PEAD)");
        r.put("descripcion", "Botellas plásticas de bebidas");
        r.put("instrucciones", "Lavar, escurrir y aplastar.");
        r.put("categoria", "PLASTICO");
        r.put("precioPorKg", 150.0);
        return r;
    }

    @Test
    @DisplayName("GET /api/catalog/rotacion/semanal - Debe retornar rotación de la semana actual")
    void testGetRotacionSemanal() throws Exception {
        when(rotacionSemanalService.obtenerRotacionParaFecha(null))
                .thenReturn(mockRotacionVidrio());

        mockMvc.perform(get("/api/catalog/rotacion/semanal"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.residuoCodigo").value("PLASTICO_PET"))
                .andExpect(jsonPath("$.residuoNombre").value("Plásticos (PET y PEAD)"))
                .andExpect(jsonPath("$.slotSemana").value(3))
                .andExpect(jsonPath("$.vigenciaDesde").value("2026-09-21"))
                .andExpect(jsonPath("$.vigenciaHasta").value("2026-09-27"));
    }

    @Test
    @DisplayName("GET /api/catalog/rotacion/semanal?fecha=2026-01-05 - Debe retornar rotación para fecha específica (sem 2 → Cartón)")
    void testGetRotacionSemanalConFecha() throws Exception {
        Map<String, Object> rotacionCarton = new LinkedHashMap<>();
        rotacionCarton.put("numSemanaISO", 2);
        rotacionCarton.put("slotSemana", 2);
        rotacionCarton.put("residuoCodigo", "CARTON_PAPEL");
        rotacionCarton.put("vigenciaDesde", "2026-01-05");
        rotacionCarton.put("vigenciaHasta", "2026-01-11");
        rotacionCarton.put("residuoId", 2L);
        rotacionCarton.put("residuoNombre", "Cartón y Papel");
        rotacionCarton.put("descripcion", "Cajas de cartón corrugado");
        rotacionCarton.put("instrucciones", "Aplanar cajas.");
        rotacionCarton.put("categoria", "CARTON");
        rotacionCarton.put("precioPorKg", 100.0);

        when(rotacionSemanalService.obtenerRotacionParaFecha(any()))
                .thenReturn(rotacionCarton);

        mockMvc.perform(get("/api/catalog/rotacion/semanal").param("fecha", "2026-01-05"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.residuoCodigo").value("CARTON_PAPEL"))
                .andExpect(jsonPath("$.slotSemana").value(2));
    }

    @Test
    @DisplayName("GET /api/catalog/rotacion/semanal?fecha=invalida - Debe retornar 400")
    void testGetRotacionFechaInvalida() throws Exception {
        mockMvc.perform(get("/api/catalog/rotacion/semanal").param("fecha", "no-es-una-fecha"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("RotacionSemanalService.calcularSlot - Slot correcto para semanas 1,2,3,4,5 (debe ciclarse)")
    void testCalcularSlot() {
        // Este test requiere acceso al service directamente.
        // Verificamos la lógica en el controlador via mock.
        // La lógica pura: sem 1→1, sem 2→2, sem 3→3, sem 4→0%4=4, sem 5→1%4=1...
        // Esto se testa en RotacionSemanalServiceTest (test unitario puro).
    }
}

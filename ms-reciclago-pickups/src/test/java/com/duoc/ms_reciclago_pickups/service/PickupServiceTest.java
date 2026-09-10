package com.duoc.ms_reciclago_pickups.service;

import com.duoc.ms_reciclago_pickups.dto.PickupHistoryResponse;
import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.repository.PickupRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PickupServiceTest {

    @Mock
    private PickupRepository pickupRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private PickupService pickupService;

    private Pickup pickup;

    @BeforeEach
    void setUp() {
        pickup = new Pickup();
        pickup.setId(1L);
        pickup.setCodigoRetiro("RET-PV-123456");
        pickup.setVecinoNombre("Carlos Ruiz");
        pickup.setVecinoEmail("carlos@example.com");
        pickup.setDireccion("Calle Los Guindos 450");
        pickup.setComuna("Puerto Varas");
        pickup.setResiduoId(1L);
        pickup.setResiduoNombre("Vidrio");
        pickup.setPesoEstimadoKg(25.0);
        pickup.setEstado("SOLICITADO");
        pickup.setFechaSolicitud(LocalDateTime.now());
    }

    @Test
    @DisplayName("crearSolicitud asigna estado SOLICITADO y guarda en repositorio")
    void testCrearSolicitud() {
        when(pickupRepository.save(any(Pickup.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pickup resultado = pickupService.crearSolicitud(pickup);

        assertNotNull(resultado);
        assertEquals("SOLICITADO", resultado.getEstado());
        assertNotNull(resultado.getCodigoRetiro());
        verify(pickupRepository, times(1)).save(any(Pickup.class));
    }

    @Test
    @DisplayName("programarRetiro cambia estado a PROGRAMADO si estaba en SOLICITADO")
    void testProgramarRetiro() {
        LocalDateTime fecha = LocalDateTime.now().plusDays(1);
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));
        when(pickupRepository.save(any(Pickup.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pickup resultado = pickupService.programarRetiro(1L, 10L, "PV-RC-2026", fecha);

        assertEquals("PROGRAMADO", resultado.getEstado());
        assertEquals(10L, resultado.getCamionId());
        assertEquals("PV-RC-2026", resultado.getCamionPatente());
        assertEquals(fecha, resultado.getFechaProgramada());
    }

    @Test
    @DisplayName("programarRetiro lanza IllegalStateException si no está en SOLICITADO")
    void testProgramarRetiroFallaSiNoSolicitado() {
        pickup.setEstado("EN_RUTA");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));

        assertThrows(IllegalStateException.class, () -> {
            pickupService.programarRetiro(1L, 10L, "PV-RC-2026", LocalDateTime.now());
        });
    }

    @Test
    @DisplayName("cambiarEstadoEnRuta lanza IllegalStateException si no está PROGRAMADO")
    void testCambiarEstadoEnRutaFallaSiNoProgramado() {
        pickup.setEstado("SOLICITADO");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));

        assertThrows(IllegalStateException.class, () -> {
            pickupService.cambiarEstadoEnRuta(1L);
        });
    }

    @Test
    @DisplayName("cambiarEstadoEnRuta pasa exitosamente a EN_RUTA si está PROGRAMADO")
    void testCambiarEstadoEnRutaExitoso() {
        pickup.setEstado("PROGRAMADO");
        pickup.setCamionPatente("PV-RC-2026");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));
        when(pickupRepository.save(any(Pickup.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pickup resultado = pickupService.cambiarEstadoEnRuta(1L);

        assertEquals("EN_RUTA", resultado.getEstado());
    }

    @Test
    @DisplayName("marcarRetirado pasa a RETIRADO si está en EN_RUTA")
    void testMarcarRetirado() {
        pickup.setEstado("EN_RUTA");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));
        when(pickupRepository.save(any(Pickup.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pickup resultado = pickupService.marcarRetirado(1L);

        assertEquals("RETIRADO", resultado.getEstado());
        assertNotNull(resultado.getFechaCompletado());
    }

    @Test
    @DisplayName("marcarRetirado lanza IllegalStateException si no está en EN_RUTA")
    void testMarcarRetiradoFallaSiNoEnRuta() {
        pickup.setEstado("SOLICITADO");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));

        assertThrows(IllegalStateException.class, () -> {
            pickupService.marcarRetirado(1L);
        });
    }

    @Test
    @DisplayName("registrarPesaje actualiza pesoRealKg y pasa a PESADO")
    void testRegistrarPesaje() {
        pickup.setEstado("RETIRADO");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));
        when(pickupRepository.save(any(Pickup.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pickup resultado = pickupService.registrarPesaje(1L, 27.5);

        assertEquals("PESADO", resultado.getEstado());
        assertEquals(27.5, resultado.getPesoRealKg());
    }

    @Test
    @DisplayName("registrarPesaje lanza IllegalStateException si no está en RETIRADO")
    void testRegistrarPesajeFallaSiNoRetirado() {
        pickup.setEstado("SOLICITADO");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));

        assertThrows(IllegalStateException.class, () -> {
            pickupService.registrarPesaje(1L, 25.0);
        });
    }

    @Test
    @DisplayName("cancelarRetiro cancela exitosamente si está en SOLICITADO")
    void testCancelarRetiro() {
        pickup.setEstado("SOLICITADO");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));
        when(pickupRepository.save(any(Pickup.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pickup resultado = pickupService.cancelarRetiro(1L, "Problemas de horario");

        assertEquals("CANCELADO", resultado.getEstado());
        assertTrue(resultado.getObservaciones().contains("Problemas de horario"));
    }

    @Test
    @DisplayName("cancelarRetiro lanza IllegalStateException si ya fue PESADO o RETIRADO")
    void testCancelarRetiroFallaSiPesado() {
        pickup.setEstado("PESADO");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));

        assertThrows(IllegalStateException.class, () -> {
            pickupService.cancelarRetiro(1L, "Intento tardio");
        });
    }

    @Test
    @DisplayName("obtenerHistorialPaginado mapea correctamente los campos según contrato")
    void testObtenerHistorialPaginado() {
        pickup.setEstado("PESADO");
        pickup.setPesoRealKg(12.5);
        Page<Pickup> page = new PageImpl<>(Collections.singletonList(pickup), PageRequest.of(0, 10), 1);

        when(pickupRepository.findAll(any(Pageable.class))).thenReturn(page);

        PickupHistoryResponse response = pickupService.obtenerHistorialPaginado(null, null, PageRequest.of(0, 10));

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
        assertEquals("completado", response.getContent().get(0).getEstado());
        assertEquals(12.5, response.getContent().get(0).getKilosRecolectados());
    }
}

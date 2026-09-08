package com.duoc.ms_reciclago_pickups.service;

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
import org.springframework.kafka.core.KafkaTemplate;

import java.time.LocalDateTime;
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
        pickup.setCodigoRetiro("RET-TEST1234");
        pickup.setVecinoNombre("Carlos Ruiz");
        pickup.setVecinoEmail("carlos@example.com");
        pickup.setDireccion("Av. Las Condes 789");
        pickup.setComuna("Las Condes");
        pickup.setResiduoId(1L);
        pickup.setResiduoNombre("Vidrio");
        pickup.setPesoEstimadoKg(25.0);
        pickup.setEstado("SOLICITADO");
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
    @DisplayName("programarRetiro cambia estado a PROGRAMADO y asigna camión")
    void testProgramarRetiro() {
        LocalDateTime fecha = LocalDateTime.now().plusDays(1);
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));
        when(pickupRepository.save(any(Pickup.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pickup resultado = pickupService.programarRetiro(1L, 10L, "AA-BB-11", fecha);

        assertEquals("PROGRAMADO", resultado.getEstado());
        assertEquals(10L, resultado.getCamionId());
        assertEquals("AA-BB-11", resultado.getCamionPatente());
        assertEquals(fecha, resultado.getFechaProgramada());
    }

    @Test
    @DisplayName("cambiarEstadoEnRuta lanza IllegalStateException si no está PROGRAMADO")
    void testCambiarEstadoEnRutaFallaSiNoProgramado() {
        pickup.setEstado("SOLICITADO"); // Aún no programado
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));

        assertThrows(IllegalStateException.class, () -> {
            pickupService.cambiarEstadoEnRuta(1L);
        });
    }

    @Test
    @DisplayName("cambiarEstadoEnRuta pasa exitosamente a EN_RUTA si está PROGRAMADO")
    void testCambiarEstadoEnRutaExitoso() {
        pickup.setEstado("PROGRAMADO");
        pickup.setCamionPatente("AA-BB-11");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));
        when(pickupRepository.save(any(Pickup.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pickup resultado = pickupService.cambiarEstadoEnRuta(1L);

        assertEquals("EN_RUTA", resultado.getEstado());
    }

    @Test
    @DisplayName("marcarRetirado pasa a RETIRADO y fija fechaCompletado")
    void testMarcarRetirado() {
        pickup.setEstado("EN_RUTA");
        when(pickupRepository.findById(1L)).thenReturn(Optional.of(pickup));
        when(pickupRepository.save(any(Pickup.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pickup resultado = pickupService.marcarRetirado(1L);

        assertEquals("RETIRADO", resultado.getEstado());
        assertNotNull(resultado.getFechaCompletado());
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
}

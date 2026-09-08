package com.duoc.ms_reciclago_pickups.service;

import com.duoc.ms_reciclago_pickups.config.KafkaConfig;
import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.EmailEventDto;
import com.duoc.ms_reciclago_pickups.dto.PickupStateChangeEventDto;
import com.duoc.ms_reciclago_pickups.dto.RouteEventDto;
import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.repository.PickupRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PickupService {

    private static final Logger log = LoggerFactory.getLogger(PickupService.class);

    private final PickupRepository pickupRepository;
    private final RabbitTemplate rabbitTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public PickupService(PickupRepository pickupRepository,
                         RabbitTemplate rabbitTemplate,
                         KafkaTemplate<String, Object> kafkaTemplate) {
        this.pickupRepository = pickupRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.kafkaTemplate = kafkaTemplate;
    }

    public List<Pickup> obtenerTodos() {
        return pickupRepository.findAll();
    }

    public List<Pickup> obtenerPorEstado(String estado) {
        return pickupRepository.findByEstado(estado);
    }

    public List<Pickup> obtenerPorVecino(String email) {
        return pickupRepository.findByVecinoEmail(email);
    }

    public Optional<Pickup> obtenerPorId(Long id) {
        return pickupRepository.findById(id);
    }

    public Optional<Pickup> obtenerPorCodigo(String codigo) {
        return pickupRepository.findByCodigoRetiro(codigo);
    }

    // 1. Crear Solicitud (Estado inicial: SOLICITADO)
    public Pickup crearSolicitud(Pickup pickup) {
        if (pickup.getCodigoRetiro() == null || pickup.getCodigoRetiro().isBlank()) {
            pickup.setCodigoRetiro("RET-" + System.currentTimeMillis() % 1000000);
        }
        pickup.setEstado("SOLICITADO");
        pickup.setFechaSolicitud(LocalDateTime.now());

        Pickup guardado = pickupRepository.save(pickup);

        // Notificar eventos iniciales
        notificarCambioEstadoKafka(guardado, "NINGUNO", "SOLICITADO");
        notificarEmailRabbitMQ(guardado, "Solicitud de Retiro Recibida", 
            "Hemos recibido tu solicitud de retiro #" + guardado.getCodigoRetiro() + ". Pronto asignaremos una fecha.");

        return guardado;
    }

    // 2. Programar Retiro (SOLICITADO -> PROGRAMADO)
    public Pickup programarRetiro(Long id, Long camionId, String camionPatente, LocalDateTime fechaProgramada) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Solicitud de retiro no encontrada con id: " + id));

        String estadoAnterior = pickup.getEstado();
        pickup.setCamionId(camionId);
        pickup.setCamionPatente(camionPatente);
        pickup.setFechaProgramada(fechaProgramada);
        pickup.setEstado("PROGRAMADO");

        Pickup actualizado = pickupRepository.save(pickup);

        // Publicar eventos (Kafka + RabbitMQ)
        notificarCambioEstadoKafka(actualizado, estadoAnterior, "PROGRAMADO");
        
        // Integración RabbitMQ (q.cmd.email y q.cmd.route)
        notificarEmailRabbitMQ(actualizado, "Retiro Programado #" + actualizado.getCodigoRetiro(),
                "Tu retiro ha sido programado para la fecha: " + fechaProgramada);
        notificarRutaRabbitMQ(actualizado);

        return actualizado;
    }

    // 3. Pasar a En Ruta (PROGRAMADO -> EN_RUTA)
    public Pickup cambiarEstadoEnRuta(Long id) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Solicitud de retiro no encontrada con id: " + id));

        // Regla del Negocio: No se puede pasar a EN_RUTA sin estar previamente en PROGRAMADO
        if (!"PROGRAMADO".equalsIgnoreCase(pickup.getEstado())) {
            throw new IllegalStateException("Regla violada: No se puede pasar a EN_RUTA si el retiro no está en estado PROGRAMADO. Estado actual: " + pickup.getEstado());
        }

        String estadoAnterior = pickup.getEstado();
        pickup.setEstado("EN_RUTA");

        Pickup actualizado = pickupRepository.save(pickup);

        // Publicar eventos (Kafka + RabbitMQ)
        notificarCambioEstadoKafka(actualizado, estadoAnterior, "EN_RUTA");
        
        // Integración RabbitMQ (q.cmd.email y q.cmd.route)
        notificarEmailRabbitMQ(actualizado, "Camión en Camino #" + actualizado.getCodigoRetiro(),
                "El camión con patente " + actualizado.getCamionPatente() + " va en camino a tu domicilio.");
        notificarRutaRabbitMQ(actualizado);

        return actualizado;
    }

    // 4. Marcar Retirado (EN_RUTA -> RETIRADO)
    public Pickup marcarRetirado(Long id) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Solicitud de retiro no encontrada con id: " + id));

        String estadoAnterior = pickup.getEstado();
        pickup.setEstado("RETIRADO");
        pickup.setFechaCompletado(LocalDateTime.now());

        Pickup actualizado = pickupRepository.save(pickup);

        notificarCambioEstadoKafka(actualizado, estadoAnterior, "RETIRADO");
        notificarEmailRabbitMQ(actualizado, "Retiro Completado #" + actualizado.getCodigoRetiro(),
                "Tus residuos han sido recolectados exitosamente.");

        return actualizado;
    }

    // 5. Registrar Pesaje (RETIRADO -> PESADO)
    public Pickup registrarPesaje(Long id, Double pesoRealKg) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Solicitud de retiro no encontrada con id: " + id));

        String estadoAnterior = pickup.getEstado();
        pickup.setPesoRealKg(pesoRealKg);
        pickup.setEstado("PESADO");

        Pickup actualizado = pickupRepository.save(pickup);

        notificarCambioEstadoKafka(actualizado, estadoAnterior, "PESADO");
        
        // Emitir a q.cmd.certificate en RabbitMQ para generación de certificado PDF
        notificarCertificadoRabbitMQ(actualizado);

        return actualizado;
    }

    // 6. Cancelar Retiro (* -> CANCELADO)
    public Pickup cancelarRetiro(Long id, String motivo) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Solicitud de retiro no encontrada con id: " + id));

        String estadoAnterior = pickup.getEstado();
        pickup.setEstado("CANCELADO");
        if (motivo != null && !motivo.isBlank()) {
            pickup.setObservaciones("Motivo de cancelación: " + motivo);
        }

        Pickup actualizado = pickupRepository.save(pickup);

        notificarCambioEstadoKafka(actualizado, estadoAnterior, "CANCELADO");
        notificarEmailRabbitMQ(actualizado, "Solicitud Cancelada #" + actualizado.getCodigoRetiro(),
                "Tu solicitud de retiro ha sido cancelada. Motivo: " + (motivo != null ? motivo : "Sin especificar"));

        return actualizado;
    }

    // ==========================================
    // MÉTODOS AUXILIARES DE MENSAJERÍA
    // ==========================================

    private void notificarCambioEstadoKafka(Pickup pickup, String estadoAnterior, String estadoNuevo) {
        try {
            PickupStateChangeEventDto event = new PickupStateChangeEventDto(
                    pickup.getId(),
                    pickup.getCodigoRetiro(),
                    estadoAnterior,
                    estadoNuevo,
                    pickup.getVecinoEmail(),
                    pickup.getComuna(),
                    pickup.getResiduoNombre(),
                    pickup.getPesoEstimadoKg(),
                    pickup.getPesoRealKg()
            );
            kafkaTemplate.send(KafkaConfig.TOPIC_PICKUPS_EVENTS, pickup.getCodigoRetiro(), event);
            kafkaTemplate.send(KafkaConfig.TOPIC_AUDIT_TIMELINE, pickup.getCodigoRetiro(), event);
            log.info("Evento de cambio de estado emitido a Kafka para {}: {} -> {}", pickup.getCodigoRetiro(), estadoAnterior, estadoNuevo);
        } catch (Exception e) {
            log.error("Error al emitir evento Kafka: {}", e.getMessage());
        }
    }

    private void notificarEmailRabbitMQ(Pickup pickup, String asunto, String mensaje) {
        try {
            EmailEventDto emailDto = new EmailEventDto(
                    pickup.getCodigoRetiro(),
                    pickup.getVecinoEmail(),
                    pickup.getVecinoNombre(),
                    asunto,
                    mensaje,
                    pickup.getEstado(),
                    LocalDateTime.now()
            );
            rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_EMAIL, emailDto);
            log.info("Mensaje de Email publicado en RabbitMQ (cola {}): {}", RabbitMQConfig.QUEUE_EMAIL, pickup.getCodigoRetiro());
        } catch (Exception e) {
            log.error("Error al publicar en RabbitMQ email: {}", e.getMessage());
        }
    }

    private void notificarRutaRabbitMQ(Pickup pickup) {
        try {
            RouteEventDto routeDto = new RouteEventDto(
                    pickup.getCodigoRetiro(),
                    pickup.getCamionId(),
                    pickup.getCamionPatente(),
                    pickup.getComuna(),
                    pickup.getDireccion(),
                    pickup.getPesoEstimadoKg(),
                    pickup.getEstado(),
                    pickup.getFechaProgramada()
            );
            rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_ROUTE, routeDto);
            log.info("Mensaje de Ruta publicado en RabbitMQ (cola {}): {}", RabbitMQConfig.QUEUE_ROUTE, pickup.getCodigoRetiro());
        } catch (Exception e) {
            log.error("Error al publicar en RabbitMQ route: {}", e.getMessage());
        }
    }

    private void notificarCertificadoRabbitMQ(Pickup pickup) {
        try {
            rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_CERTIFICATE, pickup);
            log.info("Mensaje de Certificado publicado en RabbitMQ (cola {}): {}", RabbitMQConfig.QUEUE_CERTIFICATE, pickup.getCodigoRetiro());
        } catch (Exception e) {
            log.error("Error al publicar en RabbitMQ certificate: {}", e.getMessage());
        }
    }
}

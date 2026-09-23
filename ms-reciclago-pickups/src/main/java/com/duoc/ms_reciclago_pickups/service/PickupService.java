package com.duoc.ms_reciclago_pickups.service;

import com.duoc.ms_reciclago_pickups.config.KafkaConfig;
import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.CertificateEventDto;
import com.duoc.ms_reciclago_pickups.dto.EmailEventDto;
import com.duoc.ms_reciclago_pickups.dto.PickupHistoryDto;
import com.duoc.ms_reciclago_pickups.dto.PickupHistoryResponse;
import com.duoc.ms_reciclago_pickups.dto.PickupStateChangeEventDto;
import com.duoc.ms_reciclago_pickups.dto.RouteEventDto;
import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.repository.PickupRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PickupService {

    private static final Logger log = LoggerFactory.getLogger(PickupService.class);

    private static final String ESTADO_PESADO = "PESADO";
    private static final String ESTADO_RETIRADO = "RETIRADO";
    private static final String ESTADO_SOLICITADO = "SOLICITADO";
    private static final String ESTADO_PROGRAMADO = "PROGRAMADO";
    private static final String ESTADO_EN_RUTA = "EN_RUTA";
    private static final String MSG_RETIRO_NO_ENCONTRADO = "Solicitud de retiro no encontrada con id: ";

    private final PickupRepository pickupRepository;
    private final RabbitTemplate rabbitTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RestClient restClient;

    @Value("${reciclago.services.catalog-url:http://localhost:8081}")
    private String catalogUrl;

    public PickupService(PickupRepository pickupRepository,
            RabbitTemplate rabbitTemplate,
            KafkaTemplate<String, Object> kafkaTemplate) {
        this.pickupRepository = pickupRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.kafkaTemplate = kafkaTemplate;
        this.restClient = RestClient.create();
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

    // Historial Paginado según Contrato DEV 1 <-> DEV 2
    public PickupHistoryResponse obtenerHistorialPaginado(String vecinoEmail, String estado, Pageable pageable) {
        Page<Pickup> pageResult = buscarPickupsPaginados(vecinoEmail, estado, pageable);

        DateTimeFormatter isoDate = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter spanishFormat = DateTimeFormatter.ofPattern("EEEE dd MMMM", new Locale("es", "CL"));

        List<PickupHistoryDto> dtoList = pageResult.getContent().stream()
                .map(p -> convertirAHistorialDto(p, isoDate, spanishFormat))
                .collect(Collectors.toList());

        return new PickupHistoryResponse(dtoList, pageResult.getTotalElements(), pageResult.getTotalPages(), pageResult.getNumber());
    }

    private Page<Pickup> buscarPickupsPaginados(String vecinoEmail, String estado, Pageable pageable) {
        boolean hasVecino = vecinoEmail != null && !vecinoEmail.isBlank();
        boolean hasEstado = estado != null && !estado.isBlank();

        if (hasVecino && hasEstado) {
            return pickupRepository.findByVecinoEmailAndEstado(vecinoEmail, estado, pageable);
        }
        if (hasVecino) {
            return pickupRepository.findByVecinoEmail(vecinoEmail, pageable);
        }
        if (hasEstado) {
            return pickupRepository.findByEstado(estado, pageable);
        }
        return pickupRepository.findAll(pageable);
    }

    private PickupHistoryDto convertirAHistorialDto(Pickup p, DateTimeFormatter isoDate, DateTimeFormatter spanishFormat) {
        LocalDateTime fechaBase = p.getFechaSolicitud() != null ? p.getFechaSolicitud() : LocalDateTime.now(ZoneId.systemDefault());
        String fechaStr = fechaBase.format(isoDate);
        String fechaTexto = capitalizar(fechaBase.format(spanishFormat));
        Double kilos = p.getPesoRealKg() != null ? p.getPesoRealKg() : p.getPesoEstimadoKg();
        String estadoTexto = determinarEstadoTexto(p.getEstado());

        return new PickupHistoryDto(
                p.getId(),
                fechaStr,
                fechaTexto,
                p.getResiduoNombre() != null ? p.getResiduoNombre() : "Residuos Reciclables",
                kilos,
                p.getDireccion(),
                estadoTexto
        );
    }

    private String determinarEstadoTexto(String estado) {
        if (estado == null) {
            return "solicitado";
        }
        if (ESTADO_PESADO.equalsIgnoreCase(estado) || ESTADO_RETIRADO.equalsIgnoreCase(estado)) {
            return "completado";
        }
        return estado.toLowerCase();
    }

    private String capitalizar(String texto) {
        if (texto == null || texto.isEmpty()) return texto;
        return Character.toUpperCase(texto.charAt(0)) + texto.substring(1);
    }

    // 1. Crear Solicitud (Estado inicial: SOLICITADO)
    public Pickup crearSolicitud(Pickup pickup) {
        if (pickup.getCodigoRetiro() == null || pickup.getCodigoRetiro().isBlank()) {
            pickup.setCodigoRetiro("RET-PV-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (pickup.getComuna() == null || pickup.getComuna().isBlank()) {
            pickup.setComuna("Puerto Varas");
        }
        if (pickup.getPesoEstimadoKg() == null || pickup.getPesoEstimadoKg() <= 0) {
            pickup.setPesoEstimadoKg(5.0);
        }
        if (pickup.getResiduoId() == null) {
            pickup.setResiduoId(1L);
        }
        if (pickup.getResiduoNombre() == null || pickup.getResiduoNombre().isBlank()) {
            pickup.setResiduoNombre("Residuo Reciclable");
        }
        pickup.setEstado(ESTADO_SOLICITADO);
        pickup.setFechaSolicitud(LocalDateTime.now(ZoneId.systemDefault()));

        Pickup guardado = pickupRepository.save(pickup);

        // Notificar eventos iniciales
        notificarCambioEstadoKafka(guardado, "NINGUNO", ESTADO_SOLICITADO);
        notificarEmailRabbitMQ(guardado, "Solicitud de Retiro Recibida",
                "Hemos recibido tu solicitud de retiro #" + guardado.getCodigoRetiro()
                        + ". Pronto asignaremos una fecha.");

        return guardado;
    }

    // 2. Programar Retiro (SOLICITADO -> PROGRAMADO)
    public Pickup programarRetiro(Long id, Long camionId, String camionPatente, LocalDateTime fechaProgramada) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException(MSG_RETIRO_NO_ENCONTRADO + id));

        if (!ESTADO_SOLICITADO.equalsIgnoreCase(pickup.getEstado()) && !ESTADO_PROGRAMADO.equalsIgnoreCase(pickup.getEstado())) {
            throw new IllegalStateException(
                    "Regla violada: No se puede programar o editar la programación si el retiro no está en estado SOLICITADO o PROGRAMADO. Estado actual: "
                            + pickup.getEstado());
        }

        String estadoAnterior = pickup.getEstado();
        pickup.setCamionId(camionId);
        pickup.setCamionPatente(camionPatente);
        pickup.setFechaProgramada(fechaProgramada);
        pickup.setEstado(ESTADO_PROGRAMADO);

        Pickup actualizado = pickupRepository.save(pickup);

        // Publicar eventos (Kafka + RabbitMQ)
        notificarCambioEstadoKafka(actualizado, estadoAnterior, ESTADO_PROGRAMADO);

        // Integración RabbitMQ (q.cmd.email y q.cmd.route)
        notificarEmailRabbitMQ(actualizado, "Retiro Programado #" + actualizado.getCodigoRetiro(),
                "Tu retiro ha sido programado para la fecha: " + fechaProgramada);
        notificarRutaRabbitMQ(actualizado);

        return actualizado;
    }

    // 3. Pasar a En Ruta (PROGRAMADO -> EN_RUTA)
    public Pickup cambiarEstadoEnRuta(Long id) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException(MSG_RETIRO_NO_ENCONTRADO + id));

        // Regla del Negocio: No se puede pasar a EN_RUTA sin estar previamente en PROGRAMADO
        if (!ESTADO_PROGRAMADO.equalsIgnoreCase(pickup.getEstado())) {
            throw new IllegalStateException(
                    "Regla violada: No se puede pasar a EN_RUTA si el retiro no está en estado PROGRAMADO. Estado actual: "
                            + pickup.getEstado());
        }

        String estadoAnterior = pickup.getEstado();
        pickup.setEstado(ESTADO_EN_RUTA);

        Pickup actualizado = pickupRepository.save(pickup);

        // Sincronizar estado del camión con el catálogo (best-effort)
        sincronizarEstadoCamionEnCatalogo(actualizado.getCamionPatente(), ESTADO_EN_RUTA);

        // Publicar eventos (Kafka + RabbitMQ)
        notificarCambioEstadoKafka(actualizado, estadoAnterior, ESTADO_EN_RUTA);

        // Integración RabbitMQ (q.cmd.email y q.cmd.route)
        notificarEmailRabbitMQ(actualizado, "Camión en Camino #" + actualizado.getCodigoRetiro(),
                "El camión con patente " + actualizado.getCamionPatente() + " va en camino a tu domicilio.");
        notificarRutaRabbitMQ(actualizado);

        return actualizado;
    }

    // 4. Marcar Retirado (EN_RUTA -> RETIRADO)
    public Pickup marcarRetirado(Long id) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException(MSG_RETIRO_NO_ENCONTRADO + id));

        if (!ESTADO_EN_RUTA.equalsIgnoreCase(pickup.getEstado())) {
            throw new IllegalStateException(
                    "Regla violada: No se puede marcar como RETIRADO si el retiro no está en estado EN_RUTA. Estado actual: "
                            + pickup.getEstado());
        }

        String estadoAnterior = pickup.getEstado();
        pickup.setEstado(ESTADO_RETIRADO);
        pickup.setFechaCompletado(LocalDateTime.now(ZoneId.systemDefault()));

        Pickup actualizado = pickupRepository.save(pickup);

        notificarCambioEstadoKafka(actualizado, estadoAnterior, ESTADO_RETIRADO);
        notificarEmailRabbitMQ(actualizado, "Retiro Completado #" + actualizado.getCodigoRetiro(),
                "Tus residuos han sido recolectados exitosamente.");

        return actualizado;
    }

    // 5. Registrar Pesaje (RETIRADO -> PESADO)
    public Pickup registrarPesaje(Long id, Double pesoRealKg) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException(MSG_RETIRO_NO_ENCONTRADO + id));

        if (!ESTADO_RETIRADO.equalsIgnoreCase(pickup.getEstado())) {
            throw new IllegalStateException(
                    "Regla violada: No se puede registrar pesaje si el retiro no está en estado RETIRADO. Estado actual: "
                            + pickup.getEstado());
        }

        if (pesoRealKg == null || pesoRealKg <= 0) {
            throw new IllegalArgumentException("El peso real recolectado debe ser mayor a 0 kg.");
        }

        String estadoAnterior = pickup.getEstado();
        pickup.setPesoRealKg(pesoRealKg);
        pickup.setEstado(ESTADO_PESADO);

        Pickup actualizado = pickupRepository.save(pickup);

        // Sincronizar estado del camión: retiro completado -> vuelve a DISPONIBLE (best-effort)
        sincronizarEstadoCamionEnCatalogo(actualizado.getCamionPatente(), "DISPONIBLE");

        notificarCambioEstadoKafka(actualizado, estadoAnterior, ESTADO_PESADO);

        // Emitir DTO a q.cmd.certificate en RabbitMQ para generación de certificado PDF
        notificarCertificadoRabbitMQ(actualizado);

        return actualizado;
    }

    // 6. Cancelar Retiro (* -> CANCELADO)
    public Pickup cancelarRetiro(Long id, String motivo) {
        Pickup pickup = obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException(MSG_RETIRO_NO_ENCONTRADO + id));

        if (ESTADO_RETIRADO.equalsIgnoreCase(pickup.getEstado()) || ESTADO_PESADO.equalsIgnoreCase(pickup.getEstado())) {
            throw new IllegalStateException(
                    "Regla violada: No se puede cancelar un retiro que ya ha sido RETIRADO o PESADO. Estado actual: "
                            + pickup.getEstado());
        }

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
    // SINCRONIZACIÓN CON MS-RECICLAGO-CATALOG
    // ==========================================

    /**
     * Sincroniza el estado del camión en ms-reciclago-catalog por su patente.
     * Operación best-effort: si el catálogo no está disponible, se loguea el
     * error pero el flujo del pickup continúa sin interrupción.
     *
     * @param camionPatente Patente del camión (puede ser null si no fue asignado)
     * @param nuevoEstado   Estado destino: "EN_RUTA" | "DISPONIBLE" | "MANTENIMIENTO"
     */
    private void sincronizarEstadoCamionEnCatalogo(String camionPatente, String nuevoEstado) {
        if (camionPatente == null || camionPatente.isBlank()) {
            log.warn("Sincronización ignorada: camionPatente es nulo o vacío");
            return;
        }
        try {
            String uri = catalogUrl + "/api/catalog/camiones/patente/"
                    + camionPatente + "/estado?estado=" + nuevoEstado;
            restClient.patch()
                    .uri(uri)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Camión {} sincronizado a estado {} en ms-reciclago-catalog", camionPatente, nuevoEstado);
        } catch (Exception e) {
            log.warn("No se pudo sincronizar estado del camión {} con el catálogo (best-effort): {}",
                    camionPatente, e.getMessage());
        }
    }

    // ==========================================
    // MÉTODOS AUXILIARES DE MENSAJERÍA
    // ==========================================

    private void notificarCambioEstadoKafka(Pickup pickup, String estadoAnterior, String estadoNuevo) {
        try {
            PickupStateChangeEventDto event = PickupStateChangeEventDto.builder()
                    .pickupId(pickup.getId())
                    .codigoRetiro(pickup.getCodigoRetiro())
                    .estadoAnterior(estadoAnterior)
                    .estadoNuevo(estadoNuevo)
                    .vecinoEmail(pickup.getVecinoEmail())
                    .comuna(pickup.getComuna())
                    .residuoNombre(pickup.getResiduoNombre())
                    .pesoEstimadoKg(pickup.getPesoEstimadoKg())
                    .pesoRealKg(pickup.getPesoRealKg())
                    .build();
            kafkaTemplate.send(KafkaConfig.TOPIC_PICKUPS_EVENTS, pickup.getCodigoRetiro(), event);
            kafkaTemplate.send(KafkaConfig.TOPIC_AUDIT_TIMELINE, pickup.getCodigoRetiro(), event);
            log.info("Evento de cambio de estado emitido a Kafka para {}: {} -> {}", pickup.getCodigoRetiro(),
                    estadoAnterior, estadoNuevo);
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
                    LocalDateTime.now(ZoneId.systemDefault()));
            rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_EMAIL, emailDto);
            log.info("Mensaje de Email publicado en RabbitMQ (cola {}): {}", RabbitMQConfig.QUEUE_EMAIL,
                    pickup.getCodigoRetiro());
        } catch (Exception e) {
            log.error("Error al publicar en RabbitMQ email: {}", e.getMessage());
        }
    }

    private void notificarRutaRabbitMQ(Pickup pickup) {
        try {
            RouteEventDto routeDto = RouteEventDto.builder()
                    .codigoRetiro(pickup.getCodigoRetiro())
                    .camionId(pickup.getCamionId())
                    .camionPatente(pickup.getCamionPatente())
                    .comuna(pickup.getComuna())
                    .direccion(pickup.getDireccion())
                    .pesoEstimadoKg(pickup.getPesoEstimadoKg())
                    .estado(pickup.getEstado())
                    .fechaProgramada(pickup.getFechaProgramada())
                    .build();
            rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_ROUTE, routeDto);
            log.info("Mensaje de Ruta publicado en RabbitMQ (cola {}): {}", RabbitMQConfig.QUEUE_ROUTE,
                    pickup.getCodigoRetiro());
        } catch (Exception e) {
            log.error("Error al publicar en RabbitMQ route: {}", e.getMessage());
        }
    }

    private void notificarCertificadoRabbitMQ(Pickup pickup) {
        try {
            CertificateEventDto certDto = CertificateEventDto.builder()
                    .codigoRetiro(pickup.getCodigoRetiro())
                    .vecinoNombre(pickup.getVecinoNombre())
                    .vecinoEmail(pickup.getVecinoEmail())
                    .direccion(pickup.getDireccion())
                    .comuna(pickup.getComuna())
                    .residuoNombre(pickup.getResiduoNombre())
                    .pesoRealKg(pickup.getPesoRealKg())
                    .fechaCompletado(pickup.getFechaCompletado())
                    .fechaEmision(LocalDateTime.now(ZoneId.systemDefault()))
                    .build();
            rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_CERTIFICATE, certDto);
            log.info("Mensaje de Certificado publicado en RabbitMQ (cola {}): {}", RabbitMQConfig.QUEUE_CERTIFICATE,
                    pickup.getCodigoRetiro());
        } catch (Exception e) {
            log.error("Error al publicar en RabbitMQ certificate: {}", e.getMessage());
        }
    }
}

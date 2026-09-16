package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.KafkaConfig;
import com.duoc.ms_reciclago_pickups.dto.PickupStateChangeEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class PickupAuditKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(PickupAuditKafkaConsumer.class);

    @KafkaListener(topics = {KafkaConfig.TOPIC_PICKUPS_EVENTS, KafkaConfig.TOPIC_AUDIT_TIMELINE}, groupId = "dimao-audit-group")
    public void consumeStateChangeEvent(PickupStateChangeEventDto event) {
        log.info("⚡ [KAFKA EVENT LOG - AUDITORÍA INMUTABLE DIMAO]:");
        log.info("   -> ID: {} | Código: {}", event.getPickupId(), event.getCodigoRetiro());
        log.info("   -> Transición: {} ===> {}", event.getEstadoAnterior(), event.getEstadoNuevo());
        log.info("   -> Vecino: {} | Comuna: {}", event.getVecinoEmail(), event.getComuna());
        log.info("   -> Residuo: {} | Peso Est.: {} kg | Peso Real: {} kg",
                event.getResiduoNombre(), event.getPesoEstimadoKg(), event.getPesoRealKg());
        log.info("   -> Timestamp: {}", event.getTimestamp());
    }
}

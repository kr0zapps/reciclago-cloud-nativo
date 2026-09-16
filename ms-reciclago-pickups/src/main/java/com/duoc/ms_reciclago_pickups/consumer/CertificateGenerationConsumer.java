package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.CertificateEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class CertificateGenerationConsumer {

    private static final Logger log = LoggerFactory.getLogger(CertificateGenerationConsumer.class);

    @RabbitListener(queues = RabbitMQConfig.QUEUE_CERTIFICATE)
    public void generateCertificate(CertificateEventDto certDto) {
        double co2Evitado = certDto.getPesoRealKg() != null ? certDto.getPesoRealKg() * 1.85 : 0.0;
        log.info("📜 [CERTIFICADO AMBIENTAL EMITIDO - DIMAO PUERTO VARAS]:");
        log.info("   -> Folio Certificado: DIMAO-CERT-{}", certDto.getCodigoRetiro());
        log.info("   -> Vecino Beneficiario: {}", certDto.getVecinoEmail());
        log.info("   -> Kilos Verificados en Báscula: {} kg", certDto.getPesoRealKg());
        log.info("   -> Fecha de Pesaje: {}", certDto.getFechaCompletado());
        log.info("   -> Huella CO2 Evitada estimada: {} kg CO2e", String.format("%.2f", co2Evitado));
    }
}

package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.CertificateEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CertificateGenerationConsumer {

    private static final Logger log = LoggerFactory.getLogger(CertificateGenerationConsumer.class);

    @RabbitListener(queues = RabbitMQConfig.QUEUE_CERTIFICATE)
    public void generateCertificate(CertificateEventDto certDto, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            double co2Evitado = certDto.getPesoRealKg() != null ? certDto.getPesoRealKg() * 1.85 : 0.0;
            log.info("📜 [CERTIFICADO AMBIENTAL EMITIDO - DIMAO PUERTO VARAS]:");
            log.info("   -> Folio Certificado: DIMAO-CERT-{}", certDto.getCodigoRetiro());
            log.info("   -> Vecino Beneficiario: {}", certDto.getVecinoEmail());
            log.info("   -> Kilos Verificados en Báscula: {} kg", certDto.getPesoRealKg());
            log.info("   -> Fecha de Pesaje: {}", certDto.getFechaCompletado());
            log.info("   -> Huella CO2 Evitada estimada: {} kg CO2e", String.format("%.2f", co2Evitado));

            // Confirmación explícita (ACK) según rúbrica EP3 (20%)
            channel.basicAck(tag, false);
            log.debug("ACK confirmado exitosamente para deliveryTag: {}", tag);
        } catch (Exception e) {
            log.error("❌ Error en consumidor Certificado, enviando a DLQ via basicNack: {}", e.getMessage());
            channel.basicNack(tag, false, false);
        }
    }
}

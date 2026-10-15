package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.CertificateEventDto;
import com.rabbitmq.client.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;<<<<<<<HEAD
import com.rabbitmq.client.Channel;=======>>>>>>>origin/main
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CertificateGenerationConsumer {

    private static final Logger log = LoggerFactory.getLogger(CertificateGenerationConsumer.class);

    <<<<<<<HEAD @RabbitListener(queues=RabbitMQConfig.QUEUE_CERTIFICATE)

    public void generateCertificate(CertificateEventDto certDto, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
=======

    @RabbitListener(id = "certificate-listener", queues = RabbitMQConfig.QUEUE_CERTIFICATE)
    public void generateCertificate(CertificateEventDto certDto, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            if (certDto == null || certDto.getCodigoRetiro() == null) {
                throw new IllegalArgumentException("Datos de certificado o código de retiro nulo");
            }

>>>>>>> origin/main
            double co2Evitado = certDto.getPesoRealKg() != null ? certDto.getPesoRealKg() * 1.85 : 0.0;
            log.info("📜 [CERTIFICADO AMBIENTAL EMITIDO - DIMAO PUERTO VARAS]:");
            log.info("   -> Folio Certificado: DIMAO-CERT-{}", certDto.getCodigoRetiro());
            log.info("   -> Vecino Beneficiario: {}", certDto.getVecinoEmail());
            log.info("   -> Kilos Verificados en Báscula: {} kg", certDto.getPesoRealKg());
            log.info("   -> Fecha de Pesaje: {}", certDto.getFechaCompletado());
            log.info("   -> Huella CO2 Evitada estimada: {} kg CO2e", String.format("%.2f", co2Evitado));

<<<<<<< HEAD
            // Confirmación explícita (ACK) según rúbrica EP3 (20%)
            channel.basicAck(tag, false);
            log.debug("ACK confirmado exitosamente para deliveryTag: {}", tag);
        } catch (Exception e) {
            log.error("❌ Error en consumidor Certificado, enviando a DLQ via basicNack: {}", e.getMessage());
=======
            channel.basicAck(tag, false);
            log.info("👍 [ACK] Certificado ambiental emitido y confirmado para retiro #{}", certDto.getCodigoRetiro());
        } catch (Exception e) {
            log.error("❌ [ERROR CERTIFICADO] Desviando a Dead Letter Queue (DLQ): {}", e.getMessage());
>>>>>>> origin/main
            channel.basicNack(tag, false, false);
        }
    }
}

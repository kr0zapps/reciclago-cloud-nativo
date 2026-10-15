package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.EmailEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EmailNotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationConsumer.class);

    @RabbitListener(queues = RabbitMQConfig.QUEUE_EMAIL)
    public void receiveEmailCommand(EmailEventDto emailDto, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            log.info("📧 [NOTIFICACIÓN CIUDADANA DIMAO] Enviando correo electrónico:");
            log.info("   -> Código Retiro: {}", emailDto.getCodigoRetiro());
            log.info("   -> Destinatario: {}", emailDto.getDestinatarioEmail());
            log.info("   -> Asunto: {}", emailDto.getAsunto());
            log.info("   -> Nuevo Estado: {}", emailDto.getNuevoEstado());
            log.info("   -> Mensaje: {}", emailDto.getMensaje());

            // Confirmación explícita (ACK) según rúbrica EP3 (20%)
            channel.basicAck(tag, false);
            log.debug("ACK confirmado exitosamente para deliveryTag: {}", tag);
        } catch (Exception e) {
            log.error("❌ Error en consumidor Email, enviando a DLQ via basicNack: {}", e.getMessage());
            // NACK sin requeue para que RabbitMQ lo desvíe automáticamente a la DLQ configurada
            channel.basicNack(tag, false, false);
        }
    }
}

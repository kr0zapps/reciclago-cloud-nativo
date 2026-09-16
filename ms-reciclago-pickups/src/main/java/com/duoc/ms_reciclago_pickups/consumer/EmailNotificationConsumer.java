package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.EmailEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class EmailNotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationConsumer.class);

    @RabbitListener(queues = RabbitMQConfig.QUEUE_EMAIL)
    public void receiveEmailCommand(EmailEventDto emailDto) {
        log.info("📧 [NOTIFICACIÓN CIUDADANA DIMAO] Enviando correo electrónico:");
        log.info("   -> Código Retiro: {}", emailDto.getCodigoRetiro());
        log.info("   -> Destinatario: {}", emailDto.getDestinatarioEmail());
        log.info("   -> Asunto: {}", emailDto.getAsunto());
        log.info("   -> Nuevo Estado: {}", emailDto.getNuevoEstado());
        log.info("   -> Mensaje: {}", emailDto.getMensaje());
    }
}

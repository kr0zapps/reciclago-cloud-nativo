package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.EmailEventDto;
import com.rabbitmq.client.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;<<<<<<<HEAD
import com.rabbitmq.client.Channel;
import org.springframework.amqp.support.AmqpHeaders;=======
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;>>>>>>>origin/main
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EmailNotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationConsumer.class);

    <<<<<<<HEAD @RabbitListener(queues=RabbitMQConfig.QUEUE_EMAIL)

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
=======

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    @RabbitListener(id = "email-listener", queues = RabbitMQConfig.QUEUE_EMAIL)
    public void receiveEmailCommand(EmailEventDto emailDto, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            // Validación: si el correo es nulo o inválido, forzar error para mandar a DLQ
            if (emailDto == null || emailDto.getDestinatarioEmail() == null || !emailDto.getDestinatarioEmail().contains("@")) {
                throw new IllegalArgumentException("Email no válido: " + (emailDto != null ? emailDto.getDestinatarioEmail() : "null"));
            }

            log.info("📧 [NOTIFICACIÓN CIUDADANA DIMAO] Procesando Retiro #{}", emailDto.getCodigoRetiro());

            // Envío real con Gmail si está configurado
            if (mailSender != null && mailFrom != null && !mailFrom.isBlank() && !mailFrom.contains("tu-correo")) {
                SimpleMailMessage mail = new SimpleMailMessage();
                mail.setFrom(mailFrom);
                mail.setTo(emailDto.getDestinatarioEmail());
                mail.setSubject(emailDto.getAsunto());
                mail.setText("Hola " + emailDto.getDestinatarioNombre() + ",\n\n"
                        + emailDto.getMensaje() + "\n\n"
                        + "Código de Retiro: " + emailDto.getCodigoRetiro() + "\n"
                        + "Estado: " + emailDto.getNuevoEstado() + "\n\n"
                        + "Atte. RecicLaGo DIMAO");
                mailSender.send(mail);
                log.info("✅ [GMAIL SMTP] Correo enviado exitosamente a {}", emailDto.getDestinatarioEmail());
            } else {
                log.info("ℹ️ [SIMULACIÓN] Correo procesado: {}", emailDto.getAsunto());
            }

            // Confirmación explícita (ACK)
            channel.basicAck(tag, false);
            log.info("👍 [ACK] Mensaje confirmado en cola {}", RabbitMQConfig.QUEUE_EMAIL);

        } catch (Exception e) {
            log.error("❌ [ERROR CORREO] Desviando mensaje a Dead Letter Queue (DLQ): {}", e.getMessage());
            // NACK sin requeue -> viaja automáticamente a q.cmd.email.dlq
>>>>>>> origin/main
            channel.basicNack(tag, false, false);
        }
    }
}

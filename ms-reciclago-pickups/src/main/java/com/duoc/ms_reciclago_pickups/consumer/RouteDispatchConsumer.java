package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.RouteEventDto;
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
public class RouteDispatchConsumer {

    private static final Logger log = LoggerFactory.getLogger(RouteDispatchConsumer.class);

    <<<<<<<HEAD @RabbitListener(queues=RabbitMQConfig.QUEUE_ROUTE)

    public void receiveRouteCommand(RouteEventDto routeDto, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
=======

    @RabbitListener(id = "route-listener", queues = RabbitMQConfig.QUEUE_ROUTE)
    public void receiveRouteCommand(RouteEventDto routeDto, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            if (routeDto == null || routeDto.getCodigoRetiro() == null) {
                throw new IllegalArgumentException("Datos de ruta o código de retiro nulo");
            }

>>>>>>> origin/main
            log.info("🚛 [HOJA DE RUTA DIMAO - DESPACHO MUNICIPAL]:");
            log.info("   -> Código Retiro: {}", routeDto.getCodigoRetiro());
            log.info("   -> Camión Asignado: {}", routeDto.getCamionPatente());
            log.info("   -> Comuna / Sector: {}", routeDto.getComuna());
            log.info("   -> Fecha Programada: {}", routeDto.getFechaProgramada());

<<<<<<< HEAD
            // Confirmación explícita (ACK) según rúbrica EP3 (20%)
            channel.basicAck(tag, false);
            log.debug("ACK confirmado exitosamente para deliveryTag: {}", tag);
        } catch (Exception e) {
            log.error("❌ Error en consumidor Ruta, enviando a DLQ via basicNack: {}", e.getMessage());
=======
            channel.basicAck(tag, false);
            log.info("👍 [ACK] Hoja de ruta confirmada para retiro #{}", routeDto.getCodigoRetiro());
        } catch (Exception e) {
            log.error("❌ [ERROR RUTA] Desviando a Dead Letter Queue (DLQ): {}", e.getMessage());
>>>>>>> origin/main
            channel.basicNack(tag, false, false);
        }
    }
}

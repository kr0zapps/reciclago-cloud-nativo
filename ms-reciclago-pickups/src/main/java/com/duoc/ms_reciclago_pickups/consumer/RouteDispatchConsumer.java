package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.RouteEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RouteDispatchConsumer {

    private static final Logger log = LoggerFactory.getLogger(RouteDispatchConsumer.class);

    @RabbitListener(queues = RabbitMQConfig.QUEUE_ROUTE)
    public void receiveRouteCommand(RouteEventDto routeDto, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            log.info("🚛 [HOJA DE RUTA DIMAO - DESPACHO MUNICIPAL]:");
            log.info("   -> Código Retiro: {}", routeDto.getCodigoRetiro());
            log.info("   -> Camión Asignado: {}", routeDto.getCamionPatente());
            log.info("   -> Comuna / Sector: {}", routeDto.getComuna());
            log.info("   -> Fecha Programada: {}", routeDto.getFechaProgramada());

            // Confirmación explícita (ACK) según rúbrica EP3 (20%)
            channel.basicAck(tag, false);
            log.debug("ACK confirmado exitosamente para deliveryTag: {}", tag);
        } catch (Exception e) {
            log.error("❌ Error en consumidor Ruta, enviando a DLQ via basicNack: {}", e.getMessage());
            channel.basicNack(tag, false, false);
        }
    }
}

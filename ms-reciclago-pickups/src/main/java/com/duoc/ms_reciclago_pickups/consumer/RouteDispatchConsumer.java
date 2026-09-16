package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.RouteEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class RouteDispatchConsumer {

    private static final Logger log = LoggerFactory.getLogger(RouteDispatchConsumer.class);

    @RabbitListener(queues = RabbitMQConfig.QUEUE_ROUTE)
    public void receiveRouteCommand(RouteEventDto routeDto) {
        log.info("🚛 [HOJA DE RUTA DIMAO - DESPACHO MUNICIPAL]:");
        log.info("   -> Código Retiro: {}", routeDto.getCodigoRetiro());
        log.info("   -> Camión Asignado: {}", routeDto.getCamionPatente());
        log.info("   -> Comuna / Sector: {}", routeDto.getComuna());
        log.info("   -> Fecha Programada: {}", routeDto.getFechaProgramada());
    }
}

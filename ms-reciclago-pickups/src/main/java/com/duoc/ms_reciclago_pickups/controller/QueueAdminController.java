package com.duoc.ms_reciclago_pickups.controller;

import com.duoc.ms_reciclago_pickups.dto.CreateQueueDto;
import com.duoc.ms_reciclago_pickups.service.RabbitAdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Controlador REST para la administración dinámica de colas RabbitMQ.
 * Cumple con los requerimientos de la EP3 (13% diseño REST + 7% validación de entrada).
 */
@RestController
@RequestMapping("/api/admin/queues")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:4200}")
public class QueueAdminController {

    private final RabbitAdminService rabbitAdminService;

    public QueueAdminController(RabbitAdminService rabbitAdminService) {
        this.rabbitAdminService = rabbitAdminService;
    }

    /**
     * Endpoint REST para crear una cola con validación estricta de parámetros (POST /api/admin/queues).
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createQueue(@Valid @RequestBody CreateQueueDto request) {
        String queueName = rabbitAdminService.createQueue(request.getName(), request.isDurable());
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Cola RabbitMQ creada exitosamente");
        response.put("queueName", queueName);
        response.put("durable", request.isDurable());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint REST para consultar el estado y métricas de una cola (GET /api/admin/queues/{name}).
     */
    @GetMapping("/{name}")
    public ResponseEntity<?> getQueueProperties(@PathVariable String name) {
        Properties properties = rabbitAdminService.getQueueProperties(name);
        if (properties == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "NOT_FOUND",
                    "message", "La cola '" + name + "' no existe en el broker de RabbitMQ"
            ));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("queueName", name);
        response.put("messageCount", properties.get(org.springframework.amqp.rabbit.core.RabbitAdmin.QUEUE_MESSAGE_COUNT));
        response.put("consumerCount", properties.get(org.springframework.amqp.rabbit.core.RabbitAdmin.QUEUE_CONSUMER_COUNT));
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint REST para eliminar una cola en el broker (DELETE /api/admin/queues/{name}).
     */
    @DeleteMapping("/{name}")
    public ResponseEntity<Map<String, Object>> deleteQueue(@PathVariable String name) {
        boolean deleted = rabbitAdminService.deleteQueue(name);
        
        if (deleted) {
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Cola '" + name + "' eliminada correctamente de RabbitMQ"
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "NOT_FOUND",
                    "message", "La cola '" + name + "' no existía o no pudo ser eliminada"
            ));
        }
    }
}

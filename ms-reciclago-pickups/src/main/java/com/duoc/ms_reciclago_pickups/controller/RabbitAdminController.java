package com.duoc.ms_reciclago_pickups.controller;

import com.duoc.ms_reciclago_pickups.dto.CreateQueueRequest;
import com.duoc.ms_reciclago_pickups.service.RabbitAdminService;
import jakarta.validation.Valid;
import org.springframework.amqp.core.QueueInformation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rabbitmq")
public class RabbitAdminController {

    private final RabbitAdminService adminService;

    public RabbitAdminController(RabbitAdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/queues")
    public ResponseEntity<?> createQueue(@Valid @RequestBody CreateQueueRequest request) {
        adminService.createQueue(request.getQueueName());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "mensaje", "Cola creada exitosamente",
                "queueName", request.getQueueName()
        ));
    }

    @GetMapping("/queues/{queueName}")
    public ResponseEntity<?> getQueueInfo(@PathVariable String queueName) {
        QueueInformation info = adminService.getQueueInfo(queueName);
        if (info == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Cola no encontrada"));
        }
        return ResponseEntity.ok(Map.of(
                "name", info.getName(),
                "messageCount", info.getMessageCount(),
                "consumerCount", info.getConsumerCount()
        ));
    }

    @DeleteMapping("/queues/{queueName}")
    public ResponseEntity<?> deleteQueue(@PathVariable String queueName) {
        boolean deleted = adminService.deleteQueue(queueName);
        return ResponseEntity.ok(Map.of("mensaje", "Cola eliminada", "status", deleted));
    }
}

package com.duoc.ms_reciclago_pickups.controller;

import org.springframework.amqp.rabbit.listener.MessageListenerContainer;
import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/listeners")
public class ListenerController {

    private final RabbitListenerEndpointRegistry registry;

    public ListenerController(RabbitListenerEndpointRegistry registry) {
        this.registry = registry;
    }

    @GetMapping
    public ResponseEntity<?> getAllListeners() {
        return ResponseEntity.ok(registry.getListenerContainerIds());
    }

    @PostMapping("/{listenerId}/pause")
    public ResponseEntity<?> pauseListener(@PathVariable String listenerId) {
        MessageListenerContainer container = registry.getListenerContainer(listenerId);
        if (container != null && container.isRunning()) {
            container.stop();
            return ResponseEntity.ok(Map.of("mensaje", "Listener pausado: " + listenerId));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Listener no encontrado o ya detenido"));
    }

    @PostMapping("/{listenerId}/resume")
    public ResponseEntity<?> resumeListener(@PathVariable String listenerId) {
        MessageListenerContainer container = registry.getListenerContainer(listenerId);
        if (container != null) {
            container.start();
            return ResponseEntity.ok(Map.of("mensaje", "Listener reanudado: " + listenerId));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Listener no encontrado"));
    }
}

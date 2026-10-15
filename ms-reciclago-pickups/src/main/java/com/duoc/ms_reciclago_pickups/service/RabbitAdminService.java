package com.duoc.ms_reciclago_pickups.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.stereotype.Service;

@Service
public class RabbitAdminService {

    private static final Logger log = LoggerFactory.getLogger(RabbitAdminService.class);

    private final RabbitAdmin rabbitAdmin;

    public RabbitAdminService(RabbitAdmin rabbitAdmin) {
        this.rabbitAdmin = rabbitAdmin;
    }

    public void createQueue(String queueName) {
        Queue queue = QueueBuilder.durable(queueName).build();
        rabbitAdmin.declareQueue(queue);
        log.info("✓ Cola creada dinámicamente con RabbitAdmin: {}", queueName);
    }

    public boolean deleteQueue(String queueName) {
        boolean deleted = rabbitAdmin.deleteQueue(queueName);
        log.info("✓ Cola eliminada {}: {}", queueName, deleted);
        return deleted;
    }

    public QueueInformation getQueueInfo(String queueName) {
        return rabbitAdmin.getQueueInfo(queueName);
    }

    public void purgeQueue(String queueName) {
        rabbitAdmin.purgeQueue(queueName);
        log.info("✓ Cola purgada: {}", queueName);
    }
}

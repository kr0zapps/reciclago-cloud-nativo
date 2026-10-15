package com.duoc.ms_reciclago_pickups.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitMQConfig {

    private static final String X_DEAD_LETTER_EXCHANGE = "x-dead-letter-exchange";
    private static final String X_DEAD_LETTER_ROUTING_KEY = "x-dead-letter-routing-key";

    // Nombres de Colas y DLQs
    public static final String QUEUE_EMAIL = "q.cmd.email";
    public static final String DLQ_EMAIL = "q.cmd.email.dlq";

    public static final String QUEUE_ROUTE = "q.cmd.route";
    public static final String DLQ_ROUTE = "q.cmd.route.dlq";

    public static final String QUEUE_CERTIFICATE = "q.cmd.certificate";
    public static final String DLQ_CERTIFICATE = "q.cmd.certificate.dlq";

    public static final String DLX_EXCHANGE = "dlx.exchange";

    // 1. Configuración de Dead Letter Exchange (DLX)
    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DLX_EXCHANGE);
    }

    // 2. Colas y DLQ para Email
    @Bean
    public Queue emailDlq() {
        return QueueBuilder.durable(DLQ_EMAIL).build();
    }

    @Bean
    public Binding emailDlqBinding() {
        return BindingBuilder.bind(emailDlq()).to(deadLetterExchange()).with(DLQ_EMAIL);
    }

    @Bean
    public Queue emailQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put(X_DEAD_LETTER_EXCHANGE, DLX_EXCHANGE);
        args.put(X_DEAD_LETTER_ROUTING_KEY, DLQ_EMAIL);
        return QueueBuilder.durable(QUEUE_EMAIL).withArguments(args).build();
    }

    // 3. Colas y DLQ para Ruta (Tickets/Hojas de ruta)
    @Bean
    public Queue routeDlq() {
        return QueueBuilder.durable(DLQ_ROUTE).build();
    }

    @Bean
    public Binding routeDlqBinding() {
        return BindingBuilder.bind(routeDlq()).to(deadLetterExchange()).with(DLQ_ROUTE);
    }

    @Bean
    public Queue routeQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put(X_DEAD_LETTER_EXCHANGE, DLX_EXCHANGE);
        args.put(X_DEAD_LETTER_ROUTING_KEY, DLQ_ROUTE);
        return QueueBuilder.durable(QUEUE_ROUTE).withArguments(args).build();
    }

    // 4. Colas y DLQ para Certificado
    @Bean
    public Queue certificateDlq() {
        return QueueBuilder.durable(DLQ_CERTIFICATE).build();
    }

    @Bean
    public Binding certificateDlqBinding() {
        return BindingBuilder.bind(certificateDlq()).to(deadLetterExchange()).with(DLQ_CERTIFICATE);
    }

    @Bean
    public Queue certificateQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put(X_DEAD_LETTER_EXCHANGE, DLX_EXCHANGE);
        args.put(X_DEAD_LETTER_ROUTING_KEY, DLQ_CERTIFICATE);
        return QueueBuilder.durable(QUEUE_CERTIFICATE).withArguments(args).build();
    }

    // 5. Configuración de Topic Exchange (Requerimiento EP4)
    public static final String TOPIC_EXCHANGE = "reciclago.topic.exchange";
    public static final String QUEUE_TOPIC_NOTIFICACIONES = "q.topic.notificaciones";
    public static final String ROUTING_KEY_TOPIC = "reciclago.notificaciones.*";

    @Bean
    public org.springframework.amqp.core.TopicExchange topicExchange() {
        return new org.springframework.amqp.core.TopicExchange(TOPIC_EXCHANGE);
    }

    @Bean
    public Queue topicNotificacionesQueue() {
        return QueueBuilder.durable(QUEUE_TOPIC_NOTIFICACIONES).build();
    }

    @Bean
    public Binding topicBinding() {
        return BindingBuilder.bind(topicNotificacionesQueue()).to(topicExchange()).with(ROUTING_KEY_TOPIC);
    }

    // 6. RabbitAdmin para microservicio administrador (Requerimiento EP3)
    @Bean
    public org.springframework.amqp.rabbit.core.RabbitAdmin rabbitAdmin(
            org.springframework.amqp.rabbit.connection.ConnectionFactory connectionFactory) {
        return new org.springframework.amqp.rabbit.core.RabbitAdmin(connectionFactory);
    }

    // Converter para enviar objetos como JSON en RabbitMQ
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // Constante para el TopicExchange
    public static final String TOPIC_EXCHANGE_NAME = "reciclago.topic.exchange";

    // Bean del Topic Exchange exigido por la pauta EP4
    @Bean
    public org.springframework.amqp.core.TopicExchange reciclagoTopicExchange() {
        return new org.springframework.amqp.core.TopicExchange(TOPIC_EXCHANGE_NAME, true, false);
    }

    // Bean de RabbitAdmin para gestionar colas dinámicamente desde la API
    @Bean
    public org.springframework.amqp.rabbit.core.RabbitAdmin rabbitAdmin(
            org.springframework.amqp.rabbit.connection.ConnectionFactory connectionFactory) {
        return new org.springframework.amqp.rabbit.core.RabbitAdmin(connectionFactory);
    }
}

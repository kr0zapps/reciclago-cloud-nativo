package com.duoc.ms_reciclago_pickups.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    public static final String TOPIC_PICKUPS_EVENTS = "pickups.events";
    public static final String TOPIC_AUDIT_TIMELINE = "audit.timeline";

    @Bean
    public NewTopic pickupsEventsTopic() {
        return TopicBuilder.name(TOPIC_PICKUPS_EVENTS)
                .partitions(3)
                .replicas(1)
                .config("retention.ms", "604800000") // 7 días de retención
                .build();
    }

    @Bean
    public NewTopic auditTimelineTopic() {
        return TopicBuilder.name(TOPIC_AUDIT_TIMELINE)
                .partitions(3)
                .replicas(1)
                .config("retention.ms", "2592000000") // 30 días de retención
                .config("cleanup.policy", "compact,delete")
                .build();
    }
}

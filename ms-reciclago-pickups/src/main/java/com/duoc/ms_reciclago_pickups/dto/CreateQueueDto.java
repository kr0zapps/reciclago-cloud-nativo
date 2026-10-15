package com.duoc.ms_reciclago_pickups.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * DTO para la creación dinámica de colas RabbitMQ con validación de parámetros (Requerimiento EP3: 7%).
 */
public class CreateQueueDto {

    @NotBlank(message = "El nombre de la cola no puede estar vacío")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "El nombre de la cola solo puede contener letras, números, puntos, guiones y guiones bajos")
    private String name;

    private boolean durable = true;

    public CreateQueueDto() {
    }

    public CreateQueueDto(String name, boolean durable) {
        this.name = name;
        this.durable = durable;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isDurable() {
        return durable;
    }

    public void setDurable(boolean durable) {
        this.durable = durable;
    }
}

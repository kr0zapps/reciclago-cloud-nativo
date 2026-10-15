package com.duoc.ms_reciclago_routes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "contactos_ciudadanos")
public class ContactoCiudadano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ticketId;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Debe ingresar un correo válido")
    @Column(nullable = false)
    private String email;

    private String telefono;

    @NotBlank(message = "El asunto es obligatorio")
    @Column(nullable = false)
    private String asunto;

    @NotBlank(message = "El mensaje es obligatorio")
    @Column(nullable = false, length = 1000)
    private String mensaje;

    @Column(nullable = false)
    private String status = "RECIBIDO"; // RECIBIDO, EN_TRAMITE, RESUELTO

    @Column(nullable = false)
    private LocalDateTime fechaIngreso = LocalDateTime.now(ZoneId.systemDefault());

    public ContactoCiudadano() {
    }

    public static Builder builder() {
        return new Builder();
    }

    private ContactoCiudadano(Builder builder) {
        this.id = builder.id;
        this.ticketId = builder.ticketId;
        this.nombre = builder.nombre;
        this.email = builder.email;
        this.telefono = builder.telefono;
        this.asunto = builder.asunto;
        this.mensaje = builder.mensaje;
        this.status = builder.status != null ? builder.status : "RECIBIDO";
        this.fechaIngreso = builder.fechaIngreso != null ? builder.fechaIngreso : LocalDateTime.now(ZoneId.systemDefault());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDateTime fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public static class Builder {
        private Long id;
        private String ticketId;
        private String nombre;
        private String email;
        private String telefono;
        private String asunto;
        private String mensaje;
        private String status = "RECIBIDO";
        private LocalDateTime fechaIngreso;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder ticketId(String ticketId) {
            this.ticketId = ticketId;
            return this;
        }

        public Builder nombre(String nombre) {
            this.nombre = nombre;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder telefono(String telefono) {
            this.telefono = telefono;
            return this;
        }

        public Builder asunto(String asunto) {
            this.asunto = asunto;
            return this;
        }

        public Builder mensaje(String mensaje) {
            this.mensaje = mensaje;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder fechaIngreso(LocalDateTime fechaIngreso) {
            this.fechaIngreso = fechaIngreso;
            return this;
        }

        public ContactoCiudadano build() {
            return new ContactoCiudadano(this);
        }
    }
}

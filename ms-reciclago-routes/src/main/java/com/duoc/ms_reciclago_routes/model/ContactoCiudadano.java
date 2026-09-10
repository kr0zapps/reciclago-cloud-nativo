package com.duoc.ms_reciclago_routes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

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
    private LocalDateTime fechaIngreso = LocalDateTime.now();

    public ContactoCiudadano() {
    }

    public ContactoCiudadano(Long id, String ticketId, String nombre, String email, String telefono,
                             String asunto, String mensaje, String status, LocalDateTime fechaIngreso) {
        this.id = id;
        this.ticketId = ticketId;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.asunto = asunto;
        this.mensaje = mensaje;
        this.status = status != null ? status : "RECIBIDO";
        this.fechaIngreso = fechaIngreso != null ? fechaIngreso : LocalDateTime.now();
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
}

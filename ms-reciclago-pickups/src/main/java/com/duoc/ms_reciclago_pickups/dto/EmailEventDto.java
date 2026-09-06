package com.duoc.ms_reciclago_pickups.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

public class EmailEventDto implements Serializable {
    private String codigoRetiro;
    private String destinatarioEmail;
    private String destinatarioNombre;
    private String asunto;
    private String mensaje;
    private String nuevoEstado;
    private LocalDateTime fechaEvento;

    public EmailEventDto() {
    }

    public EmailEventDto(String codigoRetiro, String destinatarioEmail, String destinatarioNombre, String asunto, String mensaje, String nuevoEstado, LocalDateTime fechaEvento) {
        this.codigoRetiro = codigoRetiro;
        this.destinatarioEmail = destinatarioEmail;
        this.destinatarioNombre = destinatarioNombre;
        this.asunto = asunto;
        this.mensaje = mensaje;
        this.nuevoEstado = nuevoEstado;
        this.fechaEvento = fechaEvento != null ? fechaEvento : LocalDateTime.now();
    }

    public String getCodigoRetiro() {
        return codigoRetiro;
    }

    public void setCodigoRetiro(String codigoRetiro) {
        this.codigoRetiro = codigoRetiro;
    }

    public String getDestinatarioEmail() {
        return destinatarioEmail;
    }

    public void setDestinatarioEmail(String destinatarioEmail) {
        this.destinatarioEmail = destinatarioEmail;
    }

    public String getDestinatarioNombre() {
        return destinatarioNombre;
    }

    public void setDestinatarioNombre(String destinatarioNombre) {
        this.destinatarioNombre = destinatarioNombre;
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

    public String getNuevoEstado() {
        return nuevoEstado;
    }

    public void setNuevoEstado(String nuevoEstado) {
        this.nuevoEstado = nuevoEstado;
    }

    public LocalDateTime getFechaEvento() {
        return fechaEvento;
    }

    public void setFechaEvento(LocalDateTime fechaEvento) {
        this.fechaEvento = fechaEvento;
    }
}

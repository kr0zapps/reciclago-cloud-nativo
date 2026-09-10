package com.duoc.ms_reciclago_routes.dto;

import java.io.Serializable;

public class ContactoResponseDto implements Serializable {

    private String ticketId;
    private String status;
    private String mensaje;

    public ContactoResponseDto() {
    }

    public ContactoResponseDto(String ticketId, String status, String mensaje) {
        this.ticketId = ticketId;
        this.status = status;
        this.mensaje = mensaje;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}

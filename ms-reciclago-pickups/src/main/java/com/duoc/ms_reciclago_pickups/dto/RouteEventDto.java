package com.duoc.ms_reciclago_pickups.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

public class RouteEventDto implements Serializable {
    private String codigoRetiro;
    private Long camionId;
    private String camionPatente;
    private String comuna;
    private String direccion;
    private Double pesoEstimadoKg;
    private String estado;
    private LocalDateTime fechaProgramada;

    public RouteEventDto() {
    }

    public RouteEventDto(String codigoRetiro, Long camionId, String camionPatente, String comuna, String direccion, Double pesoEstimadoKg, String estado, LocalDateTime fechaProgramada) {
        this.codigoRetiro = codigoRetiro;
        this.camionId = camionId;
        this.camionPatente = camionPatente;
        this.comuna = comuna;
        this.direccion = direccion;
        this.pesoEstimadoKg = pesoEstimadoKg;
        this.estado = estado;
        this.fechaProgramada = fechaProgramada;
    }

    public String getCodigoRetiro() {
        return codigoRetiro;
    }

    public void setCodigoRetiro(String codigoRetiro) {
        this.codigoRetiro = codigoRetiro;
    }

    public Long getCamionId() {
        return camionId;
    }

    public void setCamionId(Long camionId) {
        this.camionId = camionId;
    }

    public String getCamionPatente() {
        return camionPatente;
    }

    public void setCamionPatente(String camionPatente) {
        this.camionPatente = camionPatente;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Double getPesoEstimadoKg() {
        return pesoEstimadoKg;
    }

    public void setPesoEstimadoKg(Double pesoEstimadoKg) {
        this.pesoEstimadoKg = pesoEstimadoKg;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaProgramada() {
        return fechaProgramada;
    }

    public void setFechaProgramada(LocalDateTime fechaProgramada) {
        this.fechaProgramada = fechaProgramada;
    }
}

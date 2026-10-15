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

    public static Builder builder() {
        return new Builder();
    }

    private RouteEventDto(Builder builder) {
        this.codigoRetiro = builder.codigoRetiro;
        this.camionId = builder.camionId;
        this.camionPatente = builder.camionPatente;
        this.comuna = builder.comuna;
        this.direccion = builder.direccion;
        this.pesoEstimadoKg = builder.pesoEstimadoKg;
        this.estado = builder.estado;
        this.fechaProgramada = builder.fechaProgramada;
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

    public static class Builder {
        private String codigoRetiro;
        private Long camionId;
        private String camionPatente;
        private String comuna;
        private String direccion;
        private Double pesoEstimadoKg;
        private String estado;
        private LocalDateTime fechaProgramada;

        public Builder codigoRetiro(String codigoRetiro) {
            this.codigoRetiro = codigoRetiro;
            return this;
        }

        public Builder camionId(Long camionId) {
            this.camionId = camionId;
            return this;
        }

        public Builder camionPatente(String camionPatente) {
            this.camionPatente = camionPatente;
            return this;
        }

        public Builder comuna(String comuna) {
            this.comuna = comuna;
            return this;
        }

        public Builder direccion(String direccion) {
            this.direccion = direccion;
            return this;
        }

        public Builder pesoEstimadoKg(Double pesoEstimadoKg) {
            this.pesoEstimadoKg = pesoEstimadoKg;
            return this;
        }

        public Builder estado(String estado) {
            this.estado = estado;
            return this;
        }

        public Builder fechaProgramada(LocalDateTime fechaProgramada) {
            this.fechaProgramada = fechaProgramada;
            return this;
        }

        public RouteEventDto build() {
            return new RouteEventDto(this);
        }
    }
}

package com.duoc.ms_reciclago_pickups.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

public class CertificateEventDto implements Serializable {

    private String codigoRetiro;
    private String vecinoNombre;
    private String vecinoEmail;
    private String direccion;
    private String comuna;
    private String residuoNombre;
    private Double pesoRealKg;
    private LocalDateTime fechaCompletado;
    private LocalDateTime fechaEmision;

    public CertificateEventDto() {
    }

    public static Builder builder() {
        return new Builder();
    }

    private CertificateEventDto(Builder builder) {
        this.codigoRetiro = builder.codigoRetiro;
        this.vecinoNombre = builder.vecinoNombre;
        this.vecinoEmail = builder.vecinoEmail;
        this.direccion = builder.direccion;
        this.comuna = builder.comuna;
        this.residuoNombre = builder.residuoNombre;
        this.pesoRealKg = builder.pesoRealKg;
        this.fechaCompletado = builder.fechaCompletado;
        this.fechaEmision = builder.fechaEmision;
    }

    public String getCodigoRetiro() {
        return codigoRetiro;
    }

    public void setCodigoRetiro(String codigoRetiro) {
        this.codigoRetiro = codigoRetiro;
    }

    public String getVecinoNombre() {
        return vecinoNombre;
    }

    public void setVecinoNombre(String vecinoNombre) {
        this.vecinoNombre = vecinoNombre;
    }

    public String getVecinoEmail() {
        return vecinoEmail;
    }

    public void setVecinoEmail(String vecinoEmail) {
        this.vecinoEmail = vecinoEmail;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public String getResiduoNombre() {
        return residuoNombre;
    }

    public void setResiduoNombre(String residuoNombre) {
        this.residuoNombre = residuoNombre;
    }

    public Double getPesoRealKg() {
        return pesoRealKg;
    }

    public void setPesoRealKg(Double pesoRealKg) {
        this.pesoRealKg = pesoRealKg;
    }

    public LocalDateTime getFechaCompletado() {
        return fechaCompletado;
    }

    public void setFechaCompletado(LocalDateTime fechaCompletado) {
        this.fechaCompletado = fechaCompletado;
    }

    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public static class Builder {
        private String codigoRetiro;
        private String vecinoNombre;
        private String vecinoEmail;
        private String direccion;
        private String comuna;
        private String residuoNombre;
        private Double pesoRealKg;
        private LocalDateTime fechaCompletado;
        private LocalDateTime fechaEmision;

        public Builder codigoRetiro(String codigoRetiro) {
            this.codigoRetiro = codigoRetiro;
            return this;
        }

        public Builder vecinoNombre(String vecinoNombre) {
            this.vecinoNombre = vecinoNombre;
            return this;
        }

        public Builder vecinoEmail(String vecinoEmail) {
            this.vecinoEmail = vecinoEmail;
            return this;
        }

        public Builder direccion(String direccion) {
            this.direccion = direccion;
            return this;
        }

        public Builder comuna(String comuna) {
            this.comuna = comuna;
            return this;
        }

        public Builder residuoNombre(String residuoNombre) {
            this.residuoNombre = residuoNombre;
            return this;
        }

        public Builder pesoRealKg(Double pesoRealKg) {
            this.pesoRealKg = pesoRealKg;
            return this;
        }

        public Builder fechaCompletado(LocalDateTime fechaCompletado) {
            this.fechaCompletado = fechaCompletado;
            return this;
        }

        public Builder fechaEmision(LocalDateTime fechaEmision) {
            this.fechaEmision = fechaEmision;
            return this;
        }

        public CertificateEventDto build() {
            return new CertificateEventDto(this);
        }
    }
}

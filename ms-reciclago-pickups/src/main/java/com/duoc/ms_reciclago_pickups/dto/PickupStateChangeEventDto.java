package com.duoc.ms_reciclago_pickups.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class PickupStateChangeEventDto implements Serializable {
    private Long pickupId;
    private String codigoRetiro;
    private String estadoAnterior;
    private String estadoNuevo;
    private String vecinoEmail;
    private String comuna;
    private String residuoNombre;
    private Double pesoEstimadoKg;
    private Double pesoRealKg;
    private String timestamp;

    public PickupStateChangeEventDto() {
    }

    public static Builder builder() {
        return new Builder();
    }

    private PickupStateChangeEventDto(Builder builder) {
        this.pickupId = builder.pickupId;
        this.codigoRetiro = builder.codigoRetiro;
        this.estadoAnterior = builder.estadoAnterior;
        this.estadoNuevo = builder.estadoNuevo;
        this.vecinoEmail = builder.vecinoEmail;
        this.comuna = builder.comuna;
        this.residuoNombre = builder.residuoNombre;
        this.pesoEstimadoKg = builder.pesoEstimadoKg;
        this.pesoRealKg = builder.pesoRealKg;
        this.timestamp = builder.timestamp != null ? builder.timestamp : LocalDateTime.now(ZoneId.systemDefault()).toString();
    }

    public Long getPickupId() {
        return pickupId;
    }

    public void setPickupId(Long pickupId) {
        this.pickupId = pickupId;
    }

    public String getCodigoRetiro() {
        return codigoRetiro;
    }

    public void setCodigoRetiro(String codigoRetiro) {
        this.codigoRetiro = codigoRetiro;
    }

    public String getEstadoAnterior() {
        return estadoAnterior;
    }

    public void setEstadoAnterior(String estadoAnterior) {
        this.estadoAnterior = estadoAnterior;
    }

    public String getEstadoNuevo() {
        return estadoNuevo;
    }

    public void setEstadoNuevo(String estadoNuevo) {
        this.estadoNuevo = estadoNuevo;
    }

    public String getVecinoEmail() {
        return vecinoEmail;
    }

    public void setVecinoEmail(String vecinoEmail) {
        this.vecinoEmail = vecinoEmail;
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

    public Double getPesoEstimadoKg() {
        return pesoEstimadoKg;
    }

    public void setPesoEstimadoKg(Double pesoEstimadoKg) {
        this.pesoEstimadoKg = pesoEstimadoKg;
    }

    public Double getPesoRealKg() {
        return pesoRealKg;
    }

    public void setPesoRealKg(Double pesoRealKg) {
        this.pesoRealKg = pesoRealKg;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public static class Builder {
        private Long pickupId;
        private String codigoRetiro;
        private String estadoAnterior;
        private String estadoNuevo;
        private String vecinoEmail;
        private String comuna;
        private String residuoNombre;
        private Double pesoEstimadoKg;
        private Double pesoRealKg;
        private String timestamp;

        public Builder pickupId(Long pickupId) {
            this.pickupId = pickupId;
            return this;
        }

        public Builder codigoRetiro(String codigoRetiro) {
            this.codigoRetiro = codigoRetiro;
            return this;
        }

        public Builder estadoAnterior(String estadoAnterior) {
            this.estadoAnterior = estadoAnterior;
            return this;
        }

        public Builder estadoNuevo(String estadoNuevo) {
            this.estadoNuevo = estadoNuevo;
            return this;
        }

        public Builder vecinoEmail(String vecinoEmail) {
            this.vecinoEmail = vecinoEmail;
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

        public Builder pesoEstimadoKg(Double pesoEstimadoKg) {
            this.pesoEstimadoKg = pesoEstimadoKg;
            return this;
        }

        public Builder pesoRealKg(Double pesoRealKg) {
            this.pesoRealKg = pesoRealKg;
            return this;
        }

        public Builder timestamp(String timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public PickupStateChangeEventDto build() {
            return new PickupStateChangeEventDto(this);
        }
    }
}

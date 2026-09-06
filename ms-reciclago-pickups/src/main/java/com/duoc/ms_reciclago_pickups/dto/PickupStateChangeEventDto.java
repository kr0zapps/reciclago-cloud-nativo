package com.duoc.ms_reciclago_pickups.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

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

    public PickupStateChangeEventDto(Long pickupId, String codigoRetiro, String estadoAnterior, String estadoNuevo, String vecinoEmail, String comuna, String residuoNombre, Double pesoEstimadoKg, Double pesoRealKg) {
        this.pickupId = pickupId;
        this.codigoRetiro = codigoRetiro;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.vecinoEmail = vecinoEmail;
        this.comuna = comuna;
        this.residuoNombre = residuoNombre;
        this.pesoEstimadoKg = pesoEstimadoKg;
        this.pesoRealKg = pesoRealKg;
        this.timestamp = LocalDateTime.now().toString();
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
}

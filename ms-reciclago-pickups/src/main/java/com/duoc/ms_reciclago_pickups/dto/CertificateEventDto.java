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

    public CertificateEventDto(String codigoRetiro, String vecinoNombre, String vecinoEmail,
                               String direccion, String comuna, String residuoNombre,
                               Double pesoRealKg, LocalDateTime fechaCompletado, LocalDateTime fechaEmision) {
        this.codigoRetiro = codigoRetiro;
        this.vecinoNombre = vecinoNombre;
        this.vecinoEmail = vecinoEmail;
        this.direccion = direccion;
        this.comuna = comuna;
        this.residuoNombre = residuoNombre;
        this.pesoRealKg = pesoRealKg;
        this.fechaCompletado = fechaCompletado;
        this.fechaEmision = fechaEmision;
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
}

package com.duoc.ms_reciclago_pickups.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

@Entity
@Table(name = "retira_pickups")
public class Pickup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigoRetiro;

    @NotBlank(message = "El nombre del vecino es obligatorio")
    @Column(nullable = false)
    private String vecinoNombre;

    @NotBlank(message = "El correo del vecino es obligatorio")
    @Email(message = "Debe ser un correo electrónico válido")
    @Column(nullable = false)
    private String vecinoEmail;

    @NotBlank(message = "La dirección es obligatoria")
    @Column(nullable = false)
    private String direccion;

    @NotBlank(message = "La comuna es obligatoria")
    @Column(nullable = false)
    private String comuna;

    @NotNull(message = "El ID del residuo es obligatorio")
    @Column(nullable = false)
    private Long residuoId;

    private String residuoNombre;

    private Long camionId;
    private String camionPatente;

    @NotNull(message = "El peso estimado es obligatorio")
    @PositiveOrZero(message = "El peso estimado debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Double pesoEstimadoKg;

    private Double pesoRealKg;

    @Column(nullable = false)
    private String estado = "SOLICITADO"; // SOLICITADO, PROGRAMADO, EN_RUTA, RETIRADO, PESADO, CANCELADO

    @Column(nullable = false)
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    private LocalDateTime fechaProgramada;
    private LocalDateTime fechaCompletado;

    private String observaciones;

    public Pickup() {
    }

    public Pickup(Long id, String codigoRetiro, String vecinoNombre, String vecinoEmail, String direccion,
                  String comuna, Long residuoId, String residuoNombre, Long camionId, String camionPatente,
                  Double pesoEstimadoKg, Double pesoRealKg, String estado, LocalDateTime fechaSolicitud,
                  LocalDateTime fechaProgramada, LocalDateTime fechaCompletado, String observaciones) {
        this.id = id;
        this.codigoRetiro = codigoRetiro;
        this.vecinoNombre = vecinoNombre;
        this.vecinoEmail = vecinoEmail;
        this.direccion = direccion;
        this.comuna = comuna;
        this.residuoId = residuoId;
        this.residuoNombre = residuoNombre;
        this.camionId = camionId;
        this.camionPatente = camionPatente;
        this.pesoEstimadoKg = pesoEstimadoKg;
        this.pesoRealKg = pesoRealKg;
        this.estado = estado != null ? estado : "SOLICITADO";
        this.fechaSolicitud = fechaSolicitud != null ? fechaSolicitud : LocalDateTime.now();
        this.fechaProgramada = fechaProgramada;
        this.fechaCompletado = fechaCompletado;
        this.observaciones = observaciones;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getResiduoId() {
        return residuoId;
    }

    public void setResiduoId(Long residuoId) {
        this.residuoId = residuoId;
    }

    public String getResiduoNombre() {
        return residuoNombre;
    }

    public void setResiduoNombre(String residuoNombre) {
        this.residuoNombre = residuoNombre;
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDateTime fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public LocalDateTime getFechaProgramada() {
        return fechaProgramada;
    }

    public void setFechaProgramada(LocalDateTime fechaProgramada) {
        this.fechaProgramada = fechaProgramada;
    }

    public LocalDateTime getFechaCompletado() {
        return fechaCompletado;
    }

    public void setFechaCompletado(LocalDateTime fechaCompletado) {
        this.fechaCompletado = fechaCompletado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}

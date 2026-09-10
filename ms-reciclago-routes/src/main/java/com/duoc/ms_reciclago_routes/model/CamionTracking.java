package com.duoc.ms_reciclago_routes.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "camiones_tracking")
public class CamionTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long camionId;

    @Column(nullable = false)
    private String patente;

    private Long cuadranteId;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    private String calleActual;

    @Column(nullable = false)
    private String estado; // EN_CIRCULACION, EN_BASE, DETENIDO

    private Double velocidadKmH;

    private Double capacidadTotalKg;
    private Double kilosCargados;

    private LocalDateTime ultimaActualizacion;

    public CamionTracking() {
    }

    public CamionTracking(Long id, Long camionId, String patente, Long cuadranteId, Double lat, Double lng,
                          String calleActual, String estado, Double velocidadKmH, Double capacidadTotalKg,
                          Double kilosCargados, LocalDateTime ultimaActualizacion) {
        this.id = id;
        this.camionId = camionId;
        this.patente = patente;
        this.cuadranteId = cuadranteId;
        this.lat = lat;
        this.lng = lng;
        this.calleActual = calleActual;
        this.estado = estado != null ? estado : "EN_CIRCULACION";
        this.velocidadKmH = velocidadKmH;
        this.capacidadTotalKg = capacidadTotalKg;
        this.kilosCargados = kilosCargados;
        this.ultimaActualizacion = ultimaActualizacion != null ? ultimaActualizacion : LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCamionId() {
        return camionId;
    }

    public void setCamionId(Long camionId) {
        this.camionId = camionId;
    }

    public String getPatente() {
        return patente;
    }

    public void setPatente(String patente) {
        this.patente = patente;
    }

    public Long getCuadranteId() {
        return cuadranteId;
    }

    public void setCuadranteId(Long cuadranteId) {
        this.cuadranteId = cuadranteId;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public String getCalleActual() {
        return calleActual;
    }

    public void setCalleActual(String calleActual) {
        this.calleActual = calleActual;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Double getVelocidadKmH() {
        return velocidadKmH;
    }

    public void setVelocidadKmH(Double velocidadKmH) {
        this.velocidadKmH = velocidadKmH;
    }

    public Double getCapacidadTotalKg() {
        return capacidadTotalKg;
    }

    public void setCapacidadTotalKg(Double capacidadTotalKg) {
        this.capacidadTotalKg = capacidadTotalKg;
    }

    public Double getKilosCargados() {
        return kilosCargados;
    }

    public void setKilosCargados(Double kilosCargados) {
        this.kilosCargados = kilosCargados;
    }

    public LocalDateTime getUltimaActualizacion() {
        return ultimaActualizacion;
    }

    public void setUltimaActualizacion(LocalDateTime ultimaActualizacion) {
        this.ultimaActualizacion = ultimaActualizacion;
    }
}

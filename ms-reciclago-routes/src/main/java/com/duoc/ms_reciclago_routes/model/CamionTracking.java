package com.duoc.ms_reciclago_routes.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

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

    private LocalDateTime ultimaActualizacion = LocalDateTime.now(ZoneId.systemDefault());

    public CamionTracking() {
    }

    public static Builder builder() {
        return new Builder();
    }

    private CamionTracking(Builder builder) {
        this.id = builder.id;
        this.camionId = builder.camionId;
        this.patente = builder.patente;
        this.cuadranteId = builder.cuadranteId;
        this.lat = builder.lat;
        this.lng = builder.lng;
        this.calleActual = builder.calleActual;
        this.estado = builder.estado != null ? builder.estado : "EN_CIRCULACION";
        this.velocidadKmH = builder.velocidadKmH;
        this.capacidadTotalKg = builder.capacidadTotalKg;
        this.kilosCargados = builder.kilosCargados;
        this.ultimaActualizacion = builder.ultimaActualizacion != null ? builder.ultimaActualizacion : LocalDateTime.now(ZoneId.systemDefault());
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

    public static class Builder {
        private Long id;
        private Long camionId;
        private String patente;
        private Long cuadranteId;
        private Double lat;
        private Double lng;
        private String calleActual;
        private String estado = "EN_CIRCULACION";
        private Double velocidadKmH;
        private Double capacidadTotalKg;
        private Double kilosCargados;
        private LocalDateTime ultimaActualizacion;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder camionId(Long camionId) {
            this.camionId = camionId;
            return this;
        }

        public Builder patente(String patente) {
            this.patente = patente;
            return this;
        }

        public Builder cuadranteId(Long cuadranteId) {
            this.cuadranteId = cuadranteId;
            return this;
        }

        public Builder lat(Double lat) {
            this.lat = lat;
            return this;
        }

        public Builder lng(Double lng) {
            this.lng = lng;
            return this;
        }

        public Builder calleActual(String calleActual) {
            this.calleActual = calleActual;
            return this;
        }

        public Builder estado(String estado) {
            this.estado = estado;
            return this;
        }

        public Builder velocidadKmH(Double velocidadKmH) {
            this.velocidadKmH = velocidadKmH;
            return this;
        }

        public Builder capacidadTotalKg(Double capacidadTotalKg) {
            this.capacidadTotalKg = capacidadTotalKg;
            return this;
        }

        public Builder kilosCargados(Double kilosCargados) {
            this.kilosCargados = kilosCargados;
            return this;
        }

        public Builder ultimaActualizacion(LocalDateTime ultimaActualizacion) {
            this.ultimaActualizacion = ultimaActualizacion;
            return this;
        }

        public CamionTracking build() {
            return new CamionTracking(this);
        }
    }
}

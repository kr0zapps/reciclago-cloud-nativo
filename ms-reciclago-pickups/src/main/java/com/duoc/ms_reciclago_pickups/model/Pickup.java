package com.duoc.ms_reciclago_pickups.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "retira_pickups")
@JsonIgnoreProperties(ignoreUnknown = true)
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
    private String comuna = "Puerto Varas";

    @NotNull(message = "El ID del residuo es obligatorio")
    @Column(nullable = false)
    private Long residuoId = 1L;

    private String residuoNombre = "Residuo Reciclable";

    private Long camionId;
    private String camionPatente;

    @NotNull(message = "El peso estimado es obligatorio")
    @PositiveOrZero(message = "El peso estimado debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Double pesoEstimadoKg = 5.0;

    private Double pesoRealKg;

    @Column(nullable = false)
    private String estado = "SOLICITADO"; // SOLICITADO, PROGRAMADO, EN_RUTA, RETIRADO, PESADO, CANCELADO

    @Column(nullable = false)
    private LocalDateTime fechaSolicitud = LocalDateTime.now(ZoneId.systemDefault());

    private LocalDateTime fechaProgramada;
    private LocalDateTime fechaCompletado;

    private String observaciones;

    public Pickup() {
    }

    public static Builder builder() {
        return new Builder();
    }

    private Pickup(Builder builder) {
        this.id = builder.id;
        this.codigoRetiro = builder.codigoRetiro;
        this.vecinoNombre = builder.vecinoNombre;
        this.vecinoEmail = builder.vecinoEmail;
        this.direccion = builder.direccion;
        this.comuna = builder.comuna != null ? builder.comuna : "Puerto Varas";
        this.residuoId = builder.residuoId != null ? builder.residuoId : 1L;
        this.residuoNombre = builder.residuoNombre != null ? builder.residuoNombre : "Residuo Reciclable";
        this.camionId = builder.camionId;
        this.camionPatente = builder.camionPatente;
        this.pesoEstimadoKg = builder.pesoEstimadoKg != null ? builder.pesoEstimadoKg : 5.0;
        this.pesoRealKg = builder.pesoRealKg;
        this.estado = builder.estado != null ? builder.estado : "SOLICITADO";
        this.fechaSolicitud = builder.fechaSolicitud != null ? builder.fechaSolicitud : LocalDateTime.now(ZoneId.systemDefault());
        this.fechaProgramada = builder.fechaProgramada;
        this.fechaCompletado = builder.fechaCompletado;
        this.observaciones = builder.observaciones;
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

    public String getComentarios() {
        return getObservaciones();
    }

    public void setComentarios(String comentarios) {
        if (this.observaciones == null || this.observaciones.isBlank()) {
            this.observaciones = comentarios;
        }
    }

    public static class Builder {
        private Long id;
        private String codigoRetiro;
        private String vecinoNombre;
        private String vecinoEmail;
        private String direccion;
        private String comuna = "Puerto Varas";
        private Long residuoId = 1L;
        private String residuoNombre = "Residuo Reciclable";
        private Long camionId;
        private String camionPatente;
        private Double pesoEstimadoKg = 5.0;
        private Double pesoRealKg;
        private String estado = "SOLICITADO";
        private LocalDateTime fechaSolicitud;
        private LocalDateTime fechaProgramada;
        private LocalDateTime fechaCompletado;
        private String observaciones;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

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

        public Builder residuoId(Long residuoId) {
            this.residuoId = residuoId;
            return this;
        }

        public Builder residuoNombre(String residuoNombre) {
            this.residuoNombre = residuoNombre;
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

        public Builder pesoEstimadoKg(Double pesoEstimadoKg) {
            this.pesoEstimadoKg = pesoEstimadoKg;
            return this;
        }

        public Builder pesoRealKg(Double pesoRealKg) {
            this.pesoRealKg = pesoRealKg;
            return this;
        }

        public Builder estado(String estado) {
            this.estado = estado;
            return this;
        }

        public Builder fechaSolicitud(LocalDateTime fechaSolicitud) {
            this.fechaSolicitud = fechaSolicitud;
            return this;
        }

        public Builder fechaProgramada(LocalDateTime fechaProgramada) {
            this.fechaProgramada = fechaProgramada;
            return this;
        }

        public Builder fechaCompletado(LocalDateTime fechaCompletado) {
            this.fechaCompletado = fechaCompletado;
            return this;
        }

        public Builder observaciones(String observaciones) {
            this.observaciones = observaciones;
            return this;
        }

        public Pickup build() {
            return new Pickup(this);
        }
    }
}

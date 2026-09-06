package com.duoc.ms_reciclago_catalog.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "camiones")
public class Camion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La patente es obligatoria")
    @Column(nullable = false, unique = true)
    private String patente;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    @NotNull(message = "La capacidad total es obligatoria")
    @PositiveOrZero(message = "La capacidad total debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Double capacidadTotalKg;

    @NotNull(message = "La capacidad disponible es obligatoria")
    @PositiveOrZero(message = "La capacidad disponible debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Double capacidadDisponibleKg;

    @Column(nullable = false)
    private String estado = "DISPONIBLE"; // DISPONIBLE, EN_RUTA, MANTENIMIENTO

    public Camion() {
    }

    public Camion(Long id, String patente, String modelo, Double capacidadTotalKg, Double capacidadDisponibleKg, String estado) {
        this.id = id;
        this.patente = patente;
        this.modelo = modelo;
        this.capacidadTotalKg = capacidadTotalKg;
        this.capacidadDisponibleKg = capacidadDisponibleKg;
        this.estado = estado != null ? estado : "DISPONIBLE";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatente() {
        return patente;
    }

    public void setPatente(String patente) {
        this.patente = patente;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Double getCapacidadTotalKg() {
        return capacidadTotalKg;
    }

    public void setCapacidadTotalKg(Double capacidadTotalKg) {
        this.capacidadTotalKg = capacidadTotalKg;
    }

    public Double getCapacidadDisponibleKg() {
        return capacidadDisponibleKg;
    }

    public void setCapacidadDisponibleKg(Double capacidadDisponibleKg) {
        this.capacidadDisponibleKg = capacidadDisponibleKg;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}

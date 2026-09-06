package com.duoc.ms_reciclago_catalog.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "tarifas")
public class Tarifa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la tarifa es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "La comuna o zona es obligatoria")
    @Column(nullable = false)
    private String comuna;

    @NotNull(message = "El costo base es obligatorio")
    @PositiveOrZero(message = "El costo base debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Double costoBase;

    @NotNull(message = "El costo adicional por Kg es obligatorio")
    @PositiveOrZero(message = "El costo adicional por Kg debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Double costoAdicionalPorKg;

    @Column(nullable = false)
    private Boolean activo = true;

    public Tarifa() {
    }

    public Tarifa(Long id, String nombre, String comuna, Double costoBase, Double costoAdicionalPorKg, Boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.comuna = comuna;
        this.costoBase = costoBase;
        this.costoAdicionalPorKg = costoAdicionalPorKg;
        this.activo = activo != null ? activo : true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public Double getCostoBase() {
        return costoBase;
    }

    public void setCostoBase(Double costoBase) {
        this.costoBase = costoBase;
    }

    public Double getCostoAdicionalPorKg() {
        return costoAdicionalPorKg;
    }

    public void setCostoAdicionalPorKg(Double costoAdicionalPorKg) {
        this.costoAdicionalPorKg = costoAdicionalPorKg;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}

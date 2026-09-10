package com.duoc.ms_reciclago_catalog.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "residuos")
public class Residuo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del residuo es obligatorio")
    @Column(nullable = false, unique = true)
    private String nombre;

    @NotBlank(message = "El código es obligatorio")
    @Column(nullable = false, unique = true)
    private String codigo;

    private String descripcion;

    @NotNull(message = "El precio por Kg es obligatorio")
    @PositiveOrZero(message = "El precio por Kg debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Double precioPorKg;

    @Column(nullable = false)
    private Boolean requiereManejoEspecial = false;

    @Column(nullable = false)
    private Boolean activo = true;

    private String categoria;

    private String instrucciones;

    @Column(nullable = false)
    private Boolean permitido = true;

    public Residuo() {
    }

    public Residuo(Long id, String nombre, String codigo, String descripcion, Double precioPorKg, Boolean requiereManejoEspecial, Boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.precioPorKg = precioPorKg;
        this.requiereManejoEspecial = requiereManejoEspecial != null ? requiereManejoEspecial : false;
        this.activo = activo != null ? activo : true;
        this.permitido = true;
    }

    public Residuo(Long id, String nombre, String codigo, String descripcion, Double precioPorKg, 
                   Boolean requiereManejoEspecial, Boolean activo, String categoria, String instrucciones, Boolean permitido) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.precioPorKg = precioPorKg;
        this.requiereManejoEspecial = requiereManejoEspecial != null ? requiereManejoEspecial : false;
        this.activo = activo != null ? activo : true;
        this.categoria = categoria;
        this.instrucciones = instrucciones;
        this.permitido = permitido != null ? permitido : true;
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

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getPrecioPorKg() {
        return precioPorKg;
    }

    public void setPrecioPorKg(Double precioPorKg) {
        this.precioPorKg = precioPorKg;
    }

    public Boolean getRequiereManejoEspecial() {
        return requiereManejoEspecial;
    }

    public void setRequiereManejoEspecial(Boolean requiereManejoEspecial) {
        this.requiereManejoEspecial = requiereManejoEspecial;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getInstrucciones() {
        return instrucciones;
    }

    public void setInstrucciones(String instrucciones) {
        this.instrucciones = instrucciones;
    }

    public Boolean getPermitido() {
        return permitido;
    }

    public void setPermitido(Boolean permitido) {
        this.permitido = permitido;
    }
}

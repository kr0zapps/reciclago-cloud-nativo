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
        if (requiereManejoEspecial != null) {
            this.requiereManejoEspecial = requiereManejoEspecial;
        }
        if (activo != null) {
            this.activo = activo;
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String nombre;
        private String codigo;
        private String descripcion;
        private Double precioPorKg;
        private Boolean requiereManejoEspecial = false;
        private Boolean activo = true;
        private String categoria;
        private String instrucciones;
        private Boolean permitido = true;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder nombre(String nombre) {
            this.nombre = nombre;
            return this;
        }

        public Builder codigo(String codigo) {
            this.codigo = codigo;
            return this;
        }

        public Builder descripcion(String descripcion) {
            this.descripcion = descripcion;
            return this;
        }

        public Builder precioPorKg(Double precioPorKg) {
            this.precioPorKg = precioPorKg;
            return this;
        }

        public Builder requiereManejoEspecial(Boolean requiereManejoEspecial) {
            if (requiereManejoEspecial != null) {
                this.requiereManejoEspecial = requiereManejoEspecial;
            }
            return this;
        }

        public Builder activo(Boolean activo) {
            if (activo != null) {
                this.activo = activo;
            }
            return this;
        }

        public Builder categoria(String categoria) {
            this.categoria = categoria;
            return this;
        }

        public Builder instrucciones(String instrucciones) {
            this.instrucciones = instrucciones;
            return this;
        }

        public Builder permitido(Boolean permitido) {
            if (permitido != null) {
                this.permitido = permitido;
            }
            return this;
        }

        public Residuo build() {
            Residuo residuo = new Residuo();
            residuo.setId(this.id);
            residuo.setNombre(this.nombre);
            residuo.setCodigo(this.codigo);
            residuo.setDescripcion(this.descripcion);
            residuo.setPrecioPorKg(this.precioPorKg);
            residuo.setRequiereManejoEspecial(this.requiereManejoEspecial);
            residuo.setActivo(this.activo);
            residuo.setCategoria(this.categoria);
            residuo.setInstrucciones(this.instrucciones);
            residuo.setPermitido(this.permitido);
            return residuo;
        }
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

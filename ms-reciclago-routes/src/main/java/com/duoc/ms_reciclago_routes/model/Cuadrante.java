package com.duoc.ms_reciclago_routes.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cuadrantes")
public class Cuadrante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer numero;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String sector;

    @Column(nullable = false)
    private String diaSemana;

    @Column(nullable = false)
    private String horario;

    @Column(length = 500)
    private String callesPrincipales;

    private String camionPatente;

    @Column(nullable = false)
    private Boolean camionEnRuta = false;

    public Cuadrante() {
    }

    public static Builder builder() {
        return new Builder();
    }

    private Cuadrante(Builder builder) {
        this.id = builder.id;
        this.numero = builder.numero;
        this.nombre = builder.nombre;
        this.sector = builder.sector;
        this.diaSemana = builder.diaSemana;
        this.horario = builder.horario;
        this.callesPrincipales = builder.callesPrincipales;
        this.camionPatente = builder.camionPatente;
        this.camionEnRuta = Boolean.TRUE.equals(builder.camionEnRuta);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public String getCallesPrincipales() {
        return callesPrincipales;
    }

    public void setCallesPrincipales(String callesPrincipales) {
        this.callesPrincipales = callesPrincipales;
    }

    public String getCamionPatente() {
        return camionPatente;
    }

    public void setCamionPatente(String camionPatente) {
        this.camionPatente = camionPatente;
    }

    public Boolean getCamionEnRuta() {
        return camionEnRuta;
    }

    public void setCamionEnRuta(Boolean camionEnRuta) {
        this.camionEnRuta = camionEnRuta;
    }

    public static class Builder {
        private Long id;
        private Integer numero;
        private String nombre;
        private String sector;
        private String diaSemana;
        private String horario;
        private String callesPrincipales;
        private String camionPatente;
        private Boolean camionEnRuta = false;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder numero(Integer numero) {
            this.numero = numero;
            return this;
        }

        public Builder nombre(String nombre) {
            this.nombre = nombre;
            return this;
        }

        public Builder sector(String sector) {
            this.sector = sector;
            return this;
        }

        public Builder diaSemana(String diaSemana) {
            this.diaSemana = diaSemana;
            return this;
        }

        public Builder horario(String horario) {
            this.horario = horario;
            return this;
        }

        public Builder callesPrincipales(String callesPrincipales) {
            this.callesPrincipales = callesPrincipales;
            return this;
        }

        public Builder camionPatente(String camionPatente) {
            this.camionPatente = camionPatente;
            return this;
        }

        public Builder camionEnRuta(Boolean camionEnRuta) {
            this.camionEnRuta = camionEnRuta;
            return this;
        }

        public Cuadrante build() {
            return new Cuadrante(this);
        }
    }
}

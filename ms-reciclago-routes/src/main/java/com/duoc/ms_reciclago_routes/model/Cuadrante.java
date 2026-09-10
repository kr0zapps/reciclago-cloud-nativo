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

    public Cuadrante(Long id, Integer numero, String nombre, String sector, String diaSemana,
                     String horario, String callesPrincipales, String camionPatente, Boolean camionEnRuta) {
        this.id = id;
        this.numero = numero;
        this.nombre = nombre;
        this.sector = sector;
        this.diaSemana = diaSemana;
        this.horario = horario;
        this.callesPrincipales = callesPrincipales;
        this.camionPatente = camionPatente;
        this.camionEnRuta = camionEnRuta != null ? camionEnRuta : false;
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
}

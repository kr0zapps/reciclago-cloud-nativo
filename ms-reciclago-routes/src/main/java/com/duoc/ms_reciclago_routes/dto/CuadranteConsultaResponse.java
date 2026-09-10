package com.duoc.ms_reciclago_routes.dto;

import java.io.Serializable;

public class CuadranteConsultaResponse implements Serializable {

    private Long cuadranteId;
    private String nombre;
    private String sector;
    private String diaSemana;
    private String horario;
    private String camionPatente;
    private Boolean camionEnRuta;

    public CuadranteConsultaResponse() {
    }

    public CuadranteConsultaResponse(Long cuadranteId, String nombre, String sector,
                                     String diaSemana, String horario, String camionPatente, Boolean camionEnRuta) {
        this.cuadranteId = cuadranteId;
        this.nombre = nombre;
        this.sector = sector;
        this.diaSemana = diaSemana;
        this.horario = horario;
        this.camionPatente = camionPatente;
        this.camionEnRuta = camionEnRuta;
    }

    public Long getCuadranteId() {
        return cuadranteId;
    }

    public void setCuadranteId(Long cuadranteId) {
        this.cuadranteId = cuadranteId;
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

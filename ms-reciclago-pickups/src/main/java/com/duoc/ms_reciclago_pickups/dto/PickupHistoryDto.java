package com.duoc.ms_reciclago_pickups.dto;

import java.io.Serializable;

public class PickupHistoryDto implements Serializable {

    private Long id;
    private String fecha;
    private String fechaTexto;
    private String residuoNombre;
    private Double kilosRecolectados;
    private String direccion;
    private String estado;

    public PickupHistoryDto() {
    }

    public PickupHistoryDto(Long id, String fecha, String fechaTexto, String residuoNombre,
                            Double kilosRecolectados, String direccion, String estado) {
        this.id = id;
        this.fecha = fecha;
        this.fechaTexto = fechaTexto;
        this.residuoNombre = residuoNombre;
        this.kilosRecolectados = kilosRecolectados;
        this.direccion = direccion;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getFechaTexto() {
        return fechaTexto;
    }

    public void setFechaTexto(String fechaTexto) {
        this.fechaTexto = fechaTexto;
    }

    public String getResiduoNombre() {
        return residuoNombre;
    }

    public void setResiduoNombre(String residuoNombre) {
        this.residuoNombre = residuoNombre;
    }

    public Double getKilosRecolectados() {
        return kilosRecolectados;
    }

    public void setKilosRecolectados(Double kilosRecolectados) {
        this.kilosRecolectados = kilosRecolectados;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}

package com.ebentos.backend.dto;

public class MetaActualizarDTO {
    private Integer metaIngresos;
    private Double tasaConversion;
    private Integer ticketsObjetivo;

    // Getters y Setters
    public Integer getMetaIngresos() {
        return metaIngresos;
    }

    public void setMetaIngresos(Integer metaIngresos) {
        this.metaIngresos = metaIngresos;
    }

    public Double getTasaConversion() {
        return tasaConversion;
    }

    public void setTasaConversion(Double tasaConversion) {
        this.tasaConversion = tasaConversion;
    }

    public Integer getTicketsObjetivo() {
        return ticketsObjetivo;
    }

    public void setTicketsObjetivo(Integer ticketsObjetivo) {
        this.ticketsObjetivo = ticketsObjetivo;
    }
}
package com.ebentos.backend.dto;

public class EventoDisponibleDTO {
    private Integer eventoId;
    private String nombre;

    // Getters y Setters
    public Integer getEventoId() {
        return eventoId;
    }

    public void setEventoId(Integer eventoId) {
        this.eventoId = eventoId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
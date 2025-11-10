package com.ebentos.backend.dto;

import java.time.LocalDateTime;

public class MetaDetalleDTO {
    private Integer metaId;
    private Integer eventoId;
    private Integer metaIngresos;
    private Double tasaConversion;
    private Integer ticketsObjetivo;
    private Integer activo;
    private String nombreEvento;
    private LocalDateTime fechaHorarioInicio;
    private Integer entradasVendidas;
    private Integer montoTotalRecaudado;
    private Integer visitas;

    // Getters y Setters
    public Integer getMetaId() {
        return metaId;
    }

    public void setMetaId(Integer metaId) {
        this.metaId = metaId;
    }

    public Integer getEventoId() {
        return eventoId;
    }

    public void setEventoId(Integer eventoId) {
        this.eventoId = eventoId;
    }

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

    public Integer getActivo() {
        return activo;
    }

    public void setActivo(Integer activo) {
        this.activo = activo;
    }

    public String getNombreEvento() {
        return nombreEvento;
    }

    public void setNombreEvento(String nombreEvento) {
        this.nombreEvento = nombreEvento;
    }

    public LocalDateTime getFechaHorarioInicio() {
        return fechaHorarioInicio;
    }

    public void setFechaHorarioInicio(LocalDateTime fechaHorarioInicio) {
        this.fechaHorarioInicio = fechaHorarioInicio;
    }

    public Integer getEntradasVendidas() {
        return entradasVendidas;
    }

    public void setEntradasVendidas(Integer entradasVendidas) {
        this.entradasVendidas = entradasVendidas;
    }

    public Integer getMontoTotalRecaudado() {
        return montoTotalRecaudado;
    }

    public void setMontoTotalRecaudado(Integer montoTotalRecaudado) {
        this.montoTotalRecaudado = montoTotalRecaudado;
    }

    public Integer getVisitas() {
        return visitas;
    }

    public void setVisitas(Integer visitas) {
        this.visitas = visitas;
    }
}
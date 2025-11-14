package com.ebentos.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class EventoClienteDetalleDTO {

    private String posterHorizontal;
    private String posterVertical;
    private String tipoLocal;
    private String nombreLocal;
    private String direccionLocal;
    private String departamento;
    private LocalDateTime fecha;
    private String descripcion;
    private List<ZonaEventoDTO> zonas;

    public EventoClienteDetalleDTO() {}

    public String getPosterHorizontal() {
        return posterHorizontal;
    }

    public void setPosterHorizontal(String posterHorizontal) {
        this.posterHorizontal = posterHorizontal;
    }

    public String getPosterVertical() {
        return posterVertical;
    }

    public void setPosterVertical(String posterVertical) {
        this.posterVertical = posterVertical;
    }

    public String getTipoLocal() {
        return tipoLocal;
    }

    public void setTipoLocal(String tipoLocal) {
        this.tipoLocal = tipoLocal;
    }

    public String getNombreLocal() {
        return nombreLocal;
    }

    public void setNombreLocal(String nombreLocal) {
        this.nombreLocal = nombreLocal;
    }

    public String getDireccionLocal() {
        return direccionLocal;
    }

    public void setDireccionLocal(String direccionLocal) {
        this.direccionLocal = direccionLocal;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<ZonaEventoDTO> getZonas() {
        return zonas;
    }

    public void setZonas(List<ZonaEventoDTO> zonas) {
        this.zonas = zonas;
    }
}

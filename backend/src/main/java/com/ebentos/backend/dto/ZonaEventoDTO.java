package com.ebentos.backend.dto;

public class ZonaEventoDTO {

    private Integer zonaId;
    private Integer cantidadEntradasDisponible;
    private Double precioUnitario;
    private String tipoZona;
    private String letraZona;

    public ZonaEventoDTO() {}

    public ZonaEventoDTO(Integer zonaId, Integer cantidadEntradasDisponible, Double precioUnitario, String tipoZona) {
        this(zonaId, cantidadEntradasDisponible, precioUnitario, tipoZona, null);
    }

    public ZonaEventoDTO(Integer zonaId, Integer cantidadEntradasDisponible, Double precioUnitario, String tipoZona, String letraZona) {
        this.zonaId = zonaId;
        this.cantidadEntradasDisponible = cantidadEntradasDisponible;
        this.precioUnitario = precioUnitario;
        this.tipoZona = tipoZona;
        this.letraZona = letraZona;
    }

    public Integer getCantidadEntradasDisponible() {
        return cantidadEntradasDisponible;
    }

    public void setCantidadEntradasDisponible(Integer cantidadEntradasDisponible) {
        this.cantidadEntradasDisponible = cantidadEntradasDisponible;
    }

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public String getTipoZona() {
        return tipoZona;
    }

    public void setTipoZona(String tipoZona) {
        this.tipoZona = tipoZona;
    }

    public String getLetraZona() {
        return letraZona;
    }

    public void setLetraZona(String letraZona) {
        this.letraZona = letraZona;
    }
    
    public Integer getZonaId() {
        return zonaId;
    }

    public void setZonaId(Integer zonaId) {
        this.zonaId = zonaId;
    }
}

package com.ebentos.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "META")
public class Meta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "META_ID")
    private Integer metaId;

    @ManyToOne
    @JoinColumn(name = "EVENTO_ID", nullable = false)
    private Evento evento;

    @ManyToOne
    @JoinColumn(name = "PRODUCTORA_ID", nullable = false)
    private Productora productora;

    @Column(name = "META_INGRESOS", nullable = false)
    private Integer metaIngresos;

    @Column(name = "TASA_CONVERSION", nullable = false)
    private Double tasaConversion;

    @Column(name = "TICKETS_OBJETIVO", nullable = false)
    private Integer ticketsObjetivo;

    @Column(name = "ACTIVO", nullable = false, columnDefinition = "TINYINT")
    private Integer activo;

    public Integer getMetaId() {
        return metaId;
    }

    public void setMetaId(Integer metaId) {
        this.metaId = metaId;
    }

    public Evento getEvento() {
        return evento;
    }

    public void setEvento(Evento evento) {
        this.evento = evento;
    }

    public Productora getProductora() {
        return productora;
    }

    public void setProductora(Productora productora) {
        this.productora = productora;
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
}
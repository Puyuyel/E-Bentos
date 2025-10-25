package com.ebentos.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Distrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DISTRITO_ID")
    private Integer distritoId;
    
    @Column(name = "NOMBRE", nullable = false, length = 45)
    private String nombre;
    
    @ManyToOne
    @JoinColumn(name = "PROVINCIA_ID", nullable = false)
    private Provincia provincia;

    public Distrito(Integer distritoId, String nombre, Provincia provincia) {
        this.distritoId = distritoId;
        this.nombre = nombre;
        this.provincia = provincia;
    }
    
    public Distrito(){
        
    }

    public Integer getDistritoId() {
        return distritoId;
    }

    public void setDistritoId(Integer distritoId) {
        this.distritoId = distritoId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Provincia getProvincia() {
        return provincia;
    }

    public void setProvincia(Provincia provincia) {
        this.provincia = provincia;
    }
    
}

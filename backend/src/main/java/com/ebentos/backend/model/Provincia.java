package com.ebentos.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Provincia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROVINCIA_ID")
    private Integer provinciaId;
    
    @Column(name = "NOMBRE", nullable = false, length = 45)
    private String nombre;
    
    @ManyToOne
    @JoinColumn(name = "DEPARTAMENTO_ID", nullable = false)
    private Departamento departamento;

    public Provincia(Integer provinciaId, String nombre, Departamento departamento) {
        this.provinciaId = provinciaId;
        this.nombre = nombre;
        this.departamento = departamento;
    }
    
    public Provincia(){
        
    }

    public Integer getProvinciaId() {
        return provinciaId;
    }

    public void setProvinciaId(Integer provinciaId) {
        this.provinciaId = provinciaId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Departamento getDepartamento() {
        return departamento;
    }

    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
    }
    
    
}

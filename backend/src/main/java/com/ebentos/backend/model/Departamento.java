package com.ebentos.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Departamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    @Column(name = "DEPARTAMENTO_ID")
    private Integer departamentoId;
    
    @Column(name = "NOMBRE", nullable = false, length = 45)
    private String nombre;

    public Departamento(Integer departamentoId, String nombre) {
        this.departamentoId = departamentoId;
        this.nombre = nombre;
    }
    
    public Departamento(){
        
    }

    public Integer getDepartamentoId() {
        return departamentoId;
    }

    public void setDepartamentoId(Integer departamentoId) {
        this.departamentoId = departamentoId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    
}

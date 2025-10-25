package com.ebentos.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "PUNTOVENTA")
@SQLDelete(sql = "UPDATE puntoventa SET activo = 0 WHERE puntoventa_id = ?")
@Where(clause = "activo = 1")
public class PuntoVenta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PUNTOVENTA_ID")
    private Integer puntoventaId;
    
    @Column(name = "NOMBRE", nullable = false, length = 45)
    private String nombre;
    
    @Column(name = "DIRECCION", nullable = false, length = 45)
    private String direccion;
    
    @ManyToOne
    @JoinColumn(name = "DISTRITO_ID", nullable = false)
    private Distrito distrito;
    
    @Column(name = "ACTIVO", nullable = false)
    private boolean activo = true;

    public PuntoVenta(Integer puntoventaId, String nombre, String direccion, Distrito distrito) {
        this.puntoventaId = puntoventaId;
        this.nombre = nombre;
        this.direccion = direccion;
        this.distrito = distrito;
    }

    public PuntoVenta(){
        
    }

    public Integer getPuntoventaId() {
        return puntoventaId;
    }

    public void setPuntoventaId(Integer puntoventaId) {
        this.puntoventaId = puntoventaId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Distrito getDistrito() {
        return distrito;
    }

    public void setDistrito(Distrito distrito) {
        this.distrito = distrito;
    }
    
    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
    
    
}

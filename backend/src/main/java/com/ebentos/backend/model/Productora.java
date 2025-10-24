package com.ebentos.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;


@Entity
@SQLDelete(sql = "UPDATE productora SET activo = false WHERE id_productora = ?")
@Where(clause = "activo = 1")
public class Productora {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productoraId;
    
    private String ruc;
    private String razonSocial;
    private String nombreLegal;
    private String email;
    private String contrasenha;
    private String telefono;
    private LocalDate fechaFundacion;
    private boolean activo;

    public Productora(Integer productoraId, String ruc, String razonSocial,
            String nombreLegal, String email, String contrasenha, 
            String telefono, LocalDate fechaFundacion, boolean activo) {
        this.productoraId = productoraId;
        this.ruc = ruc;
        this.razonSocial = razonSocial;
        this.nombreLegal = nombreLegal;
        this.email = email;
        this.contrasenha = contrasenha;
        this.telefono = telefono;
        this.fechaFundacion = fechaFundacion;
        this.activo = true;
    }

    public Productora() {
        
    }

    public Integer getProductoraId() {
        return productoraId;
    }

    public void setProductoraId(Integer productoraId) {
        this.productoraId = productoraId;
    }

    public String getRuc() {
        return ruc;
    }

    public void setRuc(String ruc) {
        this.ruc = ruc;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public String getNombreLegal() {
        return nombreLegal;
    }

    public void setNombreLegal(String nombreLegal) {
        this.nombreLegal = nombreLegal;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasenha() {
        return contrasenha;
    }

    public void setContrasenha(String contrasenha) {
        this.contrasenha = contrasenha;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public LocalDate getFechaFundacion() {
        return fechaFundacion;
    }

    public void setFechaFundacion(LocalDate fechaFundacion) {
        this.fechaFundacion = fechaFundacion;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
    
}

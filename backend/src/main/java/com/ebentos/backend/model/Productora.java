package com.ebentos.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import java.time.LocalDate;

@Entity
@PrimaryKeyJoinColumn(name = "USUARIO_ID")
public class Productora extends Usuario{
    
    private String ruc;
    private String razonSocial;
    private String nombreLegal;
    private LocalDate fechaFundacion;

    public Productora(String ruc, String razonSocial, String nombreLegal, LocalDate fechaFundacion, Integer usuarioId, String telefono, String email, String contrasenha, Rol rol) {
        super(usuarioId, telefono, email, contrasenha, rol);
        this.ruc = ruc;
        this.razonSocial = razonSocial;
        this.nombreLegal = nombreLegal;
        this.fechaFundacion = fechaFundacion;
    }
    
    public Productora(){
        super();
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

    public LocalDate getFechaFundacion() {
        return fechaFundacion;
    }

    public void setFechaFundacion(LocalDate fechaFundacion) {
        this.fechaFundacion = fechaFundacion;
    }
    
}

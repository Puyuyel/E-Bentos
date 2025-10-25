package com.ebentos.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@PrimaryKeyJoinColumn(name = "USUARIO_ID")
@SQLDelete(sql = "UPDATE usuario SET activo = 0 WHERE usuario_id = ?")
@Where(clause = "activo = 1")
public class Productora extends Usuario{
    
    private String ruc;
    private String razonSocial;
    private String nombreComercial;

    public Productora(String ruc, String razonSocial, String nombreComercial, Integer usuarioId, String telefono, String email, String contrasenha, Rol rol) {
        super(usuarioId, telefono, email, contrasenha, rol);
        this.ruc = ruc;
        this.razonSocial = razonSocial;
        this.nombreComercial = nombreComercial;
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
        return nombreComercial;
    }

    public void setNombreLegal(String nombreComercial) {
        this.nombreComercial = nombreComercial;
    }    
}

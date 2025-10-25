package com.ebentos.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@PrimaryKeyJoinColumn(name = "USUARIO_ID")
@SQLDelete(sql = "UPDATE usuario SET activo = 0 WHERE usuario_id = ?")
@Where(clause = "activo = 1")
public class Productora extends Usuario{
    
    @Column(name = "RUC", nullable = false, unique = true, length = 11)
    private String ruc;
    
    @Column(name = "RAZON_SOCIAL", nullable = false, length = 60)
    private String razonSocial;
    
    @Column(name = "NOMBRE_COMERCIAL", nullable = false, length = 60)
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

    public String getNombreComercial() {
        return nombreComercial;
    }

    public void setNombreComercial(String nombreComercial) {
        this.nombreComercial = nombreComercial;
    }    
}

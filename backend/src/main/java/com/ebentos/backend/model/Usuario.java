package com.ebentos.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@SQLDelete(sql = "UPDATE usuario SET activo = 0 WHERE usuario_id = ?")
@Where(clause = "activo = 1")
@Inheritance(strategy = InheritanceType.JOINED)
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USUARIO_ID")
    private Integer usuarioId;
    
    @Column(name = "TELEFONO", nullable = false, length = 9)
    private String telefono;
    
    @Column(name = "EMAIL", nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "CONTRASENHA", nullable = false, length = 100)
    private String contrasenha;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ROL", nullable = false)
    private Rol rol;
    
    @Column(name = "ACTIVO", nullable = false)
    private boolean activo = true;
    
    public Usuario(Integer usuarioId, String telefono, String email, String contrasenha, Rol rol) {
        this.usuarioId = usuarioId;
        this.telefono = telefono;
        this.email = email;
        this.contrasenha = contrasenha;
        this.rol = rol;
    }
    
    public Usuario(){
        
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
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

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    

}

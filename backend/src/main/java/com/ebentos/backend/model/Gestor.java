package com.ebentos.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import java.time.LocalDate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@PrimaryKeyJoinColumn(name = "USUARIO_ID")
@SQLDelete(sql = "UPDATE usuario SET activo = false WHERE usuario_id = ?")
@Where(clause = "activo = 1")
public class Gestor extends Usuario {
    
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    @Enumerated(EnumType.STRING)
    private Genero genero;
    @ManyToOne
    @JoinColumn(name = "USUARIO_CREADOR_ID", nullable = true)
    private Usuario usuarioCreador;
    @ManyToOne
    @JoinColumn(name = "PUNTOVENTA_ID", nullable = true)
    private PuntoVenta puntoventa;

    public Gestor(String nombres, String apellidos, String dni, LocalDate fechaNacimiento, Genero genero, Usuario usuarioCreador, PuntoVenta puntoventa, Integer usuarioId, String telefono, String email, String contrasenha, Rol rol) {
        super(usuarioId, telefono, email, contrasenha, rol);
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
        this.genero = genero;
        this.usuarioCreador = usuarioCreador;
        this.puntoventa = puntoventa;
    }

    public Gestor() {
        super();
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public Genero getGenero() {
        return genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public Usuario getUsuarioCreador() {
        return usuarioCreador;
    }

    public void setUsuarioCreador(Usuario usuarioCreador) {
        this.usuarioCreador = usuarioCreador;
    }

    public PuntoVenta getPuntoventa() {
        return puntoventa;
    }

    public void setPuntoventa(PuntoVenta puntoventa) {
        this.puntoventa = puntoventa;
    }
    
}

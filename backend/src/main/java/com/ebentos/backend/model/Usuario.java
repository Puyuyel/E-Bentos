package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@SQLDelete(sql = "UPDATE usuario SET activo = 0 WHERE usuario_id = ?")
@Where(clause = "activo = 1")
@Table(name = "USUARIO")
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

    @ManyToOne
    @JoinColumn(name = "ROL_ID")
    private Rol rol;

    @Column(name = "ACTIVO", nullable = false, columnDefinition = "TINYINT")
    private Integer activo;

    @Column(name = "CODIGO_RESETEO", nullable = true, length = 6)
    private String codigoReseteo;

    @Column(name = "EXPIRACION_CODIGO", nullable = true)
    private LocalDateTime expiracionCodigo;

    //Constructores
    public Usuario(Integer usuarioId, String telefono, String email, String contrasenha, Rol rol) {
        this.usuarioId = usuarioId;
        this.telefono = telefono;
        this.email = email;
        this.contrasenha = contrasenha;
        this.rol = rol;
    }

    public Usuario() {

    }
}

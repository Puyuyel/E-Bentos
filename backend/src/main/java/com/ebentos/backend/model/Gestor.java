package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@SQLDelete(sql = "UPDATE USUARIO SET ACTIVO = 0 WHERE USUARIO_ID = ?")
@Where(clause = "ACTIVO = 1")
@Entity
@Table(name = "GESTOR")
public class Gestor extends Usuario {
    @Column(name = "DNI", nullable = false, unique = true, length = 8)
    private String dni;

    @Column(name = "NOMBRES", nullable = false, length = 100)
    private String nombres;

    @Column(name = "APELLIDOS", nullable = false, length = 100)
    private String apellidos;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USUARIO_CREADOR_ID", nullable = true)
    private Usuario usuarioCreador;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PUNTOVENTA_ID", nullable = true)
    private PuntoVenta puntoVenta;
    
}

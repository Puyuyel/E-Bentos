package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@SQLDelete(sql = "UPDATE LOCAL SET ACTIVO = 0 WHERE LOCAL_ID = ?")
@Where(clause = "ACTIVO = 1")
@Entity
@Table(name = "LOCAL")
public class Local {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOCAL_ID")
    private Integer localId;

    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DISTRITO_ID", nullable = false)
    private Distrito distrito;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GESTOR_USUARIO_ID", nullable = false)
    private Gestor gestor;

    // Campos normales
    @Column(name = "NOMBRE", length = 100, nullable = false)
    private String nombre;

    @Column(name = "DIRECCION", length = 170, nullable = false)
    private String direccion;

    @Column(name = "FOTO", length = 30, nullable = false)
    private String foto;

    @Column(name = "AFORO", nullable = false)
    private Integer aforo;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_LOCAL", nullable = false)
    private TipoLocal tipoLocal;

    @Column(name = "ACTIVO", nullable = false, columnDefinition = "TINYINT")
    private Integer activo;
}

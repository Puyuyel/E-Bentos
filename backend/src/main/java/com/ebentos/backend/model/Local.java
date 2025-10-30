package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Where(clause = "estado IN ('ACTIVO', 'PENDIENTE')")
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

    @Column(name = "DNI_PROPIETARIO", length = 8, nullable = false)
    private String dniPropietario;

    @Column(name = "NOMBRE_COMPLETO_PROPIETARIO", length = 100, nullable = false)
    private String nombreCompletoPropietario;

    @Column(name = "DNI_RESPONSABLE", length = 8, nullable = false)
    private String dniResponsable;

    @Column(name = "NOMBRE_COMPLETO_RESPONSABLE", length = 100, nullable = false)
    private String nombreCompletoResponsable;

    @Column(name = "TELEFONO_CONTACTO1", length = 9, nullable = false)
    private String telefonoContacto1;

    @Column(name = "TELEFONO_CONTACTO2", length = 9)
    private String telefonoContacto2;

    @Column(name = "CORREO_CONTACTO", length = 45, nullable = false)
    private String correoContacto;

    @Column(name = "AFORO", nullable = false)
    private Integer aforo;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_LOCAL", nullable = false)
    private TipoLocal tipoLocal;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false)
    private EstadoLocal estado;
}

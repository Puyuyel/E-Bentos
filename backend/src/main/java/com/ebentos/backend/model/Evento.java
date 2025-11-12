package com.ebentos.backend.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@SQLDelete(sql = "UPDATE EVENTO SET ESTADO = 'CANCELADO' WHERE EVENTO_ID = ?")
@Where(clause = "ESTADO IN ('PENDIENTE', 'ACTIVO', 'SOLICITUD_RECHAZADA')")
@Table(name = "EVENTO")
public class Evento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EVENTO_ID")
    private Integer eventoId;
    
    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LOCAL_ID", nullable = false)
    private Local local;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GESTOR_USUARIO_ID", nullable = false)
    private Gestor gestor;

    @ManyToOne
    @JoinColumn(name = "CATEGORIA_EVENTO_ID", nullable = false)
    private CategoriaEvento categoriaEvento;

    // Campos normales
    @Column(name = "NOMBRE", length = 100, nullable = false)
    private String nombre;

    @Column(name = "DESCRIPCION", length = 350, nullable = false)
    private String descripcion;

    @Column(name = "POSTER_HORIZONTAL", length = 100, nullable = false)
    private String posterHorizontal;
    
    @Column(name = "POSTER_VERTICAL", length = 100, nullable = false)
    private String posterVertical;

    @Column(name = "FECHA_HORARIO_INICIO", nullable = false)
    private LocalDateTime fechaHorarioInicio;

    @Column(name = "DURACION_ESTIMADA", nullable = false)
    private Integer duracionEstimada; // En horas

    @Column(name = "COSTO_TOTAL", nullable = false)
    private Double costoTotal;

    @Column(name = "VISITAS", nullable = false)
    private Integer visitas;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false)
    private EstadoEvento estado;
    
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    private List<Zona> zonas = new ArrayList<>();
}

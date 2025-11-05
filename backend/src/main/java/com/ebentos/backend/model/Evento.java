package com.ebentos.backend.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
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

    @Column(name = "POSTER", length = 30, nullable = false)
    private String poster;

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
}

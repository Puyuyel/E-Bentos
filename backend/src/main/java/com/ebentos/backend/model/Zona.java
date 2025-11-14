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
@SQLDelete(sql = "UPDATE ZONA SET ACTIVO = 0 WHERE ZONA_ID = ?")
@Where(clause = "ACTIVO = 1")
@Entity
@Table(name = "ZONA")
public class Zona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ZONA_ID")
    private Integer zonaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LOCAL_ID", nullable = false)
    private Local local;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EVENTO_ID", nullable = false)
    private Evento evento;

    // Campos normales
    @Column(name = "CAPACIDAD_TOTAL", nullable = false)
    private Integer capacidadTotal;

    @Column(name = "TIPO_ZONA", length = 30, nullable = false)
    private String tipoZona;

    @Column(name = "LETRA_ZONA", length = 1, nullable = false)
    private String letraZona;

    @Column(name = "CANTIDAD_ENTRADAS_DISPONIBLES", nullable = false)
    private Integer cantidadEntradasDisponibles;
    
    @Column(name = "PRECIO_UNITARIO", nullable = false)
    private Double precioUnitario;
    
    @Column(name = "MONTO_TOTAL_RECAUDADO", nullable = false)
    private Double montoTotalRecaudado;

    @Column(name = "ACTIVO", nullable = false, columnDefinition = "TINYINT")
    private Integer activo;
}

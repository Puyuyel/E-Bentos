package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "DESCUENTO")
public class Descuento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DESCUENTO_ID")
    private Integer descuentoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GESTOR_USUARIO_ID", nullable = true)
    private Gestor gestor;

    @Column(name = "NOMBRE", length = 70, nullable = false)
    private String nombre;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_DESCUENTO",  nullable = false)
    private TipoDescuento tipoDescuento;

    @Column(name = "VALOR_PORCENTAJE",  nullable = false)
    private Integer valorPorcentaje;

    @Column(name = "FECHA_HORA_INICIO", nullable = false)
    private LocalDateTime fechaHorarioInicio;

    @Column(name = "FECHA_HORA_FIN", nullable = false)
    private LocalDateTime fechaHorarioFin;

    @Column(name = "COSTO_PUNTOS",  nullable = true)
    private Integer costoPuntos;

}

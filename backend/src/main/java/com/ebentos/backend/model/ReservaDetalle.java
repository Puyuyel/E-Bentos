package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "RESERVA_DETALLE")
public class ReservaDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESERVA_DETALLE_ID")
    private Integer reservaDetalleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RESERVA_ID", nullable = false)
    @ToString.Exclude
    private Reserva reserva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ZONA_ID", nullable = false)
    @ToString.Exclude
    private Zona zona;

    @Column(name = "CANTIDAD", nullable = false)
    private int cantidad;

}

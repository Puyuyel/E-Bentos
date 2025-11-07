package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "SOLICITUD")
public class Solicitud {

    @EmbeddedId
    private SolicitudId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("localId")
    @JoinColumn(name = "LOCAL_ID", nullable = false)
    private Local local;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("eventoId")
    @JoinColumn(name = "EVENTO_ID", nullable = false)
    private Evento evento;

    @Column(name = "JUSTIFICACION", length = 200, nullable = true)
    private String justificacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false)
    private EstadoSolicitud estado;
}

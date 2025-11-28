package com.ebentos.backend.dto;

import com.ebentos.backend.model.EstadoSolicitud;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudInfoDTO {

    private Integer localId;
    private Integer eventoId;
    private String nombreEvento;
    private String nombreLocal;
    private LocalDateTime fechaInicio;
    private String nombreGestor;
    private String descripcionEvento;
    private EstadoSolicitud estado;

}

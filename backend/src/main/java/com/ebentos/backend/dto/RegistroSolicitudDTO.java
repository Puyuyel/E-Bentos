package com.ebentos.backend.dto;

import com.ebentos.backend.model.EstadoSolicitud;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RegistroSolicitudDTO {

    private Integer localId;
    private Integer eventoId;
    private EstadoSolicitud estado;

}

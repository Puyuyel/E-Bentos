package com.ebentos.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudReservaDTO {

    private Integer clienteId;
    private List<DetalleZonaDTO> zonas;

}

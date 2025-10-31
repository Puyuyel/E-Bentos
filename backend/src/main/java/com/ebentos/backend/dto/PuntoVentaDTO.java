package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PuntoVentaDTO {
    private Integer puntoVentaId;
    private String nombre;
    private String direccion;
}

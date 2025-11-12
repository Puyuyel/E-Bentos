package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ZonaDTO {
    private Integer zonaId;
    private Integer capacidadTotal;
    private String tipoZona;
    private String letraZona;
    private Double precioUnitario;
}

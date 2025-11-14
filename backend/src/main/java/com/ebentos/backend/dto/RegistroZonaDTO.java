package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RegistroZonaDTO {
    private Integer capacidadTotal;
    private String tipoZona;
    private String letraZona;
    private Double precioUnitario;
}

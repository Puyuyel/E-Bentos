package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RegistroEntradaDTO {

    private Integer entradaId;
    private Integer ventaId;
    private Integer zonaId;
    private Double precioOriginal;
    private Double descuento;
    private Double precioFinal;
    private String qR;

    private String correo;

}

package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DescuentoUnicoDTO {
    
    private Integer descuentoUnicoId;
    private String nombre;          
    private Integer valorPorcentaje;
    private Integer costoPuntos;
    private String codigoDescuento; 
    
}

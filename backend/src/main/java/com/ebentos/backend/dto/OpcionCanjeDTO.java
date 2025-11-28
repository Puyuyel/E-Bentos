package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OpcionCanjeDTO {
    
    private Integer descuentoId;        
    private String nombre;              
    private Integer valorPorcentaje;    
    private Integer costoPuntos;  
    
}

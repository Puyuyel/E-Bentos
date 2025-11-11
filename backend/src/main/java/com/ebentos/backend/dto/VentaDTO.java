package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class VentaDTO {
    
    private Integer ventaId;
    private EventoSimpleDTO evento;
    private Integer puntosGanados;
    private LocalSimpleParaVentasDTO local;
    private Double montoTotalFinal;
    
}

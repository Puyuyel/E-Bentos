package com.ebentos.backend.dto;

import java.util.List;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class VentaConEntradasDTO {
    
    private Integer ventaId;
    private EventoSimpleDTO evento;
    private Integer puntosGanados;
    private LocalSimpleParaVentasDTO local;
    private Double montoTotalFinal;
    private List<EntradaDTO> entradas;
    
}

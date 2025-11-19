package com.ebentos.backend.dto;

import com.ebentos.backend.model.MetodoPago;
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
    private MetodoPago metodoDepago;
    private List<EntradaDTO> entradas;
    
}

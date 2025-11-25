package com.ebentos.backend.dto;

import com.ebentos.backend.model.MetodoPago;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RegistroVentaDTO {

    private Integer eventoId;
    private Integer gestorId;
    private Integer clienteId;
    private Double montoTotalOriginal;
    private Double descuentoTotal;
    private Double montoTotalFinal;
    private Integer registradoPorTaquillero;
    private MetodoPago metodoPago;
    private List<RegistroEntradaDTO> entradas = new ArrayList<>();

}

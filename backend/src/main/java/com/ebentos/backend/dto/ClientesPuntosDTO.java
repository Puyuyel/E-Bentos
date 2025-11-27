package com.ebentos.backend.dto;

import java.util.List;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ClientesPuntosDTO {
    
    private Integer puntosActuales;

    private List<DescuentoUnicoDTO> descuentosActivos;

    private List<OpcionCanjeDTO> opcionesCanje;
    
}

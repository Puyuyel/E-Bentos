package com.ebentos.backend.dto;

import com.ebentos.backend.model.PuntoVenta;
import lombok.*;
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class GestorActualizaDTO {
    private String telefono;
    private String email;
    private String contrasenha;
    private Integer activo;
    private String nombres;
    private String apellidos;
    private PuntoVentaSimpleDTO puntoVenta;
}

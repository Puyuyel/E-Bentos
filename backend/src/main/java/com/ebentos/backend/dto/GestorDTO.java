package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class GestorDTO {
    private Integer usuarioId;
    private String telefono;
    private String email;
    private String dni;
    private String nombres;
    private String apellidos;
    private UsuarioSimpleDTO usuarioCreador;
    private PuntoVentaDTO puntoVenta;
}

package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ProductoraActualizaDTO {

    private UsuarioActualizaDTO usuario;
    private String ruc;
    private String razonSocial;
    private String nombreComercial;

}

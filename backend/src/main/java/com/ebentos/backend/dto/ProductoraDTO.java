package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ProductoraDTO {

    private UsuarioSimpleDTO usuario;
    private String ruc;
    private String razonSocial;
    private String nombreComercial;

}

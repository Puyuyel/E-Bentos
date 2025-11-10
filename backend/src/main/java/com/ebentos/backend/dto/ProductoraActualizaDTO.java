package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ProductoraActualizaDTO {

    private String telefono;
    private String email;
    private Integer activo;
    private String contrasenha;
    private String razonSocial;
    private String nombreComercial;

}

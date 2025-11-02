package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioActualizaDTO {

    private String telefono;
    private String email;
    private String contrasenha;
    private Integer activo;

}

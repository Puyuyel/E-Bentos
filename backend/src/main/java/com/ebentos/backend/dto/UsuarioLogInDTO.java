package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UsuarioLogInDTO {

    private Integer usuarioId;
    private String email;
    private String nombreRol;

}

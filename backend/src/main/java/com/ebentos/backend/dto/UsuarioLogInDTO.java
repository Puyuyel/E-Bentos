package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class UsuarioLogInDTO {

    private String email;
    private String nombreRol;

    public UsuarioLogInDTO(String email, String nombreRol) {
        this.email = email;
        this.nombreRol = nombreRol;
    }

}

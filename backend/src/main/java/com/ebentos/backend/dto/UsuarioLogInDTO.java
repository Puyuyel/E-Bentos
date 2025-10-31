package com.ebentos.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UsuarioLogInDTO {

    private String email;
    private String nombreRol;

    public UsuarioLogInDTO(String email, List<String> roles) {
        this.email = email;
        this.nombreRol = roles.get(0);
    }

}

package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSimpleDTO {

    private Integer id;
    private String telefono;
    private String email;

}

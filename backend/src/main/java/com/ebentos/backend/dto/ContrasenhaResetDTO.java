package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ContrasenhaResetDTO {

    private String email;
    private String codigo;
    private String nuevaContrasenha;

}

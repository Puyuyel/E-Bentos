package com.ebentos.backend.dto;

import com.ebentos.backend.model.Usuario;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistroProductoraDTO {

    private Usuario usuario;
    private String ruc;
    private String razonSocial;
    private String nombreComercial;

}

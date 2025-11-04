package com.ebentos.backend.dto;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistroProductoraDTO {

    private String telefono;
    private String email;
    private String contrasenha;
    private String ruc;
    private String razonSocial;
    private String nombreComercial;

}

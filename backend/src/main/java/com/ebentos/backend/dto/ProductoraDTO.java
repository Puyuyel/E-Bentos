package com.ebentos.backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ProductoraDTO {

    private Integer id;
    private String telefono;
    private String email;
    private String ruc;
    private String razonSocial;
    private String nombreComercial;

}

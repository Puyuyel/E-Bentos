package com.ebentos.backend.dto;

import com.ebentos.backend.model.TipoLocal;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class RegistroLocalDTO {
    private String nombre;
    private String direccion;
    private String foto;
    private Integer aforo;
    private TipoLocal tipoLocal;
    private GestorSimpleDTO gestor;
    private DistritoSimpleDTO distrito;
}

package com.ebentos.backend.dto;

import com.ebentos.backend.model.TipoLocal;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LocalDTO {

    private Integer localId;
    private String nombre;
    private String direccion;
    private String foto;
    private Integer aforo;
    private TipoLocal tipoLocal;
    private Integer activo;
    private GestorSimpleDTO gestor;
    private DistritoDTO distrito;
    
}

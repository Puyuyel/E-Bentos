package com.ebentos.backend.dto;

import com.ebentos.backend.model.Distrito;
import com.ebentos.backend.model.EstadoLocal;
import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.model.TipoLocal;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LocalActualizaDTO {
    private String nombre;
    private String direccion;
    private String foto;
    private Integer aforo;
    private TipoLocal tipoLocal;
    private Gestor gestor;
    private Distrito distrito;
}

package com.ebentos.backend.dto;

import com.ebentos.backend.model.EstadoLocal;
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
    private String dniPropietario;
    private String nombreCompletoPropietario;
    private String dniResponsable;
    private String nombreCompletoResponsable;
    private String telefonoContacto1;
    private String telefonoContacto2;
    private String correoContacto;
    private Integer aforo;
    private TipoLocal tipoLocal;
    private EstadoLocal estado;
    private GestorSimpleDTO gestor;
    private DistritoDTO distrito;
    
}

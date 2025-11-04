package com.ebentos.backend.dto;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistroGestorDTO {

    private String telefono;
    private String email;
    private String contrasenha;
    private String nombreRol;
    private String nombres;
    private String apellidos;
    private String dni;
    private UsuarioSimpleDTO usuarioCreador;
    private PuntoVentaSimpleDTO puntoVenta;
}

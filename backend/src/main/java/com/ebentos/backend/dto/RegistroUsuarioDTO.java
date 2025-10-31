package com.ebentos.backend.dto;


import com.ebentos.backend.model.Genero;
import com.ebentos.backend.model.PuntoVenta;
import com.ebentos.backend.model.Usuario;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistroUsuarioDTO {

    //Campos usuario base
    private String telefono;
    private String email;
    private String contrasenha;
    private String nombreRol;
    //Campos usuario cliente
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private Genero genero;
    //Puntos gastados, acumulados se colocan en 0
    //Campos usuario Productora
    private String ruc;
    private String razonSocial;
    private String nombreComercial;
    //Campos usuario gestor (gestor de local, taquillero, dueño del local, organizador de eventos)
    private Usuario usuarioCreador;
    private PuntoVenta puntoVenta;
}

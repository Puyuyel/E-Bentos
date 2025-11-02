package com.ebentos.backend.dto;

import com.ebentos.backend.model.Genero;
import com.ebentos.backend.model.Usuario;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistroClienteDTO {

    private Usuario usuario;
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private Genero genero;

}

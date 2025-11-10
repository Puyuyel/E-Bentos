package com.ebentos.backend.dto;

import com.ebentos.backend.model.Genero;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistroClienteDTO {

    private String telefono;
    private String email;
    private String contrasenha;
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private Genero genero;

}

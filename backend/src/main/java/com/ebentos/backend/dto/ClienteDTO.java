package com.ebentos.backend.dto;
import com.ebentos.backend.model.Genero;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ClienteDTO {
    
    private Integer usuarioId;
    private String telefono;
    private String email;
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private Genero genero;
    private Integer puntosAcumulados;
    private Integer puntosGastados;
}

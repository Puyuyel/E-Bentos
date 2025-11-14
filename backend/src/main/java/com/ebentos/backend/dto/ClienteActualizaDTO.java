package com.ebentos.backend.dto;
import com.ebentos.backend.model.Genero;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ClienteActualizaDTO {
    
    private String telefono;
    private String email;
    private String contrasenha;
    private Integer activo;
    private Genero genero;
    
}

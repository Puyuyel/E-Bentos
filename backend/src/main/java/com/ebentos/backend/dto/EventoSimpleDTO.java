package com.ebentos.backend.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EventoSimpleDTO {
    
    private Integer eventoId;
    private String nombre;
    private LocalDateTime fechaHorarioInicio;
}

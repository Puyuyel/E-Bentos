package com.ebentos.backend.dto;

import com.ebentos.backend.model.CategoriaEvento;
import com.ebentos.backend.model.EstadoEvento;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EventoListadoDTO {
    
    private Integer eventoId;
    private LocalAforoDTO local;
    private String nombre;
    private LocalDateTime fechaHorarioInicio;
    private Integer duracionEstimada; 
    private EstadoEvento estado;
}

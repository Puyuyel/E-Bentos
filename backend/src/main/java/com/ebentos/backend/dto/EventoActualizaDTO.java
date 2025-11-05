package com.ebentos.backend.dto;


import com.ebentos.backend.model.CategoriaEvento;
import com.ebentos.backend.model.EstadoEvento;
import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.model.Local;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EventoActualizaDTO {
    
    private Local local;
    private CategoriaEvento categoriaEvento;
    private String nombre;
    private String descripcion;
    private String poster;
    private LocalDateTime fechaHorarioInicio;
    private Integer duracionEstimada; // En horas
    private Double costoTotal;
    private Integer visitas;
    private EstadoEvento estado;
}

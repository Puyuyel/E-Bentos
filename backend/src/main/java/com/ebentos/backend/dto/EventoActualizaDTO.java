package com.ebentos.backend.dto;


import com.ebentos.backend.model.CategoriaEvento;
import com.ebentos.backend.model.EstadoEvento;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EventoActualizaDTO {
    
    private LocalSimpleDTO local;
    private CategoriaEvento categoriaEvento;
    private String nombre;
    private String descripcion;
    private String posterHorizontal;
    private String posterVertical;
    private LocalDateTime fechaHorarioInicio;
    private Integer duracionEstimada; // En horas
    private Double costoTotal;
    private EstadoEvento estado;
    private List<ZonaDTO> zonas;
}

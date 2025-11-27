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
public class EventoDTO {
    
    private Integer eventoId;
    private LocalAforoDTO local;
    private CategoriaEvento categoriaEvento;
    private String nombre;
    private String descripcion;
    private String posterHorizontal;
    private String posterVertical;
    private String imagenZonas;
    private LocalDateTime fechaHorarioInicio;
    private Integer duracionEstimada; 
    private Double costoTotal;
    private EstadoEvento estado;
    private List<ZonaDTO> zonas;
}

package com.ebentos.backend.dto;

import com.ebentos.backend.model.CategoriaEvento;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RegistroEventoDTO {
    
    private LocalSimpleDTO local;
    private GestorSimpleDTO gestor;
    private CategoriaEvento categoriaEvento;
    private String nombre;
    private String descripcion;
    private String posterHorizontal;
    private String posterVertical;
    private String imagenZonas;
    private LocalDateTime fechaHorarioInicio;
    private Integer duracionEstimada; // En horas
    private Double costoTotal;
    private List<RegistroZonaDTO> zonas;
}

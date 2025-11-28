package com.ebentos.backend.dto;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EventoClienteDTO {

    private Integer eventoId;
    private String nombreLocal;
    private String nombreCategoria;
    private String departamentoLocal;
    private String nombreEvento;
    private LocalDateTime fecha;
    private Double zonaDeMenorPrecio;
    private Double costoTotal;
    private Integer visitas;
    private String posterHorizontal;
    private String posterVertical;
    private String imagenZonas;
    private Double porcentajeVendido; // El % de entradas vendidas
    private Double popularidad;       // El cálculo final
    
    // Constructor para mapear desde la Proyección de la BD
    // Acepta Double para los valores numéricos porque el driver de MySQL
    // puede devolver Double para columnas FLOAT/DOUBLE y para expresiones aritméticas.
    // Constructor robusto para mapear desde la Proyección de la BD.
    // Acepta tipos flexibles (BigDecimal, Double, Timestamp, etc.) que pueden venir
    // desde el ResultSet de la consulta nativa y los convierte internamente.
    public EventoClienteDTO(
            Integer eventoId, String nombreLocal, String nombreCategoria,
            String departamentoLocal, String nombreEvento, Object fechaObj,
            Number zonaDeMenorPrecio, Number costoTotal, Integer visitas,
            String posterHorizontal, String posterVertical, Number porcentajeVendido) {
        this.eventoId = eventoId;
        this.nombreLocal = nombreLocal;
        this.nombreCategoria = nombreCategoria;
        this.departamentoLocal = departamentoLocal;
        this.nombreEvento = nombreEvento;

        // fecha puede venir como java.sql.Timestamp o java.time.LocalDateTime
        if (fechaObj instanceof Timestamp) {
            this.fecha = ((Timestamp) fechaObj).toLocalDateTime();
        } else if (fechaObj instanceof LocalDateTime) {
            this.fecha = (LocalDateTime) fechaObj;
        } else {
            this.fecha = null;
        }

        this.zonaDeMenorPrecio = (zonaDeMenorPrecio != null) ? zonaDeMenorPrecio.doubleValue() : 0.0;
        this.costoTotal = (costoTotal != null) ? costoTotal.doubleValue() : 0.0;
        this.visitas = visitas;
        this.posterHorizontal = posterHorizontal;
        this.posterVertical = posterVertical;
        this.porcentajeVendido = (porcentajeVendido != null) ? porcentajeVendido.doubleValue() : 0.0;
    }
}

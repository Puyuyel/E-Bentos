package com.ebentos.backend.dto;

import java.time.LocalDateTime;

public interface ReporteGeneralDTO {
    Integer getIdEvento();
    String getNombreEvento();
    String getCategoriaEvento();
    LocalDateTime getFechaEvento();
    Integer getIdLocal();
    String getNombreLocal();
    Integer getAforoLocal();
    Integer getIdProductora();
    String getNombreProductora();
    Double getMontoRecaudado();
    Long getAsistentes();
    Double getCostoTotalEvento();
    String getEstadoEvento();
    Integer getMetaIngresos();
    Integer getMetaTickets();
}

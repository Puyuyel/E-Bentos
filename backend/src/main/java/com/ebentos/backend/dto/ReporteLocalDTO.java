package com.ebentos.backend.dto;

import java.time.LocalDateTime;

public interface ReporteLocalDTO {
    Integer getIdEvento();
    String getCategoriaEvento();
    LocalDateTime getFechaEvento();
    Integer getIdLocal();
    String getNombreLocal();
    Integer getAforoLocal();
    Integer getIdProductora();
    String getNombreProductora();
    Double getMontoRecaudado();
    Long getAsistentes();
}

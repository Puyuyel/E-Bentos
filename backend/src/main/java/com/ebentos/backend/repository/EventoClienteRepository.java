package com.ebentos.backend.repository;

import java.util.List;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ebentos.backend.dto.EventoClienteDTO;
import com.ebentos.backend.model.Evento;

public interface EventoClienteRepository extends JpaRepository<Evento, Integer>{
    
    /**
     * Consulta para el endpoint de cliente.
     * Obtiene todos los datos requeridos en una sola consulta SQL nativa.
     * Filtro opcional por categoría de evento.
     */
    @Query(value = 
        "SELECT " +
            "e.EVENTO_ID AS eventoId, " +
            "l.NOMBRE AS nombreLocal, " +
            "ce.NOMBRE AS nombreCategoria, " +
            "d.NOMBRE AS departamentoLocal, " +
            "e.NOMBRE AS nombreEvento, " +
            "e.FECHA_HORARIO_INICIO AS fecha, " +
            "COALESCE((SELECT MIN(z.PRECIO_UNITARIO) FROM ZONA z WHERE z.EVENTO_ID = e.EVENTO_ID), 0) AS zonaDeMenorPrecio, " +
            "e.COSTO_TOTAL AS costoTotal, " +
            "e.VISITAS AS visitas, " +
            "e.POSTER_HORIZONTAL AS posterHorizontal, " +
            "e.POSTER_VERTICAL AS posterVertical, " +
            "COALESCE(" +
                "CASE " +
                    "WHEN SUM(z_agg.CAPACIDAD_TOTAL) > 0 THEN " +
                        "(SUM(z_agg.CAPACIDAD_TOTAL) - SUM(z_agg.CANTIDAD_ENTRADAS_DISPONIBLES)) / SUM(z_agg.CAPACIDAD_TOTAL) " +
                    "ELSE 0 " +
                "END, " +
            "0) AS porcentajeVendido " +
        "FROM EVENTO e " +
        "JOIN LOCAL l ON e.LOCAL_ID = l.LOCAL_ID " +
        "JOIN CATEGORIA_EVENTO ce ON e.CATEGORIA_EVENTO_ID = ce.CATEGORIA_EVENTO_ID " +
        "JOIN DISTRITO di ON l.DISTRITO_ID = di.DISTRITO_ID " +
        "JOIN PROVINCIA p ON di.PROVINCIA_ID = p.PROVINCIA_ID " +
        "JOIN DEPARTAMENTO d ON p.DEPARTAMENTO_ID = d.DEPARTAMENTO_ID " +
        "LEFT JOIN ZONA z_agg ON e.EVENTO_ID = z_agg.EVENTO_ID " +
        "WHERE " +
            // Filtro para no mostrar eventos pasados o cancelados
            "e.ESTADO IN ('ACTIVO') AND e.FECHA_HORARIO_INICIO > NOW() " +
            // Filtro opcional por categoría
            "AND (:categoriaId IS NULL OR e.CATEGORIA_EVENTO_ID = :categoriaId) " +
        "GROUP BY e.EVENTO_ID, l.NOMBRE, ce.NOMBRE, d.NOMBRE " + // Agrupamos para que los SUM() de ZONA funcionen
        "ORDER BY e.FECHA_HORARIO_INICIO ASC",
        nativeQuery = true)
    List<EventoClienteDTO> findEventosCliente(@Param("categoriaId") Integer categoriaId);

}

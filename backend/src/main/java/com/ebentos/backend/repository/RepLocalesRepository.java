package com.ebentos.backend.repository;

import java.util.List;
import com.ebentos.backend.model.Evento;
import com.ebentos.backend.dto.ReporteLocalDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RepLocalesRepository extends JpaRepository<Evento, Integer> {
    @Query(value = """
        SELECT 
            e.EVENTO_ID AS idEvento,
            ce.NOMBRE AS categoriaEvento,
            e.FECHA_HORARIO_INICIO AS fechaEvento,
            l.LOCAL_ID AS idLocal,
            l.NOMBRE AS nombreLocal,
            l.AFORO AS aforoLocal,
            p.USUARIO_ID AS idProductora,
            p.NOMBRE_COMERCIAL AS nombreProductora,
            IFNULL(SUM(v.MONTO_TOTAL_FINAL), 0) AS montoRecaudado,
            COUNT(v.VENTA_ID) AS asistentes
        FROM EVENTO e
        INNER JOIN LOCAL l ON e.LOCAL_ID = l.LOCAL_ID
        INNER JOIN CATEGORIA_EVENTO ce ON e.CATEGORIA_EVENTO_ID = ce.CATEGORIA_EVENTO_ID
        INNER JOIN GESTOR g ON e.GESTOR_USUARIO_ID = g.USUARIO_ID
        INNER JOIN PRODUCTORA p ON g.USUARIO_CREADOR_ID = p.USUARIO_ID
        LEFT JOIN VENTA v ON e.EVENTO_ID = v.EVENTO_ID
        GROUP BY e.EVENTO_ID, ce.NOMBRE, e.FECHA_HORARIO_INICIO, 
                 l.LOCAL_ID, l.NOMBRE, l.AFORO, 
                 p.USUARIO_ID, p.NOMBRE_COMERCIAL
        ORDER BY e.FECHA_HORARIO_INICIO DESC
        """, nativeQuery = true)
    List<ReporteLocalDTO> obtenerReporteLocales();
}

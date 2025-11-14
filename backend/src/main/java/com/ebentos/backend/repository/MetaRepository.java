package com.ebentos.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ebentos.backend.model.Meta;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Integer> {
    
    @Query(value = "SELECT " +
           "M.META_ID, M.EVENTO_ID, M.META_INGRESOS, M.TASA_CONVERSION, " +
           "M.TICKETS_OBJETIVO, M.ACTIVO, E.NOMBRE AS NOMBRE_EVENTO, " +
           "E.FECHA_HORARIO_INICIO, IFNULL(V.entradas_vendidas, 0) AS entradas_vendidas, " +
           "IFNULL(V.monto_total_recaudado, 0) AS monto_total_recaudado, " +
           "IFNULL(V.VISITAS, 0) AS VISITAS " +
           "FROM META M " +
           "JOIN EVENTO E ON E.EVENTO_ID = M.EVENTO_ID " +
           "LEFT JOIN ( " +
           "  SELECT Z.EVENTO_ID, " +
           "  SUM(Z.CAPACIDAD_TOTAL - Z.CANTIDAD_ENTRADAS_DISPONIBLES) AS entradas_vendidas, " +
           "  SUM(Z.MONTO_TOTAL_RECAUDADO) AS monto_total_recaudado, " +
           "  E.VISITAS " +
           "  FROM ZONA Z " +
           "  JOIN EVENTO E ON E.EVENTO_ID = Z.EVENTO_ID " +
           "  GROUP BY Z.EVENTO_ID, E.VISITAS " +
           ") V ON V.EVENTO_ID = M.EVENTO_ID " +
           "WHERE M.PRODUCTORA_ID = :productoraId AND M.ACTIVO = 1", 
           nativeQuery = true)
    List<Object[]> findMetasDetalladasByProductoraId(@Param("productoraId") Integer productoraId);

    @Query(value = "SELECT E.EVENTO_ID, E.NOMBRE " +
           "FROM PRODUCTORA P " +
           "JOIN GESTOR G ON G.USUARIO_CREADOR_ID = P.USUARIO_ID " +
           "JOIN EVENTO E ON E.GESTOR_USUARIO_ID = G.USUARIO_ID " +
           "WHERE P.USUARIO_ID = :productoraId " +
           "AND E.ESTADO = 'ACTIVO' " +
           "AND E.FECHA_HORARIO_INICIO > NOW()",
           nativeQuery = true)
    List<Object[]> findEventosDisponiblesByProductoraId(@Param("productoraId") Integer productoraId);
}
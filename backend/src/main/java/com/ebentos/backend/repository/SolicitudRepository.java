package com.ebentos.backend.repository;

import com.ebentos.backend.model.Solicitud;
import com.ebentos.backend.model.SolicitudId;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

public interface SolicitudRepository extends JpaRepository<Solicitud, SolicitudId> {

    @Query("SELECT s FROM Solicitud s " +
            "LEFT JOIN s.local l " +
            "LEFT JOIN l.gestor lg " +
            "LEFT JOIN s.evento e " +
            "LEFT JOIN e.gestor eg " +
            "WHERE lg.usuarioId = :gestorId OR eg.usuarioId = :gestorId")
    Page<Solicitud> findByGestorUsuarioId(
            @Param("gestorId") Integer gestorId,
            Pageable pageable
    );

}

package com.ebentos.backend.repository;

import com.ebentos.backend.model.Solicitud;
import com.ebentos.backend.model.SolicitudId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitudRepository extends JpaRepository<Solicitud, SolicitudId> {
}

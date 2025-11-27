package com.ebentos.backend.repository;

import com.ebentos.backend.model.EstadoReserva;
import com.ebentos.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    // Busca reservas pendientes que ya vencieron
    List<Reserva> findByEstadoAndFechaExpiracionBefore(EstadoReserva estado, LocalDateTime fecha);
}

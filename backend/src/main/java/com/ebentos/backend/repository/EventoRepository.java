package com.ebentos.backend.repository;

import com.ebentos.backend.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<Evento, Integer>{
    
}

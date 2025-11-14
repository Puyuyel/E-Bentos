package com.ebentos.backend.repository;

import com.ebentos.backend.model.Evento;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<Evento, Integer>{
    List<Evento> findByGestor_UsuarioId(Integer usuarioId);
    Page<Evento> findByGestor_UsuarioId(Integer usuarioId, Pageable pageable);
}

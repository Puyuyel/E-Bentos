package com.ebentos.backend.repository;

import com.ebentos.backend.model.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LocalRepository extends JpaRepository<Local, Integer>{
    
    @Query("SELECT l FROM Local l WHERE l.gestor.usuarioId = :duenhoId AND (" +
       "LOWER(l.nombre) LIKE :buscador)")
    Page<Local> buscarPorBuscadorYDuenho(String buscador, Integer duenhoId, Pageable pageable);
    
    @Query("SELECT l FROM Local l WHERE " +
       "LOWER(l.nombre) LIKE :buscador")
    Page<Local> buscarPorBuscador(String buscador, Pageable pageable);
}

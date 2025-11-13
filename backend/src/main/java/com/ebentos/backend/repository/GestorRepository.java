package com.ebentos.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ebentos.backend.model.Gestor;

public interface GestorRepository extends JpaRepository<Gestor, Integer> {
    @Query("SELECT g FROM Gestor g WHERE g.rol.nombre = :nombreRol AND (" +
       "LOWER(g.dni) LIKE :buscador OR " +
       "LOWER(g.nombres) LIKE :buscador OR " +
       "LOWER(g.apellidos) LIKE :buscador)")
    Page<Gestor> buscarPorBuscadorYRol(String nombreRol, String buscador, Pageable pageable);
    
    @Query("SELECT g FROM Gestor g WHERE g.dni = :dni AND g.activo = 1")
    Optional<Gestor> findByDniAndActivo(@Param("dni") String dni);
    
    @Query("SELECT g FROM Gestor g WHERE g.rol.nombre = 'ORGANIZADOR_EVENTOS' "
            + "AND g.usuarioCreador.usuarioId = :productoraId AND (" +
       "LOWER(g.dni) LIKE :buscador OR " +
       "LOWER(g.nombres) LIKE :buscador OR " +
       "LOWER(g.apellidos) LIKE :buscador)")
    Page<Gestor> buscarPorBuscadorYProductora(Integer productoraId, String buscador, Pageable pageable);
}


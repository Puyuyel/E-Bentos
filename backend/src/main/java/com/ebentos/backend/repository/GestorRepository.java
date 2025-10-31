package com.ebentos.backend.repository;

import com.ebentos.backend.model.Gestor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GestorRepository extends JpaRepository<Gestor, Integer> {
    @Query("SELECT g FROM Gestor g WHERE g.rol.nombre = :nombreRol AND (" +
       "LOWER(g.dni) LIKE LOWER(CONCAT('%', :buscador, '%')) OR " +
       "LOWER(g.nombres) LIKE LOWER(CONCAT('%', :buscador, '%')) OR " +
       "LOWER(g.apellidos) LIKE LOWER(CONCAT('%', :buscador, '%')))")
    Page<Gestor> buscarPorBuscadorYRol(String nombreRol, String buscador, Pageable pageable);
}

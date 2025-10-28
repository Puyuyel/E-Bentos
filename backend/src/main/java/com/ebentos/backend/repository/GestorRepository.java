package com.ebentos.backend.repository;

import com.ebentos.backend.model.Gestor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GestorRepository extends JpaRepository<Gestor, Integer> {
    Page<Gestor> findByRol_Nombre(String nombreRol, Pageable pageable);
}

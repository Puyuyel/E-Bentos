package com.ebentos.backend.repository;

import com.ebentos.backend.model.Gestor;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GestorRepository extends JpaRepository<Gestor, Integer> {
    List<Gestor> findByRol_Nombre(String nombreRol);
}

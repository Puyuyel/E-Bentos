package com.ebentos.backend.repository;

import com.ebentos.backend.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Integer> {

    // Metodo para buscar un rol por su nombre
    Optional<Rol> findByNombre(String nombre);

}

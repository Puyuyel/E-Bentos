package com.ebentos.backend.repository;

import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.model.Rol;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GestorMapper extends JpaRepository<Gestor, Integer> {
    @Query("SELECT g FROM Gestor g WHERE g.rol = :rol AND (" +
           "LOWER(g.dni) LIKE LOWER(CONCAT(:prefijo, '%')) OR " +
           "LOWER(g.nombres) LIKE LOWER(CONCAT(:prefijo, '%')) OR " +
           "LOWER(g.apellidos) LIKE LOWER(CONCAT(:prefijo, '%')))")
    List<Gestor> buscarPorPrefijoYRol(@Param("prefijo") String prefijo, 
            @Param("rol") Rol rol);
}

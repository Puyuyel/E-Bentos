package com.ebentos.backend.repository;

import com.ebentos.backend.model.Gestor;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GestorMapper extends JpaRepository<Gestor, Integer> {
    List<Gestor> findByDniStartingWith(String prefijo);
    List<Gestor> findByApellidosStartingWith(String prefijo);
}

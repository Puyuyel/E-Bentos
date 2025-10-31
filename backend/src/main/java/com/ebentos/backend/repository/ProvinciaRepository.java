package com.ebentos.backend.repository;

import com.ebentos.backend.model.Provincia;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvinciaRepository extends JpaRepository<Provincia, Integer> {
    List<Provincia> findByDepartamento_DepartamentoId(int departamentoId);
}

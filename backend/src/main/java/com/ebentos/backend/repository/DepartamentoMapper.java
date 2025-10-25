package com.ebentos.backend.repository;

import com.ebentos.backend.model.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartamentoMapper extends JpaRepository<Departamento, Integer>{
    
}

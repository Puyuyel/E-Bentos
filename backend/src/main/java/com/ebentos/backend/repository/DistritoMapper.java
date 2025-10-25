package com.ebentos.backend.repository;

import com.ebentos.backend.model.Distrito;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistritoMapper extends JpaRepository<Distrito, Integer>{
    List<Distrito> findByProvincia_ProvinciaId(int provinciaId);
}

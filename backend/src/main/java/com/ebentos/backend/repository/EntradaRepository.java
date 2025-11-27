package com.ebentos.backend.repository;

import com.ebentos.backend.model.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntradaRepository extends JpaRepository<Entrada,Integer> {
}

package com.ebentos.backend.repository;

import com.ebentos.backend.model.Descuento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DescuentoRepository extends JpaRepository<Descuento, Integer> {

}
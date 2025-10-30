package com.ebentos.backend.repository;

import com.ebentos.backend.model.Productora;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductoraRepository extends JpaRepository<Productora, Integer> {
    @Query("SELECT p FROM Productora p WHERE (" +
       "LOWER(g.ruc) LIKE LOWER(CONCAT('%', :buscador, '%')) OR " +
       "LOWER(g.nombreComercial) LIKE LOWER(CONCAT('%', :buscador, '%')) OR " +
       "LOWER(g.razonSocial) LIKE LOWER(CONCAT('%', :buscador, '%')))")
    Page<Productora> buscarPorBuscador(String buscador, Pageable pageable);
}

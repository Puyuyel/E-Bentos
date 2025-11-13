package com.ebentos.backend.repository;

import com.ebentos.backend.model.Productora;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductoraRepository extends JpaRepository<Productora, Integer> {
    @Query("SELECT p FROM Productora p WHERE (" +
       "LOWER(p.ruc) LIKE :buscador OR " +
       "LOWER(p.nombreComercial) LIKE :buscador OR " +
       "LOWER(p.razonSocial) LIKE :buscador)")
    Page<Productora> buscarPorBuscador(String buscador, Pageable pageable);
    
    Optional<Productora> findByRuc(String ruc);
}

package com.ebentos.backend.repository;

import com.ebentos.backend.model.PuntoVenta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PuntoVentaRepository extends JpaRepository<PuntoVenta, Integer> {
    @Query("SELECT p FROM PuntoVenta p " +
       "JOIN p.distrito d " +
       "JOIN d.provincia pr " +
       "JOIN pr.departamento dep " +
       "WHERE LOWER(p.nombre) LIKE :buscador " +
       "OR LOWER(d.nombre) LIKE :buscador " +
       "OR LOWER(pr.nombre) LIKE :buscador " +
       "OR LOWER(dep.nombre) LIKE :buscador")
    Page<PuntoVenta> buscarPorBuscador(String buscador, Pageable pageable);
}

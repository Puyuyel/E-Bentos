package com.ebentos.backend.repository;

import com.ebentos.backend.model.Zona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ZonaRepository extends JpaRepository<Zona, Integer> {

    // Resta stock SOLO si hay suficiente. Retorna 1 si tuvo éxito, 0 si falló.
    @Modifying
    @Query("UPDATE Zona z SET z.cantidadEntradasDisponibles = z.cantidadEntradasDisponibles - :cantidad WHERE z.zonaId = :id AND z.cantidadEntradasDisponibles >= :cantidad")
    int descontarStock(@Param("id") Integer id, @Param("cantidad") int cantidad);

    // Devuelve el stock (cuando se vence el tiempo)
    @Modifying
    @Query("UPDATE Zona z SET z.cantidadEntradasDisponibles = z.cantidadEntradasDisponibles + :cantidad WHERE z.zonaId = :id")
    void devolverStock(@Param("id") Integer id, @Param("cantidad") int cantidad);
}

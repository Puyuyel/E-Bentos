package com.ebentos.backend.repository;

import com.ebentos.backend.model.DescuentoUnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DescuentoUnicoRepository extends JpaRepository<DescuentoUnico, Integer> {

    @Query("SELECT d FROM DescuentoUnico d WHERE d.cliente.usuarioId = :clienteId AND d.estadoUsado = 0")
    List<DescuentoUnico> findActivosByClienteId(Integer clienteId);
    
}
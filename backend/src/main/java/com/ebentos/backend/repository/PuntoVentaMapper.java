package com.ebentos.backend.repository;

import com.ebentos.backend.model.PuntoVenta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PuntoVentaMapper extends JpaRepository<PuntoVenta, Integer> {
    
}

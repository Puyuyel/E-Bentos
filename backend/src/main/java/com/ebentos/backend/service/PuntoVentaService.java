package com.ebentos.backend.service;

import com.ebentos.backend.model.PuntoVenta;
import com.ebentos.backend.repository.PuntoVentaMapper;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;

public class PuntoVentaService {
    
    private final PuntoVentaMapper puntoVentaMapper;
    
    @Autowired
    public PuntoVentaService(PuntoVentaMapper puntoVentaMapper) {
        this.puntoVentaMapper = puntoVentaMapper;
    }
    
    public Optional<PuntoVenta> obtenerPorId(Integer id) {
        return puntoVentaMapper.findById(id);
    }

    public List<PuntoVenta> listarTodas() {
        return puntoVentaMapper.findAll();
    }

    public PuntoVenta insertar(PuntoVenta puntoVenta) {
        return puntoVentaMapper.save(puntoVenta);
    }

    public void eliminar(Integer id) {
        if (puntoVentaMapper.existsById(id)) {
            puntoVentaMapper.deleteById(id);
        } else {
            throw new RuntimeException("Productora no encontrada con id: " + id);
        }
    }
    
    public PuntoVenta modificar(Integer id, PuntoVenta puntoVenta) {
        puntoVenta.setPuntoventaId(id);
        return puntoVentaMapper.save(puntoVenta);
    }
    
   
}

package com.ebentos.backend.service;

import com.ebentos.backend.model.PuntoVenta;
import com.ebentos.backend.repository.PuntoVentaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PuntoVentaService {
    
    private final PuntoVentaRepository puntoVentaRepository;
    
    @Autowired
    public PuntoVentaService(PuntoVentaRepository puntoVentaRepository) {
        this.puntoVentaRepository = puntoVentaRepository;
    }
    
    public Optional<PuntoVenta> obtenerPorId(Integer id) {
        return puntoVentaRepository.findById(id);
    }

    public List<PuntoVenta> listarTodas() {
        return puntoVentaRepository.findAll();
    }

    public PuntoVenta insertar(PuntoVenta puntoVenta) {
        return puntoVentaRepository.save(puntoVenta);
    }

    public void eliminar(Integer id) {
        if (puntoVentaRepository.existsById(id)) {
            puntoVentaRepository.deleteById(id);
        } else {
            throw new RuntimeException("Productora no encontrada con id: " + id);
        }
    }
    
    public PuntoVenta modificar(Integer id, PuntoVenta puntoVenta) {
        puntoVenta.setPuntoventaId(id);
        return puntoVentaRepository.save(puntoVenta);
    }
    
   
}

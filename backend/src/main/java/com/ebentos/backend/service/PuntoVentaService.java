package com.ebentos.backend.service;

import com.ebentos.backend.model.PuntoVenta;
import com.ebentos.backend.repository.PuntoVentaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.Map;
import java.util.HashMap;

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
            throw new RuntimeException("Punto de venta no encontrado con id: " + id);
        }
    }
    
    public PuntoVenta modificar(Integer id, PuntoVenta puntoVenta) {
        puntoVenta.setPuntoventaId(id);
        return puntoVentaRepository.save(puntoVenta);
    }
    
    public Map<String, Object> listarPaginadoPorBuscador(int page, int size, String buscador) {
        Pageable pageable = PageRequest.of(page, size);
        buscador = "%" + buscador.toLowerCase() + "%";
        Page<PuntoVenta> puntosVentaPage = puntoVentaRepository.buscarPorBuscador(buscador, pageable);

        // Construimos la respuesta con la estructura pedida
        Map<String, Object> response = new HashMap<>();
        response.put("data", puntosVentaPage.getContent());

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("totalItems", puntosVentaPage.getTotalElements());
        pagination.put("totalPages", puntosVentaPage.getTotalPages());
        pagination.put("currentPage", puntosVentaPage.getNumber());
        pagination.put("pageSize", puntosVentaPage.getSize());
        pagination.put("hasNextPage", puntosVentaPage.hasNext());
        pagination.put("hasPreviousPage", puntosVentaPage.hasPrevious());
        pagination.put("nextPage", puntosVentaPage.hasNext() ? "/api/puntoventas?page=" + (page + 1) + "&limit=" + size : null);
        pagination.put("prevPage", puntosVentaPage.hasPrevious() ? "/api/puntoventas?page=" + (page - 1) + "&limit=" + size : null);

        response.put("pagination", pagination);

        return response;
    }
}

package com.ebentos.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ebentos.backend.dto.EventoClienteDTO;
import com.ebentos.backend.repository.EventoClienteRepository;

@Service
public class EventoClienteService {
    
    private final EventoClienteRepository eventoClienteRepository;

    public EventoClienteService(EventoClienteRepository eventoRepository) {
        this.eventoClienteRepository = eventoRepository;
    }

    public List<EventoClienteDTO> listarEventosCliente(Integer categoriaId) {
        // 1. Obtener la lista de eventos desde la BD
        List<EventoClienteDTO> eventos = eventoClienteRepository.findEventosCliente(categoriaId);
        
        if (eventos.isEmpty()) {
            return eventos;
        }

        // 2. Encontrar los valores MÁXIMOS para normalizar
        // Usamos .stream() para procesar la lista que ya tenemos
        double maxVisitas = eventos.stream()
                .mapToDouble(EventoClienteDTO::getVisitas)
                .max()
                .orElse(1.0); // Evita división por cero si no hay visitas
        
        double maxCosto = eventos.stream()
                .mapToDouble(EventoClienteDTO::getCostoTotal)
                .max()
                .orElse(1.0); // Evita división por cero
        
        // 3. Calcular la popularidad para CADA evento
        for (EventoClienteDTO dto : eventos) {
            // Normalización (valores de 0 a 1)
            double visitasNorm = (dto.getVisitas() / maxVisitas);
            double costoNorm = (dto.getCostoTotal() / maxCosto);
            double pctVendido = dto.getPorcentajeVendido();

            // Fórmula de Popularidad: visitas 50% + costo 20% + entradas vendidas 30%
            double popularidad = (visitasNorm * 0.50) + (costoNorm * 0.20) + (pctVendido * 0.30);
            
            dto.setPopularidad(popularidad);
        }

        // Opcional: Ordenar por la nueva popularidad (de mayor a menor)
        eventos.sort((e1, e2) -> e2.getPopularidad().compareTo(e1.getPopularidad()));
        
        return eventos;
    }
}

package com.ebentos.backend.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ebentos.backend.dto.EventoClienteDTO;
import com.ebentos.backend.dto.EventoClienteDetalleDTO;
import com.ebentos.backend.dto.ZonaEventoDTO;
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

    public EventoClienteDetalleDTO verDetalleEvento(Integer eventoId) {
        if (eventoId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "eventoId requerido");
        }

        List<Object[]> results = eventoClienteRepository.findEventoDetalleById(eventoId);
        if (results == null || results.isEmpty()) {
            // evento no encontrado o no cumple condiciones (activo y fecha futura)
            return null;
        }

        Object[] row = results.get(0);
        if (row.length < 8) {
            // datos incompletos
            return null;
        }

        EventoClienteDetalleDTO detalle = new EventoClienteDetalleDTO();

        // Mapeo de columnas según la consulta: poster_horizontal, poster_vertical, tipo_local, nombre_local, direccion, departamento, fecha, descripcion
        detalle.setPosterHorizontal(row[0] != null ? row[0].toString() : null);
        detalle.setPosterVertical(row[1] != null ? row[1].toString() : null);
        detalle.setTipoLocal(row[2] != null ? row[2].toString() : null);
        detalle.setNombreLocal(row[3] != null ? row[3].toString() : null);
        detalle.setDireccionLocal(row[4] != null ? row[4].toString() : null);
        detalle.setDepartamento(row[5] != null ? row[5].toString() : null);

        if (row[6] != null) {
            if (row[6] instanceof Timestamp) {
                detalle.setFecha(((Timestamp) row[6]).toLocalDateTime());
            } else if (row[6] instanceof java.util.Date) {
                detalle.setFecha(((java.util.Date) row[6]).toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
            } else {
                // fallback: try to parse as string
                try {
                    detalle.setFecha(LocalDateTime.parse(row[6].toString()));
                } catch (Exception ex) {
                    detalle.setFecha(null);
                }
            }
        }

        detalle.setDescripcion(row[7] != null ? row[7].toString() : null);

        // Traer zonas
        List<Object[]> zonasRows = eventoClienteRepository.findZonasByEventoId(eventoId);
        List<ZonaEventoDTO> zonas = new ArrayList<>();
        if (zonasRows != null) {
            for (Object[] zr : zonasRows) {
                Integer cantidad = null;
                Double precio = null;
                String tipo = null;
                String letra = null;

                if (zr.length > 0 && zr[0] != null) {
                    if (zr[0] instanceof Number) {
                        cantidad = ((Number) zr[0]).intValue();
                    } else {
                        try { cantidad = Integer.parseInt(zr[0].toString()); } catch (Exception e) { cantidad = null; }
                    }
                }

                if (zr.length > 1 && zr[1] != null) {
                    if (zr[1] instanceof Number) {
                        precio = ((Number) zr[1]).doubleValue();
                    } else {
                        try { precio = Double.parseDouble(zr[1].toString()); } catch (Exception e) { precio = null; }
                    }
                }

                if (zr.length > 2 && zr[2] != null) {
                    tipo = zr[2].toString();
                }

                if (zr.length > 3 && zr[3] != null) {
                    letra = zr[3].toString();
                }

                zonas.add(new ZonaEventoDTO(cantidad, precio, tipo, letra));
            }
        }

        detalle.setZonas(zonas);
        return detalle;
    }

    /**
     * Incrementa el contador de visitas de un evento.
     * Debe llamarse cuando el usuario hace click en un evento de la lista.
     */
    @Transactional
    public void registrarVisita(Integer eventoId) {
        if (eventoId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "eventoId requerido");
        }
        eventoClienteRepository.incrementarVisitas(eventoId);
    }
}

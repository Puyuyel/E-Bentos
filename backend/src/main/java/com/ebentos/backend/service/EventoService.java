package com.ebentos.backend.service;

import com.ebentos.backend.dto.*;
import com.ebentos.backend.model.*;
import com.ebentos.backend.repository.EventoRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class EventoService {
    private final EventoRepository eventoRepository;
    private final SolicitudService solicitudService;

    public EventoService(EventoRepository eventoRepository, SolicitudService solicitudService) {
        this.eventoRepository = eventoRepository;
        this.solicitudService = solicitudService;
    }
    
    public EventoDTO obtenerPorId(Integer id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado con ID: " + id));

        EventoDTO eventoDTO = mapToEventoDTO(evento);

        return eventoDTO;
    }
    
    public Map<String, Object> listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Evento> eventoPage = eventoRepository.findAll(pageable);

        List<EventoListadoDTO> eventosDTO = eventoPage.getContent()
                .stream()
                .map(this::mapToEventoListadoDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("data", eventosDTO);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("totalItems", eventoPage.getTotalElements());
        pagination.put("totalPages", eventoPage.getTotalPages());
        pagination.put("currentPage", eventoPage.getNumber());
        pagination.put("pageSize", eventoPage.getSize());
        pagination.put("hasNextPage", eventoPage.hasNext());
        pagination.put("hasPreviousPage", eventoPage.hasPrevious());
        pagination.put("nextPage", eventoPage.hasNext() ? "/api/eventos?page=" + (page + 1) + "&limit=" + size : null);
        pagination.put("prevPage", eventoPage.hasPrevious() ? "/api/eventos?page=" + (page - 1) + "&limit=" + size : null);

        response.put("pagination", pagination);
        return response;
    }
    
    public List<EventoListadoDTO> listarTodas() {
        return eventoRepository.findAll()
                .stream()
                .map(this::mapToEventoListadoDTO)
                .collect(Collectors.toList());
    }
    
    public EventoDTO insertar(RegistroEventoDTO registroEventoDTO) {
        Evento evento = new Evento();
        // Campos simples
        evento.setNombre(registroEventoDTO.getNombre());
        evento.setDescripcion(registroEventoDTO.getDescripcion());
        evento.setPosterHorizontal(registroEventoDTO.getPosterHorizontal());
        evento.setPosterVertical(registroEventoDTO.getPosterVertical());
        evento.setFechaHorarioInicio(registroEventoDTO.getFechaHorarioInicio());
        evento.setDuracionEstimada(registroEventoDTO.getDuracionEstimada());
        evento.setCostoTotal(registroEventoDTO.getCostoTotal());
        evento.setVisitas(0);
        evento.setEstado(EstadoEvento.PENDIENTE);
        
        // Asociaciones (solo por ID)
        if (registroEventoDTO.getLocal() != null && registroEventoDTO.getLocal().getLocalId() != null) {
            Local local = new Local();
            local.setLocalId(registroEventoDTO.getLocal().getLocalId());
            evento.setLocal(local);
        }

        if (registroEventoDTO.getGestor() != null && registroEventoDTO.getGestor().getUsuarioId() != null) {
            Gestor gestor = new Gestor();
            gestor.setUsuarioId(registroEventoDTO.getGestor().getUsuarioId());
            evento.setGestor(gestor);
        }

        if (registroEventoDTO.getCategoriaEvento() != null && registroEventoDTO.getCategoriaEvento().getCategoriaEventoId() != null) {
            CategoriaEvento categoria = new CategoriaEvento();
            categoria.setCategoriaEventoId(registroEventoDTO.getCategoriaEvento().getCategoriaEventoId());
            evento.setCategoriaEvento(categoria);
        }
        
        if (registroEventoDTO.getZonas() != null && !registroEventoDTO.getZonas().isEmpty()) {
            for (RegistroZonaDTO zonaDTO : registroEventoDTO.getZonas()) {
                Zona zona = new Zona();
                zona.setCapacidadTotal(zonaDTO.getCapacidadTotal());
                zona.setLetraZona(zonaDTO.getLetraZona());
                zona.setPrecioUnitario(zonaDTO.getPrecioUnitario());
                zona.setTipoZona(zonaDTO.getTipoZona());
                zona.setActivo(1);
                zona.setCantidadEntradasDisponibles(zonaDTO.getCapacidadTotal());
                zona.setLocal(evento.getLocal());
                zona.setMontoTotalRecaudado(0.0);
                zona.setEvento(evento);
                evento.getZonas().add(zona);
            }
        }
    

        Evento guardado = eventoRepository.save(evento);

        //Insertamos la solicitud del local
        SolicitudDTO solicitudDTO = new SolicitudDTO();
        solicitudDTO.setLocalId(registroEventoDTO.getLocal().getLocalId());
        solicitudDTO.setEventoId(guardado.getEventoId());
        solicitudDTO.setEstado(EstadoSolicitud.EN_REVISION);
        solicitudService.insertar(solicitudDTO);

        return mapToEventoDTO(guardado);
    }
    
    public void eliminar(Integer id) {
        if (eventoRepository.existsById(id)) {
            eventoRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Evento no encontrado con ID: " + id);
        }
    }
    
    public EventoDTO modificar(Integer id, EventoActualizaDTO eventoActualizaDTO) {
        Evento eventoExistente = eventoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado con ID: " + id));

        if (!Objects.equals(eventoActualizaDTO.getNombre(), eventoExistente.getNombre())){
            eventoExistente.setNombre(eventoActualizaDTO.getNombre());
        }
        if (!Objects.equals(eventoActualizaDTO.getDescripcion(), eventoExistente.getDescripcion())){
            eventoExistente.setDescripcion(eventoActualizaDTO.getDescripcion());
        }
        if (!Objects.equals(eventoActualizaDTO.getPosterHorizontal(), eventoExistente.getPosterHorizontal())){
            eventoExistente.setPosterHorizontal(eventoActualizaDTO.getPosterHorizontal());
        }
        if (!Objects.equals(eventoActualizaDTO.getPosterVertical(), eventoExistente.getPosterVertical())){
            eventoExistente.setPosterVertical(eventoActualizaDTO.getPosterVertical());
        }
        if (!Objects.equals(eventoActualizaDTO.getFechaHorarioInicio(), eventoExistente.getFechaHorarioInicio())){
            eventoExistente.setFechaHorarioInicio(eventoActualizaDTO.getFechaHorarioInicio());
        }
        if (!Objects.equals(eventoActualizaDTO.getDuracionEstimada(), eventoExistente.getDuracionEstimada())){
            eventoExistente.setDuracionEstimada(eventoActualizaDTO.getDuracionEstimada());
        }
        if (!Objects.equals(eventoActualizaDTO.getCostoTotal(), eventoExistente.getCostoTotal())){
            eventoExistente.setCostoTotal(eventoActualizaDTO.getCostoTotal());
        }
        if (!Objects.equals(eventoActualizaDTO.getEstado(), eventoExistente.getEstado())){
            eventoExistente.setEstado(eventoActualizaDTO.getEstado());
        }
        if (!Objects.equals(eventoActualizaDTO.getLocal().getLocalId(), eventoExistente.getLocal().getLocalId())){
            Local local = new Local();
            local.setLocalId(eventoActualizaDTO.getLocal().getLocalId());
            eventoExistente.setLocal(local);

            //Se envía otra solicitud
            SolicitudDTO solicitudDTO = new SolicitudDTO();
            solicitudDTO.setLocalId(eventoActualizaDTO.getLocal().getLocalId());
            solicitudDTO.setEventoId(eventoExistente.getEventoId());
            solicitudDTO.setEstado(EstadoSolicitud.EN_REVISION);
            solicitudService.insertar(solicitudDTO); // Dicen que sí o sí se va a cambiar el id del local, por lo que podría fallar si es que otra vez intentamos
                                                     // con el mismo local, podríamos hacer un insert o update en el caso que ese local y evento ya fueron solicitados pero rechazados

        }
        if (!Objects.equals(eventoActualizaDTO.getCategoriaEvento(), eventoExistente.getCategoriaEvento())){
            eventoExistente.setCategoriaEvento(eventoActualizaDTO.getCategoriaEvento());
        }
        
        Map<Integer, Zona> zonasExistentes = eventoExistente.getZonas().stream()
        .collect(Collectors.toMap(Zona::getZonaId, z -> z));

        List<Zona> nuevasZonas = new ArrayList<>();

        for (ZonaDTO zonaDTO : eventoActualizaDTO.getZonas()) {
            Zona zona;
            if (zonaDTO.getZonaId() != null && zonasExistentes.containsKey(zonaDTO.getZonaId())) {
                // Actualizar zona existente
                zona = zonasExistentes.get(zonaDTO.getZonaId());
                zona.setCapacidadTotal(zonaDTO.getCapacidadTotal());
                zona.setCantidadEntradasDisponibles(zonaDTO.getCapacidadTotal());
                zona.setLetraZona(zonaDTO.getLetraZona());
                zona.setTipoZona(zonaDTO.getTipoZona());
                zona.setPrecioUnitario(zonaDTO.getPrecioUnitario());
                zonasExistentes.remove(zonaDTO.getZonaId());
            } else {
                // Crear zona nueva
                zona = new Zona();
                zona.setCapacidadTotal(zonaDTO.getCapacidadTotal());
                zona.setLetraZona(zonaDTO.getLetraZona());
                zona.setTipoZona(zonaDTO.getTipoZona());
                zona.setPrecioUnitario(zonaDTO.getPrecioUnitario());
                zona.setActivo(1);
                zona.setCantidadEntradasDisponibles(zonaDTO.getCapacidadTotal());
                zona.setLocal(eventoExistente.getLocal());
                zona.setMontoTotalRecaudado(0.0);
                zona.setEvento(eventoExistente);
            }
            nuevasZonas.add(zona);
        }

        // Eliminar las zonas que ya no están en el DTO
        for (Zona zonaEliminada : zonasExistentes.values()) {
            zonaEliminada.setActivo(0);
        }

        eventoExistente.setZonas(nuevasZonas);

        Evento eventoActualizado = eventoRepository.save(eventoExistente);
        return mapToEventoDTO(eventoActualizado);
    }
    
    private EventoDTO mapToEventoDTO(Evento evento) {
        EventoDTO eventoDTO = new EventoDTO();

        eventoDTO.setEventoId(evento.getEventoId());
        eventoDTO.setNombre(evento.getNombre());
        eventoDTO.setDescripcion(evento.getDescripcion());
        eventoDTO.setPosterHorizontal(evento.getPosterHorizontal());
        eventoDTO.setPosterVertical(evento.getPosterVertical());
        eventoDTO.setFechaHorarioInicio(evento.getFechaHorarioInicio());
        eventoDTO.setDuracionEstimada(evento.getDuracionEstimada());
        eventoDTO.setCostoTotal(evento.getCostoTotal());
        eventoDTO.setEstado(evento.getEstado());
        eventoDTO.setCategoriaEvento(evento.getCategoriaEvento());

        if (evento.getLocal() != null) {
            LocalAforoDTO localDTO = new LocalAforoDTO();
            localDTO.setLocalId(evento.getLocal().getLocalId());
            localDTO.setNombre(evento.getLocal().getNombre());
            localDTO.setAforo(evento.getLocal().getAforo());
            eventoDTO.setLocal(localDTO);
        }
        
        if (evento.getZonas() != null && !evento.getZonas().isEmpty()) {
            List<ZonaDTO> zonasDTO = evento.getZonas().stream().map(zona -> {
                ZonaDTO zonaDTO = new ZonaDTO();
                zonaDTO.setZonaId(zona.getZonaId());
                zonaDTO.setCapacidadTotal(zona.getCapacidadTotal());
                zonaDTO.setLetraZona(zona.getLetraZona());
                zonaDTO.setTipoZona(zona.getTipoZona());
                zonaDTO.setPrecioUnitario(zona.getPrecioUnitario());
                return zonaDTO;
            }).collect(Collectors.toList());

            eventoDTO.setZonas(zonasDTO);
        }

        return eventoDTO;
    }
    
    private EventoListadoDTO mapToEventoListadoDTO(Evento evento) {
        EventoListadoDTO eventoDTO = new EventoListadoDTO();

        eventoDTO.setEventoId(evento.getEventoId());
        eventoDTO.setNombre(evento.getNombre());
        eventoDTO.setFechaHorarioInicio(evento.getFechaHorarioInicio());
        eventoDTO.setDuracionEstimada(evento.getDuracionEstimada());
        eventoDTO.setEstado(evento.getEstado());

        if (evento.getLocal() != null) {
            LocalAforoDTO localDTO = new LocalAforoDTO();
            localDTO.setLocalId(evento.getLocal().getLocalId());
            localDTO.setNombre(evento.getLocal().getNombre());
            localDTO.setAforo(evento.getLocal().getAforo());
            eventoDTO.setLocal(localDTO);
        }

        return eventoDTO;
    }

    public EventoActualizaDTO eventoDTOParaSolicitud(Integer eventoId) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado con ID: " + eventoId));
        EventoActualizaDTO eventoActualizaDTO = new EventoActualizaDTO();
        eventoActualizaDTO.setNombre(evento.getNombre());
        eventoActualizaDTO.setDescripcion(evento.getDescripcion());
        eventoActualizaDTO.setPosterHorizontal(evento.getPosterHorizontal());
        eventoActualizaDTO.setPosterVertical(evento.getPosterVertical());
        eventoActualizaDTO.setFechaHorarioInicio(evento.getFechaHorarioInicio());
        eventoActualizaDTO.setDuracionEstimada(evento.getDuracionEstimada());
        eventoActualizaDTO.setCostoTotal(evento.getCostoTotal());
        eventoActualizaDTO.setEstado(evento.getEstado());
        eventoActualizaDTO.setCategoriaEvento(evento.getCategoriaEvento());

        if (evento.getLocal() != null) {
            LocalSimpleDTO localDTO = new LocalSimpleDTO();
            localDTO.setLocalId(evento.getLocal().getLocalId());
            eventoActualizaDTO.setLocal(localDTO);
        }
        return eventoActualizaDTO;
    }

}

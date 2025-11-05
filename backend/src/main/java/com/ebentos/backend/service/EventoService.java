package com.ebentos.backend.service;

import com.ebentos.backend.dto.EventoActualizaDTO;
import com.ebentos.backend.dto.EventoDTO;
import com.ebentos.backend.dto.GestorSimpleDTO;
import com.ebentos.backend.dto.LocalSimpleDTO;
import com.ebentos.backend.dto.RegistroEventoDTO;
import com.ebentos.backend.model.CategoriaEvento;
import com.ebentos.backend.model.EstadoEvento;
import com.ebentos.backend.model.Evento;
import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.model.Local;
import com.ebentos.backend.repository.EventoRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class EventoService {
    private final EventoRepository eventoRepository;
    
    @Autowired
    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
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

        List<EventoDTO> eventosDTO = eventoPage.getContent()
                .stream()
                .map(this::mapToEventoDTO)
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
    
    public List<EventoDTO> listarTodas() {
        return eventoRepository.findAll()
                .stream()
                .map(this::mapToEventoDTO)
                .collect(Collectors.toList());
    }
    
    public EventoDTO insertar(RegistroEventoDTO registroEventoDTO) {
        Evento evento = new Evento();
        // Campos simples
        evento.setNombre(registroEventoDTO.getNombre());
        evento.setDescripcion(registroEventoDTO.getDescripcion());
        evento.setPoster(registroEventoDTO.getPoster());
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

        Evento guardado = eventoRepository.save(evento);
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
        if (!Objects.equals(eventoActualizaDTO.getPoster(), eventoExistente.getPoster())){
            eventoExistente.setPoster(eventoActualizaDTO.getPoster());
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
        if (!Objects.equals(eventoActualizaDTO.getVisitas(), eventoExistente.getVisitas())){
            eventoExistente.setVisitas(eventoActualizaDTO.getVisitas());
        }
        if (!Objects.equals(eventoActualizaDTO.getEstado(), eventoExistente.getEstado())){
            eventoExistente.setEstado(eventoActualizaDTO.getEstado());
        }
        if (!Objects.equals(eventoActualizaDTO.getLocal(), eventoExistente.getLocal())){
            eventoExistente.setLocal(eventoActualizaDTO.getLocal());
        }
        if (!Objects.equals(eventoActualizaDTO.getCategoriaEvento(), eventoExistente.getCategoriaEvento())){
            eventoExistente.setCategoriaEvento(eventoActualizaDTO.getCategoriaEvento());
        }

        Evento eventoActualizado = eventoRepository.save(eventoExistente);
        return mapToEventoDTO(eventoActualizado);
    }
    
    private EventoDTO mapToEventoDTO(Evento evento) {
        EventoDTO eventoDTO = new EventoDTO();

        eventoDTO.setEventoId(evento.getEventoId());
        eventoDTO.setNombre(evento.getNombre());
        eventoDTO.setDescripcion(evento.getDescripcion());
        eventoDTO.setPoster(evento.getPoster());
        eventoDTO.setFechaHorarioInicio(evento.getFechaHorarioInicio());
        eventoDTO.setDuracionEstimada(evento.getDuracionEstimada());
        eventoDTO.setCostoTotal(evento.getCostoTotal());
        eventoDTO.setVisitas(evento.getVisitas());
        eventoDTO.setEstado(evento.getEstado());
        eventoDTO.setCategoriaEvento(evento.getCategoriaEvento());

        if (evento.getLocal() != null) {
            LocalSimpleDTO localDTO = new LocalSimpleDTO();
            localDTO.setLocalId(evento.getLocal().getLocalId());
            localDTO.setAforo(evento.getLocal().getAforo());
            eventoDTO.setLocal(localDTO);
        }

        if (evento.getGestor() != null) {
            GestorSimpleDTO gestorDTO = new GestorSimpleDTO();
            gestorDTO.setUsuarioId(evento.getGestor().getUsuarioId());
            eventoDTO.setGestor(gestorDTO);
        }

        return eventoDTO;
    }
        
}

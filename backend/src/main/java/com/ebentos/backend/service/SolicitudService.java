package com.ebentos.backend.service;

import com.ebentos.backend.dto.EventoActualizaDTO;
import com.ebentos.backend.dto.SolicitudDTO;
import com.ebentos.backend.model.*;
import com.ebentos.backend.repository.SolicitudRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SolicitudService {

    //Atributos
    private final SolicitudRepository solicitudRepository;
    private final EventoService eventoService;

    //Constructor
    @Autowired
    public SolicitudService(SolicitudRepository solicitudRepository, @Lazy EventoService eventoService) {
        this.solicitudRepository = solicitudRepository;
        this.eventoService = eventoService;
    }

    //Insertar
    public void insertar(SolicitudDTO solicitudDTO) {
        Solicitud solicitud = new Solicitud();

        // Crear el ID compuesto
        SolicitudId solicitudId = new SolicitudId();
        solicitudId.setEventoId(solicitudDTO.getEventoId());
        solicitudId.setLocalId(solicitudDTO.getLocalId());
        solicitud.setId(solicitudId);

        // Asociaciones (solo por ID)
        Evento evento = new Evento();
        evento.setEventoId(solicitudDTO.getEventoId());
        solicitud.setEvento(evento);

        Local local = new Local();
        local.setLocalId(solicitudDTO.getLocalId());
        solicitud.setLocal(local);

        // Campo simple
        solicitud.setEstado(solicitudDTO.getEstado());

        // Guardar
        solicitudRepository.save(solicitud);
    }

    //Modificar / Aceptar rechazar
    public SolicitudDTO modificar(Integer localId, Integer eventoId, SolicitudDTO solicitudDTO) {
        //Al tener el id compuesto por dos fks, tenemos que crear el id
        SolicitudId solicitudId = new SolicitudId(localId, eventoId);
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new EntityNotFoundException("Solicitud no encontrada con ID: " + solicitudId));
            if (!Objects.equals(localId, solicitud.getLocal().getLocalId())){
                Local local = new Local();
                local.setLocalId(localId);
                solicitud.setLocal(local);
            }
            if (!Objects.equals(eventoId, solicitud.getEvento().getEventoId())){
                Evento evento = new Evento();
                evento.setEventoId(eventoId);
                solicitud.setEvento(evento);
            }
            if (!Objects.equals(solicitudDTO.getJustificacion(), solicitud.getJustificacion())){
                solicitud.setJustificacion(solicitudDTO.getJustificacion());
            }
            if (!Objects.equals(solicitudDTO.getEstado(), solicitud.getEstado())){
                solicitud.setEstado(solicitudDTO.getEstado());
                EventoActualizaDTO eventoDTO = eventoService.eventoDTOParaSolicitud(eventoId);
                //Verificamos si es se aceptó o rechazó
                if(Objects.equals(solicitudDTO.getEstado(), EstadoSolicitud.APROBADO)){
                    //Se actualiza el evento a aceptado
                    eventoDTO.setEstado(EstadoEvento.ACTIVO);
                }else{
                    //Se rechaza el evento
                    eventoDTO.setEstado(EstadoEvento.SOLICITUD_RECHAZADA);
                }
                eventoService.modificar(solicitudDTO.getEventoId(), eventoDTO);
            }
            Solicitud solicitudActualizada = solicitudRepository.save(solicitud);

        return llenarADTO(solicitudActualizada);
    }
    
    public SolicitudDTO obtenerPorId(Integer localId, Integer eventoId){
        SolicitudId solicitudId = new SolicitudId(localId, eventoId);
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new EntityNotFoundException("Solicitud no encontrada con ID: " + solicitudId));
        
        SolicitudDTO solicitudDTO = llenarADTO(solicitud);
        
        return solicitudDTO;
    }

    private SolicitudDTO llenarADTO(Solicitud solicitudActualizada){
        SolicitudDTO solicitudDTO = new SolicitudDTO();

        solicitudDTO.setJustificacion(solicitudActualizada.getJustificacion());
        solicitudDTO.setEstado(solicitudActualizada.getEstado());

        if (solicitudActualizada.getId() != null) {
            solicitudDTO.setLocalId(solicitudActualizada.getId().getLocalId());
            solicitudDTO.setEventoId(solicitudActualizada.getId().getEventoId());
        }

        return solicitudDTO;
    }

    //Listar paginado
    public Map<String, Object> listarPaginado(Integer gestorUsuarioId, Integer  page, Integer size){
        Pageable pageable = PageRequest.of(page, size);
        Page<Solicitud> solicitudesPage = solicitudRepository.findByGestorUsuarioId(gestorUsuarioId, pageable);

        List<SolicitudDTO> solicitudesDTO = solicitudesPage.getContent().stream().map(this::llenarADTO).collect(Collectors.toList());

        // Construimos la respuesta con la estructura pedida
        Map<String, Object> response = new HashMap<>();
        response.put("data", solicitudesDTO);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("totalItems", solicitudesPage.getTotalElements());
        pagination.put("totalPages", solicitudesPage.getTotalPages());
        pagination.put("currentPage", solicitudesPage.getNumber());
        pagination.put("pageSize", solicitudesPage.getSize());
        pagination.put("hasNextPage", solicitudesPage.hasNext());
        pagination.put("hasPreviousPage", solicitudesPage.hasPrevious());

        String baseUrl = "/api/solicitudes/paginado/" + gestorUsuarioId;
        pagination.put("nextPage", solicitudesPage.hasNext() ? baseUrl + "?page=" + (page + 1) + "&limit=" + size : null);
        pagination.put("prevPage", solicitudesPage.hasPrevious() ? baseUrl + "?page=" + (page - 1) + "&limit=" + size : null);

        response.put("pagination", pagination);

        return response;
    }


}

package com.ebentos.backend.controller;

import com.ebentos.backend.dto.SolicitudDTO;
import com.ebentos.backend.service.SolicitudService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    //Atributos
    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    //Métodos

    @PutMapping("/local/{localId}/evento/{eventoId}")
    public SolicitudDTO modificarSolicitud( @PathVariable Integer localId, @PathVariable Integer eventoId, @RequestBody SolicitudDTO solicitudDTO) {
        // Pasamos los IDs de la URL y el cuerpo de la solicitud al servicio
        return solicitudService.modificar(localId, eventoId, solicitudDTO);
    }
    
    @GetMapping("/local/{localId}/evento/{eventoId}")
    public SolicitudDTO obtenerSolicitud( @PathVariable Integer localId, @PathVariable Integer eventoId) {
        // Pasamos los IDs de la URL y el cuerpo de la solicitud al servicio
        return solicitudService.obtenerPorId(localId, eventoId);
    }

    @GetMapping("/paginado/{gestorUsuarioId}")
    public Map<String, Object> listarPaginado(
            @PathVariable Integer gestorUsuarioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Object> response = solicitudService.listarPaginado(gestorUsuarioId, page, limit);

        return response;
    }

}

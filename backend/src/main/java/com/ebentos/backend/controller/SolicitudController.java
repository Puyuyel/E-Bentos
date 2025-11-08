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

    @GetMapping("/paginado")
    public Map<String, Object> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Object> response = solicitudService.listarPaginado(page, limit);

        // Construir URLs completas dinámicamente
        Map<String, Object> pagination = (Map<String, Object>) response.get("pagination");
        String baseUrl = ServletUriComponentsBuilder.fromCurrentRequestUri().toUriString();

        if ((boolean) pagination.get("hasNextPage")) {
            pagination.put("nextPage", baseUrl + "?page=" + (page + 1) + "&limit=" + limit);
        }
        if ((boolean) pagination.get("hasPreviousPage")) {
            pagination.put("prevPage", baseUrl + "?page=" + (page - 1) + "&limit=" + limit);
        }

        return response;
    }

}

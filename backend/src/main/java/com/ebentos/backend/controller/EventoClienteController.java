package com.ebentos.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ebentos.backend.dto.EventoClienteDTO;
import com.ebentos.backend.service.EventoClienteService;

@RestController
@RequestMapping("/api/eventosCliente")
public class EventoClienteController {

    private final EventoClienteService eventoClienteService;

    @Autowired
    public EventoClienteController(EventoClienteService eventoClienteService) {
        this.eventoClienteService = eventoClienteService;
    }

    /**
     * Endpoint público para listar eventos disponibles para clientes.
     * Opcionalmente filtra por categoría de evento.
     * 
     * @param categoriaId ID de la categoría (opcional)
     * @return Lista de eventos con todos los campos requeridos + popularidad calculada
     */
    @GetMapping
    public List<EventoClienteDTO> listarEventosParaCliente(
            @RequestParam(required = false) Integer categoriaId) {
        
        return eventoClienteService.listarEventosCliente(categoriaId);
    }

    @GetMapping("/verDetalle/{eventoId}")
    public ResponseEntity<?> verDetalleEvento(@PathVariable Integer eventoId) {
        var detalle = eventoClienteService.verDetalleEvento(eventoId);
        if (detalle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detalle);
    }
}

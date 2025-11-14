package com.ebentos.backend.controller;

import com.ebentos.backend.dto.EventoActualizaDTO;
import com.ebentos.backend.dto.EventoDTO;
import com.ebentos.backend.dto.EventoListadoDTO;
import com.ebentos.backend.dto.RegistroEventoDTO;
import com.ebentos.backend.service.EventoService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {
    
    private final EventoService eventoService;

    @Autowired
    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping
    public List<EventoListadoDTO> listarTodas() {
        return eventoService.listarTodas();
    }
    
    @GetMapping("/organizador/{id}")
    public List<EventoListadoDTO> listarPorOrganizador(@PathVariable Integer id) {
        return eventoService.listarPorOrganizador(id);
    }

    @GetMapping("/paginado/organizador/{id}")
    public Map<String, Object> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @PathVariable Integer id) {

        Map<String, Object> response = eventoService.listarPaginadoPorOrganizador(page, limit, id);

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

    @GetMapping("/{id}")
    public EventoDTO obtenerPorId(@PathVariable Integer id) {
        return eventoService.obtenerPorId(id);
    }

    @PostMapping
    public EventoDTO insertar(@RequestBody RegistroEventoDTO regsitroEventoDTO) {
        return eventoService.insertar(regsitroEventoDTO);
    }

    @PutMapping("/{id}")
    public EventoDTO modificar(@PathVariable Integer id, @RequestBody EventoActualizaDTO eventoActualizaDTO) {
        return eventoService.modificar(id, eventoActualizaDTO);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        eventoService.eliminar(id);
    }
}

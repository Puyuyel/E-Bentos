package com.ebentos.backend.controller;
import com.ebentos.backend.dto.GestorActualizaDTO;
import com.ebentos.backend.dto.GestorDTO;
import com.ebentos.backend.service.GestorService;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/gestores")
public class GestorController {
    
    private final GestorService gestorService;

    @Autowired
    public GestorController(GestorService gestorService){
        this.gestorService = gestorService;
    }
    
    @GetMapping
    public List<GestorDTO> listarTodas() {
        return gestorService.listarTodas();
    }
    
    @GetMapping("/paginado")
    public Map<String, Object> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Object> response = gestorService.listarPaginado(page, limit);

        // 🔹 Construir URLs completas usando el dominio actual
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
    public GestorDTO obtenerPorId(@PathVariable Integer id) {
        return gestorService.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public GestorDTO modificar(@PathVariable Integer id, @RequestBody GestorActualizaDTO gestorActualizaDTO) {
        // Llama al servicio con el ID y el DTO
        return gestorService.modificar(id, gestorActualizaDTO);
    }
}

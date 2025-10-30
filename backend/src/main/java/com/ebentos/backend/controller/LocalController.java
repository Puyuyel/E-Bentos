package com.ebentos.backend.controller;

import com.ebentos.backend.dto.LocalActualizaDTO;
import com.ebentos.backend.dto.LocalDTO;
import com.ebentos.backend.model.Local;
import com.ebentos.backend.service.LocalService;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
@RequestMapping("/api/locales")
public class LocalController {
    private final LocalService localService;
    
    @Autowired
    public LocalController(LocalService localService){
        this.localService = localService;
    }
    
    @GetMapping
    public List<LocalDTO> listarTodas() {
        return localService.listarTodas();
    }
    
    @GetMapping("/paginado")
    public Map<String, Object> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Object> response = localService.listarPaginado(page, limit);

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
    public LocalDTO obtenerPorId(@PathVariable Integer id) {
        return localService.obtenerPorId(id);
    }

    @PostMapping
    public LocalDTO insertar(@RequestBody LocalDTO localDTO) {
        return localService.insertar(localDTO);
    }

    @PutMapping("/{id}")
    public LocalDTO modificar(@PathVariable Integer id, @RequestBody LocalActualizaDTO localActualizaDTO) {
        return localService.modificar(id, localActualizaDTO);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        localService.eliminar(id);
    }
}

package com.ebentos.backend.controller;

import com.ebentos.backend.dto.ProductoraActualizaDTO;
import com.ebentos.backend.dto.ProductoraDTO;
import com.ebentos.backend.service.ProductoraService;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/productoras")
public class ProductoraController {

    private final ProductoraService productoraService;

    @Autowired
    public ProductoraController(ProductoraService productoraService){
        this.productoraService = productoraService;
    }

    @GetMapping
    public List<ProductoraDTO> listarTodas() {
        return productoraService.listarTodas();
    }
    
    @GetMapping("/paginadoPorBuscador")
    public Map<String, Object> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam String buscador) {

        Map<String, Object> response = productoraService.listarPaginadoPorBuscador(page, limit, buscador);

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
    public ProductoraDTO obtenerPorId(@PathVariable Integer id) {
        return productoraService.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public ProductoraDTO modificar(@PathVariable Integer id, @RequestBody ProductoraActualizaDTO productoraActualizaDTO) {
        // Llama al servicio con el ID y el DTO
        return productoraService.modificar(id, productoraActualizaDTO);
    }
    
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        productoraService.eliminar(id);
    }

}

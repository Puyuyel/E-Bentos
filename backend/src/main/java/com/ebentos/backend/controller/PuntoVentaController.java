package com.ebentos.backend.controller;

import com.ebentos.backend.model.PuntoVenta;
import com.ebentos.backend.service.PuntoVentaService;
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
@RequestMapping("/api/puntoventas")
public class PuntoVentaController {
    
    private final PuntoVentaService puntoVentaService;
    
    @Autowired
    public PuntoVentaController(PuntoVentaService puntoVentaService){
        this.puntoVentaService = puntoVentaService;
    }
    
    @GetMapping
    public List<PuntoVenta> listarTodas() {
        return puntoVentaService.listarTodas();
    }
    
    @GetMapping("/{id}")
    public Optional<PuntoVenta> obtenerPorId(@PathVariable Integer id) {
        return puntoVentaService.obtenerPorId(id);
    }

    @PostMapping
    public PuntoVenta insertar(@RequestBody PuntoVenta puntoventa) {
        return puntoVentaService.insertar(puntoventa);
    }

    @PutMapping("/{id}")
    public PuntoVenta modificar(@PathVariable Integer id, @RequestBody PuntoVenta puntoventa) {
        return puntoVentaService.modificar(id, puntoventa);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        puntoVentaService.eliminar(id);
    }
    
    @GetMapping("/paginadoPorBuscador")
    public Map<String, Object> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam String buscador) {

        Map<String, Object> response = puntoVentaService.listarPaginadoPorBuscador(page, limit, buscador);

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

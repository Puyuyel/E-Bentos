package com.ebentos.backend.controller;

import com.ebentos.backend.dto.VentaDTO;
import com.ebentos.backend.service.VentaService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {
    
    private final VentaService ventaService;
    
    @Autowired
    public VentaController(VentaService ventaService){
        this.ventaService = ventaService;
    }
    
    @GetMapping
    public List<VentaDTO> listarTodas() {
        return ventaService.listarTodas();
    }
    
    @GetMapping("/{id}")
    public VentaDTO obtenerPorId(@PathVariable Integer id) {
        return ventaService.obtenerPorId(id);
    }
    
    
}

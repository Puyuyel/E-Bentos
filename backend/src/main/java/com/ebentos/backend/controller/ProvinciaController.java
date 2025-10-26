package com.ebentos.backend.controller;

import com.ebentos.backend.model.Provincia;
import com.ebentos.backend.service.ProvinciaService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/provincias")
public class ProvinciaController {
        
    private final ProvinciaService provinciaService;
    
    @Autowired
    public ProvinciaController(ProvinciaService provinciaService){
        this.provinciaService = provinciaService;
    }
    
    @GetMapping
    public List<Provincia> listarTodas() {
        return provinciaService.listarTodas();
    }
    
    @GetMapping("/buscar")
    public List<Provincia> buscarPorDepartamentoId(@RequestParam int departamentoId) {
        return provinciaService.buscarPorDepartamentoId(departamentoId);
    }
}

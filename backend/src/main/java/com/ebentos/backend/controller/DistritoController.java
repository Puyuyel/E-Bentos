package com.ebentos.backend.controller;

import com.ebentos.backend.model.Distrito;
import com.ebentos.backend.service.DistritoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/distritos")
public class DistritoController {
        
    private final DistritoService distritoService;
    
    @Autowired
    public DistritoController(DistritoService distritoService){
        this.distritoService = distritoService;
    }
    
    @GetMapping
    public List<Distrito> listarTodas() {
        return distritoService.listarTodas();
    }
    
    @GetMapping("/buscar")
    public List<Distrito> buscarPorProvinciaId(@RequestParam int provinciaId) {
        return distritoService.buscarPorProvinciaId(provinciaId);
    }
}

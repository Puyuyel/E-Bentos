package com.ebentos.backend.controller;

import com.ebentos.backend.model.Departamento;
import com.ebentos.backend.service.DepartamentoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/departamentos")
public class DepartamentoRestController {
    
    private final DepartamentoService departamentoService;
    
    @Autowired
    public DepartamentoRestController(DepartamentoService departamentoService){
        this.departamentoService = departamentoService;
    }
    
    @GetMapping
    public List<Departamento> listarTodas() {
        return departamentoService.listarTodas();
    }
}

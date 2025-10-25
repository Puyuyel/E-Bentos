package com.ebentos.backend.service;

import com.ebentos.backend.model.Departamento;
import com.ebentos.backend.model.Productora;
import com.ebentos.backend.repository.DepartamentoMapper;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

public class DepartamentoService {
    private final DepartamentoMapper departamentoMapper;
    
    @Autowired
    public DepartamentoService(DepartamentoMapper departamentoMapper) {
        this.departamentoMapper = departamentoMapper;
    }
    
    public List<Departamento> listarTodas() {
        return departamentoMapper.findAll();
    }
}

package com.ebentos.backend.service;

import com.ebentos.backend.model.Distrito;
import com.ebentos.backend.repository.DistritoMapper;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

public class DistritoService {
    
    private final DistritoMapper distritoMapper;
    
    @Autowired
    public DistritoService(DistritoMapper distritoMapper) {
        this.distritoMapper = distritoMapper;
    }
    
    public List<Distrito> listarTodas() {
        return distritoMapper.findAll();
    }
    
    public List<Distrito> buscarPorProvinciaId(int provinciaId){
        return distritoMapper.findByProvincia_ProvinciaId(provinciaId);
    }
}

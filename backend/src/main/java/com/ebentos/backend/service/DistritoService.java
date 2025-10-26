package com.ebentos.backend.service;

import com.ebentos.backend.model.Distrito;
import com.ebentos.backend.repository.DistritoRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DistritoService {
    
    private final DistritoRepository distritoRepository;
    
    @Autowired
    public DistritoService(DistritoRepository distritoRepository) {
        this.distritoRepository = distritoRepository;
    }
    
    public List<Distrito> listarTodas() {
        return distritoRepository.findAll();
    }
    
    public List<Distrito> buscarPorProvinciaId(int provinciaId){
        return distritoRepository.findByProvincia_ProvinciaId(provinciaId);
    }
}

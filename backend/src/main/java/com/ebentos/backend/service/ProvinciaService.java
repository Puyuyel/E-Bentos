package com.ebentos.backend.service;

import com.ebentos.backend.model.Provincia;
import com.ebentos.backend.repository.ProvinciaMapper;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

public class ProvinciaService {
    
    private final ProvinciaMapper provinciaMapper;
    
    @Autowired
    public ProvinciaService(ProvinciaMapper provinciaMapper) {
        this.provinciaMapper = provinciaMapper;
    }
    
    public List<Provincia> listarTodas() {
        return provinciaMapper.findAll();
    }
    
    public List<Provincia> buscarPorDepartamentoId(int departamentoId){
        return provinciaMapper.findByDepartamento_DepartamentoId(departamentoId);
    }
}

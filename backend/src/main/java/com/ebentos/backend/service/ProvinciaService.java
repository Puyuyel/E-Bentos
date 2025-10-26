package com.ebentos.backend.service;

import com.ebentos.backend.model.Provincia;
import com.ebentos.backend.repository.ProvinciaRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProvinciaService {
    
    private final ProvinciaRepository provinciaRepository;
    
    @Autowired
    public ProvinciaService(ProvinciaRepository provinciaRepository) {
        this.provinciaRepository = provinciaRepository;
    }
    
    public List<Provincia> listarTodas() {
        return provinciaRepository.findAll();
    }
    
    public List<Provincia> buscarPorDepartamentoId(int departamentoId){
        return provinciaRepository.findByDepartamento_DepartamentoId(departamentoId);
    }
}

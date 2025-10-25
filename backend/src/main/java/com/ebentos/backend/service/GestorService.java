package com.ebentos.backend.service;

import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.model.Rol;
import com.ebentos.backend.repository.GestorMapper;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class GestorService {
    private final GestorMapper gestorMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public GestorService(GestorMapper gestorMapper, PasswordEncoder passwordEncoder) {
        this.gestorMapper = gestorMapper;
        this.passwordEncoder = passwordEncoder;
    }
    
    public Optional<Gestor> obtenerPorId(Integer id) {
        return gestorMapper.findById(id);
    }

    public List<Gestor> listarTodos() {
        return gestorMapper.findAll();
    }

    public Gestor insertar(Gestor gestor) {
        gestor.setContrasenha(passwordEncoder.encode(gestor.getContrasenha()));
        return gestorMapper.save(gestor);
    }
    
    public void eliminar(Integer id) {
        if (gestorMapper.existsById(id)) {
            gestorMapper.deleteById(id);
        } else {
            throw new RuntimeException("Productora no encontrada con id: " + id);
        }
    }
    
    public Gestor modificar(Integer id, Gestor gestor) {
        gestor.setUsuarioId(id);
        return gestorMapper.save(gestor);
    }
    
    public List<Gestor> buscarPorPrefijoYRol(String prefijo, Rol rol) {
        return gestorMapper.buscarPorPrefijoYRol(prefijo, rol);
    }
    
}

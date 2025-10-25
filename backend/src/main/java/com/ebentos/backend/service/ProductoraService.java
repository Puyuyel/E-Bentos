package com.ebentos.backend.service;

import com.ebentos.backend.model.Productora;
import com.ebentos.backend.repository.ProductoraMapper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class ProductoraService {

    private final ProductoraMapper productoraMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ProductoraService(ProductoraMapper productoraMapper, PasswordEncoder passwordEncoder) {
        this.productoraMapper = productoraMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Productora> obtenerPorId(Integer id) {
        return productoraMapper.findById(id);
    }

    public List<Productora> listarTodas() {
        return productoraMapper.findAll();
    }

    public Productora insertar(Productora productora) {
        productora.setContrasenha(passwordEncoder.encode(productora.getContrasenha()));
        return productoraMapper.save(productora);
    }

    public void eliminar(Integer id) {
        if (productoraMapper.existsById(id)) {
            productoraMapper.deleteById(id);
        } else {
            throw new RuntimeException("Productora no encontrada con id: " + id);
        }
    }
    
    public Productora modificar(Integer id, Productora productora) {
        productora.setUsuarioId(id);
        return productoraMapper.save(productora);
    }
    
    public List<Productora> buscarPorRazonSocial(String prefijo) {
        return productoraMapper.findByRazonSocialStartingWith(prefijo);
    }
    
}

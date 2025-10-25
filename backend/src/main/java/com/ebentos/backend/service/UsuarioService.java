package com.ebentos.backend.service;

import com.ebentos.backend.repository.UsuarioMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioService(UsuarioMapper usuarioMapper, PasswordEncoder passwordEncoder) {
        this.usuarioMapper = usuarioMapper;
        this.passwordEncoder = passwordEncoder;
    }
    
    public boolean verificarCredenciales(String email, String password) {
        return usuarioMapper.findByEmail(email)
                .map(usuario -> passwordEncoder.matches(password, usuario.getContrasenha()))
                .orElse(false);
    }
}

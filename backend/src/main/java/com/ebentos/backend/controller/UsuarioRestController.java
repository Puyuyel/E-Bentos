package com.ebentos.backend.controller;

import com.ebentos.backend.model.Usuario;
import com.ebentos.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {
    
    private final UsuarioService usuarioService;
    
    @Autowired
    public UsuarioRestController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Usuario usuario) {
        boolean valido = usuarioService.verificarCredenciales(usuario.getEmail(),
                usuario.getContrasenha());
        if (valido) {
            return ResponseEntity.ok("Login exitoso");
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }
}

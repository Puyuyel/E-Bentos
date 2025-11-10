package com.ebentos.backend.controller;

import com.ebentos.backend.config.UsuarioDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import  com.ebentos.backend.dto.UsuarioLogInDTO;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    //Llamar a los endpoints (/api/auth/register, /api/auth/login = da la cookie session, /api/users/me = da el correo y el rol)
    /**
     * Endpoint protegido para obtener la información del usuario
     * actualmente logueado (basado en su cookie de sesión).
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioLogInDTO> obtenerUsuarioActual(Authentication authentication) {

        // 'authentication' es inyectado por Spring Security.
        // Contiene el 'expediente' (UserDetails) que creamos en SecurityConfig
        UsuarioDetails userDetails = (UsuarioDetails) authentication.getPrincipal();
        Integer usuarioId = userDetails.getUsuarioId();
        String email = authentication.getName();

        List<String> roles = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Usamos un DTO para no devolver la contraseña, demas campos
        UsuarioLogInDTO usuarioDTO = new UsuarioLogInDTO(usuarioId, email, roles.get(0));

        return ResponseEntity.ok(usuarioDTO);
    }
}

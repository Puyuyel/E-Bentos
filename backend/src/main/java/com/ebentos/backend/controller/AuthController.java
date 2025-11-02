package com.ebentos.backend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ebentos.backend.dto.ContrasenhaResetDTO;
import com.ebentos.backend.dto.RegistroUsuarioDTO;
import com.ebentos.backend.model.Usuario;
import com.ebentos.backend.service.UsuarioService;
import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    // Registro nuevo usuario
    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroUsuarioDTO registroDTO, Authentication authentication) { // DTO general recibe todos los campos posibles
        try {
            String rolSolicitado = registroDTO.getNombreRol();
            // Caso 1: registro sin autenticación -> solo CLIENTE
            if (authentication == null) {
                if (!"CLIENTE".equalsIgnoreCase(rolSolicitado)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Solo se pueden crear cuentas de CLIENTE sin autenticación");
                }
            } else {
                // Caso 2: usuario autenticado
                String rolActual = authentication.getAuthorities().iterator().next().getAuthority();

                // Validar jerarquía
                if (!puedeCrear(rolActual, rolSolicitado)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("No tienes permisos para crear usuarios con rol " + rolSolicitado);
                }
            }
            Usuario usuarioCreado = usuarioService.crearUsuario(registroDTO);
            // Devolvemos 201 Created (no devolvemos la contraseña)
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado con ID: " + usuarioCreado.getUsuarioId());
        } catch (RuntimeException e) {
            // Maneja errores como email duplicado o rol no encontrado
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Manejador general de errores
            System.err.println("Error inesperado durante el registro: " + e.getMessage()); // Log del error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al procesar el registro.");
        }
    }

    // Olvido constraseña
    @PostMapping("/forgot-password")
    public ResponseEntity<String> solicitarReseteoContrasenha(@RequestParam String email) {
        try {
            usuarioService.iniciarReseteoPassword(email);
            return ResponseEntity.ok("Se ha enviado un código de verificación a tu correo.");
        } catch (RuntimeException e) {
            // Maneja el caso de email no encontrado u otros errores
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            // Manejo general de errores (ej. fallo al enviar correo)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la solicitud.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetearContrasenha(@RequestBody ContrasenhaResetDTO resetDTO) {
        try {
            usuarioService.completarReseteoContrasenha(resetDTO.getEmail(), resetDTO.getCodigo(), resetDTO.getNuevaContrasenha());
            return ResponseEntity.ok("Contraseña actualizada correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); // Código inválido, expirado, etc.
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la contraseña.");
        }
    }
    
    private boolean puedeCrear(String rolActual, String rolNuevo) {
    return switch (rolActual) {
        case "ROLE_ADMIN" -> List.of("PRODUCTORA", "GESTOR_LOCAL", "TAQUILLERO").contains(rolNuevo);
        case "ROLE_PRODUCTORA" -> List.of("ORGANIZADOR_EVENTOS").contains(rolNuevo);
        case "ROLE_GESTOR_LOCAL" -> List.of("DUENHO_LOCAL").contains(rolNuevo);
        default -> false;
    };
}

}
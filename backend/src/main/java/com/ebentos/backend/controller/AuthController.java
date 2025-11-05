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
        if(rolNuevo.equals("CLIENTE"))
            return true;
        return switch (rolActual) {
            case "ROLE_ADMIN" -> List.of("PRODUCTORA", "GESTOR_LOCAL", "TAQUILLERO").contains(rolNuevo);
            case "ROLE_PRODUCTORA" -> List.of("ORGANIZADOR_EVENTOS").contains(rolNuevo);
            case "ROLE_GESTOR_LOCAL" -> List.of("DUENHO_LOCAL").contains(rolNuevo);   
            default -> false;
    };
}

}

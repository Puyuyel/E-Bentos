package com.ebentos.backend.controller;

import com.ebentos.backend.dto.RegistroClienteDTO;
import com.ebentos.backend.model.Cliente;
import com.ebentos.backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    
    private final ClienteService clienteService;

    @Autowired
    public ClienteController(ClienteService clienteService){
        this.clienteService = clienteService;
    }
    
    @PostMapping
    public ResponseEntity<?> registrarCliente(@RequestBody RegistroClienteDTO registroDTO) {
        try {
            Cliente clienteCreado = clienteService.insertar(registroDTO);
            // Devolvemos 201 Created (no devolvemos la contraseña)
            return ResponseEntity.status(HttpStatus.CREATED).body("Cliente creado con ID: " + clienteCreado.getUsuarioId());
        } catch (RuntimeException e) {
            // Maneja errores como email duplicado o rol no encontrado
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Manejador general de errores
            System.err.println("Error inesperado durante el registro: " + e.getMessage()); // Log del error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al procesar el registro.");
        }
    }
}

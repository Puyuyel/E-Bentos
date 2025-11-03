package com.ebentos.backend.service;

import com.ebentos.backend.dto.RegistroUsuarioDTO;
import com.ebentos.backend.model.Cliente;
import com.ebentos.backend.model.Usuario;
import com.ebentos.backend.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    // Se elimina la inyección de UsuarioService (rompe el ciclo)
    private final ClienteRepository clienteRepository;

    // SOLO INYECTA LAS DEPENDENCIAS NECESARIAS
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    // CRUD, falta
}
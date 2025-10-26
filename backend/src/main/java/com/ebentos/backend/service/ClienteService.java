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

    // CRUD, fala


    // Construye la entidad cliente sin guardarla
    public Cliente crearNuevoClienteTemporal(RegistroUsuarioDTO registroUsuarioDTO) {

        // Crear y pre-llenar el Cliente
        Cliente nuevoCliente = new Cliente();

        // El UsuarioService se encarga de enlazar el 'usuario' y el 'id'

        nuevoCliente.setPuntosGastados(0);
        nuevoCliente.setPuntosAcumulados(0);
        nuevoCliente.setRegistradoPorTaquillero(1);
        nuevoCliente.setNombres(registroUsuarioDTO.getNombres());
        nuevoCliente.setApellidos(registroUsuarioDTO.getApellidos());
        nuevoCliente.setDni(registroUsuarioDTO.getDni());
        nuevoCliente.setFechaNacimiento(registroUsuarioDTO.getFechaNacimiento());
        nuevoCliente.setGenero(registroUsuarioDTO.getGenero());

        return nuevoCliente;
    }
}
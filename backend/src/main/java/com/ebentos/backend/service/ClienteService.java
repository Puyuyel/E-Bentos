package com.ebentos.backend.service;

import com.ebentos.backend.dto.RegistroClienteDTO;
import com.ebentos.backend.model.Cliente;
import com.ebentos.backend.model.Rol;
import com.ebentos.backend.repository.ClienteRepository;
import com.ebentos.backend.repository.RolRepository;
import com.ebentos.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    // SOLO INYECTA LAS DEPENDENCIAS NECESARIAS
    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository, RolRepository rolRepository,
            PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public Cliente insertar(RegistroClienteDTO registroClienteDTO){
        //Validar datos inicionales
        String email = registroClienteDTO.getEmail();
        String contrasenha = registroClienteDTO.getContrasenha();
        if(!email.contains("@") || contrasenha.length() < 8){
            throw new IllegalArgumentException("El formato del correo electrónico o contrasenha no es valido.");
        }

        // Validar si el email ya existe
        if (usuarioRepository.findByEmail(registroClienteDTO.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está en uso");
        }
        
        Rol rolUsuario = rolRepository.findByNombre("CLIENTE")
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        
        Cliente nuevoCliente = new Cliente();
        nuevoCliente.setDni(registroClienteDTO.getDni());
        nuevoCliente.setNombres(registroClienteDTO.getNombres());
        nuevoCliente.setApellidos(registroClienteDTO.getApellidos());
        nuevoCliente.setPuntosGastados(0);
        nuevoCliente.setPuntosAcumulados(0);
        nuevoCliente.setRegistradoPorTaquillero(0);
        nuevoCliente.setFechaNacimiento(registroClienteDTO.getFechaNacimiento());
        nuevoCliente.setGenero(registroClienteDTO.getGenero());
        nuevoCliente.setEmail(email);
        nuevoCliente.setTelefono(registroClienteDTO.getTelefono());
        nuevoCliente.setContrasenha(passwordEncoder.encode(contrasenha));
        nuevoCliente.setRol(rolUsuario);
        nuevoCliente.setActivo(1);
        
        Cliente cliente = clienteRepository.save(nuevoCliente);
        
        return cliente;
        
    }

    
}
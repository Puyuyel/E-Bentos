package com.ebentos.backend.service;

import com.ebentos.backend.dto.ClienteActualizaDTO;
import com.ebentos.backend.dto.ClienteDTO;
import com.ebentos.backend.dto.ClientesPuntosDTO;
import com.ebentos.backend.dto.DescuentoUnicoDTO;
import com.ebentos.backend.dto.OpcionCanjeDTO;
import com.ebentos.backend.dto.RegistroClienteDTO;
import com.ebentos.backend.model.Cliente;
import com.ebentos.backend.model.Descuento;
import com.ebentos.backend.model.DescuentoUnico;
import com.ebentos.backend.model.Rol;
import com.ebentos.backend.repository.ClienteRepository;
import com.ebentos.backend.repository.DescuentoRepository;
import com.ebentos.backend.repository.DescuentoUnicoRepository;
import com.ebentos.backend.repository.RolRepository;
import com.ebentos.backend.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final DescuentoRepository descuentoRepository;
    private final DescuentoUnicoRepository descuentoUnicoRepository;

    @Autowired
    // SOLO INYECTA LAS DEPENDENCIAS NECESARIAS
    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository, RolRepository rolRepository,
            PasswordEncoder passwordEncoder, DescuentoRepository descuentoRepository, DescuentoUnicoRepository descuentoUnicoRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.descuentoRepository = descuentoRepository;
        this.descuentoUnicoRepository = descuentoUnicoRepository;
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
    
    public ClienteDTO obtenerPorId(Integer id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con ID: " + id));

        ClienteDTO clienteDTO = mapToClienteDTO(cliente);

        return clienteDTO;
    }
    
    public ClienteDTO modificar(Integer id, ClienteActualizaDTO clienteActualizaDTO) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con ID: " + id));

        if (!Objects.equals(clienteActualizaDTO.getTelefono(), clienteExistente.getTelefono())) {
            clienteExistente.setTelefono(clienteActualizaDTO.getTelefono());
        }
        if (!Objects.equals(clienteActualizaDTO.getEmail(), clienteExistente.getEmail())) {
            clienteExistente.setEmail(clienteActualizaDTO.getEmail());
        }
        if (!clienteActualizaDTO.getContrasenha().isBlank()) {
            clienteExistente.setContrasenha(passwordEncoder.encode(clienteActualizaDTO.getContrasenha()));
        }
        if (!Objects.equals(clienteActualizaDTO.getActivo(), clienteExistente.getActivo())) {
            clienteExistente.setActivo(clienteActualizaDTO.getActivo());
        }
        if (!Objects.equals(clienteActualizaDTO.getGenero(), clienteExistente.getGenero())) {
            clienteExistente.setGenero(clienteActualizaDTO.getGenero());
        }

        Cliente clienteActualizado = clienteRepository.save(clienteExistente);
        return mapToClienteDTO(clienteActualizado);
    }

    
    private ClienteDTO mapToClienteDTO(Cliente cliente) {
        ClienteDTO clienteDTO = new ClienteDTO();

        clienteDTO.setUsuarioId(cliente.getUsuarioId());
        clienteDTO.setTelefono(cliente.getTelefono());
        clienteDTO.setEmail(cliente.getEmail());
        clienteDTO.setNombres(cliente.getNombres());
        clienteDTO.setApellidos(cliente.getApellidos());
        clienteDTO.setDni(cliente.getDni());
        clienteDTO.setFechaNacimiento(cliente.getFechaNacimiento());
        clienteDTO.setGenero(cliente.getGenero());
        clienteDTO.setPuntosAcumulados(cliente.getPuntosAcumulados());
        clienteDTO.setPuntosGastados(cliente.getPuntosGastados());

        return clienteDTO;
    }

    public void eliminar(Integer id){
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Productora no encontrada con id: " + id);
        }
    }

    //Metodos adicionales para el ciente
    @Transactional
    public void aumentarPuntos(Integer idCliente, Double totalPagado) {

        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        //Convertimos el total pagado a puntos
        Integer puntosGanados = (int) (totalPagado * 0.1);
        Integer puntosNuevos = cliente.getPuntosAcumulados() + puntosGanados;
        // Cambiamos los puntos
        cliente.setPuntosAcumulados(puntosNuevos);

        // Al salir, @Transactional hace commit
        // JPA detecta que se cambió y ejecuta por sí solo el update
    }
    
    @Transactional
    public void canjearPuntos(Integer idCliente, Integer idDescuento){
        Descuento desc = descuentoRepository.findById(idDescuento)
                .orElseThrow(() -> new RuntimeException("Descuento no encontrado"));
        Integer cantPuntosAQuitar = desc.getCostoPuntos();
        //Quitar puntos ganados y aumentar puntos gastados
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Integer puntosAcumulados= cliente.getPuntosAcumulados();
        Integer puntosGastados =  cliente.getPuntosGastados();
        
        // Validar puntos suficientes
        if (puntosAcumulados < cantPuntosAQuitar) {
            throw new RuntimeException("Puntos insuficientes para canjear este descuento.");
        }
        
        cliente.setPuntosAcumulados(puntosAcumulados-cantPuntosAQuitar);
        cliente.setPuntosGastados(puntosGastados+cantPuntosAQuitar);

        //Insertar en la tabla descuentoUnico
        
        DescuentoUnico descUnico = new DescuentoUnico();
        descUnico.setCliente(cliente);
        descUnico.setDescuento(desc);
        descUnico.setCodigoDescuento(generarCodigo());
        descUnico.setEstadoUsado(0);

        descuentoUnicoRepository.save(descUnico);

    }
    
    private String generarCodigo() {
        String letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder();

        // 3 letras
        for (int i = 0; i < 3; i++) {
            int index = (int) (Math.random() * letras.length());
            sb.append(letras.charAt(index));
        }

        sb.append("-");

        // 7 números
        for (int i = 0; i < 7; i++) {
            sb.append((int) (Math.random() * 10));
        }

        return sb.toString(); // Ejemplo: ZTF-8394021
    }

    
    public ClientesPuntosDTO listarMisPuntos(Integer idCliente){
        
        Cliente cliente = clienteRepository.findById(idCliente)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        
        List<DescuentoUnico> descuentosActivos = descuentoUnicoRepository.findActivosByClienteId(idCliente);
        
        List<Descuento> descuentosPredeterminados = descuentoRepository.findAll();
        
        List<DescuentoUnicoDTO> descuentosActivosDTO = descuentosActivos.stream()
                .map(descuentoUnico -> {
                    DescuentoUnicoDTO descuentoUnicoDTO = new DescuentoUnicoDTO();
                    descuentoUnicoDTO.setDescuentoUnicoId(descuentoUnico.getDescuentoUnicoId());
                    descuentoUnicoDTO.setNombre(descuentoUnico.getDescuento().getNombre());
                    descuentoUnicoDTO.setValorPorcentaje(descuentoUnico.getDescuento().getValorPorcentaje());
                    descuentoUnicoDTO.setCostoPuntos(descuentoUnico.getDescuento().getCostoPuntos());
                    descuentoUnicoDTO.setCodigoDescuento(descuentoUnico.getCodigoDescuento());
                    return descuentoUnicoDTO;
                }).collect(Collectors.toList());
        
        List<OpcionCanjeDTO> opcionesCanjeDTO = descuentosPredeterminados.stream()
                .map(des -> {
                    OpcionCanjeDTO dto = new OpcionCanjeDTO();
                    dto.setDescuentoId(des.getDescuentoId());
                    dto.setNombre(des.getNombre());
                    dto.setValorPorcentaje(des.getValorPorcentaje());
                    dto.setCostoPuntos(des.getCostoPuntos());
                    return dto;
                })
                .collect(Collectors.toList());
        
        ClientesPuntosDTO dto = new ClientesPuntosDTO();
        dto.setPuntosActuales(cliente.getPuntosAcumulados());
        dto.setDescuentosActivos(descuentosActivosDTO);
        dto.setOpcionesCanje(opcionesCanjeDTO);

        return dto;
    }

}
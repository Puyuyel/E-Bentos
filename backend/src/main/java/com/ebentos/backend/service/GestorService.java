package com.ebentos.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ebentos.backend.dto.GestorActualizaDTO;
import com.ebentos.backend.dto.GestorDTO;
import com.ebentos.backend.dto.GestorSimpleNombreDTO;
import com.ebentos.backend.dto.PuntoVentaDTO;
import com.ebentos.backend.dto.RegistroGestorDTO;
import com.ebentos.backend.dto.UsuarioSimpleDTO;
import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.model.PuntoVenta;
import com.ebentos.backend.model.Rol;
import com.ebentos.backend.model.Usuario;
import com.ebentos.backend.repository.GestorRepository;
import com.ebentos.backend.repository.RolRepository;
import com.ebentos.backend.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class GestorService {
    private final GestorRepository gestorRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    // SOLO INYECTA LAS DEPENDENCIAS NECESARIAS
    public GestorService(GestorRepository gestorRepository, 
            UsuarioRepository usuarioRepository, RolRepository rolRepository,
            PasswordEncoder passwordEncoder) {
        this.gestorRepository = gestorRepository;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public Gestor insertar(RegistroGestorDTO registroGestorDTO){
        //Validar datos inicionales
        String email = registroGestorDTO.getEmail();
        String contrasenha = registroGestorDTO.getContrasenha();
        if(!email.contains("@") || contrasenha.length() < 6){
            throw new IllegalArgumentException("El formato del correo electrónico o contrasenha no es valido.");
        }

        // Validar si el email ya existe
        if (usuarioRepository.findByEmail(registroGestorDTO.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está en uso");
        }
        
        // Validar si el dni ya existe
        if (gestorRepository.findByDniAndActivo(registroGestorDTO.getDni()).isPresent()) {
            throw new RuntimeException("El dni ya está en uso");
        }

        // Buscar el rol
        Rol rolUsuario = rolRepository.findByNombre(registroGestorDTO.getNombreRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        Gestor nuevoGestor = new Gestor();
        nuevoGestor.setDni(registroGestorDTO.getDni());
        nuevoGestor.setNombres(registroGestorDTO.getNombres());
        nuevoGestor.setApellidos(registroGestorDTO.getApellidos());
        nuevoGestor.setEmail(email);
        nuevoGestor.setTelefono(registroGestorDTO.getTelefono());
        nuevoGestor.setContrasenha(passwordEncoder.encode(contrasenha));
        nuevoGestor.setRol(rolUsuario);
        nuevoGestor.setActivo(1);
        Usuario usuarioCreador = new Usuario();
        usuarioCreador.setUsuarioId(registroGestorDTO.getUsuarioCreador().getUsuarioId());
        nuevoGestor.setUsuarioCreador(usuarioCreador);
        if(rolUsuario.getNombre().equals("TAQUILLERO")){
            PuntoVenta puntoVenta = new PuntoVenta();
            puntoVenta.setPuntoventaId(registroGestorDTO.getPuntoVenta().getPuntoVentaId());
            nuevoGestor.setPuntoVenta(puntoVenta);
        }
        
        Gestor gestor = gestorRepository.save(nuevoGestor);
        
        return gestor;
        
    }
    
    public GestorDTO obtenerPorId(Integer id) {
        // Usar Optional con la entidad para manejar el caso de no encontrarla
        Gestor gestor = gestorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Gestor no encontrado con ID: " + id));

        GestorDTO gestorDTO = llenarDTO(gestor);

        return gestorDTO;
    }
    
    public Map<String, Object> listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Gestor> gestoresPage = gestorRepository.findAll(pageable);

        // Convertimos la lista de entidades a DTOs
        List<GestorDTO> gestoresDTO = gestoresPage.getContent().stream()
                .map(this::llenarDTO)
                .collect(Collectors.toList());

        // Construimos la respuesta con la estructura pedida
        Map<String, Object> response = new HashMap<>();
        response.put("data", gestoresDTO);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("totalItems", gestoresPage.getTotalElements());
        pagination.put("totalPages", gestoresPage.getTotalPages());
        pagination.put("currentPage", gestoresPage.getNumber());
        pagination.put("pageSize", gestoresPage.getSize());
        pagination.put("hasNextPage", gestoresPage.hasNext());
        pagination.put("hasPreviousPage", gestoresPage.hasPrevious());
        pagination.put("nextPage", gestoresPage.hasNext() ? "/api/gestores?page=" + (page + 1) + "&limit=" + size : null);
        pagination.put("prevPage", gestoresPage.hasPrevious() ? "/api/gestores?page=" + (page - 1) + "&limit=" + size : null);

        response.put("pagination", pagination);

        return response;
    }
    
    public Map<String, Object> listarPaginadoPorBuscadorYRol(int page, int size, 
            String nombreRol, String buscador) {
        Pageable pageable = PageRequest.of(page, size);
        buscador = "%" + buscador.toLowerCase() + "%";
        Page<Gestor> gestoresPage = gestorRepository.buscarPorBuscadorYRol(nombreRol, buscador, pageable);

        // Convertimos la lista de entidades a DTOs
        List<GestorDTO> gestoresDTO = gestoresPage.getContent().stream()
                .map(this::llenarDTO)
                .collect(Collectors.toList());

        // Construimos la respuesta con la estructura pedida
        Map<String, Object> response = new HashMap<>();
        response.put("data", gestoresDTO);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("totalItems", gestoresPage.getTotalElements());
        pagination.put("totalPages", gestoresPage.getTotalPages());
        pagination.put("currentPage", gestoresPage.getNumber());
        pagination.put("pageSize", gestoresPage.getSize());
        pagination.put("hasNextPage", gestoresPage.hasNext());
        pagination.put("hasPreviousPage", gestoresPage.hasPrevious());
        pagination.put("nextPage", gestoresPage.hasNext() ? "/api/gestores?page=" + (page + 1) + "&limit=" + size : null);
        pagination.put("prevPage", gestoresPage.hasPrevious() ? "/api/gestores?page=" + (page - 1) + "&limit=" + size : null);

        response.put("pagination", pagination);

        return response;
    }
    
    public Map<String, Object> listarPaginadoPorBuscadorYProductora(int page, int size, 
            Integer productoraId, String buscador) {
        Pageable pageable = PageRequest.of(page, size);
        buscador = "%" + buscador.toLowerCase() + "%";
        Page<Gestor> gestoresPage = gestorRepository.buscarPorBuscadorYProductora(productoraId, buscador, pageable);

        // Convertimos la lista de entidades a DTOs
        List<GestorDTO> gestoresDTO = gestoresPage.getContent().stream()
                .map(this::llenarDTO)
                .collect(Collectors.toList());

        // Construimos la respuesta con la estructura pedida
        Map<String, Object> response = new HashMap<>();
        response.put("data", gestoresDTO);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("totalItems", gestoresPage.getTotalElements());
        pagination.put("totalPages", gestoresPage.getTotalPages());
        pagination.put("currentPage", gestoresPage.getNumber());
        pagination.put("pageSize", gestoresPage.getSize());
        pagination.put("hasNextPage", gestoresPage.hasNext());
        pagination.put("hasPreviousPage", gestoresPage.hasPrevious());
        pagination.put("nextPage", gestoresPage.hasNext() ? "/api/gestores?page=" + (page + 1) + "&limit=" + size : null);
        pagination.put("prevPage", gestoresPage.hasPrevious() ? "/api/gestores?page=" + (page - 1) + "&limit=" + size : null);

        response.put("pagination", pagination);

        return response;
    }
    
    public List<GestorDTO> listarTodas() {
        // Obtener todas las entidades
        List<Gestor> gestores = gestorRepository.findAll();

        // Mapear cada entidad a su DTO
        return gestores.stream()
                .map(gestor -> {
                    GestorDTO gestorDTO = llenarDTO(gestor);
                    return gestorDTO;
                })
                .collect(Collectors.toList());
    }
    
    private GestorDTO llenarDTO(Gestor gestor){
        GestorDTO gestorDTO = new GestorDTO();
        gestorDTO.setDni(gestor.getDni());
        gestorDTO.setNombres(gestor.getNombres());
        gestorDTO.setApellidos(gestor.getApellidos());
        gestorDTO.setUsuarioId(gestor.getUsuarioId());
        gestorDTO.setTelefono(gestor.getTelefono());
        gestorDTO.setEmail(gestor.getEmail());
        
        if(gestor.getUsuarioCreador()!=null){
            UsuarioSimpleDTO usuarioCreador = new UsuarioSimpleDTO();
            usuarioCreador.setUsuarioId(gestor.getUsuarioCreador().getUsuarioId());
            gestorDTO.setUsuarioCreador(usuarioCreador);
        }
        
        if(gestor.getPuntoVenta()!=null){
            PuntoVentaDTO puntoVenta = new PuntoVentaDTO();
            puntoVenta.setPuntoVentaId(gestor.getPuntoVenta().getPuntoventaId());
            puntoVenta.setNombre(gestor.getPuntoVenta().getNombre());
            puntoVenta.setDireccion(gestor.getPuntoVenta().getDireccion());
            gestorDTO.setPuntoVenta(puntoVenta);
        }
        
        return gestorDTO;
    }
    
    public GestorDTO modificar(Integer id, GestorActualizaDTO gestorActualizaDTO) {

        // BUSCAR la entidad existente
        Gestor gestorExistente = gestorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Gestor no encontrado con ID: " + id));

        if (!Objects.equals(gestorActualizaDTO.getNombres(), gestorExistente.getNombres())) {
            gestorExistente.setNombres(gestorActualizaDTO.getNombres());
        }

        if (!Objects.equals(gestorActualizaDTO.getApellidos(), gestorExistente.getApellidos())) {
            gestorExistente.setApellidos(gestorActualizaDTO.getApellidos());
        }
        
        if (gestorActualizaDTO.getPuntoVenta()!=null && gestorActualizaDTO.getPuntoVenta().getPuntoVentaId()!=null) {
            PuntoVenta puntoventa = new PuntoVenta();
            puntoventa.setPuntoventaId(gestorActualizaDTO.getPuntoVenta().getPuntoVentaId());
            gestorExistente.setPuntoVenta(puntoventa);
        }

        if (!Objects.equals(gestorActualizaDTO.getTelefono(), gestorExistente.getTelefono())) {
            gestorExistente.setTelefono(gestorActualizaDTO.getTelefono());
        }

        if (!Objects.equals(gestorActualizaDTO.getEmail(), gestorExistente.getEmail())) {
            if (usuarioRepository.findByEmail(gestorActualizaDTO.getEmail()).isPresent()) {
                throw new RuntimeException("El email ya está en uso");
            }
            gestorExistente.setEmail(gestorActualizaDTO.getEmail());
        }
        
        if (!Objects.equals(gestorActualizaDTO.getActivo(), gestorExistente.getActivo())) {
            gestorExistente.setActivo(gestorActualizaDTO.getActivo());
        }

        if (!gestorActualizaDTO.getContrasenha().isBlank()) {
            gestorExistente.setContrasenha(passwordEncoder.encode(gestorActualizaDTO.getContrasenha()));
        }

        //  GUARDAR y devolver
        Gestor gestorActualizado = gestorRepository.save(gestorExistente);

        //  Mapear y devolver el DTO de respuesta
        return mapToGestorDTO(gestorActualizado);
    }

    private GestorDTO mapToGestorDTO(Gestor gestor) {

        //  Mapear la Productora al DTO principal (ProductoraDTO)
        GestorDTO gestorDTO = new GestorDTO();

        // Mapeamos los campos directos de Productora (asumiendo que estos existen
        // en la entidad Productora además de los que heredó de Usuario)
        gestorDTO.setDni(gestor.getDni());
        gestorDTO.setNombres(gestor.getNombres());
        gestorDTO.setApellidos(gestor.getApellidos());
        gestorDTO.setUsuarioId(gestor.getUsuarioId());
        gestorDTO.setTelefono(gestor.getTelefono());
        gestorDTO.setEmail(gestor.getEmail());
        
        if(gestor.getPuntoVenta()!=null){
            PuntoVentaDTO puntoVentaDTO = new PuntoVentaDTO();
            puntoVentaDTO.setPuntoVentaId(gestor.getPuntoVenta().getPuntoventaId());
            gestorDTO.setPuntoVenta(puntoVentaDTO);
        }
        return gestorDTO;
    }
    
    public void eliminar(Integer id){
        if (gestorRepository.existsById(id)) {
            gestorRepository.deleteById(id);
        } else {
            throw new RuntimeException("Gestor no encontrado con id: " + id);
        }
    }

    public GestorDTO modificarAInactivo(Integer id){
        // BUSCAR la entidad existente
        Gestor gestorExistente = gestorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Gestor no encontrado con ID: " + id));

        gestorExistente.setActivo(0);

        //  GUARDAR y devolver
        Gestor gestorActualizado = gestorRepository.save(gestorExistente);

        //  Mapear y devolver el DTO de respuesta
        return mapToGestorDTO(gestorActualizado);
    }

    public GestorSimpleNombreDTO obtenerNombrePorDni(String dni) {
        // Buscar el gestor sin importar si está activo o no
        Gestor gestor = gestorRepository.findByDniAndActivo(dni)
            .orElseThrow(() -> new EntityNotFoundException("No existe un gestor registrado con DNI: " + dni));
        
        // Si está inactivo, lanzar una excepción más clara
        //if (gestor.getActivo() == 0) {
        //    throw new EntityNotFoundException("El gestor con DNI " + dni + " ha sido desactivado");
        //}
        
        GestorSimpleNombreDTO dto = new GestorSimpleNombreDTO();
        dto.setUsuarioId(gestor.getUsuarioId());
        dto.setNombre(gestor.getNombres() + " " + gestor.getApellidos());
        return dto;
    }
    
}

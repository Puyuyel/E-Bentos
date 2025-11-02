package com.ebentos.backend.service;

import com.ebentos.backend.dto.GestorActualizaDTO;
import com.ebentos.backend.dto.GestorDTO;
import com.ebentos.backend.dto.PuntoVentaDTO;
import com.ebentos.backend.dto.UsuarioSimpleDTO;
import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.model.PuntoVenta;
import com.ebentos.backend.repository.GestorRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.HashMap;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class GestorService {
    private final GestorRepository gestorRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    // SOLO INYECTA LAS DEPENDENCIAS NECESARIAS
    public GestorService(GestorRepository gestorRepository, PasswordEncoder passwordEncoder) {
        this.gestorRepository = gestorRepository;
        this.passwordEncoder = passwordEncoder;
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
        
        if (!Objects.equals(gestorActualizaDTO.getPuntoVenta(), gestorExistente.getPuntoVenta())) {
            gestorExistente.setPuntoVenta(gestorActualizaDTO.getPuntoVenta());
        }

        if (!Objects.equals(gestorActualizaDTO.getTelefono(), gestorExistente.getTelefono())) {
            gestorExistente.setTelefono(gestorActualizaDTO.getTelefono());
        }

        if (!Objects.equals(gestorActualizaDTO.getEmail(), gestorExistente.getEmail())) {
            gestorExistente.setEmail(gestorActualizaDTO.getEmail());
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
}

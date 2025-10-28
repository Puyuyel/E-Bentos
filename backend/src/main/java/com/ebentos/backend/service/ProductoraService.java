package com.ebentos.backend.service;

import com.ebentos.backend.dto.ProductoraActualizaDTO;
import com.ebentos.backend.dto.ProductoraDTO;
import com.ebentos.backend.model.Productora;
import com.ebentos.backend.repository.ProductoraRepository;
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
public class ProductoraService {

    private final ProductoraRepository productoraRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    // SOLO INYECTA LAS DEPENDENCIAS NECESARIAS
    public ProductoraService(ProductoraRepository productoraRepository, PasswordEncoder passwordEncoder) {
        this.productoraRepository = productoraRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ----------------------------------------------- CRUD -------------------------------------------------
    public ProductoraDTO obtenerPorId(Integer id) {
        // Usar Optional con la entidad para manejar el caso de no encontrarla
        Productora productora = productoraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Productora no encontrada con ID: " + id));

        ProductoraDTO productoraDTO = llenarDTO(productora);

        return productoraDTO;
    }
    
    public Map<String, Object> listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Productora> productorasPage = productoraRepository.findAll(pageable);

        // Convertimos la lista de entidades a DTOs
        List<ProductoraDTO> productorasDTO = productorasPage.getContent().stream()
                .map(this::llenarDTO)
                .collect(Collectors.toList());

        // Construimos la respuesta con la estructura pedida
        Map<String, Object> response = new HashMap<>();
        response.put("data", productorasDTO);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("totalItems", productorasPage.getTotalElements());
        pagination.put("totalPages", productorasPage.getTotalPages());
        pagination.put("currentPage", productorasPage.getNumber());
        pagination.put("pageSize", productorasPage.getSize());
        pagination.put("hasNextPage", productorasPage.hasNext());
        pagination.put("hasPreviousPage", productorasPage.hasPrevious());
        pagination.put("nextPage", productorasPage.hasNext() ? "/api/productoras?page=" + (page + 1) + "&limit=" + size : null);
        pagination.put("prevPage", productorasPage.hasPrevious() ? "/api/productoras?page=" + (page - 1) + "&limit=" + size : null);

        response.put("pagination", pagination);

        return response;
    }

    public List<ProductoraDTO> listarTodas() {
        // Obtener todas las entidades
        List<Productora> productoras = productoraRepository.findAll();

        // Mapear cada entidad a su DTO
        return productoras.stream()
                .map(productora -> {
                    ProductoraDTO productoraDTO = llenarDTO(productora);
                    return productoraDTO;
                })
                .collect(Collectors.toList());
    }

    private ProductoraDTO llenarDTO(Productora  productora){
        ProductoraDTO productoraDTO = new ProductoraDTO();
        productoraDTO.setRazonSocial(productora.getRazonSocial());
        productoraDTO.setNombreComercial(productora.getNombreComercial());
        productoraDTO.setRuc(productora.getRuc());
        productoraDTO.setUsuarioId(productora.getUsuarioId());
        productoraDTO.setTelefono(productora.getTelefono());
        productoraDTO.setEmail(productora.getEmail());
        
        return productoraDTO;
    }

    public ProductoraDTO modificar(Integer id, ProductoraActualizaDTO productoraActualizaDTO) {

        // BUSCAR la entidad existente
        Productora productoraExistente = productoraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Productora no encontrada con ID: " + id));

        // ACTUALIZAR campos de Productora (Usando Objects.equals() para comparación de Strings)
        if (!Objects.equals(productoraActualizaDTO.getRazonSocial(), productoraExistente.getRazonSocial())) {
            productoraExistente.setRazonSocial(productoraActualizaDTO.getRazonSocial());
        }

        if (!Objects.equals(productoraActualizaDTO.getNombreComercial(), productoraExistente.getNombreComercial())) {
            productoraExistente.setNombreComercial(productoraActualizaDTO.getNombreComercial());
        }

        if (!Objects.equals(productoraActualizaDTO.getRuc(), productoraExistente.getRuc())) {
            productoraExistente.setRuc(productoraActualizaDTO.getRuc());
        }

        if (!Objects.equals(productoraActualizaDTO.getTelefono(), productoraExistente.getTelefono())) {
            productoraExistente.setTelefono(productoraActualizaDTO.getTelefono());
        }

        if (!Objects.equals(productoraActualizaDTO.getEmail(), productoraExistente.getEmail())) {
            productoraExistente.setEmail(productoraActualizaDTO.getEmail());
        }

        if (!productoraActualizaDTO.getContrasenha().isBlank()) {
            productoraExistente.setContrasenha(passwordEncoder.encode(productoraActualizaDTO.getContrasenha()));
        }

        if (!Objects.equals(productoraActualizaDTO.getActivo(), productoraExistente.getActivo())) {
            productoraExistente.setActivo(productoraActualizaDTO.getActivo());
        }

        //  GUARDAR y devolver
        Productora productoraActualizada = productoraRepository.save(productoraExistente);

        //  Mapear y devolver el DTO de respuesta
        return mapToProductoraDTO(productoraActualizada);
    }

    private ProductoraDTO mapToProductoraDTO(Productora productora) {

        //  Mapear la Productora al DTO principal (ProductoraDTO)
        ProductoraDTO productoraDTO = new ProductoraDTO();

        // Mapeamos los campos directos de Productora (asumiendo que estos existen
        // en la entidad Productora además de los que heredó de Usuario)
        productoraDTO.setRuc(productora.getRuc());
        productoraDTO.setRazonSocial(productora.getRazonSocial());
        productoraDTO.setNombreComercial(productora.getNombreComercial());
        productoraDTO.setUsuarioId(productora.getUsuarioId());
        productoraDTO.setTelefono(productora.getTelefono());
        productoraDTO.setEmail(productora.getEmail());

        return productoraDTO;
    }

}

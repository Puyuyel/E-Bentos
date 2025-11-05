package com.ebentos.backend.service;

import com.ebentos.backend.dto.DistritoDTO;
import com.ebentos.backend.dto.GestorSimpleDTO;
import com.ebentos.backend.dto.LocalActualizaDTO;
import com.ebentos.backend.dto.LocalDTO;
import com.ebentos.backend.model.Distrito;
import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.model.Local;
import com.ebentos.backend.repository.LocalRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class LocalService {
    private final LocalRepository localReporsitory;
    
    @Autowired
    public LocalService(LocalRepository localReporsitory) {
        this.localReporsitory = localReporsitory;
    }
    
    public LocalDTO obtenerPorId(Integer id) {
        Local local = localReporsitory.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Gestor no encontrado con ID: " + id));

        LocalDTO localDTO = llenarDTO(local);

        return localDTO;
    }
    
    public Map<String, Object> listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Local> localesPage = localReporsitory.findAll(pageable);

        List<LocalDTO> localesDTO = localesPage.getContent().stream()
                .map(this::llenarDTO)
                .collect(Collectors.toList());

        // Construimos la respuesta con la estructura pedida
        Map<String, Object> response = new HashMap<>();
        response.put("data", localesDTO);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("totalItems", localesPage.getTotalElements());
        pagination.put("totalPages", localesPage.getTotalPages());
        pagination.put("currentPage", localesPage.getNumber());
        pagination.put("pageSize", localesPage.getSize());
        pagination.put("hasNextPage", localesPage.hasNext());
        pagination.put("hasPreviousPage", localesPage.hasPrevious());
        pagination.put("nextPage", localesPage.hasNext() ? "/api/locales?page=" + (page + 1) + "&limit=" + size : null);
        pagination.put("prevPage", localesPage.hasPrevious() ? "/api/locales?page=" + (page - 1) + "&limit=" + size : null);

        response.put("pagination", pagination);

        return response;
    }

    public List<LocalDTO> listarTodas() {
        // Obtener todas las entidades
        List<Local> locales = localReporsitory.findAll();

        // Mapear cada entidad a su DTO
        return locales.stream()
                .map(local -> {
                    LocalDTO localDTO = llenarDTO(local);
                    return localDTO;
                })
                .collect(Collectors.toList());
    }
    
    public LocalDTO insertar(LocalDTO localDTO) {
        
        Local local = new Local();

        // Mapeo desde el DTO hacia la entidad
        local.setNombre(localDTO.getNombre());
        local.setDireccion(localDTO.getDireccion());
        local.setFoto(localDTO.getFoto());
        local.setAforo(localDTO.getAforo());
        local.setTipoLocal(localDTO.getTipoLocal());
        local.setActivo(1);

        // Asociar Gestor (solo con el ID)
        if (localDTO.getGestor() != null && localDTO.getGestor().getUsuarioId() != null) {
            Gestor gestor = new Gestor();
            gestor.setUsuarioId(localDTO.getGestor().getUsuarioId());
            local.setGestor(gestor);
        }

        // Asociar Distrito (solo con el ID)
        if (localDTO.getDistrito() != null && localDTO.getDistrito().getDistritoId() != null) {
            Distrito distrito = new Distrito();
            distrito.setDistritoId(localDTO.getDistrito().getDistritoId());
            local.setDistrito(distrito);
        }

        // Guardar en BD
        Local localGuardado = localReporsitory.save(local);
        
        LocalDTO localDevuelto = mapToLocalDTO(localGuardado);
        
        localDevuelto.setLocalId(localGuardado.getLocalId());

        // Devolver DTO
        return localDevuelto;
    }

    public void eliminar(Integer id) {
        if (localReporsitory.existsById(id)) {
            localReporsitory.deleteById(id);
        } else {
            throw new RuntimeException("Local no encontrado con id: " + id);
        }
    }
    
    public LocalDTO modificar(Integer id, LocalActualizaDTO localActualizaDTO) {

        // Buscar el local existente    
        Local localExistente = localReporsitory.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Local no encontrado con ID: " + id));

        // Campos simples (solo se actualizan si cambiaron)
        if (!Objects.equals(localActualizaDTO.getNombre(), localExistente.getNombre())) {
            localExistente.setNombre(localActualizaDTO.getNombre());
        }

        if (!Objects.equals(localActualizaDTO.getDireccion(), localExistente.getDireccion())) {
            localExistente.setDireccion(localActualizaDTO.getDireccion());
        }

        if (!Objects.equals(localActualizaDTO.getFoto(), localExistente.getFoto())) {
            localExistente.setFoto(localActualizaDTO.getFoto());
        }

        if (!Objects.equals(localActualizaDTO.getAforo(), localExistente.getAforo())) {
            localExistente.setAforo(localActualizaDTO.getAforo());
        }

        if (!Objects.equals(localActualizaDTO.getTipoLocal(), localExistente.getTipoLocal())) {
            localExistente.setTipoLocal(localActualizaDTO.getTipoLocal());
        }
        
        if (!Objects.equals(localActualizaDTO.getDistrito(), localExistente.getDistrito())) {
            localExistente.setDistrito(localActualizaDTO.getDistrito());
        }
        
        if (!Objects.equals(localActualizaDTO.getGestor(), localExistente.getGestor())) {
            localExistente.setGestor(localActualizaDTO.getGestor());
        }

        //  GUARDAR y devolver
        Local localActualizado = localReporsitory.save(localExistente);

        //  Mapear y devolver el DTO de respuesta
        return mapToLocalDTO(localActualizado);
    }

    private LocalDTO mapToLocalDTO(Local local) {

        //  Mapear el Local al DTO principal (LocalDTO)
        LocalDTO localDTO = new LocalDTO();
        
        localDTO.setLocalId(local.getLocalId());
        localDTO.setNombre(local.getNombre());
        localDTO.setDireccion(local.getDireccion());
        localDTO.setFoto(local.getFoto());
        localDTO.setAforo(local.getAforo());
        localDTO.setTipoLocal(local.getTipoLocal());

        // Gestor
        if (local.getGestor() != null) {
            GestorSimpleDTO gestorDTO = new GestorSimpleDTO();
            gestorDTO.setUsuarioId(local.getGestor().getUsuarioId());
            localDTO.setGestor(gestorDTO);
        }

        // Distrito
        if (local.getDistrito() != null) {
            DistritoDTO distritoDTO = new DistritoDTO();
            distritoDTO.setDistritoId(local.getDistrito().getDistritoId());
            distritoDTO.setNombre(local.getDistrito().getNombre());
            localDTO.setDistrito(distritoDTO);
        }

        return localDTO;
    }

    private LocalDTO llenarDTO(Local local) {
        LocalDTO localdto = new LocalDTO();
        
        localdto.setLocalId(local.getLocalId());
        localdto.setNombre(local.getNombre());
        localdto.setDireccion(local.getDireccion());
        localdto.setFoto(local.getFoto());
        localdto.setAforo(local.getAforo());
        localdto.setTipoLocal(local.getTipoLocal());
        localdto.setActivo(local.getActivo());
        if (local.getGestor() != null) {
            GestorSimpleDTO gestorDTO = new GestorSimpleDTO();
            gestorDTO.setUsuarioId(local.getGestor().getUsuarioId());
            localdto.setGestor(gestorDTO);
        }

        if (local.getDistrito() != null) {
            DistritoDTO distritoDTO = new DistritoDTO();
            distritoDTO.setDistritoId(local.getDistrito().getDistritoId());
            distritoDTO.setNombre(local.getDistrito().getNombre());
            localdto.setDistrito(distritoDTO);
        }

        return localdto;
    }
}

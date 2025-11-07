package com.ebentos.backend.service;

import com.ebentos.backend.dto.DistritoDTO;
import com.ebentos.backend.dto.GestorSimpleDTO;
import com.ebentos.backend.dto.LocalActualizaDTO;
import com.ebentos.backend.dto.LocalDTO;
import com.ebentos.backend.dto.RegistroLocalDTO;
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
    
    public Map<String, Object> listarPaginadoPorBuscador(int page, int size, String buscador) {
        Pageable pageable = PageRequest.of(page, size);
        buscador = "%" + buscador.toLowerCase() + "%";
        Page<Local> localesPage = localReporsitory.buscarPorBuscador(buscador,pageable);

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
    
    public Map<String, Object> listarPaginadoPorBuscadorYDuenho(int page, int size, String buscador, Integer duenhoId) {
        Pageable pageable = PageRequest.of(page, size);
        buscador = "%" + buscador.toLowerCase() + "%";
        Page<Local> localesPage = localReporsitory.buscarPorBuscadorYDuenho(buscador,duenhoId,pageable);

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
    
    public LocalDTO insertar(RegistroLocalDTO registroLocalDTO) {
        
        Local local = new Local();

        // Mapeo desde el DTO hacia la entidad
        local.setNombre(registroLocalDTO.getNombre());
        local.setDireccion(registroLocalDTO.getDireccion());
        local.setFoto(registroLocalDTO.getFoto());
        local.setAforo(registroLocalDTO.getAforo());
        local.setTipoLocal(registroLocalDTO.getTipoLocal());
        local.setActivo(1);

        // Asociar Gestor (solo con el ID)
        if (registroLocalDTO.getGestor() != null && registroLocalDTO.getGestor().getUsuarioId() != null) {
            Gestor gestor = new Gestor();
            gestor.setUsuarioId(registroLocalDTO.getGestor().getUsuarioId());
            local.setGestor(gestor);
        }

        // Asociar Distrito (solo con el ID)
        if (registroLocalDTO.getDistrito() != null && registroLocalDTO.getDistrito().getDistritoId() != null) {
            Distrito distrito = new Distrito();
            distrito.setDistritoId(registroLocalDTO.getDistrito().getDistritoId());
            local.setDistrito(distrito);
        }

        // Guardar en BD
        Local localGuardado = localReporsitory.save(local);
        
        LocalDTO localDevuelto = llenarDTO(localGuardado);

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

        //  GUARDAR y devolver
        Local localActualizado = localReporsitory.save(localExistente);

        //  Mapear y devolver el DTO de respuesta
        return llenarDTO(localActualizado);
    }

    public LocalDTO modificarAInactivo(Integer id){
        // Buscar el local existente
        Local localExistente = localReporsitory.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Local no encontrado con ID: " + id));

        localExistente.setActivo(0);

        //  Guardo y devolver
        Local localActualizado = localReporsitory.save(localExistente);

        //  Mapeo y devuelvo el DTO de respuesta
        return llenarDTO(localActualizado);
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

package com.ebentos.backend.service;

import com.ebentos.backend.dto.EventoSimpleDTO;
import com.ebentos.backend.dto.LocalSimpleParaVentasDTO;
import com.ebentos.backend.dto.VentaDTO;
import com.ebentos.backend.model.Venta;
import com.ebentos.backend.repository.VentaRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VentaService {
    
    private final VentaRepository ventaRepository;
    
    @Autowired
    public VentaService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }
    
    public VentaDTO obtenerPorId(Integer id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada con ID: " + id));

        VentaDTO ventaDTO = llenarDTO(venta);

        return ventaDTO;
    }
    
    public List<VentaDTO> listarTodas() {
        return ventaRepository.findAll()
                .stream()
                .map(this::llenarDTO)
                .collect(Collectors.toList());
    }
    
    private VentaDTO llenarDTO(Venta venta) {
        VentaDTO ventaDTO = new VentaDTO();
        
        ventaDTO.setVentaId(venta.getVentaId());
        ventaDTO.setMontoTotalFinal(venta.getMontoTotalFinal());
        ventaDTO.setPuntosGanados((int)(venta.getMontoTotalFinal()*0.1));
        
        if (venta.getEvento() != null){
            EventoSimpleDTO eventoDTO = new EventoSimpleDTO();
            eventoDTO.setEventoId(venta.getEvento().getEventoId());
            eventoDTO.setNombre(venta.getEvento().getNombre());
            eventoDTO.setFechaHorarioInicio(venta.getEvento().getFechaHorarioInicio());
            ventaDTO.setEvento(eventoDTO);
        }
        
        if (venta.getEvento().getLocal() != null){
            LocalSimpleParaVentasDTO localDTO = new LocalSimpleParaVentasDTO();
            localDTO.setLocalId(venta.getEvento().getLocal().getLocalId());
            localDTO.setNombre(venta.getEvento().getLocal().getNombre());
            localDTO.setDireccion(venta.getEvento().getLocal().getDireccion());
            ventaDTO.setLocal(localDTO);
        } 
        
        return ventaDTO;
    }
}

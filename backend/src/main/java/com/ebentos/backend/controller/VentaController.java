package com.ebentos.backend.controller;

import com.ebentos.backend.config.UsuarioDetails;
import com.ebentos.backend.dto.VentaConEntradasDTO;
import com.ebentos.backend.dto.VentaDTO;
import com.ebentos.backend.service.VentaService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {
    
    private final VentaService ventaService;
    
    @Autowired
    public VentaController(VentaService ventaService){
        this.ventaService = ventaService;
    }
    //Lista todas las ventas sin importar que sean del cliente
    @GetMapping
    public List<VentaConEntradasDTO> listarTodas() {
        return ventaService.listarTodas();
    }
    
    @GetMapping("/{id}")
    public VentaDTO obtenerPorId(@PathVariable Integer id) {
        return ventaService.obtenerPorId(id);
    }
    //lista las compras pasadas del cliente, lo hace chapando al cliente logeeado en ese momento
    @GetMapping("/pasadas")
    public List<VentaDTO> listarPasadas(Authentication authentication) {
        UsuarioDetails user = (UsuarioDetails) authentication.getPrincipal();
        Integer clienteId = user.getUsuarioId();
        return ventaService.listarPasadas(clienteId);
    }
    //lista las compras activas del cliente, lo hace chapando al cliente logeeado en ese momento
    @GetMapping("/activas")
    public List<VentaConEntradasDTO> listarActivas(Authentication authentication) {
        UsuarioDetails user = (UsuarioDetails) authentication.getPrincipal();
        Integer clienteId = user.getUsuarioId();
        return ventaService.listarActivas(clienteId);
    }
    
    @GetMapping("/{ventaId}/descargar")
    public ResponseEntity<byte[]> descargarEntradas(@PathVariable Integer ventaId,
            Authentication authentication) {

        UsuarioDetails user = (UsuarioDetails) authentication.getPrincipal();
        Integer clienteId = user.getUsuarioId();

        byte[] pdf = ventaService.generarPdfEntradas(ventaId, clienteId);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=entradas_" + ventaId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

}

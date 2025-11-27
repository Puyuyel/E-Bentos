package com.ebentos.backend.controller;

import com.ebentos.backend.config.UsuarioDetails;
import com.ebentos.backend.dto.RegistroVentaDTO;
import com.ebentos.backend.dto.SolicitudReservaDTO;
import com.ebentos.backend.dto.VentaConEntradasDTO;
import com.ebentos.backend.dto.VentaDTO;
import com.ebentos.backend.model.Reserva;
import com.ebentos.backend.service.VentaService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public List<VentaDTO> listarTodas() {
        return ventaService.listarTodas();
    }
    
    @GetMapping("/{id}")
    public VentaConEntradasDTO obtenerPorId(@PathVariable Integer id, Authentication authentication) {
        UsuarioDetails user = (UsuarioDetails) authentication.getPrincipal();
        Integer clienteId = user.getUsuarioId();
        return ventaService.obtenerPorId(id, clienteId);
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
    public List<VentaDTO> listarActivas(Authentication authentication) {
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

    @PostMapping("/reservar")
    public ResponseEntity<?> crearReserva(@RequestBody SolicitudReservaDTO solicitud) {
        try {
            // Llama al servicio que hace la resta atómica en BD
            Reserva reserva = ventaService.crearReservaTemporal(solicitud);

            // Retornamos un JSON simple con el ID: { "reservaId": 105 }
            // Ojo, luego podríamos agregar el tiempo que queda para que el front ponga el relojito
            Map<String, Integer> response = Collections.singletonMap("reservaId", reserva.getReservaId());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Si falla (Sold Out), devolvemos error 400 con el mensaje
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/confirmar/{reservaId}")
    public ResponseEntity<?> confirmarVenta(@PathVariable Integer reservaId, @RequestParam String correo, @RequestBody RegistroVentaDTO registroVentaDTO) {
        try {
            // Llama al servicio que valida los 4 minutos y guarda la venta final
            VentaConEntradasDTO ventaRealizada = ventaService.confirmarVenta(correo, reservaId, registroVentaDTO);
            return ResponseEntity.ok(ventaRealizada);
        } catch (RuntimeException e) {
            // Si expiró el tiempo o la reserva no existe
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

}

package com.ebentos.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ebentos.backend.config.UsuarioDetails;
import com.ebentos.backend.dto.EventoDisponibleDTO;
import com.ebentos.backend.dto.MetaActualizarDTO;
import com.ebentos.backend.dto.MetaDetalleDTO;
import com.ebentos.backend.model.Meta;
import com.ebentos.backend.model.Productora;
import com.ebentos.backend.service.MetaService;

@RestController
@RequestMapping("/api/metas")
public class MetaController {

    @Autowired
    private MetaService metaService;

    @GetMapping("/productora")
    public ResponseEntity<List<MetaDetalleDTO>> listarMetasDetalladas(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        List<MetaDetalleDTO> metas = metaService.listarMetasDetalladasPorProductora(usuarioDetails.getUsuarioId());
        return ResponseEntity.ok(metas);
    }

    @GetMapping("/eventos-disponibles")
    public ResponseEntity<List<EventoDisponibleDTO>> listarEventosDisponibles(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        List<EventoDisponibleDTO> eventos = metaService.listarEventosDisponiblesPorProductora(usuarioDetails.getUsuarioId());
        return ResponseEntity.ok(eventos);
    }

    @PostMapping
    public ResponseEntity<Meta> crearMeta(
            @RequestBody Meta meta,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        // Si el cliente no envía el objeto `productora`, evitamos NPE creando uno nuevo.
        if (meta.getProductora() == null) {
            meta.setProductora(new Productora());
        }
        // Asignamos la productora desde la sesión (no confiar en datos del cliente)
        meta.getProductora().setUsuarioId(usuarioDetails.getUsuarioId());
        Meta metaCreada = metaService.crearMeta(meta);
        return ResponseEntity.ok(metaCreada);
    }

    @PutMapping("/{metaId}")
    public ResponseEntity<MetaActualizarDTO> actualizarMeta(
            @PathVariable Integer metaId,
            @RequestBody MetaActualizarDTO meta) {
        MetaActualizarDTO metaActualizada = metaService.actualizarMeta(metaId, meta);
        return ResponseEntity.ok(metaActualizada);
    }

    @DeleteMapping("/{metaId}")
    public ResponseEntity<Void> eliminarMeta(@PathVariable Integer metaId) {
        metaService.eliminarMeta(metaId);
        return ResponseEntity.ok().build();
    }
}
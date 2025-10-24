package com.ebentos.backend.controller;

import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.service.GestorService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gestores")
public class GestorRestController {
    
    private final GestorService gestorService;
    
    @Autowired
    public GestorRestController(GestorService gestorService){
        this.gestorService = gestorService;
    }
    
    @GetMapping
    public List<Gestor> listarTodos() {
        return gestorService.listarTodos();
    }
    
    @GetMapping("/{id}")
    public Optional<Gestor> obtenerPorId(@PathVariable Integer id) {
        return gestorService.obtenerPorId(id);
    }

    @PostMapping
    public Gestor insertar(@RequestBody Gestor gestor) {
        return gestorService.insertar(gestor);
    }

    @PutMapping("/{id}")
    public Gestor modificar(@PathVariable Integer id, @RequestBody Gestor gestor) {
        return gestorService.modificar(id, gestor);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        gestorService.eliminar(id);
    }
    
    @GetMapping("/buscarPorDNI")
    public List<Gestor> buscarPorDNI(@RequestParam String prefijo) {
        return gestorService.buscarPorDNI(prefijo);
    }
    
    @GetMapping("/buscarPorApels")
    public List<Gestor> buscarPorApellidos(@RequestParam String prefijo) {
        return gestorService.buscarPorApellidos(prefijo);
    }
    
}

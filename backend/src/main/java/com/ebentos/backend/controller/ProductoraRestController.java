package com.ebentos.backend.controller;

import com.ebentos.backend.model.Productora;
import com.ebentos.backend.service.ProductoraService;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/productoras")
public class ProductoraRestController {
    
    private final ProductoraService productoraService;
    
    public ProductoraRestController(ProductoraService productoraService){
        this.productoraService = productoraService;
    }
    
    @GetMapping
    public List<Productora> listarTodas() {
        return productoraService.listarTodas();
    }
    
    @GetMapping("/{id}")
    public Optional<Productora> obtenerPorId(@PathVariable Integer id) {
        return productoraService.obtenerPorId(id);
    }

    @PostMapping
    public Productora insertar(@RequestBody Productora p) {
        return productoraService.insertar(p);
    }

    @PutMapping("/{id}")
    public Productora modificar(@PathVariable Integer id, @RequestBody Productora p) {
        return productoraService.modificar(id, p);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        productoraService.eliminar(id);
    }
    
    @GetMapping("/buscar")
    public List<Productora> buscarPorRazonSocial(@RequestParam String prefijo) {
        return productoraService.buscarPorRazonSocial(prefijo);
    }
    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Productora p) {
        boolean valido = productoraService.verificarCredenciales(p.getEmail(), p.getContrasenha());
        if (valido) {
            return ResponseEntity.ok("Login exitoso");
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }
}

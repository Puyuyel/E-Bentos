package com.ebentos.backend.controller;

import com.ebentos.backend.model.Productora;
import com.ebentos.backend.service.ProductoraService;
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
@RequestMapping("/api/productoras")
public class ProductoraRestController {
    
    private final ProductoraService productoraService;
    
    @Autowired
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
    public Productora insertar(@RequestBody Productora productora) {
        return productoraService.insertar(productora);
    }

    @PutMapping("/{id}")
    public Productora modificar(@PathVariable Integer id, @RequestBody Productora productora) {
        return productoraService.modificar(id, productora);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        productoraService.eliminar(id);
    }
    
    @GetMapping("/buscar")
    public List<Productora> buscarPorRazonSocial(@RequestParam String prefijo) {
        return productoraService.buscarPorRazonSocial(prefijo);
    }
    
}

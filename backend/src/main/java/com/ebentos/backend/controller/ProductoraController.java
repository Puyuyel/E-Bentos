package com.ebentos.backend.controller;

import com.ebentos.backend.dto.ProductoraActualizaDTO;
import com.ebentos.backend.dto.ProductoraDTO;
import com.ebentos.backend.service.ProductoraService;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productoras")
public class ProductoraController {

    private final ProductoraService productoraService;

    @Autowired
    public ProductoraController(ProductoraService productoraService){
        this.productoraService = productoraService;
    }

    @GetMapping
    public List<ProductoraDTO> listarTodas() {
        return productoraService.listarTodas();
    }

    @GetMapping("/{id}")
    public ProductoraDTO obtenerPorId(@PathVariable Integer id) {
        return productoraService.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public ProductoraDTO modificar(@PathVariable Integer id, @RequestBody ProductoraActualizaDTO productoraActualizaDTO) {
        // Llama al servicio con el ID y el DTO
        return productoraService.modificar(id, productoraActualizaDTO);
    }

//    @GetMapping("/buscar")
//    public List<Productora> buscarPorRazonSocial(@RequestParam String prefijo) {
//        return productoraService.buscarPorRazonSocial(prefijo);
//    }


}

package com.ebentos.backend.controller;

import com.ebentos.backend.dto.ReporteLocalDTO;
import com.ebentos.backend.service.RepLocalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes/locales")
public class RepLocalesController {

    private final RepLocalesService reporteLocalesService;

    @Autowired
    public RepLocalesController(RepLocalesService reporteLocalesService) {
        this.reporteLocalesService = reporteLocalesService;
    }

    @GetMapping
    public List<ReporteLocalDTO> obtenerReporteLocales() {
        return reporteLocalesService.obtenerReporteLocales();
    }
}

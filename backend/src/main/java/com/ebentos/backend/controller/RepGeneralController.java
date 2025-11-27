package com.ebentos.backend.controller;

import com.ebentos.backend.dto.ReporteGeneralDTO;
import com.ebentos.backend.service.RepGeneralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes/general")
public class RepGeneralController {

    private final RepGeneralService reporteGeneralService;

    @Autowired
    public RepGeneralController(RepGeneralService reporteGeneralService) {
        this.reporteGeneralService = reporteGeneralService;
    }

    @GetMapping
    public List<ReporteGeneralDTO> obtenerReporteGeneral() {
        return reporteGeneralService.obtenerReporteGeneral();
    }
}

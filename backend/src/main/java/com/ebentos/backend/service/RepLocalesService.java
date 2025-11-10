package com.ebentos.backend.service;

import com.ebentos.backend.dto.ReporteLocalDTO;
import com.ebentos.backend.repository.RepLocalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepLocalesService {

    private final RepLocalesRepository reporteLocalesRepository;

    @Autowired
    public RepLocalesService(RepLocalesRepository reporteLocalesRepository) {
        this.reporteLocalesRepository = reporteLocalesRepository;
    }

    public List<ReporteLocalDTO> obtenerReporteLocales() {
        return reporteLocalesRepository.obtenerReporteLocales();
    }
}


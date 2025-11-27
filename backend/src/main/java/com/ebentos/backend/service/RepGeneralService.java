package com.ebentos.backend.service;

import com.ebentos.backend.dto.ReporteGeneralDTO;
import com.ebentos.backend.repository.RepGeneralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepGeneralService {

    private final RepGeneralRepository reporteGeneralRepository;

    @Autowired
    public RepGeneralService(RepGeneralRepository reporteGeneralRepository) {
        this.reporteGeneralRepository = reporteGeneralRepository;
    }

    public List<ReporteGeneralDTO> obtenerReporteGeneral() {
        return reporteGeneralRepository.obtenerReporteGeneral();
    }
}


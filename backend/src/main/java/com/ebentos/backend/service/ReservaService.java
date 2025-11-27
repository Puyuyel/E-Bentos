package com.ebentos.backend.service;

import com.ebentos.backend.model.EstadoReserva;
import com.ebentos.backend.model.Reserva;
import com.ebentos.backend.model.ReservaDetalle;
import com.ebentos.backend.repository.ReservaRepository;
import com.ebentos.backend.repository.ZonaRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final ZonaRepository zonaRepository;

    public ReservaService(ReservaRepository reservaRepository, ZonaRepository zonaRepository) {
        this.reservaRepository = reservaRepository;
        this.zonaRepository = zonaRepository;
    }

    // Se ejecuta cada 60 segundos
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void liberarReservasVencidas() {
        LocalDateTime ahora = LocalDateTime.now();

        // Buscamos PENDIENTES viejas
        List<Reserva> vencidas = reservaRepository.findByEstadoAndFechaExpiracionBefore(EstadoReserva.PENDIENTE, ahora);

        for (Reserva res : vencidas) {
            System.out.println("Liberando reserva ID: " + res.getReservaId());

            // 1. Marcamos como expirada
            res.setEstado(EstadoReserva.EXPIRADA);

            // 2. Devolvemos el stock a cada zona involucrada
            for (ReservaDetalle det : res.getDetalles()) {
                zonaRepository.devolverStock(det.getZona().getZonaId(), det.getCantidad());
            }

            reservaRepository.save(res);
        }
    }

}

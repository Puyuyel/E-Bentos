package com.ebentos.backend.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ebentos.backend.dto.EventoDisponibleDTO;
import com.ebentos.backend.dto.MetaActualizarDTO;
import com.ebentos.backend.dto.MetaDetalleDTO;
import com.ebentos.backend.model.Meta;
import com.ebentos.backend.repository.EventoRepository;
import com.ebentos.backend.repository.MetaRepository;
import com.ebentos.backend.repository.ProductoraRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class MetaService {

    @Autowired
    private MetaRepository metaRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private ProductoraRepository productoraRepository;

    @Transactional(readOnly = true)
    public List<MetaDetalleDTO> listarMetasDetalladasPorProductora(Integer productoraId) {
        List<Object[]> resultados = metaRepository.findMetasDetalladasByProductoraId(productoraId);
        List<MetaDetalleDTO> metas = new ArrayList<>();

        for (Object[] resultado : resultados) {
            MetaDetalleDTO dto = new MetaDetalleDTO();

            // META_ID
            Object o0 = resultado[0];
            dto.setMetaId(o0 == null ? null : ((Number) o0).intValue());

            // EVENTO_ID
            Object o1 = resultado[1];
            dto.setEventoId(o1 == null ? null : ((Number) o1).intValue());

            // META_INGRESOS
            Object o2 = resultado[2];
            dto.setMetaIngresos(o2 == null ? null : ((Number) o2).intValue());

            // TASA_CONVERSION
            Object o3 = resultado[3];
            dto.setTasaConversion(o3 == null ? null : ((Number) o3).doubleValue());

            // TICKETS_OBJETIVO
            Object o4 = resultado[4];
            dto.setTicketsObjetivo(o4 == null ? null : ((Number) o4).intValue());

            // ACTIVO (TINYINT) -> Integer
            Object o5 = resultado[5];
            Integer activo = null;
            if (o5 instanceof Number) {
                activo = ((Number) o5).intValue();
            } else if (o5 != null) {
                try {
                    activo = Integer.parseInt(o5.toString());
                } catch (NumberFormatException ex) {
                    activo = "1".equalsIgnoreCase(o5.toString()) ? 1 : 0;
                }
            } else {
                activo = 0;
            }
            dto.setActivo(activo);

            // NOMBRE_EVENTO
            dto.setNombreEvento(resultado[6] == null ? null : resultado[6].toString());

            // FECHA_HORARIO_INICIO
            Object o7 = resultado[7];
            if (o7 instanceof Timestamp) {
                dto.setFechaHorarioInicio(((Timestamp) o7).toLocalDateTime());
            } else if (o7 instanceof java.util.Date) {
                dto.setFechaHorarioInicio(((java.util.Date) o7).toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
            } else {
                dto.setFechaHorarioInicio(null);
            }

            dto.setEntradasVendidas(resultado[8] == null ? 0 : ((Number) resultado[8]).intValue());
            dto.setMontoTotalRecaudado(resultado[9] == null ? 0 : ((Number) resultado[9]).intValue());
            dto.setVisitas(resultado[10] == null ? 0 : ((Number) resultado[10]).intValue());

            metas.add(dto);
        }

        return metas;
    }

    @Transactional
    public Meta crearMeta(Meta meta) {
        // Validar que exista la productora
        productoraRepository.findById(meta.getProductora().getUsuarioId())
            .orElseThrow(() -> new EntityNotFoundException("Productora no encontrada"));

        // Validar que exista el evento
        eventoRepository.findById(meta.getEvento().getEventoId())
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado"));

        meta.setActivo(1);
        return metaRepository.save(meta);
    }

    @Transactional
    public MetaActualizarDTO actualizarMeta(Integer metaId, MetaActualizarDTO metaActualizada) {
        Meta metaExistente = metaRepository.findById(metaId)
            .orElseThrow(() -> new EntityNotFoundException("Meta no encontrada"));

        metaExistente.setMetaIngresos(metaActualizada.getMetaIngresos());
        metaExistente.setTasaConversion(metaActualizada.getTasaConversion());
        metaExistente.setTicketsObjetivo(metaActualizada.getTicketsObjetivo());
        metaRepository.save(metaExistente);
        return metaActualizada;
    }

    @Transactional
    public void eliminarMeta(Integer metaId) {
        Meta meta = metaRepository.findById(metaId)
            .orElseThrow(() -> new EntityNotFoundException("Meta no encontrada"));

    meta.setActivo(0);
        metaRepository.save(meta);
    }

    @Transactional(readOnly = true)
    public List<EventoDisponibleDTO> listarEventosDisponiblesPorProductora(Integer productoraId) {
        List<Object[]> resultados = metaRepository.findEventosDisponiblesByProductoraId(productoraId);
        List<EventoDisponibleDTO> eventos = new ArrayList<>();

        for (Object[] resultado : resultados) {
            EventoDisponibleDTO dto = new EventoDisponibleDTO();
            dto.setEventoId((Integer) resultado[0]);
            dto.setNombre((String) resultado[1]);
            eventos.add(dto);
        }

        return eventos;
    }
}
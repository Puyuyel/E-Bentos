package com.ebentos.backend.service;

import com.ebentos.backend.dto.*;
import com.ebentos.backend.model.*;
import com.ebentos.backend.repository.ReservaRepository;
import com.ebentos.backend.repository.VentaRepository;
import com.ebentos.backend.repository.ZonaRepository;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class VentaService {
    
    private final VentaRepository ventaRepository;
    private final EntradaService entradaService;
    private final ClienteService clienteService;
    private final ZonaRepository zonaRepository;
    private final ReservaRepository reservaRepository;

    @Autowired
    public VentaService(VentaRepository ventaRepository, EntradaService entradaService, ClienteService clienteService, ZonaRepository zonaRepository, ReservaRepository reservaRepository) {
        this.ventaRepository = ventaRepository;
        this.entradaService = entradaService;
        this.clienteService = clienteService;
        this.zonaRepository = zonaRepository;
        this.reservaRepository = reservaRepository;
    }
    
    public VentaDTO obtenerPorId(Integer id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada con ID: " + id));

        VentaDTO ventaDTO = llenarDTO(venta);

        return ventaDTO;
    }
    
    public List<VentaDTO> listarPasadas(Integer clienteId) {
    return ventaRepository.findEventosPasadosByCliente(clienteId)
            .stream()
            .map(this::llenarDTO)
            .collect(Collectors.toList());
}

    public List<VentaConEntradasDTO> listarActivas(Integer clienteId) {
        return ventaRepository.findEventosFuturosByCliente(clienteId)
                .stream()
                .map(this::llenarDTOConEntradas)
                .collect(Collectors.toList());
    }

    
    public List<VentaConEntradasDTO> listarTodas() {
        return ventaRepository.findAll()
                .stream()
                .map(this::llenarDTOConEntradas)
                .collect(Collectors.toList());
    }
    
    private VentaDTO llenarDTO(Venta venta) {
        VentaDTO ventaDTO = new VentaDTO();
        
        ventaDTO.setVentaId(venta.getVentaId());
        ventaDTO.setMontoTotalFinal(venta.getMontoTotalFinal());
        ventaDTO.setPuntosGanados((int)(venta.getMontoTotalFinal()*0.1));
        
        if (venta.getEvento() != null){
            EventoSimpleDTO eventoDTO = new EventoSimpleDTO();
            eventoDTO.setEventoId(venta.getEvento().getEventoId());
            eventoDTO.setNombre(venta.getEvento().getNombre());
            eventoDTO.setFechaHorarioInicio(venta.getEvento().getFechaHorarioInicio());
            ventaDTO.setEvento(eventoDTO);
            
            if (venta.getEvento().getLocal() != null){
                LocalSimpleParaVentasDTO localDTO = new LocalSimpleParaVentasDTO();
                localDTO.setLocalId(venta.getEvento().getLocal().getLocalId());
                localDTO.setNombre(venta.getEvento().getLocal().getNombre());
                localDTO.setDireccion(venta.getEvento().getLocal().getDireccion());
                ventaDTO.setLocal(localDTO);
            } 
            
        }
        
        return ventaDTO;
    }
    
    private VentaConEntradasDTO llenarDTOConEntradas(Venta venta) {
        VentaConEntradasDTO dto = new VentaConEntradasDTO();

        dto.setVentaId(venta.getVentaId());
        dto.setMontoTotalFinal(venta.getMontoTotalFinal());
        dto.setPuntosGanados((int) (venta.getMontoTotalFinal() * 0.1));

        // Evento
        if (venta.getEvento() != null) {
            EventoSimpleDTO eventoDTO = new EventoSimpleDTO();
            eventoDTO.setEventoId(venta.getEvento().getEventoId());
            eventoDTO.setNombre(venta.getEvento().getNombre());
            eventoDTO.setFechaHorarioInicio(venta.getEvento().getFechaHorarioInicio());
            dto.setEvento(eventoDTO);

            // Local
            if (venta.getEvento().getLocal() != null) {
                LocalSimpleParaVentasDTO localDTO = new LocalSimpleParaVentasDTO();
                localDTO.setLocalId(venta.getEvento().getLocal().getLocalId());
                localDTO.setNombre(venta.getEvento().getLocal().getNombre());
                localDTO.setDireccion(venta.getEvento().getLocal().getDireccion());
                dto.setLocal(localDTO);
            }
        }

        // Entradas
        if (venta.getEntradas() != null && !venta.getEntradas().isEmpty()) {
            List<EntradaDTO> entradasDTO = venta.getEntradas().stream()
                .map(entrada -> {
                    EntradaDTO entradaDTO = new EntradaDTO();
                    entradaDTO.setEntradaId(entrada.getEntradaId());
                    entradaDTO.setQr(entrada.getQr()); // ahora QR es String
                    return entradaDTO;
                })
                .collect(Collectors.toList());
            dto.setEntradas(entradasDTO);
        }

        return dto;
    }

    //----------------------------------------------------------------------
    @Transactional
    public Reserva crearReservaTemporal(SolicitudReservaDTO solicitud) {
        Reserva reserva = new Reserva();
        Cliente cliente = new Cliente();
        cliente.setUsuarioId(solicitud.getClienteId());
        reserva.setCliente(cliente);
        reserva.setFechaExpiracion(LocalDateTime.now().plusMinutes(4)); // 4 Minutos
        reserva.setEstado(EstadoReserva.PENDIENTE);

        // Iteramos por cada zona solicitada
        List<ReservaDetalle> reservasDetalle = new ArrayList<>();
        for (DetalleZonaDTO item : solicitud.getZonas()) {
            // INTENTO DE RESTA ATÓMICA EN BD
            int exito = zonaRepository.descontarStock(item.getZonaId(), item.getCantidad());

            if (exito == 0) {
                // Si falla UNA zona, el @Transactional hará rollback de todo lo anterior automáticamente
                throw new RuntimeException("SOLD OUT: No hay stock suficiente en la zona " + item.getZonaId());
            }

            // Si hay stock, agregamos al detalle
            ReservaDetalle detalle = new ReservaDetalle();
            Zona zona = new Zona();
            zona.setZonaId(item.getZonaId());
            detalle.setZona(zona);
            detalle.setCantidad(item.getCantidad());
            reservasDetalle.add(detalle);
        }
        reserva.setDetalles(reservasDetalle);
        return reservaRepository.save(reserva);
    }


    @Transactional
    public Venta confirmarVenta(String correo, Integer reservaId, RegistroVentaDTO  registroVentaDTO) {
        // 1. Recuperar y Validar la Reserva
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
            throw new RuntimeException("Esta reserva ya fue procesada o expiró.");
        }
        if (LocalDateTime.now().isAfter(reserva.getFechaExpiracion())) {
            // Opcional: Si ya expiró, podrías llamar aquí al método de devolver stock manualmente
            // pero dejemos que el Scheduler lo haga. Solo lanzamos error.
            throw new RuntimeException("El tiempo de compra ha expirado.");
        }

        Venta venta = new Venta();
        //Campos simples
        venta.setMontoTotalOriginal(registroVentaDTO.getMontoTotalOriginal());
        venta.setMontoTotalFinal(registroVentaDTO.getMontoTotalFinal());
        venta.setDescuentoTotal(registroVentaDTO.getDescuentoTotal());
        venta.setRegistradoPorTaquillero(registroVentaDTO.getRegistradoPorTaquillero());
        venta.setMetodoPago(registroVentaDTO.getMetodoPago());
        //Campos no tan simples
        Evento evento = new Evento();
        evento.setEventoId(registroVentaDTO.getEventoId());
        venta.setEvento(evento);
        if (registroVentaDTO.getGestorId() != null) {
            Gestor gestor = new Gestor();
            gestor.setUsuarioId(registroVentaDTO.getGestorId());
            venta.setGestor(gestor);
        }
        Cliente cliente = new Cliente();
        cliente.setUsuarioId(registroVentaDTO.getClienteId());
        venta.setCliente(cliente);

        //Guardamos la venta
        Venta ventaGurdada = ventaRepository.save(venta);

        // 3. Actualizar estado de la Reserva (Para que no se libere el stock)
        reserva.setEstado(EstadoReserva.PAGADA);
        reservaRepository.save(reserva);

        //Guardamos la/las entradas
        List<RegistroEntradaDTO> registroEntradasDTOS = new ArrayList<>();
        for(int i = 0; i < registroVentaDTO.getEntradas().size(); i++){
            //Guardamos para registrar la entrada
            RegistroEntradaDTO registroEntradaDTO = new RegistroEntradaDTO();
            registroEntradaDTO.setCorreo(correo);
            registroEntradaDTO.setDescuento(registroVentaDTO.getEntradas().get(i).getDescuento());
            registroEntradaDTO.setPrecioFinal(registroVentaDTO.getEntradas().get(i).getPrecioFinal());
            registroEntradaDTO.setPrecioOriginal(registroVentaDTO.getEntradas().get(i).getPrecioOriginal());
            registroEntradaDTO.setZonaId(registroVentaDTO.getEntradas().get(i).getZonaId());
            registroEntradaDTO.setVentaId(ventaGurdada.getVentaId());
            registroEntradasDTOS.add(registroEntradaDTO);
        }
        entradaService.insertar(correo, registroEntradasDTOS);

        //Aumentamos los puntos del cliente
        clienteService.aumentarPuntos(registroVentaDTO.getClienteId(), registroVentaDTO.getMontoTotalFinal());

        //devolvemos la venta
        return ventaGurdada;
    }

}

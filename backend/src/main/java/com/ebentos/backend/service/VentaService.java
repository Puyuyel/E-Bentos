package com.ebentos.backend.service;

import com.ebentos.backend.dto.*;
import com.ebentos.backend.model.*;
import com.ebentos.backend.repository.EntradaRepository;
import com.ebentos.backend.repository.EventoRepository;
import com.ebentos.backend.repository.ReservaRepository;
import com.ebentos.backend.repository.VentaRepository;
import com.ebentos.backend.repository.ZonaRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.persistence.EntityNotFoundException;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import java.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VentaService {
    
    private final VentaRepository ventaRepository;
    private final EntradaService entradaService;
    private final ClienteService clienteService;
    private final EmailService emailService;
    private final ZonaRepository zonaRepository;
    private final ReservaRepository reservaRepository;
    private final EntradaRepository entradaRepository;
    private final EventoRepository eventoRepository;

    @Autowired
    public VentaService(VentaRepository ventaRepository, EntradaService entradaService, 
            ClienteService clienteService, EmailService emailService, 
            ZonaRepository zonaRepository, ReservaRepository reservaRepository, 
            EntradaRepository entradaRepository, EventoRepository eventoRepository) {
        this.ventaRepository = ventaRepository;
        this.entradaService = entradaService;
        this.clienteService = clienteService;
        this.emailService = emailService;
        this.zonaRepository = zonaRepository;
        this.reservaRepository = reservaRepository;
        this.entradaRepository = entradaRepository;
        this.eventoRepository = eventoRepository;
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
    private Image generarQR(String textoQR) throws Exception {

        int size = 200;
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(textoQR, BarcodeFormat.QR_CODE, size, size);

        ByteArrayOutputStream pngOutput = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", pngOutput);

        return Image.getInstance(pngOutput.toByteArray());
    }
    
    private String linea(char c, int cantidad) {
        return String.valueOf(c).repeat(Math.max(0, cantidad));
    }

    
    public byte[] generarPdfEntradas(Integer ventaId, Integer clienteId) {

        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada"));
        Evento evento = eventoRepository.findById(venta.getEvento().getEventoId())
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        venta.setEvento(evento);
        VentaConEntradasDTO ventasConEntrada = llenarDTOConEntradas(venta);

        if (!venta.getCliente().getUsuarioId().equals(clienteId)) {
            throw new RuntimeException("No tienes acceso a esta venta");
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();
        DateTimeFormatter formatoFecha = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter formatoHora  = DateTimeFormatter.ofPattern("hh:mm a");

        try {
            
            PdfWriter.getInstance(document, baos);
            document.open();
            LocalDateTime fechaHora = venta.getEvento().getFechaHorarioInicio();
            String fechaFormateada = fechaHora.format(formatoFecha);
            String horaFormateada  = fechaHora.format(formatoHora);
            // -----------------------------
            //  ENCABEZADO PRINCIPAL
            // -----------------------------
            Paragraph titulo = new Paragraph("e-Bentos\n\n",
                    new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 20, com.itextpdf.text.Font.BOLD));
            titulo.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(titulo);

            // Línea divisoria
            document.add(new Paragraph(linea('=', 74) + "\n\n"));

            // -----------------------------
            //  INFORMACIÓN GENERAL
            // -----------------------------
            Paragraph subtitulo = new Paragraph("ENTRADAS DEL EVENTO\n",
                    new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 16, com.itextpdf.text.Font.BOLD));
            subtitulo.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(subtitulo);
            document.add(new Paragraph(linea('-', 130) + "\n\n"));

            document.add(new Paragraph("Evento: " + ventasConEntrada.getEvento().getNombre()));
            document.add(new Paragraph("Fecha: " + fechaFormateada));
            document.add(new Paragraph("Hora: " + horaFormateada));
            document.add(new Paragraph("Local: " + ventasConEntrada.getLocal().getNombre()));
            document.add(new Paragraph("Dirección: " + ventasConEntrada.getLocal().getDireccion()));
            document.add(new Paragraph("Método de pago: " + ventasConEntrada.getMetodoDepago()));
            document.add(new Paragraph("Monto pagado: S/ " + String.format("%.2f", ventasConEntrada.getMontoTotalFinal())));
            document.add(new Paragraph("Puntos ganados: " + ventasConEntrada.getPuntosGanados()));
            document.add(new Paragraph("\n" + linea('=', 74) + "\n\n"));

            // -----------------------------
            //  GENERAR LOS QR
            // -----------------------------
            int counter = 1;
            List<Entrada> entradas = entradaRepository.findByVenta_VentaId(ventaId);
            for (Entrada entrada : entradas) {

                if (counter > 1) {
                    document.newPage();
                }

                Paragraph entradaTitulo = new Paragraph("ENTRADA #" + counter + "\n",
                        new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD));
                entradaTitulo.setAlignment(Paragraph.ALIGN_CENTER);
                document.add(entradaTitulo);

                document.add(new Paragraph(linea('-', 130) + "\n"));
                document.add(new Paragraph("Zona: " + entrada.getZona().getTipoZona()));
                document.add(new Paragraph("Precio Original: S/ " + String.format("%.2f", entrada.getPrecioOriginal())));
                document.add(new Paragraph("Descuento: S/ " + String.format("%.2f", entrada.getDescuento())));
                document.add(new Paragraph("Precio Final: S/ " + String.format("%.2f", entrada.getPrecioFinal())));
                Image qrImg = generarQR(entrada.getQr());
                qrImg.scaleToFit(200, 200);
                qrImg.setAlignment(Image.ALIGN_CENTER);
                qrImg.setSpacingBefore(10);
                qrImg.setSpacingAfter(10);
                document.add(qrImg);

                document.add(new Paragraph("\n" + linea('-', 130)));

                counter++;
            }

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generando PDF: " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    
    private VentaDTO llenarDTO(Venta venta) {
        VentaDTO ventaDTO = new VentaDTO();
        
        ventaDTO.setVentaId(venta.getVentaId());
        ventaDTO.setMontoTotalFinal(venta.getMontoTotalFinal());
        ventaDTO.setPuntosGanados((int)(venta.getMontoTotalFinal()*0.1));
        ventaDTO.setMetodoDepago(venta.getMetodoPago());
        
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
        dto.setMetodoDepago(venta.getMetodoPago());

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
            detalle.setReserva(reserva);
            reservasDetalle.add(detalle);
        }
        reserva.setDetalles(reservasDetalle);
        
        return reservaRepository.save(reserva);
    }


    @Transactional
    public VentaConEntradasDTO confirmarVenta(String correo, Integer reservaId, RegistroVentaDTO  registroVentaDTO) {
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
        Venta ventaGuardada = ventaRepository.save(venta);

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
            registroEntradaDTO.setVentaId(ventaGuardada.getVentaId());
            registroEntradasDTOS.add(registroEntradaDTO);
        }
        entradaService.insertar(registroEntradasDTOS);
        for (RegistroEntradaDTO entrada : registroEntradasDTOS) {
            zonaRepository.sumarMonto(entrada.getZonaId(), entrada.getPrecioFinal());
        }
        
        //Aumentamos los puntos del cliente
        clienteService.aumentarPuntos(registroVentaDTO.getClienteId(), registroVentaDTO.getMontoTotalFinal());

        byte[] pdf = generarPdfEntradas(ventaGuardada.getVentaId(), cliente.getUsuarioId());
        //Enviamos el correo con todas las entradas que compró de forma asíncrona
        emailService.enviarCorreoEntradas(correo, pdf, ventaGuardada.getVentaId());
        
        //devolvemos la venta
        return llenarDTOConEntradas(ventaGuardada);
    }

}

package com.ebentos.backend.service;

import com.ebentos.backend.dto.EntradaDTO;
import com.ebentos.backend.dto.EventoSimpleDTO;
import com.ebentos.backend.dto.LocalSimpleParaVentasDTO;
import com.ebentos.backend.dto.VentaConEntradasDTO;
import com.ebentos.backend.dto.VentaDTO;
import com.ebentos.backend.model.Entrada;
import com.ebentos.backend.model.Venta;
import com.ebentos.backend.repository.VentaRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.text.Document;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.persistence.EntityNotFoundException;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VentaService {
    
    private final VentaRepository ventaRepository;
    
    @Autowired
    public VentaService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
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
        VentaConEntradasDTO ventasConEntrada = llenarDTOConEntradas(venta);
        // Seguridad: asegurar que el cliente logueado sea el dueño de la venta
//        if (!venta.getCliente().getUsuarioId().equals(clienteId)) {
//            throw new RuntimeException("No tienes acceso a esta venta");
//        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            
            PdfWriter.getInstance(document, baos);
            document.open();

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
            document.add(new Paragraph("Fecha: " + ventasConEntrada.getEvento().getFechaHorarioInicio()));
            document.add(new Paragraph("Local: " + ventasConEntrada.getLocal().getNombre()));
            document.add(new Paragraph("Dirección: " + ventasConEntrada.getLocal().getDireccion()));
            document.add(new Paragraph("Método de pago: " + ventasConEntrada.getMetodoDepago()));
            document.add(new Paragraph("Monto pagado: S/ " + ventasConEntrada.getMontoTotalFinal()));
            document.add(new Paragraph("Puntos ganados: " + ventasConEntrada.getPuntosGanados()));
            document.add(new Paragraph("\n" + linea('=', 74) + "\n\n"));

            // -----------------------------
            //  GENERAR LOS QR
            // -----------------------------

            int counter = 1;

            for (Entrada entrada : venta.getEntradas()) {

                Paragraph entradaTitulo = new Paragraph("ENTRADA #" + counter + "\n",
                        new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 14, com.itextpdf.text.Font.BOLD));
                entradaTitulo.setAlignment(Paragraph.ALIGN_CENTER);
                document.add(entradaTitulo);
                document.add(new Paragraph(linea('-', 130) + "\n\n"));
                
                // Generar QR a partir del texto
                Image qrImg = generarQR(entrada.getQr());
                qrImg.scaleToFit(200, 200);
                qrImg.setAlignment(Image.ALIGN_CENTER);
                document.add(qrImg);

                document.add(new Paragraph(linea('-', 130) + "\n\n"));

                counter++;
            }

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generando PDF");
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

}

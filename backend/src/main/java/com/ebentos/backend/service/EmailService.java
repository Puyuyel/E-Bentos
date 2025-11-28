package com.ebentos.backend.service;

import com.ebentos.backend.dto.RegistroEntradaDTO;
import com.ebentos.backend.model.Entrada;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Envía un correo de forma asíncrona.
     * Spring ejecutará esto en un hilo separado.
     */
    @Async
    public void enviarCorreoVerificacion(String destinatario, String codigo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(destinatario);
            message.setSubject("Código de Recuperación de Contraseña - ebentos");
            message.setText("Hola, nos comunicamos de parte de e-Bentos \n\nTu código para restablecer la contraseña es: " + codigo +
                    "\n\nEste código expirará en 5 minutos.\n\nSi no solicitaste esto, ignora este correo.\n\nSaludos,\nEl equipo de ebentos");

            mailSender.send(message);
            System.out.println("Correo de recuperación enviado a " + destinatario); // Log para consola

        } catch (Exception e) {
            System.err.println("Error al enviar correo a " + destinatario + ": " + e.getMessage());
        }
    }

    @Async
    public void enviarCorreoEntradas(String destinatario, byte[] pdfBytes, Integer ventaId) {
        //Para verificar que se está haciendo en otro hilo
        System.out.println("Hilo actual: " + Thread.currentThread().getName());

        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject("QR Entradas  - ebentos");

            //Construímos el mensaje
            helper.setText("<h1>¡Gracias por tu compra!</h1>" +
                    "<p>Adjunto encontrarás un archivo PDF con tus entradas y códigos QR.</p>" +
                    "<p>Descárgalo y preséntalo en la entrada.</p>", true);
                
            // Definimos un nombre único para el archivo
            // Ejemplo: "Entrada-1.pdf", "Entrada-2.pdf"
            String nombreArchivo = "entradas_" + ventaId + ".pdf";

            // Adjuntamos el archivo al correo
            helper.addAttachment(nombreArchivo, new ByteArrayResource(pdfBytes));
            

            //Enviamos mensaje
            mailSender.send(mensaje);
            System.out.println("Correo de entradas enviado a " + destinatario); // Log para consola

        } catch (Exception e) {
            System.err.println("Error al enviar correo a " + destinatario + ": " + e.getMessage());
        }
    }

    // Metodo para crear el archivo PDF
    private byte[] generarPDFIndividual(Entrada entrada) throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);

        document.open();

        // Estilos de fuente
        Font fontTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Font fontSubtitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Font fontTexto = FontFactory.getFont(FontFactory.HELVETICA, 12);

        // Cabecera del Ticket
        document.add(new Paragraph("Ticket de Entrada - ebentos", fontTitulo));
        document.add(new Paragraph("--------------------------------------------------"));
        document.add(new Paragraph(" "));

        // Datos del Ticket
        document.add(new Paragraph("Evento: " + entrada.getZona().getEvento().getNombre(), fontSubtitulo));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Zona: " + entrada.getZona().getTipoZona(), fontTexto));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Precio:" + entrada.getPrecioFinal(), fontTexto));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Escanea el siguiente código para ingresar:", fontTexto));
        document.add(new Paragraph(" "));

        try {
            // Generar QR
            byte[] qrBytes = generarQR(entrada.getQr(), 250, 250);
            Image qrImage = Image.getInstance(qrBytes);
            qrImage.setAlignment(Element.ALIGN_CENTER); // Centrado queda mejor en ticket individual
            document.add(qrImage);
        } catch (Exception e) {
            document.add(new Paragraph("[Error visualizando el código QR]"));
        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph("ID Único: " + entrada.getQr(), FontFactory.getFont(FontFactory.COURIER, 8)));

        document.close();
        return out.toByteArray();
    }

    private byte[] generarQR(String texto, int ancho, int alto) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(texto, BarcodeFormat.QR_CODE, ancho, alto);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }

}
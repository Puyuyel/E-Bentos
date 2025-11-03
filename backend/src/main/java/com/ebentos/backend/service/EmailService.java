package com.ebentos.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

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
            // Manejo básico de errores (podrías usar un logger)
            System.err.println("Error al enviar correo a " + destinatario + ": " + e.getMessage());
        }
    }
}
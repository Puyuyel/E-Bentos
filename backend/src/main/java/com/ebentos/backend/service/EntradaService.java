package com.ebentos.backend.service;

import com.ebentos.backend.dto.RegistroEntradaDTO;
import com.ebentos.backend.model.Entrada;
import com.ebentos.backend.model.Venta;
import com.ebentos.backend.model.Zona;
import com.ebentos.backend.repository.EntradaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EntradaService {

    //Atributos
    private final EntradaRepository entradaRepository;
    private final EmailService emailService;

    //Constructores
    public EntradaService(EntradaRepository entradaRepository, EmailService emailService) {
        this.entradaRepository = entradaRepository;
        this.emailService = emailService;
    }

    //Métodos públicos
    @Transactional
    public void insertar(String correo, List<RegistroEntradaDTO> registroEntradasDTO) {
        List<Entrada> entradasParaGuardar = registroEntradasDTO.stream()
                .map(dto -> {
                    Entrada entrada = new Entrada();

                    // Campos simples
                    entrada.setDescuento(dto.getDescuento());
                    entrada.setPrecioFinal(dto.getPrecioFinal());
                    entrada.setPrecioOriginal(dto.getPrecioOriginal());

                    // Generamos el QR como token
                    entrada.setQr(generarTokenQR());

                    // Asociaciones
                    Venta venta = new Venta();
                    venta.setVentaId(dto.getVentaId());
                    entrada.setVenta(venta);

                    Zona zona = new Zona();
                    zona.setZonaId(dto.getZonaId());
                    entrada.setZona(zona);

                    return entrada;
                })
                .collect(Collectors.toList());

        // Guardamos todos de una sola vez, en vez de hacer for ( save )
        entradaRepository.saveAll(entradasParaGuardar);

        //Enviamos el correo con todas las entradas que compró de forma asíncrona
        emailService.enviarCorreoEntradas(correo, registroEntradasDTO);
    }

    //Obtener toda la info de la entrada ?

    //Listar todas las entradas de un cliente ?


    //Métodos privados
    private String generarTokenQR(){
        return UUID.randomUUID().toString();
    }

}

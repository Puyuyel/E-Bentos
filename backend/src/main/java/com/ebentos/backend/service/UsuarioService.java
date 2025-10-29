package com.ebentos.backend.service;

import com.ebentos.backend.model.Productora;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ebentos.backend.dto.RegistroUsuarioDTO;
import com.ebentos.backend.model.Rol;
import com.ebentos.backend.model.Usuario;
import com.ebentos.backend.model.Cliente; // Importar Cliente
import com.ebentos.backend.model.Gestor;
import com.ebentos.backend.repository.RolRepository;
import com.ebentos.backend.repository.UsuarioRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // Injección de constructor
    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            ClienteService clienteService, ProductoraService productoraService) {

        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ------------------------- Metodos ----------------------------------------------
    @Transactional
    public Usuario crearUsuario(RegistroUsuarioDTO registroUsuarioDTO) {

        //Validar datos inicionales
        String email = registroUsuarioDTO.getEmail();
        String contrasenha = registroUsuarioDTO.getContrasenha();
        if(!email.contains("@") || contrasenha.length() < 8){
            throw new IllegalArgumentException("El formato del correo electrónico o contrasenha no es valido.");
        }

        // Validar si el email ya existe
        if (usuarioRepository.findByEmail(registroUsuarioDTO.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está en uso");
        }

        // Buscar el rol
        Rol rolUsuario = rolRepository.findByNombre(registroUsuarioDTO.getNombreRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        // Crear la nueva entidad Usuario
        Usuario nuevoUsuario;
        switch (registroUsuarioDTO.getNombreRol().toUpperCase()) {
            case "CLIENTE" -> {
                Cliente nuevoCliente = new Cliente();
                nuevoCliente.setPuntosGastados(0);
                nuevoCliente.setPuntosAcumulados(0);
                nuevoCliente.setRegistradoPorTaquillero(0);
                nuevoCliente.setNombres(registroUsuarioDTO.getNombres());
                nuevoCliente.setApellidos(registroUsuarioDTO.getApellidos());
                nuevoCliente.setDni(registroUsuarioDTO.getDni());
                nuevoCliente.setFechaNacimiento(registroUsuarioDTO.getFechaNacimiento());
                nuevoCliente.setGenero(registroUsuarioDTO.getGenero());
                nuevoCliente.setActivo(1);
                nuevoUsuario = nuevoCliente;
            }

            case "PRODUCTORA" -> {
                Productora nuevaProductora = new Productora();
                nuevaProductora.setRuc(registroUsuarioDTO.getRuc());
                nuevaProductora.setRazonSocial(registroUsuarioDTO.getRazonSocial());
                nuevaProductora.setNombreComercial(registroUsuarioDTO.getNombreComercial());
                nuevaProductora.setEmail(email);
                nuevaProductora.setTelefono(registroUsuarioDTO.getTelefono());
                nuevaProductora.setContrasenha(passwordEncoder.encode(contrasenha));
                nuevaProductora.setRol(rolUsuario);
                nuevaProductora.setActivo(1);
                nuevoUsuario = nuevaProductora;
            }

            default -> {
                Gestor nuevoGestor = new Gestor();
                nuevoGestor.setDni(registroUsuarioDTO.getDni());
                nuevoGestor.setNombres(registroUsuarioDTO.getNombres());
                nuevoGestor.setApellidos(registroUsuarioDTO.getApellidos());
                nuevoGestor.setUsuarioCreador(registroUsuarioDTO.getUsuarioCreador());
                if(rolUsuario.getNombre().equals("TAQUILLERO"))
                    nuevoGestor.setPuntoVenta(registroUsuarioDTO.getPuntoVenta());
                nuevoGestor.setEmail(email);
                nuevoGestor.setTelefono(registroUsuarioDTO.getTelefono());
                nuevoGestor.setContrasenha(passwordEncoder.encode(contrasenha));
                nuevoGestor.setRol(rolUsuario);
                nuevoGestor.setActivo(1);
                nuevoUsuario = nuevoGestor;
            }
        }

        // Guardar en la BD
        Usuario usuario = usuarioRepository.save(nuevoUsuario);

        return usuario;
    }

    //Olvido contraseña
    @Transactional
    public void iniciarReseteoPassword(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));

        String codigo = generarCodigoVerificacion();

        // Guardar el código y la fecha de expiración en el usuario
        usuario.setCodigoReseteo(codigo);
        usuario.setExpiracionCodigo(LocalDateTime.now().plusMinutes(5));
        usuarioRepository.save(usuario);

        // Llamar al servicio de correo ASÍNCRONO
        emailService.enviarCorreoVerificacion(usuario.getEmail(), codigo);
    }

    @Transactional
    public void completarReseteoContrasenha(String email, String codigo, String nuevaContrasenha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));

        if (usuario.getCodigoReseteo() == null || !usuario.getCodigoReseteo().equals(codigo)) {
            throw new RuntimeException("Código de verificación inválido.");
        }

        if (usuario.getExpiracionCodigo() == null || LocalDateTime.now().isAfter(usuario.getExpiracionCodigo())) {
            limpiarCodigoReseteo(usuario);
            usuarioRepository.save(usuario);
            throw new RuntimeException("El código de verificación ha expirado.");
        }

        usuario.setContrasenha(passwordEncoder.encode(nuevaContrasenha));
        limpiarCodigoReseteo(usuario);
        usuarioRepository.save(usuario);
    }

    private String generarCodigoVerificacion() {
        String caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        int longitudCodigo = 6;
        SecureRandom random = new SecureRandom();
        StringBuilder codigo = new StringBuilder(longitudCodigo);

        for (int i = 0; i < longitudCodigo; i++) {
            int indiceAleatorio = random.nextInt(caracteresPermitidos.length());
            codigo.append(caracteresPermitidos.charAt(indiceAleatorio));
        }

        return codigo.toString();
    }

    private void limpiarCodigoReseteo(Usuario usuario) {
        usuario.setCodigoReseteo(null);
        usuario.setExpiracionCodigo(null);
    }
}
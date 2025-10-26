package com.ebentos.backend.service;

import com.ebentos.backend.model.Productora;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ebentos.backend.dto.RegistroUsuarioDTO;
import com.ebentos.backend.model.Rol;
import com.ebentos.backend.model.Usuario;
import com.ebentos.backend.model.Cliente; // Importar Cliente
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
    private final ClienteService clienteService;
    private final ProductoraService productoraService;

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
        this.clienteService = clienteService;
        this.productoraService = productoraService;
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
        Rol rolCliente = rolRepository.findByNombre(registroUsuarioDTO.getNombreRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        // Crear la nueva entidad Usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setTelefono(registroUsuarioDTO.getTelefono());

        // Hashear la contraseña
        nuevoUsuario.setContrasenha(passwordEncoder.encode(contrasenha));

        nuevoUsuario.setRol(rolCliente);
        nuevoUsuario.setActivo(1); // Activar el usuario por defecto

        // Guardar el tipo de usuario (USANDO CASCADE)
        if ( registroUsuarioDTO.getNombreRol().equals("CLIENTE") ) {

            // Crear el objeto Cliente (sin persistencia aún)
            Cliente nuevoCliente = clienteService.crearNuevoClienteTemporal(registroUsuarioDTO);

            // Establecer la relación bidireccional
            nuevoCliente.setUsuario(nuevoUsuario);
            nuevoUsuario.setCliente(nuevoCliente);

        } else if ( registroUsuarioDTO.getNombreRol().equals("PRODUCTORA") ) {
            // Crear el objeto Productora (sin persistencia aún)
            Productora nuevaProductora = productoraService.crearNuevaProductoraTemporal(registroUsuarioDTO);
            // Establecer la relación bidireccional
            nuevaProductora.setUsuario(nuevoUsuario);
            nuevoUsuario.setProductora(nuevaProductora);
        }

        // Guardar en la BD
        // Esto guarda Usuario Y, por CascadeType.ALL, guarda los tipos de usuario
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
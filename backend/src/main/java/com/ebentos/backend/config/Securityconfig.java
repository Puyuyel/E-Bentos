package com.ebentos.backend.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.ebentos.backend.model.Rol;
import com.ebentos.backend.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class Securityconfig {

    // Inyecta el valor desde application.properties
    @Value("${app.cors.allowed-origin}")
    private String origenPermitido;

    // BEAN: Codificador de Contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // BEAN: Servicio de Detalles de Usuario
    @Bean
    public UserDetailsService userDetailsService(UsuarioRepository usuarioRepository) {
        return email -> usuarioRepository.findByEmail(email)
                .map(usuario -> {
                    // Obtiene el objeto Rol del usuario
                    Rol rol = usuario.getRol();
                    String nombreRol = rol.getNombre();

                    // Spring Security necesita que los roles empiecen con "ROLE_"
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + nombreRol);

                    // Crea el usuario de Spring con su rol
                    return new org.springframework.security.core.userdetails.User(
                            usuario.getEmail(),
                            usuario.getContrasenha(),
                            // 5. Le pasa la lista con la autoridad
                            Collections.singletonList(authority));
                })
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    // BEAN: Cadena de Filtros de Seguridad
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configuración de CORS (para que React se conecte)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Desactivar CSRF (común para APIs REST stateless)
                .csrf(csrf -> csrf.disable())

                // Autorización de Rutas
                .authorizeHttpRequests(authz -> authz
                        // Permite el registro y el login públicamente
                        .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                        // Protege todas las demás rutas
                        .anyRequest().authenticated())

                .exceptionHandling(ex -> ex
                        // Esto se dispara cuando un usuario no autenticado
                        // intenta acceder a una ruta protegida.
                        .authenticationEntryPoint((request, response, authException) -> {
                            // En lugar de redirigir a HTML, devolvemos 401.
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No autorizado");
                        }))

                // Configuración de FORM LOGIN (para que funcione como API REST)
                .formLogin(form -> form
                        // La URL que Spring Security vigilará para el POST de login
                        .loginProcessingUrl("/api/auth/login")

                        // Nombres de los parámetros que React enviará en el JSON/form
                        .usernameParameter("email")
                        .passwordParameter("contrasenha") // Coincide con tu entidad

                        // Handler para ÉXITO de login (devuelve 200 OK)
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                        })
                        .failureHandler((request, response, exception) -> {
                            // ¡Añade esta línea para imprimir el error en tu consola de Spring!
                            System.out.println("Error de autenticación: " + exception.getMessage());

                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Credenciales inválidas");
                        }))

                // Configuración de LOGOUT (opcional)
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                        }));

        return http.build();
    }

    // BEAN: Configuración de CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // El puerto donde corre React
        configuration.setAllowedOrigins(Arrays.asList(origenPermitido, "http://react:5173", "http://127.0.0.1:5173"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration); // Aplica a toda tu API
        return source;
    }

}

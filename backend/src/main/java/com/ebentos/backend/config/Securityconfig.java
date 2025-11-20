package com.ebentos.backend.config;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.ebentos.backend.model.Rol;
import com.ebentos.backend.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class Securityconfig {

        // Inyecta el valor CSV desde application.properties
        @Value("${app.cors.allowed-origins}")
        private String allowedOriginsCsv;

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
                                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(
                                                        "ROLE_" + nombreRol);

                                        // Crea el usuario de Spring con su rol
                                        return new UsuarioDetails(
                                                        usuario.getUsuarioId(),
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
                                // Desactivar CSRF (común para APIs REST stateless)
                                .csrf(csrf -> csrf.disable())

                                // Configuración de CORS (debe ir ANTES de autorización)
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                // Autorización de Rutas
                                .authorizeHttpRequests(authz -> authz
                                                // Permitir preflight a cualquier ruta
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                // Rutas públicas (no requieren autenticación)
                                                .requestMatchers(HttpMethod.POST, "/api/clientes").permitAll()
                                                .requestMatchers(
                                                                "/api/auth/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/eventosCliente",
                                                                "/api/eventosCliente/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/eventosCliente",
                                                                "/api/eventosCliente/**")
                                                .permitAll()
                                                // Permitir acceso público a rutas de ubicación
                                                .requestMatchers(
                                                                "/api/departamentos/**",
                                                                "/api/provincias/**",
                                                                "/api/distritos/**")
                                                .permitAll()

                                                // Rutas protegidas por rol
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/productoras/*")
                                                .hasAnyRole("ADMIN", "PRODUCTORA")
                                                .requestMatchers("/api/metas/**").hasRole("PRODUCTORA")
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/gestores/*")
                                                .hasAnyRole("ADMIN", "PRODUCTORA", "GESTOR_LOCAL",
                                                                "DUENHO_LOCAL", "TAQUILLERO", "ORGANIZADOR_EVENTOS")
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/clientes/*")
                                                .hasAnyRole("CLIENTE", "TAQUILLERO")
                                                .requestMatchers("/api/productoras/**", "/api/puntoventas/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers("/api/gestores/**")
                                                .hasAnyRole("ADMIN", "GESTOR_LOCAL", "PRODUCTORA")
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/locales/**")
                                                .hasRole("GESTOR_LOCAL")
                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/locales/**")
                                                .hasAnyRole("GESTOR_LOCAL", "DUENHO_LOCAL")
                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/api/locales/**")
                                                .hasAnyRole("GESTOR_LOCAL", "DUENHO_LOCAL")
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/eventos/**")
                                                .hasRole("ORGANIZADOR_EVENTOS")
                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/eventos/**")
                                                .hasRole("ORGANIZADOR_EVENTOS")
                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/api/eventos/**")
                                                .hasRole("ORGANIZADOR_EVENTOS")
                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/solicitudes/**")
                                                .hasRole("DUENHO_LOCAL")
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/solicitudes/**")
                                                .hasAnyRole("DUENHO_LOCAL", "ORGANIZADOR_EVENTOS")
                                                // Protege todas las demás rutas
                                                .anyRequest().authenticated())

                                .exceptionHandling(ex -> ex
                                                // Esto se dispara cuando un usuario no autenticado
                                                // intenta acceder a una ruta protegida.
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        // En lugar de redirigir a HTML, devolvemos 401.
                                                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                                                                        "No autorizado");
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
                                                        String sessionId = request.getSession().getId();
                                                        response.setHeader(
                                                                        "Set-Cookie",
                                                                        "JSESSIONID=" + sessionId
                                                                                        + "; Path=/; Secure; HttpOnly; SameSite=None");
                                                })
                                                .failureHandler((request, response, exception) -> {
                                                        // ¡Añade esta línea para imprimir el error en tu consola de
                                                        // Spring!
                                                        System.out.println("Error de autenticación: "
                                                                        + exception.getMessage());

                                                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                                                                        "Credenciales inválidas");
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

                // Parsea CSV y trim
                List<String> origins = Arrays.stream(allowedOriginsCsv.split(","))
                                .map(String::trim)
                                .filter(s -> !s.isEmpty())
                                .collect(Collectors.toList());

                // DEBUG: Imprime los origins parseados
                System.out.println("🔍 CORS Origins configurados: " + origins);

                // Usa allowedOriginPatterns en lugar de allowedOrigins (más permisivo)
                configuration.setAllowedOriginPatterns(Arrays.asList("*"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setExposedHeaders(Arrays.asList("Access-Control-Allow-Origin",
                                "Access-Control-Allow-Credentials", "Set-Cookie"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L); // 1 hora en segundos

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

}

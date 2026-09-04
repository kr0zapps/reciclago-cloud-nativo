package com.duoc.ms_reciclago_bff;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                // Permite acceso a rutas públicas (si las hubiera, como /actuator/health)
                .requestMatchers("/public/**").permitAll()
                // Cualquier otra ruta al BFF requiere estar autenticado con un JWT válido
                .anyRequest().authenticated()
            )
            // Configura a Spring Boot como un Servidor de Recursos OAuth2 que valida JWTs
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        
        return http.build();
    }
}

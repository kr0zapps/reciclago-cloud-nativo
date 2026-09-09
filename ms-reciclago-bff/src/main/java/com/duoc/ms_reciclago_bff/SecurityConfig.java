package com.duoc.ms_reciclago_bff;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import java.util.*;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.audiences}")
    private String audience;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/public/**", "/actuator/health").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("Admin")
                .requestMatchers("/api/coordinador/**").hasAnyRole("Admin", "Coordinador")
                .requestMatchers("/api/pickups/**").authenticated()
                .requestMatchers("/api/catalog/**").authenticated()
                .requestMatchers("/api/me").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(customJwtAuthenticationConverter())
                )
                .authenticationEntryPoint(authenticationEntryPoint())
                .accessDeniedHandler(accessDeniedHandler())
            );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = JwtDecoders.fromIssuerLocation(issuerUri);

        OAuth2TokenValidator<Jwt> withTimestamp = new JwtTimestampValidator();
        OAuth2TokenValidator<Jwt> withIssuer = (Jwt token) -> {
            String iss = token.getIssuer() != null ? token.getIssuer().toString() : "";
            if (iss.contains("5625266d-cae0-4070-a7ea-b5e88273580f")) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Emisor no corresponde al tenant de RecicLaGo: " + iss, null));
        };

        OAuth2TokenValidator<Jwt> withAudience = (Jwt token) -> {
            List<String> audiences = token.getAudience();
            if (audiences != null && audiences.stream().anyMatch(a ->
                a.contains("9a946a0b-5350-4fe1-a79e-ca332612f60d") ||
                a.contains("20ae8f6f-ef82-48a6-a4ae-897d36212b4b") ||
                a.contains(audience))) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Audiencia no corresponde a la aplicacion: " + audiences, null));
        };

        jwtDecoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withTimestamp, withIssuer, withAudience));
        return jwtDecoder;
    }

    private JwtAuthenticationConverter customJwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setPrincipalClaimName("preferred_username");
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            Object rolesClaim = jwt.getClaims().get("roles");
            if (rolesClaim instanceof List<?> rolesList && !rolesList.isEmpty()) {
                for (Object role : rolesList) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toString()));
                }
            } else {
                authorities.add(new SimpleGrantedAuthority("ROLE_Vecino"));
            }

            Object scpClaim = jwt.getClaims().get("scp");
            if (scpClaim instanceof String scpString) {
                for (String scope : scpString.split(" ")) {
                    authorities.add(new SimpleGrantedAuthority("SCOPE_" + scope));
                }
            }

            return authorities;
        });

        return converter;
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            String detail = authException != null && authException.getMessage() != null
                ? authException.getMessage().replace("\"", "'")
                : "Token JWT no valido o ausente";
            response.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"" + detail + "\"}");
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            String detail = accessDeniedException != null && accessDeniedException.getMessage() != null
                ? accessDeniedException.getMessage().replace("\"", "'")
                : "Acceso denegado: no cuentas con el rol requerido";
            response.getWriter().write("{\"status\":403,\"error\":\"Forbidden\",\"message\":\"" + detail + "\"}");
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:4200",
            "http://reciclago-frontend-puertovaras.s3-website-us-east-1.amazonaws.com",
            "https://reciclago-frontend-puertovaras.s3.us-east-1.amazonaws.com"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

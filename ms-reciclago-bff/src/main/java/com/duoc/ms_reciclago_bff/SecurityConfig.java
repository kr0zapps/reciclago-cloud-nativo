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
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String ROLE_ADMIN = "Admin";
    private static final String ROLE_COORDINADOR = "Coordinador";
    private static final String ROLE_CHOFER = "Chofer";
    private static final String ROLE_PREFIX = "ROLE_";

    @Value("${azure.activedirectory.tenant-id:5625266d-cae0-4070-a7ea-b5e88273580f}")
    private String tenantId;

    @Value("${azure.activedirectory.client-id:9a946a0b-5350-4fe1-a79e-ca332612f60d}")
    private String clientId;

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
                .requestMatchers("/public/**", "/actuator/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Acceso público a información cívica y consultas comunitarias
                .requestMatchers(HttpMethod.GET, "/api/citizens/how-it-works", "/api/citizens/faq", "/api/citizens/impacto").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/citizens/contact").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/routes/cuadrante", "/api/routes/cuadrantes", "/api/routes/cuadrantes/*", "/api/routes/*/tracking", "/api/routes/tracking/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/catalog/residuos", "/api/catalog/camiones").permitAll()
                // Paneles administrativos, coordinación y chofer
                .requestMatchers("/api/admin/**").hasRole(ROLE_ADMIN)
                .requestMatchers("/api/coordinador/**").hasAnyRole(ROLE_ADMIN, ROLE_COORDINADOR)
                .requestMatchers("/api/chofer/**").hasAnyRole(ROLE_ADMIN, ROLE_COORDINADOR, ROLE_CHOFER)
                .requestMatchers(HttpMethod.GET, "/api/citizens/contact").hasAnyRole(ROLE_ADMIN, ROLE_COORDINADOR)
                .requestMatchers(HttpMethod.PUT, "/api/routes/tracking/**").hasAnyRole(ROLE_ADMIN, ROLE_COORDINADOR, ROLE_CHOFER)
                // RBAC estricto en operaciones logisticas de ciclo de vida (Admin, Coordinador y Chofer)
                .requestMatchers(HttpMethod.PATCH, "/api/pickups/*/programar").hasAnyRole(ROLE_ADMIN, ROLE_COORDINADOR)
                .requestMatchers(HttpMethod.PATCH, "/api/pickups/*/en-ruta").hasAnyRole(ROLE_ADMIN, ROLE_COORDINADOR, ROLE_CHOFER)
                .requestMatchers(HttpMethod.PATCH, "/api/pickups/*/retirado").hasAnyRole(ROLE_ADMIN, ROLE_COORDINADOR, ROLE_CHOFER)
                .requestMatchers(HttpMethod.PATCH, "/api/pickups/*/pesado").hasAnyRole(ROLE_ADMIN, ROLE_COORDINADOR, ROLE_CHOFER)
                .requestMatchers(HttpMethod.PATCH, "/api/catalog/camiones/*/estado").hasAnyRole(ROLE_ADMIN, ROLE_COORDINADOR)
                .requestMatchers("/api/pickups/**").authenticated()
                .requestMatchers("/api/catalog/**").authenticated()
                .requestMatchers("/api/routes/**").authenticated()
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
            if (iss.contains(tenantId) || iss.equals(issuerUri)) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Emisor no corresponde al tenant de RecicLaGo: " + iss, null));
        };

        OAuth2TokenValidator<Jwt> withAudience = (Jwt token) -> {
            List<String> audiences = token.getAudience();
            if (audiences != null && audiences.stream().anyMatch(a ->
                a.equals(clientId) ||
                a.equals("api://" + clientId) ||
                a.equals(audience))) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Audiencia no corresponde a la API de RecicLaGo: " + audiences, null));
        };

        jwtDecoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withTimestamp, withIssuer, withAudience));
        return jwtDecoder;
    }

    private JwtAuthenticationConverter customJwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setPrincipalClaimName("preferred_username");
        converter.setJwtGrantedAuthoritiesConverter(this::extractAuthorities);
        return converter;
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        extractRoles(jwt, authorities);
        extractScopes(jwt, authorities);
        return authorities;
    }

    private void extractRoles(Jwt jwt, Collection<GrantedAuthority> authorities) {
        Object rolesClaim = jwt.getClaims().get("roles");
        if (rolesClaim instanceof List<?> rolesList && !rolesList.isEmpty()) {
            for (Object role : rolesList) {
                if (role != null) {
                    addRoleAuthorities(role.toString(), authorities);
                }
            }
        } else if (rolesClaim instanceof String roleStr && !roleStr.isBlank()) {
            for (String r : roleStr.split(",")) {
                addRoleAuthorities(r, authorities);
            }
        } else {
            authorities.add(new SimpleGrantedAuthority(ROLE_PREFIX + "Vecino"));
        }
    }

    private void addRoleAuthorities(String roleName, Collection<GrantedAuthority> authorities) {
        String r = roleName.trim();
        if (r.isEmpty()) {
            return;
        }
        authorities.add(new SimpleGrantedAuthority(ROLE_PREFIX + r));
        String cap = Character.toUpperCase(r.charAt(0)) + (r.length() > 1 ? r.substring(1).toLowerCase() : "");
        if (!cap.equals(r)) {
            authorities.add(new SimpleGrantedAuthority(ROLE_PREFIX + cap));
        }
    }

    private void extractScopes(Jwt jwt, Collection<GrantedAuthority> authorities) {
        Object scpClaim = jwt.getClaims().get("scp");
        if (scpClaim instanceof String scpString) {
            for (String scope : scpString.split(" ")) {
                authorities.add(new SimpleGrantedAuthority("SCOPE_" + scope));
            }
        }
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
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

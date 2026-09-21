package com.duoc.ms_reciclago_bff;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class BffController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(BffController.class);
    private final RestClient restClient;

    @Value("${reciclago.services.catalog-url:http://localhost:8081}")
    private String catalogUrl;

    @Value("${reciclago.services.pickups-url:http://localhost:8083}")
    private String pickupsUrl;

    @Value("${reciclago.services.routes-url:http://localhost:8084}")
    private String routesUrl;

    public BffController(RestClient.Builder restClientBuilder) {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.restClient = restClientBuilder
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .build();
    }

    @GetMapping("/public/status")
    public ResponseEntity<Map<String, Object>> getPublicStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "ms-reciclago-bff");
        response.put("security", "Public endpoint");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/me")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("subject", jwt.getSubject());
        profile.put("username", jwt.getClaimAsString("preferred_username"));
        profile.put("name", jwt.getClaimAsString("name"));
        profile.put("roles", jwt.getClaimAsStringList("roles"));
        profile.put("issuer", jwt.getIssuer().toString());
        profile.put("audience", jwt.getAudience());
        profile.put("claims", jwt.getClaims());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/api/admin/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminData(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Acceso exclusivo concedido para Administradores de RecicLaGo");
        response.put("user", jwt.getClaimAsString("preferred_username"));
        response.put("roles", jwt.getClaimAsStringList("roles"));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/coordinador/dashboard")
    public ResponseEntity<Map<String, Object>> getCoordinadorData(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Acceso concedido para Coordinadores y Administradores de RecicLaGo");
        response.put("user", jwt.getClaimAsString("preferred_username"));
        response.put("roles", jwt.getClaimAsStringList("roles"));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/chofer/dashboard")
    public ResponseEntity<Map<String, Object>> getChoferData(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Acceso concedido para Choferes y Personal Operativo de RecicLaGo");
        response.put("user", jwt.getClaimAsString("preferred_username"));
        response.put("roles", jwt.getClaimAsStringList("roles"));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/catalog/residuos")
    public ResponseEntity<?> getResiduos() {
        try {
            List<?> residuos = restClient.get()
                    .uri(catalogUrl + "/api/catalog/residuos")
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(residuos);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error comunicando con ms-reciclago-catalog");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @GetMapping("/api/catalog/tarifas")
    public ResponseEntity<?> getTarifas() {
        try {
            List<?> tarifas = restClient.get()
                    .uri(catalogUrl + "/api/catalog/tarifas")
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(tarifas);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error comunicando con ms-reciclago-catalog");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @GetMapping("/api/catalog/camiones")
    public ResponseEntity<?> getCamiones() {
        try {
            List<?> camiones = restClient.get()
                    .uri(catalogUrl + "/api/catalog/camiones")
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(camiones);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error comunicando con ms-reciclago-catalog");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    /**
     * Retorna la rotación semanal de residuos domiciliarios calculada por ms-reciclago-catalog.
     * El frontend consume este endpoint para mostrar el material de la semana actual
     * sin depender de constantes hardcodeadas.
     *
     * @param fecha Opcional. Fecha ISO yyyy-MM-dd para consulta histórica o futura.
     */
    @GetMapping("/api/catalog/rotacion/semanal")
    public ResponseEntity<?> getRotacionSemanal(@RequestParam(required = false) String fecha) {
        try {
            String uri = catalogUrl + "/api/catalog/rotacion/semanal";
            if (fecha != null && !fecha.isBlank()) {
                uri += "?fecha=" + java.net.URLEncoder.encode(fecha, java.nio.charset.StandardCharsets.UTF_8);
            }
            Object rotacion = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(rotacion);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "ms-reciclago-catalog no disponible para consultar rotación semanal");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @GetMapping("/api/catalog/rotacion/config")
    public ResponseEntity<?> getRotacionConfig() {
        try {
            Object config = restClient.get()
                    .uri(catalogUrl + "/api/catalog/rotacion/config")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "ms-reciclago-catalog no disponible para consultar configuración de rotación");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @PutMapping("/api/catalog/rotacion/config")
    public ResponseEntity<?> actualizarRotacionConfig(@RequestBody Map<String, Object> payload) {
        try {
            Object actualizada = restClient.put()
                    .uri(catalogUrl + "/api/catalog/rotacion/config")
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error actualizando configuración de rotación en ms-reciclago-catalog");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/api/catalog/rotacion/reset")
    public ResponseEntity<?> resetRotacionConfig() {
        try {
            Object res = restClient.post()
                    .uri(catalogUrl + "/api/catalog/rotacion/reset")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error restableciendo rotación en ms-reciclago-catalog");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PatchMapping("/api/catalog/rotacion/sector/{sectorNombre}")
    public ResponseEntity<?> actualizarSectorRotacion(@PathVariable String sectorNombre, @RequestBody Map<String, String> payload) {
        try {
            Object res = restClient.patch()
                    .uri(catalogUrl + "/api/catalog/rotacion/sector/" + java.net.URLEncoder.encode(sectorNombre, java.nio.charset.StandardCharsets.UTF_8))
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error actualizando programación del sector en ms-reciclago-catalog");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PatchMapping("/api/catalog/camiones/{id}/estado")
    public ResponseEntity<?> actualizarEstadoCamion(@PathVariable Long id, @RequestParam String estado) {
        try {
            var actualizado = restClient.patch()
                    .uri(catalogUrl + "/api/catalog/camiones/" + id + "/estado?estado=" + estado)
                    .retrieve()
                    .body(Map.class);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error actualizando estado del camión en ms-reciclago-catalog");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/api/pickups")
    public ResponseEntity<?> getPickups(@AuthenticationPrincipal Jwt jwt, @RequestParam(required = false) String vecinoEmail) {
        try {
            // Protección contra fuga de datos (BOLA): Si no es Staff (Admin, Coordinador, Chofer), forzar su propio email
            List<String> roles = jwt != null ? jwt.getClaimAsStringList("roles") : null;
            boolean isStaff = roles != null && roles.stream().anyMatch(r ->
                r.equalsIgnoreCase("Admin") || r.equalsIgnoreCase("Coordinador") || r.equalsIgnoreCase("Chofer")
            );

            String effectiveEmail = vecinoEmail;
            if (!isStaff && jwt != null) {
                effectiveEmail = jwt.getClaimAsString("preferred_username");
                if (effectiveEmail == null) effectiveEmail = jwt.getClaimAsString("upn");
                if (effectiveEmail == null) effectiveEmail = jwt.getClaimAsString("email");
                if (effectiveEmail == null) effectiveEmail = jwt.getClaimAsString("unique_name");
            }

            if (!isStaff && (effectiveEmail == null || effectiveEmail.isBlank())) {
                return ResponseEntity.ok(List.of());
            }

            String uri = pickupsUrl + "/api/pickups";
            if (effectiveEmail != null && !effectiveEmail.isBlank()) {
                uri += "?vecinoEmail=" + effectiveEmail;
            }
            List<?> pickups = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(pickups != null ? pickups : List.of());
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error comunicando con ms-reciclago-pickups");
            error.put("message", "Servicio no disponible actualmente");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @PostMapping("/api/pickups")
    public ResponseEntity<?> createPickup(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> payload) {
        try {
            List<String> roles = jwt != null ? jwt.getClaimAsStringList("roles") : null;
            boolean isStaff = roles != null && roles.stream().anyMatch(r ->
                r.equalsIgnoreCase("Admin") || r.equalsIgnoreCase("Coordinador") || r.equalsIgnoreCase("Chofer")
            );

            // Identidad del vecino
            String email = (payload.get("vecinoEmail") != null && !payload.get("vecinoEmail").toString().isBlank())
                    ? payload.get("vecinoEmail").toString()
                    : (payload.get("ciudadanoEmail") != null ? payload.get("ciudadanoEmail").toString() : null);

            // Si es un vecino común (no staff), su email DEBE ser el del token (prevención IDOR)
            if (!isStaff) {
                if (jwt != null) {
                    String tokenEmail = jwt.getClaimAsString("preferred_username");
                    if (tokenEmail == null) tokenEmail = jwt.getClaimAsString("upn");
                    if (tokenEmail == null) tokenEmail = jwt.getClaimAsString("email");
                    if (tokenEmail == null) tokenEmail = jwt.getClaimAsString("unique_name");
                    if (tokenEmail != null && !tokenEmail.isBlank()) {
                        email = tokenEmail;
                    }
                }
            }
            if (email == null || email.isBlank()) {
                email = "vecino.contacto@puertovaras.cl";
            }
            payload.put("vecinoEmail", email);

            String name = (payload.get("vecinoNombre") != null && !payload.get("vecinoNombre").toString().isBlank())
                    ? payload.get("vecinoNombre").toString()
                    : null;
            if (!isStaff && jwt != null) {
                String tokenName = jwt.getClaimAsString("name");
                if (tokenName == null) tokenName = jwt.getClaimAsString("given_name");
                if (tokenName != null && !tokenName.isBlank()) {
                    name = tokenName;
                }
            }
            if (name == null || name.isBlank()) {
                name = (email.contains("@")) ? email.substring(0, email.indexOf('@')) : "Vecino Puerto Varas";
            }
            payload.put("vecinoNombre", name);

            // Defaults requeridos por ms-pickups
            if (!payload.containsKey("comuna") || payload.get("comuna") == null || payload.get("comuna").toString().isBlank()) {
                payload.put("comuna", "Puerto Varas");
            }
            if (!payload.containsKey("pesoEstimadoKg") || payload.get("pesoEstimadoKg") == null) {
                payload.put("pesoEstimadoKg", 5.0);
            }
            if (!payload.containsKey("residuoId") || payload.get("residuoId") == null) {
                payload.put("residuoId", 1L);
            }
            if (!payload.containsKey("residuoNombre") || payload.get("residuoNombre") == null || payload.get("residuoNombre").toString().isBlank()) {
                payload.put("residuoNombre", "Residuo Reciclable");
            }

            // Homogeneizar observaciones y comentarios para evitar fallo de mapeo
            if (payload.containsKey("comentarios") && !payload.containsKey("observaciones")) {
                payload.put("observaciones", payload.get("comentarios"));
            }

            Object response = restClient.post()
                    .uri(pickupsUrl + "/api/pickups")
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(Object.class);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            log.error("Error HTTP al crear retiro: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Error al crear retiro: {}", e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al crear solicitud en ms-reciclago-pickups");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/api/pickups/summary")
    public ResponseEntity<Map<String, Object>> getPickupsSummary(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("preferred_username");
        if (email == null)
            email = jwt.getClaimAsString("upn");

        Map<String, Object> response = new HashMap<>();
        response.put("user", email);
        response.put("name", jwt.getClaimAsString("name"));
        response.put("roles", jwt.getClaimAsStringList("roles"));

        try {
            List<?> allPickups = restClient.get()
                    .uri(pickupsUrl + "/api/pickups")
                    .retrieve()
                    .body(List.class);

            List<?> myPickups = restClient.get()
                    .uri(pickupsUrl + "/api/pickups?vecinoEmail=" + email)
                    .retrieve()
                    .body(List.class);

            response.put("totalSystemPickups", allPickups != null ? allPickups.size() : 0);
            response.put("userPickupsCount", myPickups != null ? myPickups.size() : 0);
            response.put("userPickups", myPickups);
            response.put("status", "SUCCESS");
        } catch (Exception e) {
            response.put("status", "PARTIAL");
            response.put("message", "Microservicio de retiros no disponible actualmente");
        }

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/api/pickups/{id}/programar")
    public ResponseEntity<?> programarPickup(@PathVariable Long id,
            @RequestParam(required = false) Long camionId,
            @RequestParam(required = false) String camionPatente,
            @RequestParam(required = false) String fechaProgramada,
            @RequestBody(required = false) Map<String, Object> body) {
        try {
            Long effectiveCamionId = camionId != null ? camionId : (body != null && body.get("camionId") != null ? Long.valueOf(body.get("camionId").toString()) : null);
            String effectivePatente = camionPatente != null ? camionPatente : (body != null && body.get("camionPatente") != null ? body.get("camionPatente").toString() : null);
            String rawFecha = fechaProgramada != null ? fechaProgramada : (body != null && body.get("fechaProgramada") != null ? body.get("fechaProgramada").toString() : null);

            if (effectiveCamionId == null || effectivePatente == null || effectivePatente.isBlank() || rawFecha == null || rawFecha.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Los campos camionId, camionPatente y fechaProgramada son obligatorios para programar un retiro"));
            }

            String trimmed = rawFecha.trim();
            String effectiveFecha = (trimmed.length() == 16) ? (trimmed + ":00") : trimmed;

            Map<String, Object> forwardBody = Map.of(
                    "camionId", effectiveCamionId,
                    "camionPatente", effectivePatente,
                    "fechaProgramada", effectiveFecha
            );

            Object response = restClient.patch()
                    .uri(pickupsUrl + "/api/pickups/{id}/programar?camionId={camionId}&camionPatente={camionPatente}&fechaProgramada={fechaProgramada}",
                            id, effectiveCamionId, effectivePatente, effectiveFecha)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(forwardBody)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            log.error("Error HTTP al programar retiro {}: {} - {}", id, e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Error al programar retiro {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Error al programar retiro"));
        }
    }

    @PatchMapping("/api/pickups/{id}/en-ruta")
    public ResponseEntity<?> enRutaPickup(@PathVariable Long id) {
        try {
            Object response = restClient.patch()
                    .uri(pickupsUrl + "/api/pickups/" + id + "/en-ruta")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/api/pickups/{id}/retirado")
    public ResponseEntity<?> retiradoPickup(@PathVariable Long id) {
        try {
            Object response = restClient.patch()
                    .uri(pickupsUrl + "/api/pickups/" + id + "/retirado")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/api/pickups/{id}/pesado")
    public ResponseEntity<?> pesadoPickup(@PathVariable Long id,
            @RequestParam(required = false) Double pesoRealKg,
            @RequestBody(required = false) Map<String, Object> body) {
        try {
            Double effectivePeso = pesoRealKg != null ? pesoRealKg : (body != null && body.get("pesoRealKg") != null ? Double.valueOf(body.get("pesoRealKg").toString()) : null);
            if (effectivePeso == null || effectivePeso <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "El campo pesoRealKg es obligatorio y debe ser mayor a 0"));
            }
            Object response = restClient.patch()
                    .uri(pickupsUrl + "/api/pickups/{id}/pesado?pesoRealKg={pesoRealKg}", id, effectivePeso)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(Map.of("pesoRealKg", effectivePeso))
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/api/pickups/{id}/cancelar")
    public ResponseEntity<?> cancelarPickup(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            // Protección contra BOLA / IDOR
            Map<?, ?> pickup = restClient.get()
                    .uri(pickupsUrl + "/api/pickups/" + id)
                    .retrieve()
                    .body(Map.class);
            if (pickup == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Retiro no encontrado"));
            }

            List<String> roles = jwt != null ? jwt.getClaimAsStringList("roles") : null;
            boolean isStaff = roles != null && roles.stream().anyMatch(r ->
                r.equalsIgnoreCase("Admin") || r.equalsIgnoreCase("Coordinador") || r.equalsIgnoreCase("Chofer")
            );
            String userEmail = jwt != null ? jwt.getClaimAsString("preferred_username") : null;
            if (userEmail == null && jwt != null) {
                userEmail = jwt.getClaimAsString("upn");
            }
            if (userEmail == null && jwt != null) {
                userEmail = jwt.getClaimAsString("email");
            }

            Object pickupOwner = pickup.get("vecinoEmail");
            if (!isStaff && (userEmail == null || !userEmail.equalsIgnoreCase(String.valueOf(pickupOwner)))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "No autorizado para cancelar este retiro"));
            }

            Object response = restClient.patch()
                    .uri(pickupsUrl + "/api/pickups/{id}/cancelar" + (motivo != null && !motivo.isBlank() ? "?motivo={motivo}" : ""),
                            (motivo != null && !motivo.isBlank() ? new Object[]{id, motivo} : new Object[]{id}))
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(motivo != null ? Map.of("motivo", motivo) : Map.of())
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/pickups/history")
    public ResponseEntity<?> getPickupsHistory(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String vecinoEmail,
            @RequestParam(required = false) String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<String> roles = jwt != null ? jwt.getClaimAsStringList("roles") : null;
            boolean isStaff = roles != null && roles.stream().anyMatch(r ->
                r.equalsIgnoreCase("Admin") || r.equalsIgnoreCase("Coordinador") || r.equalsIgnoreCase("Chofer")
            );
            String effectiveEmail = vecinoEmail;
            if (!isStaff && jwt != null) {
                effectiveEmail = jwt.getClaimAsString("preferred_username");
                if (effectiveEmail == null) {
                    effectiveEmail = jwt.getClaimAsString("upn");
                }
                if (effectiveEmail == null) {
                    effectiveEmail = jwt.getClaimAsString("email");
                }
            }
            String uri = pickupsUrl + "/api/pickups/history?page=" + page + "&size=" + size;
            if (effectiveEmail != null && !effectiveEmail.isBlank()) {
                uri += "&vecinoEmail=" + java.net.URLEncoder.encode(effectiveEmail, java.nio.charset.StandardCharsets.UTF_8);
            }
            if (estado != null && !estado.isBlank()) {
                uri += "&estado=" + java.net.URLEncoder.encode(estado, java.nio.charset.StandardCharsets.UTF_8);
            }
            Object history = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error comunicando con ms-reciclago-pickups");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @GetMapping("/api/pickups/{id}")
    public ResponseEntity<?> getPickupById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        try {
            Map<?, ?> pickup = restClient.get()
                    .uri(pickupsUrl + "/api/pickups/" + id)
                    .retrieve()
                    .body(Map.class);
            if (pickup == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Retiro no encontrado"));
            }

            List<String> roles = jwt != null ? jwt.getClaimAsStringList("roles") : null;
            boolean isStaff = roles != null && (roles.contains("Admin") || roles.contains("Coordinador"));
            String userEmail = jwt != null ? jwt.getClaimAsString("preferred_username") : null;
            if (userEmail == null && jwt != null) {
                userEmail = jwt.getClaimAsString("upn");
            }

            Object pickupOwner = pickup.get("vecinoEmail");
            if (!isStaff && (userEmail == null || !userEmail.equalsIgnoreCase(String.valueOf(pickupOwner)))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "No autorizado para visualizar este retiro"));
            }

            return ResponseEntity.ok(pickup);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Retiro no encontrado", "details", e.getMessage()));
        }
    }

    // ==========================================
    // Endpoints de Rutas y Cuadrantes (ms-reciclago-routes)
    // ==========================================

    @GetMapping("/api/routes/cuadrantes")
    public ResponseEntity<?> getCuadrantes() {
        try {
            List<?> cuadrantes = restClient.get()
                    .uri(routesUrl + "/api/routes/cuadrantes")
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(cuadrantes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", "ms-reciclago-routes no disponible", "details", e.getMessage()));
        }
    }

    @GetMapping("/api/routes/cuadrantes/{id}")
    public ResponseEntity<?> getCuadranteById(@PathVariable Long id) {
        try {
            Object cuadrante = restClient.get()
                    .uri(routesUrl + "/api/routes/cuadrantes/" + id)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(cuadrante);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Cuadrante no encontrado"));
        }
    }

    @GetMapping("/api/routes/cuadrante")
    public ResponseEntity<?> consultarCuadrante(@RequestParam(required = false) String direccion) {
        try {
            String uri = routesUrl + "/api/routes/cuadrante";
            if (direccion != null && !direccion.isBlank()) {
                uri += "?direccion=" + java.net.URLEncoder.encode(direccion, java.nio.charset.StandardCharsets.UTF_8);
            }
            Object response = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", "Error consultando cuadrante", "details", e.getMessage()));
        }
    }

    @GetMapping("/api/routes/{cuadranteId}/tracking")
    public ResponseEntity<?> getTrackingPorCuadrante(@PathVariable Long cuadranteId) {
        try {
            Object tracking = restClient.get()
                    .uri(routesUrl + "/api/routes/" + cuadranteId + "/tracking")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(tracking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Tracking no disponible para el cuadrante"));
        }
    }

    @GetMapping("/api/routes/tracking/{camionId}")
    public ResponseEntity<?> getTrackingPorCamion(@PathVariable Long camionId) {
        try {
            Object tracking = restClient.get()
                    .uri(routesUrl + "/api/routes/tracking/" + camionId)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(tracking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Tracking no disponible para el camion"));
        }
    }

    @PutMapping("/api/routes/tracking/{camionId}")
    public ResponseEntity<?> actualizarTracking(
            @PathVariable Long camionId,
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(required = false) String calle,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) Double velocidad) {
        try {
            String uri = routesUrl + "/api/routes/tracking/" + camionId + "?lat=" + lat + "&lng=" + lng;
            if (calle != null) uri += "&calle=" + java.net.URLEncoder.encode(calle, java.nio.charset.StandardCharsets.UTF_8);
            if (estado != null) uri += "&estado=" + java.net.URLEncoder.encode(estado, java.nio.charset.StandardCharsets.UTF_8);
            if (velocidad != null) uri += "&velocidad=" + velocidad;

            Object response = restClient.put()
                    .uri(uri)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // ==========================================
    // Endpoints Cívicos y Ciudadanos DIMAO
    // ==========================================

    @PostMapping("/api/citizens/contact")
    public ResponseEntity<?> registrarContactoCiudadano(@RequestBody Map<String, Object> payload) {
        try {
            Object response = restClient.post()
                    .uri(routesUrl + "/api/citizens/contact")
                    .body(payload)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Error al enviar mensaje DIMAO", "details", e.getMessage()));
        }
    }

    @GetMapping("/api/citizens/contact")
    public ResponseEntity<?> listarContactosCiudadanos() {
        try {
            List<?> contactos = restClient.get()
                    .uri(routesUrl + "/api/citizens/contact")
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(contactos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", "Servicio no disponible"));
        }
    }

    @GetMapping("/api/citizens/how-it-works")
    public ResponseEntity<?> getGuiaCiudadana() {
        try {
            Object guia = restClient.get()
                    .uri(routesUrl + "/api/citizens/how-it-works")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(guia);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", "Guia ciudadana no disponible"));
        }
    }

    @GetMapping("/api/citizens/faq")
    public ResponseEntity<?> getFaqsCiudadanas() {
        try {
            List<?> faqs = restClient.get()
                    .uri(routesUrl + "/api/citizens/faq")
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(faqs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", "FAQ no disponible"));
        }
    }
}

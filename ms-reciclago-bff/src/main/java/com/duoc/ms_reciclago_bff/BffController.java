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

    private static final String STATUS_KEY = "status";
    private static final String CLAIM_PREFERRED_USERNAME = "preferred_username";
    private static final String CLAIM_ROLES = "roles";
    private static final String MESSAGE_KEY = "message";
    private static final String ERROR_KEY = "error";
    private static final String ERROR_CATALOG = "Error comunicando con ms-reciclago-catalog";
    private static final String DETAILS_KEY = "details";
    private static final String ROLE_ADMIN = "Admin";
    private static final String ROLE_COORDINADOR = "Coordinador";
    private static final String ROLE_CHOFER = "Chofer";
    private static final String CLAIM_EMAIL = "email";
    private static final String PATH_API_PICKUPS = "/api/pickups";
    private static final String FIELD_VECINO_EMAIL = "vecinoEmail";
    private static final String FIELD_VECINO_NOMBRE = "vecinoNombre";
    private static final String FIELD_COMUNA = "comuna";
    private static final String FIELD_PESO_ESTIMADO_KG = "pesoEstimadoKg";
    private static final String FIELD_RESIDUO_ID = "residuoId";
    private static final String FIELD_RESIDUO_NOMBRE = "residuoNombre";
    private static final String FIELD_CAMION_ID = "camionId";
    private static final String FIELD_CAMION_PATENTE = "camionPatente";
    private static final String FIELD_FECHA_PROGRAMADA = "fechaProgramada";
    private static final String PATH_API_PICKUPS_SLASH = "/api/pickups/";
    private static final String FIELD_PESO_REAL_KG = "pesoRealKg";
    private static final String MSG_RETIRO_NO_ENCONTRADO = "Retiro no encontrado";

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
        response.put(STATUS_KEY, "UP");
        response.put("service", "ms-reciclago-bff");
        response.put("security", "Public endpoint");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/me")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("subject", jwt.getSubject());
        profile.put("username", jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME));
        profile.put("name", jwt.getClaimAsString("name"));
        profile.put(CLAIM_ROLES, jwt.getClaimAsStringList(CLAIM_ROLES));
        profile.put("issuer", jwt.getIssuer().toString());
        profile.put("audience", jwt.getAudience());
        profile.put("claims", jwt.getClaims());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/api/admin/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminData(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put(MESSAGE_KEY, "Acceso exclusivo concedido para Administradores de RecicLaGo");
        response.put("user", jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME));
        response.put(CLAIM_ROLES, jwt.getClaimAsStringList(CLAIM_ROLES));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/coordinador/dashboard")
    public ResponseEntity<Map<String, Object>> getCoordinadorData(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put(MESSAGE_KEY, "Acceso concedido para Coordinadores y Administradores de RecicLaGo");
        response.put("user", jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME));
        response.put(CLAIM_ROLES, jwt.getClaimAsStringList(CLAIM_ROLES));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/chofer/dashboard")
    public ResponseEntity<Map<String, Object>> getChoferData(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put(MESSAGE_KEY, "Acceso concedido para Choferes y Personal Operativo de RecicLaGo");
        response.put("user", jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME));
        response.put(CLAIM_ROLES, jwt.getClaimAsStringList(CLAIM_ROLES));
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
            error.put(ERROR_KEY, ERROR_CATALOG);
            error.put(DETAILS_KEY, e.getMessage());
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
            error.put(ERROR_KEY, ERROR_CATALOG);
            error.put(DETAILS_KEY, e.getMessage());
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
            error.put(ERROR_KEY, ERROR_CATALOG);
            error.put(DETAILS_KEY, e.getMessage());
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
            error.put(ERROR_KEY, "ms-reciclago-catalog no disponible para consultar rotación semanal");
            error.put(DETAILS_KEY, e.getMessage());
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
            error.put(ERROR_KEY, "ms-reciclago-catalog no disponible para consultar configuración de rotación");
            error.put(DETAILS_KEY, e.getMessage());
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
            error.put(ERROR_KEY, "Error actualizando configuración de rotación en ms-reciclago-catalog");
            error.put(DETAILS_KEY, e.getMessage());
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
            error.put(ERROR_KEY, "Error restableciendo rotación en ms-reciclago-catalog");
            error.put(DETAILS_KEY, e.getMessage());
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
            error.put(ERROR_KEY, "Error actualizando programación del sector en ms-reciclago-catalog");
            error.put(DETAILS_KEY, e.getMessage());
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
            error.put(ERROR_KEY, "Error actualizando estado del camión en ms-reciclago-catalog");
            error.put(DETAILS_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping(PATH_API_PICKUPS)
    public ResponseEntity<?> getPickups(@AuthenticationPrincipal Jwt jwt, @RequestParam(required = false) String vecinoEmail) {
        try {
            // Protección contra fuga de datos (BOLA): Si no es Staff (Admin, Coordinador, Chofer), forzar su propio email
            boolean isStaff = isStaffUser(jwt);
            String effectiveEmail = isStaff ? vecinoEmail : extractEmailFromJwt(jwt);

            if (!isStaff && (effectiveEmail == null || effectiveEmail.isBlank())) {
                return ResponseEntity.ok(List.of());
            }

            String uri = pickupsUrl + PATH_API_PICKUPS;
            if (effectiveEmail != null && !effectiveEmail.isBlank()) {
                uri += "?" + FIELD_VECINO_EMAIL + "=" + effectiveEmail;
            }
            List<?> pickups = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(pickups != null ? pickups : List.of());
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put(ERROR_KEY, "Error comunicando con ms-reciclago-pickups");
            error.put(MESSAGE_KEY, "Servicio no disponible actualmente");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @PostMapping(PATH_API_PICKUPS)
    public ResponseEntity<?> createPickup(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> payload) {
        try {
            boolean isStaff = isStaffUser(jwt);
            String email = resolvePickupEmail(jwt, payload, isStaff);
            payload.put(FIELD_VECINO_EMAIL, email);

            String name = resolvePickupNombre(jwt, payload, isStaff, email);
            payload.put(FIELD_VECINO_NOMBRE, name);

            applyPickupDefaults(payload);

            Object response = restClient.post()
                    .uri(pickupsUrl + PATH_API_PICKUPS)
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
            error.put(ERROR_KEY, "Error al crear solicitud en ms-reciclago-pickups");
            error.put(MESSAGE_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/api/pickups/summary")
    public ResponseEntity<Map<String, Object>> getPickupsSummary(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME);
        if (email == null)
            email = jwt.getClaimAsString("upn");

        Map<String, Object> response = new HashMap<>();
        response.put("user", email);
        response.put("name", jwt.getClaimAsString("name"));
        response.put(CLAIM_ROLES, jwt.getClaimAsStringList(CLAIM_ROLES));

        try {
            List<?> allPickups = restClient.get()
                    .uri(pickupsUrl + PATH_API_PICKUPS)
                    .retrieve()
                    .body(List.class);

            List<?> myPickups = restClient.get()
                    .uri(pickupsUrl + PATH_API_PICKUPS + "?" + FIELD_VECINO_EMAIL + "=" + email)
                    .retrieve()
                    .body(List.class);

            response.put("totalSystemPickups", allPickups != null ? allPickups.size() : 0);
            response.put("userPickupsCount", myPickups != null ? myPickups.size() : 0);
            response.put("userPickups", myPickups);
            response.put(STATUS_KEY, "SUCCESS");
        } catch (Exception e) {
            response.put(STATUS_KEY, "PARTIAL");
            response.put(MESSAGE_KEY, "Microservicio de retiros no disponible actualmente");
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
            Long effectiveCamionId = resolveLongParam(camionId, body, FIELD_CAMION_ID);
            String effectivePatente = resolveStringParam(camionPatente, body, FIELD_CAMION_PATENTE);
            String rawFecha = resolveStringParam(fechaProgramada, body, FIELD_FECHA_PROGRAMADA);

            if (effectiveCamionId == null || effectivePatente == null || effectivePatente.isBlank() || rawFecha == null || rawFecha.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(ERROR_KEY, "Los campos camionId, camionPatente y fechaProgramada son obligatorios para programar un retiro"));
            }

            String effectiveFecha = formatFechaProgramada(rawFecha);

            Map<String, Object> forwardBody = Map.of(
                    FIELD_CAMION_ID, effectiveCamionId,
                    FIELD_CAMION_PATENTE, effectivePatente,
                    FIELD_FECHA_PROGRAMADA, effectiveFecha
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(ERROR_KEY, e.getMessage() != null ? e.getMessage() : "Error al programar retiro"));
        }
    }

    @PatchMapping("/api/pickups/{id}/en-ruta")
    public ResponseEntity<?> enRutaPickup(@PathVariable Long id) {
        try {
            Object response = restClient.patch()
                    .uri(pickupsUrl + PATH_API_PICKUPS_SLASH + id + "/en-ruta")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(ERROR_KEY, e.getMessage()));
        }
    }

    @PatchMapping("/api/pickups/{id}/retirado")
    public ResponseEntity<?> retiradoPickup(@PathVariable Long id) {
        try {
            Object response = restClient.patch()
                    .uri(pickupsUrl + PATH_API_PICKUPS_SLASH + id + "/retirado")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(ERROR_KEY, e.getMessage()));
        }
    }

    @PatchMapping("/api/pickups/{id}/pesado")
    public ResponseEntity<?> pesadoPickup(@PathVariable Long id,
            @RequestParam(required = false) Double pesoRealKg,
            @RequestBody(required = false) Map<String, Object> body) {
        try {
            Double effectivePeso = resolveDoubleParam(pesoRealKg, body, FIELD_PESO_REAL_KG);
            if (effectivePeso == null || effectivePeso <= 0) {
                return ResponseEntity.badRequest().body(Map.of(ERROR_KEY, "El campo pesoRealKg es obligatorio y debe ser mayor a 0"));
            }
            Object response = restClient.patch()
                    .uri(pickupsUrl + "/api/pickups/{id}/pesado?pesoRealKg={pesoRealKg}", id, effectivePeso)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(Map.of(FIELD_PESO_REAL_KG, effectivePeso))
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(ERROR_KEY, e.getMessage()));
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
                    .uri(pickupsUrl + PATH_API_PICKUPS_SLASH + id)
                    .retrieve()
                    .body(Map.class);
            if (pickup == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(ERROR_KEY, MSG_RETIRO_NO_ENCONTRADO));
            }

            if (!isUserAuthorizedForPickup(pickup, jwt)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(ERROR_KEY, "No autorizado para cancelar este retiro"));
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(ERROR_KEY, e.getMessage()));
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
            boolean isStaff = isStaffUser(jwt);
            String effectiveEmail = vecinoEmail;
            if (!isStaff && jwt != null) {
                effectiveEmail = extractEmailFromJwt(jwt);
            }
            String uri = pickupsUrl + "/api/pickups/history?page=" + page + "&size=" + size;
            if (effectiveEmail != null && !effectiveEmail.isBlank()) {
                uri += "&" + FIELD_VECINO_EMAIL + "=" + java.net.URLEncoder.encode(effectiveEmail, java.nio.charset.StandardCharsets.UTF_8);
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
            error.put(ERROR_KEY, "Error comunicando con ms-reciclago-pickups");
            error.put(MESSAGE_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @GetMapping("/api/pickups/{id}")
    public ResponseEntity<?> getPickupById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        try {
            Map<?, ?> pickup = restClient.get()
                    .uri(pickupsUrl + PATH_API_PICKUPS_SLASH + id)
                    .retrieve()
                    .body(Map.class);
            if (pickup == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(ERROR_KEY, MSG_RETIRO_NO_ENCONTRADO));
            }

            List<String> roles = jwt != null ? jwt.getClaimAsStringList(CLAIM_ROLES) : null;
            boolean isStaff = roles != null && (roles.contains(ROLE_ADMIN) || roles.contains(ROLE_COORDINADOR));
            String userEmail = jwt != null ? jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME) : null;
            if (userEmail == null && jwt != null) {
                userEmail = jwt.getClaimAsString("upn");
            }

            Object pickupOwner = pickup.get(FIELD_VECINO_EMAIL);
            if (!isStaff && (userEmail == null || !userEmail.equalsIgnoreCase(String.valueOf(pickupOwner)))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(ERROR_KEY, "No autorizado para visualizar este retiro"));
            }

            return ResponseEntity.ok(pickup);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(ERROR_KEY, MSG_RETIRO_NO_ENCONTRADO, DETAILS_KEY, e.getMessage()));
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
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(ERROR_KEY, "ms-reciclago-routes no disponible", DETAILS_KEY, e.getMessage()));
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(ERROR_KEY, "Cuadrante no encontrado"));
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
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(ERROR_KEY, "Error consultando cuadrante", DETAILS_KEY, e.getMessage()));
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(ERROR_KEY, "Tracking no disponible para el cuadrante"));
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(ERROR_KEY, "Tracking no disponible para el camion"));
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(ERROR_KEY, e.getMessage()));
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(ERROR_KEY, "Error al enviar mensaje DIMAO", DETAILS_KEY, e.getMessage()));
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
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(ERROR_KEY, "Servicio no disponible"));
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
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(ERROR_KEY, "Guia ciudadana no disponible"));
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
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(ERROR_KEY, "FAQ no disponible"));
        }
    }

    @GetMapping("/api/citizens/impacto")
    public ResponseEntity<Map<String, Object>> getImpactoComunal() {
        Map<String, Object> response = new HashMap<>();

        int camionesOperativos = fetchCamionesOperativos();
        double kilosRecolectadosReales = fetchKilosRecolectadosReales();

        double totalKilosCertificados = kilosRecolectadosReales;
        int porcentaje = kilosRecolectadosReales > 0 ? Math.min(100, Math.max(15, (int)(kilosRecolectadosReales / 10) + 15)) : 25;

        response.put("kilosCertificados", Math.round(totalKilosCertificados));
        response.put("kilosEnVivo", Math.round(kilosRecolectadosReales));
        response.put("porcentajeVertederos", porcentaje);
        response.put("camionesOperativos", camionesOperativos);
        response.put(FIELD_COMUNA, "Puerto Varas");
        response.put("origen", "ms-reciclago-pickups & ms-reciclago-catalog");
        response.put(STATUS_KEY, "LIVE");

        return ResponseEntity.ok(response);
    }

    private boolean isStaffUser(Jwt jwt) {
        if (jwt == null) {
            return false;
        }
        List<String> roles = jwt.getClaimAsStringList(CLAIM_ROLES);
        return roles != null && roles.stream().anyMatch(r ->
            r.equalsIgnoreCase(ROLE_ADMIN) || r.equalsIgnoreCase(ROLE_COORDINADOR) || r.equalsIgnoreCase(ROLE_CHOFER)
        );
    }

    private String extractEmailFromJwt(Jwt jwt) {
        if (jwt == null) {
            return null;
        }
        String email = jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME);
        if (email == null) {
            email = jwt.getClaimAsString("upn");
        }
        if (email == null) {
            email = jwt.getClaimAsString(CLAIM_EMAIL);
        }
        if (email == null) {
            email = jwt.getClaimAsString("unique_name");
        }
        return email;
    }

    private String resolvePickupEmail(Jwt jwt, Map<String, Object> payload, boolean isStaff) {
        String email = null;
        Object vecinoEmailObj = payload.get(FIELD_VECINO_EMAIL);
        if (vecinoEmailObj != null && !vecinoEmailObj.toString().isBlank()) {
            email = vecinoEmailObj.toString();
        } else {
            Object ciudadanoEmailObj = payload.get("ciudadanoEmail");
            if (ciudadanoEmailObj != null && !ciudadanoEmailObj.toString().isBlank()) {
                email = ciudadanoEmailObj.toString();
            }
        }

        // Si es un vecino común (no staff), su email DEBE ser el del token (prevención IDOR)
        if (!isStaff && jwt != null) {
            String tokenEmail = extractEmailFromJwt(jwt);
            if (tokenEmail != null && !tokenEmail.isBlank()) {
                email = tokenEmail;
            }
        }
        if (email == null || email.isBlank()) {
            email = "vecino.contacto@puertovaras.cl";
        }
        return email;
    }

    private String resolvePickupNombre(Jwt jwt, Map<String, Object> payload, boolean isStaff, String email) {
        String name = null;
        Object vecinoNombreObj = payload.get(FIELD_VECINO_NOMBRE);
        if (vecinoNombreObj != null && !vecinoNombreObj.toString().isBlank()) {
            name = vecinoNombreObj.toString();
        }

        if (!isStaff && jwt != null) {
            String tokenName = jwt.getClaimAsString("name");
            if (tokenName == null) {
                tokenName = jwt.getClaimAsString("given_name");
            }
            if (tokenName != null && !tokenName.isBlank()) {
                name = tokenName;
            }
        }
        if (name == null || name.isBlank()) {
            name = email.contains("@") ? email.substring(0, email.indexOf('@')) : "Vecino Puerto Varas";
        }
        return name;
    }

    private void applyPickupDefaults(Map<String, Object> payload) {
        if (!payload.containsKey(FIELD_COMUNA) || payload.get(FIELD_COMUNA) == null || payload.get(FIELD_COMUNA).toString().isBlank()) {
            payload.put(FIELD_COMUNA, "Puerto Varas");
        }
        if (!payload.containsKey(FIELD_PESO_ESTIMADO_KG) || payload.get(FIELD_PESO_ESTIMADO_KG) == null) {
            payload.put(FIELD_PESO_ESTIMADO_KG, 5.0);
        }
        if (!payload.containsKey(FIELD_RESIDUO_ID) || payload.get(FIELD_RESIDUO_ID) == null) {
            payload.put(FIELD_RESIDUO_ID, 1L);
        }
        if (!payload.containsKey(FIELD_RESIDUO_NOMBRE) || payload.get(FIELD_RESIDUO_NOMBRE) == null || payload.get(FIELD_RESIDUO_NOMBRE).toString().isBlank()) {
            payload.put(FIELD_RESIDUO_NOMBRE, "Residuo Reciclable");
        }
        if (payload.containsKey("comentarios") && !payload.containsKey("observaciones")) {
            payload.put("observaciones", payload.get("comentarios"));
        }
    }

    private Long resolveLongParam(Long param, Map<String, Object> body, String key) {
        if (param != null) {
            return param;
        }
        if (body != null && body.get(key) != null) {
            return Long.valueOf(body.get(key).toString());
        }
        return null;
    }

    private String resolveStringParam(String param, Map<String, Object> body, String key) {
        if (param != null) {
            return param;
        }
        if (body != null && body.get(key) != null) {
            return body.get(key).toString();
        }
        return null;
    }

    private Double resolveDoubleParam(Double param, Map<String, Object> body, String key) {
        if (param != null) {
            return param;
        }
        if (body != null && body.get(key) != null) {
            return Double.valueOf(body.get(key).toString());
        }
        return null;
    }

    private String formatFechaProgramada(String rawFecha) {
        String trimmed = rawFecha.trim();
        return (trimmed.length() == 16) ? (trimmed + ":00") : trimmed;
    }

    private boolean isUserAuthorizedForPickup(Map<?, ?> pickup, Jwt jwt) {
        if (isStaffUser(jwt)) {
            return true;
        }
        String userEmail = extractEmailFromJwt(jwt);
        Object pickupOwner = pickup.get(FIELD_VECINO_EMAIL);
        return userEmail != null && userEmail.equalsIgnoreCase(String.valueOf(pickupOwner));
    }

    private int fetchCamionesOperativos() {
        try {
            List<?> camiones = restClient.get()
                    .uri(catalogUrl + "/api/catalog/camiones")
                    .retrieve()
                    .body(List.class);
            if (camiones != null && !camiones.isEmpty()) {
                return camiones.size();
            }
        } catch (Exception e) {
            log.warn("No se pudo consultar camiones en catalogo para impacto comunal: {}", e.getMessage());
        }
        return 4;
    }

    private double fetchKilosRecolectadosReales() {
        try {
            List<Map<String, Object>> pickups = restClient.get()
                    .uri(pickupsUrl + PATH_API_PICKUPS)
                    .retrieve()
                    .body(List.class);
            if (pickups != null) {
                return calcularTotalKilos(pickups);
            }
        } catch (Exception e) {
            log.warn("No se pudo consultar retiros en pickups para impacto comunal: {}", e.getMessage());
        }
        return 0.0;
    }

    private double calcularTotalKilos(List<Map<String, Object>> pickups) {
        double total = 0.0;
        for (Map<String, Object> p : pickups) {
            Object estado = p.get("estado");
            if ("PESADO".equals(estado) || "RETIRADO".equals(estado) || "COMPLETADO".equals(estado)) {
                total += extraerPesoPickup(p);
            }
        }
        return total;
    }

    private double extraerPesoPickup(Map<String, Object> p) {
        Object pr = p.get(FIELD_PESO_REAL_KG);
        if (pr instanceof Number n) {
            return n.doubleValue();
        }
        Object pe = p.get(FIELD_PESO_ESTIMADO_KG);
        if (pe instanceof Number ne) {
            return ne.doubleValue();
        }
        return 0.0;
    }
}

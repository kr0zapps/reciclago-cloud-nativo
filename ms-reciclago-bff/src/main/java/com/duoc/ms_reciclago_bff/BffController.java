package com.duoc.ms_reciclago_bff;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class BffController {

    private final RestClient restClient;

    @Value("${reciclago.services.catalog-url:http://localhost:8081}")
    private String catalogUrl;

    @Value("${reciclago.services.pickups-url:http://localhost:8083}")
    private String pickupsUrl;

    @Value("${reciclago.services.routes-url:http://localhost:8084}")
    private String routesUrl;

    public BffController(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
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

    @GetMapping("/api/pickups")
    public ResponseEntity<?> getPickups(@AuthenticationPrincipal Jwt jwt, @RequestParam(required = false) String vecinoEmail) {
        try {
            // Protección contra fuga de datos (BOLA): Si no es Admin ni Coordinador, forzar su propio email
            List<String> roles = jwt != null ? jwt.getClaimAsStringList("roles") : null;
            boolean isStaff = roles != null && (roles.contains("Admin") || roles.contains("Coordinador"));

            String effectiveEmail = vecinoEmail;
            if (!isStaff && jwt != null) {
                effectiveEmail = jwt.getClaimAsString("preferred_username");
                if (effectiveEmail == null) {
                    effectiveEmail = jwt.getClaimAsString("upn");
                }
            }

            String uri = pickupsUrl + "/api/pickups";
            if (effectiveEmail != null && !effectiveEmail.isBlank()) {
                uri += "?vecinoEmail=" + effectiveEmail;
            }
            List<?> pickups = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(pickups);
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
            // Prevención estricta de IDOR: Sobrescribir incondicionalmente vecinoEmail y vecinoNombre desde los claims del JWT
            String email = jwt.getClaimAsString("preferred_username");
            if (email == null)
                email = jwt.getClaimAsString("upn");
            payload.put("vecinoEmail", email);

            String name = jwt.getClaimAsString("name");
            if (name == null)
                name = email;
            payload.put("vecinoNombre", name);

            Object response = restClient.post()
                    .uri(pickupsUrl + "/api/pickups")
                    .body(payload)
                    .retrieve()
                    .body(Object.class);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
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
            Long effectiveCamionId = camionId != null ? camionId : (body != null && body.get("camionId") != null ? Long.valueOf(body.get("camionId").toString()) : 1L);
            String effectivePatente = camionPatente != null ? camionPatente : (body != null && body.get("camionPatente") != null ? body.get("camionPatente").toString() : "PV-RC-2026");
            String effectiveFecha = fechaProgramada != null ? fechaProgramada : (body != null && body.get("fechaProgramada") != null ? body.get("fechaProgramada").toString() : java.time.LocalDateTime.now().plusDays(1).toString());

            String targetUri = pickupsUrl + "/api/pickups/" + id + "/programar"
                    + "?camionId=" + effectiveCamionId
                    + "&camionPatente=" + java.net.URLEncoder.encode(effectivePatente, java.nio.charset.StandardCharsets.UTF_8)
                    + "&fechaProgramada=" + java.net.URLEncoder.encode(effectiveFecha, java.nio.charset.StandardCharsets.UTF_8);

            Object response = restClient.patch()
                    .uri(targetUri)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/api/pickups/{id}/pesado")
    public ResponseEntity<?> pesadoPickup(@PathVariable Long id, @RequestParam Double pesoRealKg) {
        try {
            Object response = restClient.patch()
                    .uri(pickupsUrl + "/api/pickups/" + id + "/pesado?pesoRealKg=" + pesoRealKg)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/api/pickups/{id}/cancelar")
    public ResponseEntity<?> cancelarPickup(@PathVariable Long id, @RequestParam(required = false) String motivo) {
        try {
            String uri = pickupsUrl + "/api/pickups/" + id + "/cancelar";
            if (motivo != null && !motivo.isBlank()) {
                uri += "?motivo=" + motivo;
            }
            Object response = restClient.patch()
                    .uri(uri)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/pickups/history")
    public ResponseEntity<?> getPickupsHistory(@AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String vecinoEmail,
            @RequestParam(required = false) String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<String> roles = jwt != null ? jwt.getClaimAsStringList("roles") : null;
            boolean isStaff = roles != null && (roles.contains("Admin") || roles.contains("Coordinador"));

            String effectiveEmail = vecinoEmail;
            if (!isStaff && jwt != null) {
                effectiveEmail = jwt.getClaimAsString("preferred_username");
                if (effectiveEmail == null) {
                    effectiveEmail = jwt.getClaimAsString("upn");
                }
            }

            StringBuilder uri = new StringBuilder(pickupsUrl)
                    .append("/api/pickups/history?page=").append(page)
                    .append("&size=").append(size);

            if (effectiveEmail != null && !effectiveEmail.isBlank()) {
                uri.append("&vecinoEmail=").append(java.net.URLEncoder.encode(effectiveEmail, java.nio.charset.StandardCharsets.UTF_8));
            }
            if (estado != null && !estado.isBlank()) {
                uri.append("&estado=").append(java.net.URLEncoder.encode(estado, java.nio.charset.StandardCharsets.UTF_8));
            }

            Object response = restClient.get()
                    .uri(uri.toString())
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error comunicando con historial de retiros");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @GetMapping("/api/routes/cuadrantes")
    public ResponseEntity<?> getCuadrantes() {
        try {
            List<?> cuadrantes = restClient.get()
                    .uri(routesUrl + "/api/routes/cuadrantes")
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(cuadrantes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Error comunicando con ms-reciclago-routes", "details", e.getMessage()));
        }
    }

    @GetMapping("/api/routes/cuadrante")
    public ResponseEntity<?> getCuadrantePorDireccion(@RequestParam(required = false) String direccion) {
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
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Error consultando cuadrante", "details", e.getMessage()));
        }
    }

    @GetMapping("/api/routes/{cuadranteId}/tracking")
    public ResponseEntity<?> getTrackingPorCuadrante(@PathVariable Long cuadranteId) {
        try {
            Object response = restClient.get()
                    .uri(routesUrl + "/api/routes/" + cuadranteId + "/tracking")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Error consultando telemetria de camion", "details", e.getMessage()));
        }
    }

    @GetMapping("/api/routes/tracking/{camionId}")
    public ResponseEntity<?> getTrackingPorCamion(@PathVariable Long camionId) {
        try {
            Object response = restClient.get()
                    .uri(routesUrl + "/api/routes/tracking/" + camionId)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Error consultando telemetria", "details", e.getMessage()));
        }
    }

    @PostMapping("/api/citizens/contact")
    public ResponseEntity<?> submitCitizenContact(@RequestBody Map<String, Object> payload) {
        try {
            Object response = restClient.post()
                    .uri(routesUrl + "/api/citizens/contact")
                    .body(payload)
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Error enviando contacto ciudadano", "details", e.getMessage()));
        }
    }

    @GetMapping("/api/citizens/how-it-works")
    public ResponseEntity<?> getHowItWorks() {
        try {
            Object response = restClient.get()
                    .uri(routesUrl + "/api/citizens/how-it-works")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Error consultando guia ciudadana", "details", e.getMessage()));
        }
    }

    @GetMapping("/api/citizens/faq")
    public ResponseEntity<?> getFaq() {
        try {
            Object response = restClient.get()
                    .uri(routesUrl + "/api/citizens/faq")
                    .retrieve()
                    .body(Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Error consultando preguntas frecuentes", "details", e.getMessage()));
        }
    }

}

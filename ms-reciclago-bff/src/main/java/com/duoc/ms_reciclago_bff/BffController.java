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
    public ResponseEntity<?> getPickups(@RequestParam(required = false) String vecinoEmail) {
        try {
            String uri = pickupsUrl + "/api/pickups";
            if (vecinoEmail != null && !vecinoEmail.isBlank()) {
                uri += "?vecinoEmail=" + vecinoEmail;
            }
            List<?> pickups = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(List.class);
            return ResponseEntity.ok(pickups);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error comunicando con ms-reciclago-pickups");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @PostMapping("/api/pickups")
    public ResponseEntity<?> createPickup(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> payload) {
        try {
            if (!payload.containsKey("vecinoEmail") || payload.get("vecinoEmail") == null) {
                String email = jwt.getClaimAsString("preferred_username");
                if (email == null)
                    email = jwt.getClaimAsString("upn");
                payload.put("vecinoEmail", email);
            }
            if (!payload.containsKey("vecinoNombre") || payload.get("vecinoNombre") == null) {
                String name = jwt.getClaimAsString("name");
                if (name == null)
                    name = jwt.getClaimAsString("preferred_username");
                payload.put("vecinoNombre", name);
            }

            Object response = restClient.post()
                    .uri(pickupsUrl + "/api/pickups")
                    .body(payload)
                    .retrieve()
                    .body(Object.class);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al crear solicitud en ms-reciclago-pickups");
            error.put("details", e.getMessage());
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
            @RequestBody(required = false) Map<String, Object> body) {
        try {
            Object response = restClient.patch()
                    .uri(pickupsUrl + "/api/pickups/" + id + "/programar")
                    .body(body != null ? body : Map.of())
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

}

package com.duoc.ms_reciclago_bff;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping
public class BffController {

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

    @GetMapping("/api/pickups/summary")
    public ResponseEntity<Map<String, Object>> getPickupsSummary(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Resumen de retiros disponible para usuarios autorizados");
        response.put("user", jwt.getClaimAsString("preferred_username"));
        response.put("roles", jwt.getClaimAsStringList("roles"));
        return ResponseEntity.ok(response);
    }
}

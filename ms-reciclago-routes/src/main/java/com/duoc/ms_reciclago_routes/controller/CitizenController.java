package com.duoc.ms_reciclago_routes.controller;

import com.duoc.ms_reciclago_routes.dto.ContactoRequestDto;
import com.duoc.ms_reciclago_routes.dto.ContactoResponseDto;
import com.duoc.ms_reciclago_routes.model.ContactoCiudadano;
import com.duoc.ms_reciclago_routes.service.CitizenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citizens")
@CrossOrigin(origins = "*")
public class CitizenController {

    private final CitizenService citizenService;

    public CitizenController(CitizenService citizenService) {
        this.citizenService = citizenService;
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactoResponseDto> crearContacto(@Valid @RequestBody ContactoRequestDto request) {
        ContactoResponseDto respuesta = citizenService.registrarContacto(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @GetMapping("/contact")
    public ResponseEntity<List<ContactoCiudadano>> listarContactos() {
        return ResponseEntity.ok(citizenService.listarTodos());
    }

    @GetMapping("/how-it-works")
    public ResponseEntity<Map<String, Object>> obtenerGuia() {
        return ResponseEntity.ok(citizenService.obtenerGuiaCiudadana());
    }

    @GetMapping("/faq")
    public ResponseEntity<List<Map<String, String>>> obtenerFaq() {
        return ResponseEntity.ok(citizenService.obtenerFaqs());
    }
}

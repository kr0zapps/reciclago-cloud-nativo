package com.duoc.ms_reciclago_catalog.service;

import com.duoc.ms_reciclago_catalog.model.Camion;
import com.duoc.ms_reciclago_catalog.model.EstadoCamion;
import com.duoc.ms_reciclago_catalog.repository.CamionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CamionService {

    private final CamionRepository camionRepository;

    public CamionService(CamionRepository camionRepository) {
        this.camionRepository = camionRepository;
    }

    public List<Camion> obtenerTodos() {
        return camionRepository.findAll();
    }

    public List<Camion> obtenerPorEstado(EstadoCamion estado) {
        return camionRepository.findByEstado(estado);
    }

    public List<Camion> obtenerPorEstado(String estado) {
        try {
            EstadoCamion enumVal = Camion.parseEstado(estado);
            return camionRepository.findByEstado(enumVal);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public Optional<Camion> obtenerPorId(Long id) {
        return camionRepository.findById(id);
    }

    public Optional<Camion> obtenerPorPatente(String patente) {
        return camionRepository.findByPatente(patente);
    }

    public Camion guardar(Camion camion) {
        if (camion.getCapacidadDisponibleKg() == null) {
            camion.setCapacidadDisponibleKg(camion.getCapacidadTotalKg());
        }
        return camionRepository.save(camion);
    }

    public Camion actualizar(Long id, Camion detalles) {
        return camionRepository.findById(id).map(c -> {
            c.setPatente(detalles.getPatente());
            c.setModelo(detalles.getModelo());
            c.setCapacidadTotalKg(detalles.getCapacidadTotalKg());
            c.setCapacidadDisponibleKg(detalles.getCapacidadDisponibleKg());
            c.setEstado(detalles.getEstado());
            return camionRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Camión no encontrado con id: " + id));
    }

    public Camion actualizarEstado(Long id, EstadoCamion nuevoEstado) {
        return camionRepository.findById(id).map(c -> {
            c.setEstado(nuevoEstado);
            return camionRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Camión no encontrado con id: " + id));
    }

    public Camion actualizarEstado(Long id, String nuevoEstado) {
        return actualizarEstado(id, Camion.parseEstado(nuevoEstado));
    }

    public Camion reducirCapacidad(Long id, Double pesoKg) {
        return camionRepository.findById(id).map(c -> {
            double actual = c.getCapacidadDisponibleKg() != null ? c.getCapacidadDisponibleKg() : c.getCapacidadTotalKg();
            double restar = pesoKg != null ? pesoKg : 0.0;
            c.setCapacidadDisponibleKg(Math.max(0.0, actual - restar));
            return camionRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Camión no encontrado con id: " + id));
    }

    public void eliminar(Long id) {
        camionRepository.deleteById(id);
    }
}


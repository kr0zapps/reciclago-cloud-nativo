package com.duoc.ms_reciclago_catalog.service;

import com.duoc.ms_reciclago_catalog.model.Camion;
import com.duoc.ms_reciclago_catalog.repository.CamionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<Camion> obtenerPorEstado(String estado) {
        return camionRepository.findByEstado(estado);
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

    public Camion reducirCapacidad(Long id, Double pesoKg) {
        return camionRepository.findById(id).map(c -> {
            if (c.getCapacidadDisponibleKg() < pesoKg) {
                throw new IllegalArgumentException("Capacidad insuficiente en el camión. Disponible: " 
                    + c.getCapacidadDisponibleKg() + "kg, requerido: " + pesoKg + "kg");
            }
            c.setCapacidadDisponibleKg(c.getCapacidadDisponibleKg() - pesoKg);
            return camionRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Camión no encontrado con id: " + id));
    }

    public Camion liberarCapacidad(Long id, Double pesoKg) {
        return camionRepository.findById(id).map(c -> {
            double nuevaCapacidad = c.getCapacidadDisponibleKg() + pesoKg;
            if (nuevaCapacidad > c.getCapacidadTotalKg()) {
                nuevaCapacidad = c.getCapacidadTotalKg();
            }
            c.setCapacidadDisponibleKg(nuevaCapacidad);
            return camionRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Camión no encontrado con id: " + id));
    }

    public void eliminar(Long id) {
        camionRepository.deleteById(id);
    }
}

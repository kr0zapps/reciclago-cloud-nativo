package com.duoc.ms_reciclago_catalog.service;

import com.duoc.ms_reciclago_catalog.model.Tarifa;
import com.duoc.ms_reciclago_catalog.repository.TarifaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TarifaService {

    private final TarifaRepository tarifaRepository;

    public TarifaService(TarifaRepository tarifaRepository) {
        this.tarifaRepository = tarifaRepository;
    }

    public List<Tarifa> obtenerTodas() {
        return tarifaRepository.findAll();
    }

    public List<Tarifa> obtenerActivas() {
        return tarifaRepository.findByActivoTrue();
    }

    public List<Tarifa> obtenerPorComuna(String comuna) {
        return tarifaRepository.findByComunaIgnoreCase(comuna);
    }

    public Optional<Tarifa> obtenerPorId(Long id) {
        return tarifaRepository.findById(id);
    }

    public Tarifa guardar(Tarifa tarifa) {
        return tarifaRepository.save(tarifa);
    }

    public Tarifa actualizar(Long id, Tarifa detalles) {
        return tarifaRepository.findById(id).map(t -> {
            t.setNombre(detalles.getNombre());
            t.setComuna(detalles.getComuna());
            t.setCostoBase(detalles.getCostoBase());
            t.setCostoAdicionalPorKg(detalles.getCostoAdicionalPorKg());
            t.setActivo(detalles.getActivo());
            return tarifaRepository.save(t);
        }).orElseThrow(() -> new RuntimeException("Tarifa no encontrada con id: " + id));
    }

    public void eliminar(Long id) {
        tarifaRepository.deleteById(id);
    }
}

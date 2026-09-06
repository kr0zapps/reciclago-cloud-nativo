package com.duoc.ms_reciclago_catalog.service;

import com.duoc.ms_reciclago_catalog.model.Residuo;
import com.duoc.ms_reciclago_catalog.repository.ResiduoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ResiduoService {

    private final ResiduoRepository residuoRepository;

    public ResiduoService(ResiduoRepository residuoRepository) {
        this.residuoRepository = residuoRepository;
    }

    public List<Residuo> obtenerTodos() {
        return residuoRepository.findAll();
    }

    public List<Residuo> obtenerActivos() {
        return residuoRepository.findByActivoTrue();
    }

    public Optional<Residuo> obtenerPorId(Long id) {
        return residuoRepository.findById(id);
    }

    public Optional<Residuo> obtenerPorCodigo(String codigo) {
        return residuoRepository.findByCodigo(codigo);
    }

    public Residuo guardar(Residuo residuo) {
        return residuoRepository.save(residuo);
    }

    public Residuo actualizar(Long id, Residuo residuoDetalles) {
        return residuoRepository.findById(id).map(r -> {
            r.setNombre(residuoDetalles.getNombre());
            r.setCodigo(residuoDetalles.getCodigo());
            r.setDescripcion(residuoDetalles.getDescripcion());
            r.setPrecioPorKg(residuoDetalles.getPrecioPorKg());
            r.setRequiereManejoEspecial(residuoDetalles.getRequiereManejoEspecial());
            r.setActivo(residuoDetalles.getActivo());
            return residuoRepository.save(r);
        }).orElseThrow(() -> new RuntimeException("Residuo no encontrado con id: " + id));
    }

    public void eliminar(Long id) {
        residuoRepository.deleteById(id);
    }
}

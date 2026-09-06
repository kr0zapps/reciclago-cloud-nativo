package com.duoc.ms_reciclago_catalog.repository;

import com.duoc.ms_reciclago_catalog.model.Camion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CamionRepository extends JpaRepository<Camion, Long> {
    Optional<Camion> findByPatente(String patente);
    List<Camion> findByEstado(String estado);
}

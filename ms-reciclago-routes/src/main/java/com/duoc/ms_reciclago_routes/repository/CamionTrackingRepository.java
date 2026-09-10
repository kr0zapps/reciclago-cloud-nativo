package com.duoc.ms_reciclago_routes.repository;

import com.duoc.ms_reciclago_routes.model.CamionTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CamionTrackingRepository extends JpaRepository<CamionTracking, Long> {
    Optional<CamionTracking> findByCamionId(Long camionId);
    Optional<CamionTracking> findByPatente(String patente);
    Optional<CamionTracking> findByCuadranteId(Long cuadranteId);
    List<CamionTracking> findByEstado(String estado);
}

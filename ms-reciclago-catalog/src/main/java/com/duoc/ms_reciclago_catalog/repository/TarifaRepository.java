package com.duoc.ms_reciclago_catalog.repository;

import com.duoc.ms_reciclago_catalog.model.Tarifa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TarifaRepository extends JpaRepository<Tarifa, Long> {
    List<Tarifa> findByComunaIgnoreCase(String comuna);
    List<Tarifa> findByActivoTrue();
}

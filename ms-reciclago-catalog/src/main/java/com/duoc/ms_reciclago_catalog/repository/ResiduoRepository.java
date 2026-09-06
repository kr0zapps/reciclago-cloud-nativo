package com.duoc.ms_reciclago_catalog.repository;

import com.duoc.ms_reciclago_catalog.model.Residuo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResiduoRepository extends JpaRepository<Residuo, Long> {
    Optional<Residuo> findByCodigo(String codigo);
    List<Residuo> findByActivoTrue();
}

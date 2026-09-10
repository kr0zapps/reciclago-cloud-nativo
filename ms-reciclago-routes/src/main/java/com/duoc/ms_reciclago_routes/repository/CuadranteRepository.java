package com.duoc.ms_reciclago_routes.repository;

import com.duoc.ms_reciclago_routes.model.Cuadrante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CuadranteRepository extends JpaRepository<Cuadrante, Long> {
    Optional<Cuadrante> findByNumero(Integer numero);
    List<Cuadrante> findBySector(String sector);
    List<Cuadrante> findByDiaSemana(String diaSemana);
}

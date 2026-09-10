package com.duoc.ms_reciclago_pickups.repository;

import com.duoc.ms_reciclago_pickups.model.Pickup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Long> {
    Optional<Pickup> findByCodigoRetiro(String codigoRetiro);
    List<Pickup> findByEstado(String estado);
    List<Pickup> findByVecinoEmail(String vecinoEmail);
    List<Pickup> findByComuna(String comuna);

    Page<Pickup> findByVecinoEmail(String vecinoEmail, Pageable pageable);
    Page<Pickup> findByEstado(String estado, Pageable pageable);
    Page<Pickup> findByVecinoEmailAndEstado(String vecinoEmail, String estado, Pageable pageable);
}

package com.duoc.ms_reciclago_routes.repository;

import com.duoc.ms_reciclago_routes.model.ContactoCiudadano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactoCiudadanoRepository extends JpaRepository<ContactoCiudadano, Long> {
    Optional<ContactoCiudadano> findByTicketId(String ticketId);
    List<ContactoCiudadano> findByEmail(String email);
    List<ContactoCiudadano> findByStatus(String status);
}

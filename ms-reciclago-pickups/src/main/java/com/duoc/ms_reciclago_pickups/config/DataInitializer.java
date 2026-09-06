package com.duoc.ms_reciclago_pickups.config;

import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.repository.PickupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final PickupRepository pickupRepository;

    public DataInitializer(PickupRepository pickupRepository) {
        this.pickupRepository = pickupRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (pickupRepository.count() == 0) {
            pickupRepository.save(new Pickup(
                    null,
                    "RET-1001",
                    "Juan Pérez",
                    "juan.perez@example.com",
                    "Av. Providencia 1234, Apt 402",
                    "Providencia",
                    1L,
                    "Plástico PET",
                    1L,
                    "AB-123-CD",
                    15.5,
                    null,
                    "PROGRAMADO",
                    LocalDateTime.now().minusDays(1),
                    LocalDateTime.now().plusDays(1),
                    null,
                    "Retiro por la mañana antes de las 12:00"
            ));

            pickupRepository.save(new Pickup(
                    null,
                    "RET-1002",
                    "María González",
                    "maria.gonzalez@example.com",
                    "Calle Alameda 567",
                    "Santiago",
                    2L,
                    "Cartón y Papel",
                    null,
                    null,
                    45.0,
                    null,
                    "SOLICITADO",
                    LocalDateTime.now(),
                    null,
                    null,
                    "Cajas de cartón desarmadas en el portón"
            ));

            pickupRepository.save(new Pickup(
                    null,
                    "RET-1003",
                    "Carlos Silva",
                    "carlos.silva@example.com",
                    "Av. Vitacura 890",
                    "Vitacura",
                    3L,
                    "Vidrio",
                    2L,
                    "EF-456-GH",
                    80.0,
                    82.4,
                    "PESADO",
                    LocalDateTime.now().minusDays(3),
                    LocalDateTime.now().minusDays(2),
                    LocalDateTime.now().minusDays(2),
                    "Botellas de vidrio clasificadas por color"
            ));
        }
    }
}

package com.duoc.ms_reciclago_pickups.config;

import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.repository.PickupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

/**
 * Inicializador de datos de prueba para el ambiente de desarrollo.
 * Crea 3 retiros de ejemplo en distintos estados del flujo
 * usando direcciones y patentes coherentes con Puerto Varas.
 */
@Configuration
public class DataInitializer implements CommandLineRunner {

    private final PickupRepository pickupRepository;

    public DataInitializer(PickupRepository pickupRepository) {
        this.pickupRepository = pickupRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (pickupRepository.count() == 0) {
            // Retiro PROGRAMADO — Cuadrante 1 (Puerto Chico), Cartón/Papel, Lunes
            pickupRepository.save(new Pickup(
                    null,
                    "RET-PV-SEED01",
                    "Juan Pérez",
                    "jon.vidals@duocuc.cl",
                    "Av. Puerto Chico 234",
                    "Puerto Varas",
                    1L,
                    "Cartón y Papel",
                    1L,
                    "PV-RC-2026",
                    15.5,
                    null,
                    "PROGRAMADO",
                    LocalDateTime.now().minusDays(1),
                    LocalDateTime.now().plusDays(1),
                    null,
                    "Cajas de cartón desarmadas en el portón"
            ));

            // Retiro SOLICITADO — Cuadrante 2 (Costanera Sur), Vidrio, Martes
            pickupRepository.save(new Pickup(
                    null,
                    "RET-PV-SEED02",
                    "María González",
                    "maria.gonzalez@puertovaras.cl",
                    "Costanera Sur 567",
                    "Puerto Varas",
                    2L,
                    "Vidrio",
                    null,
                    null,
                    45.0,
                    null,
                    "SOLICITADO",
                    LocalDateTime.now(),
                    null,
                    null,
                    "Botellas de vidrio clasificadas por color"
            ));

            // Retiro PESADO — Cuadrante 3 (Ensenada), Plásticos, Miércoles
            pickupRepository.save(new Pickup(
                    null,
                    "RET-PV-SEED03",
                    "Carlos Silva",
                    "carlos.silva@puertovaras.cl",
                    "Camino Ensenada 890",
                    "Puerto Varas",
                    3L,
                    "Plástico PET",
                    2L,
                    "PV-RC-2027",
                    80.0,
                    82.4,
                    "PESADO",
                    LocalDateTime.now().minusDays(3),
                    LocalDateTime.now().minusDays(2),
                    LocalDateTime.now().minusDays(2),
                    "Envases plásticos limpios y compactados"
            ));
        }
    }
}


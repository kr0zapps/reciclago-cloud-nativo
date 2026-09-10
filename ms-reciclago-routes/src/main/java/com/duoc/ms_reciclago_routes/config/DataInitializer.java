package com.duoc.ms_reciclago_routes.config;

import com.duoc.ms_reciclago_routes.model.CamionTracking;
import com.duoc.ms_reciclago_routes.model.Cuadrante;
import com.duoc.ms_reciclago_routes.repository.CamionTrackingRepository;
import com.duoc.ms_reciclago_routes.repository.CuadranteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final CuadranteRepository cuadranteRepository;
    private final CamionTrackingRepository trackingRepository;

    public DataInitializer(CuadranteRepository cuadranteRepository, CamionTrackingRepository trackingRepository) {
        this.cuadranteRepository = cuadranteRepository;
        this.trackingRepository = trackingRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (cuadranteRepository.count() == 0) {
            cuadranteRepository.save(new Cuadrante(
                    null, 1, "Cuadrante 1: Puerto Chico y Mirador", "Sector Puerto Chico",
                    "LUNES", "08:00 - 17:00 hrs",
                    "Colo Colo, Colón, Decher, Mirador, Walker Martínez, Imperial Norte",
                    "PV-RC-2027", true
            ));

            cuadranteRepository.save(new Cuadrante(
                    null, 2, "Costanera Sur y Llanquihue Sur", "Sector Lago",
                    "MARTES", "08:00 - 17:00 hrs",
                    "Los Guindos, Av. Vicente Pérez Rosales, San Francisco, Imperial, Costanera, Santa Rosa",
                    "PV-RC-2026", true
            ));

            cuadranteRepository.save(new Cuadrante(
                    null, 3, "Cuadrante 3: Ensenada y Colonos", "Sector Rural / Ensenada",
                    "MIÉRCOLES", "08:30 - 16:30 hrs",
                    "Ruta 225, Colonos, Ensenada, Los Riscos, Río Pescado",
                    "PV-RC-2028", false
            ));

            cuadranteRepository.save(new Cuadrante(
                    null, 4, "Cuadrante 4: Nueva Braunau", "Sector Nueva Braunau",
                    "JUEVES", "08:00 - 17:00 hrs",
                    "Ruta V-50, Otto Klein, Las Rosas, Central, Pasaje Los Alerces",
                    "PV-RC-2026", false
            ));
        }

        if (trackingRepository.count() == 0) {
            trackingRepository.save(new CamionTracking(
                    null, 1L, "PV-RC-2026", 2L,
                    -41.3204, -72.9856,
                    "Av. Vicente Pérez Rosales con Calle Los Guindos",
                    "EN_CIRCULACION", 24.5, 1500.0, 420.0,
                    LocalDateTime.now()
            ));

            trackingRepository.save(new CamionTracking(
                    null, 2L, "PV-RC-2027", 1L,
                    -41.3280, -72.9750,
                    "Calle Decher con Pasaje Mirador",
                    "EN_CIRCULACION", 18.0, 3000.0, 950.0,
                    LocalDateTime.now()
            ));

            trackingRepository.save(new CamionTracking(
                    null, 3L, "PV-RC-2028", 3L,
                    -41.3150, -72.9800,
                    "Base Operaciones DIMAO Puerto Varas",
                    "EN_BASE", 0.0, 2000.0, 0.0,
                    LocalDateTime.now()
            ));
        }
    }
}

package com.duoc.ms_reciclago_pickups.config;

import com.duoc.ms_reciclago_pickups.model.Pickup;
import com.duoc.ms_reciclago_pickups.repository.PickupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * Inicializador de datos de prueba para el ambiente de desarrollo.
 * Crea 3 retiros de ejemplo en distintos estados del flujo
 * usando direcciones y patentes coherentes con Puerto Varas.
 */
@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final String COMUNA_PUERTO_VARAS = "Puerto Varas";

    private final PickupRepository pickupRepository;

    public DataInitializer(PickupRepository pickupRepository) {
        this.pickupRepository = pickupRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (pickupRepository.count() == 0) {
            ZoneId zoneId = ZoneId.systemDefault();

            // Retiro PROGRAMADO — Cuadrante 1 (Puerto Chico), Cartón/Papel, Lunes
            pickupRepository.save(Pickup.builder()
                    .codigoRetiro("RET-PV-SEED01")
                    .vecinoNombre("Juan Pérez")
                    .vecinoEmail("jon.vidals@duocuc.cl")
                    .direccion("Av. Puerto Chico 234")
                    .comuna(COMUNA_PUERTO_VARAS)
                    .residuoId(1L)
                    .residuoNombre("Cartón y Papel")
                    .camionId(1L)
                    .camionPatente("PV-RC-2026")
                    .pesoEstimadoKg(15.5)
                    .estado("PROGRAMADO")
                    .fechaSolicitud(LocalDateTime.now(zoneId).minusDays(1))
                    .fechaProgramada(LocalDateTime.now(zoneId).plusDays(1))
                    .observaciones("Cajas de cartón desarmadas en el portón")
                    .build()
            );

            // Retiro SOLICITADO — Cuadrante 2 (Costanera Sur), Vidrio, Martes
            pickupRepository.save(Pickup.builder()
                    .codigoRetiro("RET-PV-SEED02")
                    .vecinoNombre("María González")
                    .vecinoEmail("maria.gonzalez@puertovaras.cl")
                    .direccion("Costanera Sur 567")
                    .comuna(COMUNA_PUERTO_VARAS)
                    .residuoId(2L)
                    .residuoNombre("Vidrio")
                    .pesoEstimadoKg(45.0)
                    .estado("SOLICITADO")
                    .fechaSolicitud(LocalDateTime.now(zoneId))
                    .observaciones("Botellas de vidrio clasificadas por color")
                    .build()
            );

            // Retiro PESADO — Cuadrante 3 (Ensenada), Plásticos, Miércoles
            pickupRepository.save(Pickup.builder()
                    .codigoRetiro("RET-PV-SEED03")
                    .vecinoNombre("Carlos Silva")
                    .vecinoEmail("carlos.silva@puertovaras.cl")
                    .direccion("Camino Ensenada 890")
                    .comuna(COMUNA_PUERTO_VARAS)
                    .residuoId(3L)
                    .residuoNombre("Plástico PET")
                    .camionId(2L)
                    .camionPatente("PV-RC-2027")
                    .pesoEstimadoKg(80.0)
                    .pesoRealKg(82.4)
                    .estado("PESADO")
                    .fechaSolicitud(LocalDateTime.now(zoneId).minusDays(3))
                    .fechaProgramada(LocalDateTime.now(zoneId).minusDays(2))
                    .fechaCompletado(LocalDateTime.now(zoneId).minusDays(2))
                    .observaciones("Envases plásticos limpios y compactados")
                    .build()
            );
        }
    }
}

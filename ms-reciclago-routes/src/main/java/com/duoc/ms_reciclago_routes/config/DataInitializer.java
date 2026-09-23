package com.duoc.ms_reciclago_routes.config;

import com.duoc.ms_reciclago_routes.model.CamionTracking;
import com.duoc.ms_reciclago_routes.model.Cuadrante;
import com.duoc.ms_reciclago_routes.repository.CamionTrackingRepository;
import com.duoc.ms_reciclago_routes.repository.CuadranteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final String HORARIO_HABITUAL = "08:00 - 17:00 hrs";
    private static final String PATENTE_PV_RC_2026 = "PV-RC-2026";

    private final CuadranteRepository cuadranteRepository;
    private final CamionTrackingRepository trackingRepository;

    public DataInitializer(CuadranteRepository cuadranteRepository, CamionTrackingRepository trackingRepository) {
        this.cuadranteRepository = cuadranteRepository;
        this.trackingRepository = trackingRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (cuadranteRepository.count() == 0) {
            cuadranteRepository.save(Cuadrante.builder()
                    .numero(1)
                    .nombre("Cuadrante 1: Puerto Chico y Mirador")
                    .sector("Sector Puerto Chico")
                    .diaSemana("LUNES")
                    .horario(HORARIO_HABITUAL)
                    .callesPrincipales("Colo Colo, Colón, Decher, Mirador, Walker Martínez, Imperial Norte")
                    .camionPatente("PV-RC-2027")
                    .camionEnRuta(true)
                    .build()
            );

            cuadranteRepository.save(Cuadrante.builder()
                    .numero(2)
                    .nombre("Costanera Sur y Llanquihue Sur")
                    .sector("Sector Lago")
                    .diaSemana("MARTES")
                    .horario(HORARIO_HABITUAL)
                    .callesPrincipales("Los Guindos, Av. Vicente Pérez Rosales, San Francisco, Imperial, Costanera, Santa Rosa")
                    .camionPatente(PATENTE_PV_RC_2026)
                    .camionEnRuta(true)
                    .build()
            );

            cuadranteRepository.save(Cuadrante.builder()
                    .numero(3)
                    .nombre("Cuadrante 3: Ensenada y Colonos")
                    .sector("Sector Rural / Ensenada")
                    .diaSemana("MIÉRCOLES")
                    .horario("08:30 - 16:30 hrs")
                    .callesPrincipales("Ruta 225, Colonos, Ensenada, Los Riscos, Río Pescado")
                    .camionPatente("PV-RC-2028")
                    .camionEnRuta(false)
                    .build()
            );

            cuadranteRepository.save(Cuadrante.builder()
                    .numero(4)
                    .nombre("Cuadrante 4: Nueva Braunau")
                    .sector("Sector Nueva Braunau")
                    .diaSemana("JUEVES")
                    .horario(HORARIO_HABITUAL)
                    .callesPrincipales("Ruta V-50, Otto Klein, Las Rosas, Central, Pasaje Los Alerces")
                    .camionPatente(PATENTE_PV_RC_2026)
                    .camionEnRuta(false)
                    .build()
            );
        }

        if (trackingRepository.count() == 0) {
            ZoneId zoneId = ZoneId.systemDefault();

            trackingRepository.save(CamionTracking.builder()
                    .camionId(1L)
                    .patente(PATENTE_PV_RC_2026)
                    .cuadranteId(2L)
                    .lat(-41.3204)
                    .lng(-72.9856)
                    .calleActual("Av. Vicente Pérez Rosales con Calle Los Guindos")
                    .estado("EN_CIRCULACION")
                    .velocidadKmH(24.5)
                    .capacidadTotalKg(1500.0)
                    .kilosCargados(420.0)
                    .ultimaActualizacion(LocalDateTime.now(zoneId))
                    .build()
            );

            trackingRepository.save(CamionTracking.builder()
                    .camionId(2L)
                    .patente("PV-RC-2027")
                    .cuadranteId(1L)
                    .lat(-41.3280)
                    .lng(-72.9750)
                    .calleActual("Calle Decher con Pasaje Mirador")
                    .estado("EN_CIRCULACION")
                    .velocidadKmH(18.0)
                    .capacidadTotalKg(3000.0)
                    .kilosCargados(950.0)
                    .ultimaActualizacion(LocalDateTime.now(zoneId))
                    .build()
            );

            trackingRepository.save(CamionTracking.builder()
                    .camionId(3L)
                    .patente("PV-RC-2028")
                    .cuadranteId(3L)
                    .lat(-41.3150)
                    .lng(-72.9800)
                    .calleActual("Base Operaciones DIMAO Puerto Varas")
                    .estado("EN_BASE")
                    .velocidadKmH(0.0)
                    .capacidadTotalKg(2000.0)
                    .kilosCargados(0.0)
                    .ultimaActualizacion(LocalDateTime.now(zoneId))
                    .build()
            );
        }
    }
}

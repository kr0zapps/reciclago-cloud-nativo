package com.duoc.ms_reciclago_catalog.config;

import com.duoc.ms_reciclago_catalog.model.Camion;
import com.duoc.ms_reciclago_catalog.model.Residuo;
import com.duoc.ms_reciclago_catalog.model.Tarifa;
import com.duoc.ms_reciclago_catalog.repository.CamionRepository;
import com.duoc.ms_reciclago_catalog.repository.ResiduoRepository;
import com.duoc.ms_reciclago_catalog.repository.TarifaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final ResiduoRepository residuoRepository;
    private final CamionRepository camionRepository;
    private final TarifaRepository tarifaRepository;

    public DataInitializer(ResiduoRepository residuoRepository,
                           CamionRepository camionRepository,
                           TarifaRepository tarifaRepository) {
        this.residuoRepository = residuoRepository;
        this.camionRepository = camionRepository;
        this.tarifaRepository = tarifaRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (residuoRepository.count() == 0) {
            residuoRepository.save(new Residuo(null, "Plástico PET", "PLASTICO_PET", "Botellas plásticas y envases transparentes PET", 150.0, false, true));
            residuoRepository.save(new Residuo(null, "Cartón y Papel", "CARTON_PAPEL", "Cajas de cartón corrugado, diarios y revistas", 100.0, false, true));
            residuoRepository.save(new Residuo(null, "Vidrio", "VIDRIO", "Botellas y frascos de vidrio limpio", 80.0, false, true));
            residuoRepository.save(new Residuo(null, "Residuos Electrónicos (RAEE)", "RAEE", "Electrodomésticos pequeños, computadores y cables", 500.0, true, true));
        }

        if (camionRepository.count() == 0) {
            camionRepository.save(new Camion(null, "AB-123-CD", "Mercedes Benz Sprinter 516", 1500.0, 1500.0, "DISPONIBLE"));
            camionRepository.save(new Camion(null, "EF-456-GH", "Volvo FL250 Recolector", 3000.0, 3000.0, "DISPONIBLE"));
            camionRepository.save(new Camion(null, "IJ-789-KL", "Isuzu NPR 75", 2000.0, 2000.0, "DISPONIBLE"));
        }

        if (tarifaRepository.count() == 0) {
            tarifaRepository.save(new Tarifa(null, "Tarifa Residencial Santiago Centro", "Santiago", 2500.0, 50.0, true));
            tarifaRepository.save(new Tarifa(null, "Tarifa Residencial Providencia", "Providencia", 3000.0, 45.0, true));
            tarifaRepository.save(new Tarifa(null, "Tarifa Comercial Pyme", "Providencia", 5000.0, 30.0, true));
        }
    }
}

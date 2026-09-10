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
            residuoRepository.save(new Residuo(null, "Vidrio", "VIDRIO", 
                    "Botellas y frascos de vidrio transparente o color limpio", 80.0, false, true, 
                    "VIDRIO", "Enjuagar botellas y frascos, retirar tapas y corchos. No incluir cerámica ni espejos.", true));
            residuoRepository.save(new Residuo(null, "Cartón y Papel", "CARTON_PAPEL", 
                    "Cajas de cartón corrugado, papel blanco, diarios y revistas limpias", 100.0, false, true, 
                    "CARTON", "Aplanar cajas para reducir volumen. Mantener seco y sin residuos de comida o grasa.", true));
            residuoRepository.save(new Residuo(null, "Plásticos (PET y PEAD)", "PLASTICO_PET", 
                    "Botellas plásticas de bebidas, envases de detergente y lácteos", 150.0, false, true, 
                    "PLASTICO", "Lavar, escurrir, aplastar y volver a colocar la tapa plástica.", true));
            residuoRepository.save(new Residuo(null, "Latas y Metales", "LATAS_METALES", 
                    "Latas de bebidas en aluminio y tarros de conserva de hojalata", 200.0, false, true, 
                    "LATAS", "Enjuagar para evitar olores y vectores. Aplastar si es posible.", true));
            residuoRepository.save(new Residuo(null, "Residuos Electrónicos (RAEE)", "RAEE", 
                    "Electrodomésticos menores, computadores, cargadores y cables en desuso", 500.0, true, true, 
                    "RAEE", "Entregar secos, completos y con sus cables enrollados.", true));
        }

        if (camionRepository.count() == 0) {
            camionRepository.save(new Camion(null, "PV-RC-2026", "Mercedes Benz Sprinter 516 - Cuadrante Costanera", 1500.0, 1500.0, "DISPONIBLE"));
            camionRepository.save(new Camion(null, "PV-RC-2027", "Volvo FL250 Recolector - Cuadrante Puerto Chico", 3000.0, 3000.0, "DISPONIBLE"));
            camionRepository.save(new Camion(null, "PV-RC-2028", "Isuzu NPR 75 Tolva - Cuadrante Ensenada", 2000.0, 2000.0, "DISPONIBLE"));
        }

        if (tarifaRepository.count() == 0) {
            tarifaRepository.save(new Tarifa(null, "Tarifa Domiciliaria Costanera y Centro", "Puerto Varas", 2000.0, 40.0, true));
            tarifaRepository.save(new Tarifa(null, "Tarifa Domiciliaria Puerto Chico / Mirador", "Puerto Varas", 2000.0, 40.0, true));
            tarifaRepository.save(new Tarifa(null, "Tarifa Comercial Pymes Lago Llanquihue", "Puerto Varas", 4500.0, 30.0, true));
        }
    }
}

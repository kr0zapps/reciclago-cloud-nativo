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

    private static final String PUERTO_VARAS = "Puerto Varas";

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
            residuoRepository.save(Residuo.builder()
                    .nombre("Vidrio")
                    .codigo("VIDRIO")
                    .descripcion("Botellas y frascos de vidrio transparente o color limpio")
                    .precioPorKg(80.0)
                    .requiereManejoEspecial(false)
                    .activo(true)
                    .categoria("VIDRIO")
                    .instrucciones("Enjuagar botellas y frascos, retirar tapas y corchos. No incluir cerámica ni espejos.")
                    .permitido(true)
                    .build());
            residuoRepository.save(Residuo.builder()
                    .nombre("Cartón y Papel")
                    .codigo("CARTON_PAPEL")
                    .descripcion("Cajas de cartón corrugado, papel blanco, diarios y revistas limpias")
                    .precioPorKg(100.0)
                    .requiereManejoEspecial(false)
                    .activo(true)
                    .categoria("CARTON")
                    .instrucciones("Aplanar cajas para reducir volumen. Mantener seco y sin residuos de comida o grasa.")
                    .permitido(true)
                    .build());
            residuoRepository.save(Residuo.builder()
                    .nombre("Plásticos (PET y PEAD)")
                    .codigo("PLASTICO_PET")
                    .descripcion("Botellas plásticas de bebidas, envases de detergente y lácteos")
                    .precioPorKg(150.0)
                    .requiereManejoEspecial(false)
                    .activo(true)
                    .categoria("PLASTICO")
                    .instrucciones("Lavar, escurrir, aplastar y volver a colocar la tapa plástica.")
                    .permitido(true)
                    .build());
            residuoRepository.save(Residuo.builder()
                    .nombre("Latas y Metales")
                    .codigo("LATAS_METALES")
                    .descripcion("Latas de bebidas en aluminio y tarros de conserva de hojalata")
                    .precioPorKg(200.0)
                    .requiereManejoEspecial(false)
                    .activo(true)
                    .categoria("LATAS")
                    .instrucciones("Enjuagar para evitar olores y vectores. Aplastar si es posible.")
                    .permitido(true)
                    .build());
            residuoRepository.save(Residuo.builder()
                    .nombre("Residuos Electrónicos (RAEE)")
                    .codigo("RAEE")
                    .descripcion("Electrodomésticos menores, computadores, cargadores y cables en desuso")
                    .precioPorKg(500.0)
                    .requiereManejoEspecial(true)
                    .activo(true)
                    .categoria("RAEE")
                    .instrucciones("Entregar secos, completos y con sus cables enrollados.")
                    .permitido(true)
                    .build());
        }

        if (camionRepository.count() == 0) {
            camionRepository.save(new Camion(null, "PV-RC-2026", "Mercedes Benz Sprinter 516 - Cuadrante Costanera", 1500.0, 1500.0, com.duoc.ms_reciclago_catalog.model.EstadoCamion.DISPONIBLE));
            camionRepository.save(new Camion(null, "PV-RC-2027", "Volvo FL250 Recolector - Cuadrante Puerto Chico", 3000.0, 3000.0, com.duoc.ms_reciclago_catalog.model.EstadoCamion.DISPONIBLE));
            camionRepository.save(new Camion(null, "PV-RC-2028", "Isuzu NPR 75 Tolva - Cuadrante Ensenada", 2000.0, 2000.0, com.duoc.ms_reciclago_catalog.model.EstadoCamion.DISPONIBLE));
        }

        if (tarifaRepository.count() == 0) {
            tarifaRepository.save(new Tarifa(null, "Tarifa Domiciliaria Costanera y Centro", PUERTO_VARAS, 2000.0, 40.0, true));
            tarifaRepository.save(new Tarifa(null, "Tarifa Domiciliaria Puerto Chico / Mirador", PUERTO_VARAS, 2000.0, 40.0, true));
            tarifaRepository.save(new Tarifa(null, "Tarifa Comercial Pymes Lago Llanquihue", PUERTO_VARAS, 4500.0, 30.0, true));
        }
    }
}

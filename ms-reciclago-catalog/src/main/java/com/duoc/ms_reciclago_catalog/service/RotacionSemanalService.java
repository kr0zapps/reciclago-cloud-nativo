package com.duoc.ms_reciclago_catalog.service;

import com.duoc.ms_reciclago_catalog.model.Residuo;
import com.duoc.ms_reciclago_catalog.repository.ResiduoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio de Rotación Semanal de Residuos Domiciliarios.
 *
 * Implementa el calendario municipal de Puerto Varas / DIMAO:
 *   Semana del mes 1 → Vidrio            (código: VIDRIO)
 *   Semana del mes 2 → Cartón y Papel    (código: CARTON_PAPEL)
 *   Semana del mes 3 → Plásticos PET/PEAD(código: PLASTICO_PET)
 *   Semana del mes 4 → Latas y Metales   (código: LATAS_METALES)
 *
 * El cálculo se basa en el número de semana ISO del año módulo 4, mapeado
 * al slot correspondiente (1..4). Semana ISO % 4 == 0 → slot 4 (Latas).
 */
@Service
@Transactional(readOnly = true)
public class RotacionSemanalService {

    /** Orden canónico de la rotación: slot 1..4 → código de residuo */
    private static final String[] ROTACION_CODIGOS = {
        "VIDRIO",        // slot 1
        "CARTON_PAPEL",  // slot 2
        "PLASTICO_PET",  // slot 3
        "LATAS_METALES"  // slot 4
    };

    private final ResiduoRepository residuoRepository;

    public RotacionSemanalService(ResiduoRepository residuoRepository) {
        this.residuoRepository = residuoRepository;
    }

    /**
     * Calcula la rotación semanal para una fecha dada (por defecto hoy).
     *
     * @param fecha Fecha de referencia. Si es null, se usa LocalDate.now().
     * @return Mapa con los campos del response JSON de rotación.
     */
    public Map<String, Object> obtenerRotacionParaFecha(LocalDate fecha) {
        if (fecha == null) {
            fecha = LocalDate.now();
        }

        int numSemanaISO = fecha.get(WeekFields.ISO.weekOfYear());
        int slot = calcularSlot(numSemanaISO);
        String codigoResiduo = ROTACION_CODIGOS[slot - 1];

        LocalDate inicioSemana = fecha.with(WeekFields.ISO.dayOfWeek(), 1);
        LocalDate finSemana   = inicioSemana.plusDays(6);

        // Buscar el residuo real en BD; si no existe, retornar datos genéricos
        Optional<Residuo> residuoOpt = residuoRepository.findByCodigo(codigoResiduo);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("numSemanaISO", numSemanaISO);
        response.put("slotSemana", slot);
        response.put("residuoCodigo", codigoResiduo);
        response.put("vigenciaDesde", inicioSemana.toString());
        response.put("vigenciaHasta", finSemana.toString());

        if (residuoOpt.isPresent()) {
            Residuo r = residuoOpt.get();
            response.put("residuoId", r.getId());
            response.put("residuoNombre", r.getNombre());
            response.put("descripcion", r.getDescripcion());
            response.put("instrucciones", r.getInstrucciones());
            response.put("categoria", r.getCategoria());
            response.put("precioPorKg", r.getPrecioPorKg());
        } else {
            // Fallback semántico si el seed aún no corrió
            response.put("residuoId", null);
            response.put("residuoNombre", nombreFallbackPorCodigo(codigoResiduo));
            response.put("descripcion", null);
            response.put("instrucciones", null);
            response.put("categoria", codigoResiduo);
            response.put("precioPorKg", null);
        }

        return response;
    }

    /**
     * Convierte el número de semana ISO al slot de rotación (1..4).
     *
     * Semana ISO % 4:
     *   1 → slot 1 (Vidrio)
     *   2 → slot 2 (Cartón y Papel)
     *   3 → slot 3 (Plásticos)
     *   0 → slot 4 (Latas y Metales)  ← módulo da 0 en sem 4, 8, 12...
     */
    public int calcularSlot(int numSemanaISO) {
        int mod = numSemanaISO % 4;
        return (mod == 0) ? 4 : mod;
    }

    /** Nombre legible cuando el residuo no existe aún en BD */
    private String nombreFallbackPorCodigo(String codigo) {
        return switch (codigo) {
            case "VIDRIO"       -> "Vidrio";
            case "CARTON_PAPEL" -> "Cartón y Papel";
            case "PLASTICO_PET" -> "Plásticos (PET y PEAD)";
            case "LATAS_METALES"-> "Latas y Metales";
            default             -> codigo;
        };
    }
}

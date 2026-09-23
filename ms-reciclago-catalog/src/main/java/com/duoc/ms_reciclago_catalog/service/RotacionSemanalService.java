package com.duoc.ms_reciclago_catalog.service;

import com.duoc.ms_reciclago_catalog.model.Residuo;
import com.duoc.ms_reciclago_catalog.repository.ResiduoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Servicio de Rotación Semanal de Residuos Domiciliarios.
 *
 * Implementa el calendario municipal de Puerto Varas / DIMAO:
 *   Semana del mes 1 → Vidrio            (código: VIDRIO)
 *   Semana del mes 2 → Cartón y Papel    (código: CARTON_PAPEL)
 *   Semana del mes 3 → Plásticos PET/PEAD(código: PLASTICO_PET)
 *   Semana del mes 4 → Latas y Metales   (código: LATAS_METALES)
 *
 * Soporta:
 *   - Modo AUTOMATICO (por defecto según semana ISO del año)
 *   - Modo MANUAL (override administrativo de la semana en curso)
 *   - Overrides de día y material por sector/cuadrante
 */
@Service
@Transactional(readOnly = true)
public class RotacionSemanalService {

    public static final String MODO_AUTOMATICO = "AUTOMATICO";
    public static final String MODO_MANUAL = "MANUAL";

    private static final List<String> DEFAULT_CODIGOS = List.of(
        "VIDRIO",        // slot 1
        "CARTON_PAPEL",  // slot 2
        "PLASTICO_PET",  // slot 3
        "LATAS_METALES"  // slot 4
    );

    private final ResiduoRepository residuoRepository;

    private volatile String modo = MODO_AUTOMATICO;
    private volatile String overrideCodigoResiduo = null;
    private final List<String> ordenCodigos = new CopyOnWriteArrayList<>(DEFAULT_CODIGOS);
    private final Map<String, Map<String, String>> sectorOverrides = new ConcurrentHashMap<>();

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
        boolean esHoy = (fecha == null);
        if (fecha == null) {
            fecha = LocalDate.now(ZoneId.systemDefault());
        }

        int numSemanaISO = fecha.get(WeekFields.ISO.weekOfYear());
        int slot = calcularSlot(numSemanaISO);

        String codigoResiduo;
        if (esHoy && MODO_MANUAL.equalsIgnoreCase(modo) && overrideCodigoResiduo != null && !overrideCodigoResiduo.isBlank()) {
            codigoResiduo = overrideCodigoResiduo.trim().toUpperCase();
        } else {
            int idx = Math.min(Math.max(slot - 1, 0), ordenCodigos.size() - 1);
            codigoResiduo = ordenCodigos.get(idx);
        }

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
        response.put("modo", modo);
        response.put("overrideActivo", esHoy && MODO_MANUAL.equalsIgnoreCase(modo) && overrideCodigoResiduo != null);

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
     */
    public int calcularSlot(int numSemanaISO) {
        int mod = numSemanaISO % 4;
        return (mod == 0) ? 4 : mod;
    }

    /**
     * Retorna la configuración administrativa completa del calendario.
     */
    public Map<String, Object> getConfiguracion() {
        Map<String, Object> cfg = new LinkedHashMap<>();
        cfg.put("modo", modo);
        cfg.put("overrideCodigoResiduo", overrideCodigoResiduo);
        cfg.put("slots", new ArrayList<>(ordenCodigos));
        cfg.put("sectorOverrides", new LinkedHashMap<>(sectorOverrides));
        cfg.put("rotacionActual", obtenerRotacionParaFecha(null));

        List<Map<String, Object>> slotsDetalle = new ArrayList<>();
        for (int i = 0; i < ordenCodigos.size(); i++) {
            String cod = ordenCodigos.get(i);
            Map<String, Object> s = new LinkedHashMap<>();
            s.put("slot", i + 1);
            s.put("codigo", cod);
            s.put("nombre", nombreFallbackPorCodigo(cod));
            slotsDetalle.add(s);
        }
        cfg.put("slotsDetalle", slotsDetalle);
        return cfg;
    }

    /**
     * Actualiza la configuración de rotación municipal.
     */
    public Map<String, Object> actualizarConfiguracion(String nuevoModo, String nuevoOverride, List<String> nuevosSlots) {
        if (nuevoModo != null && (nuevoModo.equalsIgnoreCase(MODO_AUTOMATICO) || nuevoModo.equalsIgnoreCase(MODO_MANUAL))) {
            this.modo = nuevoModo.toUpperCase();
        }
        if (MODO_AUTOMATICO.equalsIgnoreCase(this.modo)) {
            this.overrideCodigoResiduo = null;
        } else if (nuevoOverride != null && !nuevoOverride.isBlank()) {
            this.overrideCodigoResiduo = nuevoOverride.trim().toUpperCase();
        }
        if (nuevosSlots != null && nuevosSlots.size() == 4) {
            ordenCodigos.clear();
            ordenCodigos.addAll(nuevosSlots);
        }
        return getConfiguracion();
    }

    /**
     * Actualiza el día o material asignado para un sector específico.
     */
    public Map<String, Object> actualizarSector(String sectorNombre, String dia, String materialCodigo) {
        if (sectorNombre != null && !sectorNombre.isBlank()) {
            Map<String, String> data = new LinkedHashMap<>();
            if (dia != null && !dia.isBlank()) data.put("dia", dia.trim());
            if (materialCodigo != null && !materialCodigo.isBlank()) data.put("materialCodigo", materialCodigo.trim().toUpperCase());
            sectorOverrides.put(sectorNombre.trim(), data);
        }
        return getConfiguracion();
    }

    /**
     * Restablece la rotación y cuadrantes al comportamiento automático por defecto.
     */
    public Map<String, Object> restablecerAutomatico() {
        this.modo = MODO_AUTOMATICO;
        this.overrideCodigoResiduo = null;
        this.ordenCodigos.clear();
        this.ordenCodigos.addAll(DEFAULT_CODIGOS);
        this.sectorOverrides.clear();
        return getConfiguracion();
    }

    /** Nombre legible cuando el residuo no existe aún en BD */
    public String nombreFallbackPorCodigo(String codigo) {
        if (codigo == null) return "Vidrio";
        return switch (codigo.toUpperCase()) {
            case "VIDRIO"       -> "Vidrio";
            case "CARTON_PAPEL", "CARTON" -> "Cartón y Papel";
            case "PLASTICO_PET", "PLASTICO" -> "Plásticos (PET y PEAD)";
            case "LATAS_METALES", "LATAS", "METAL" -> "Latas y Metales";
            default             -> codigo;
        };
    }
}

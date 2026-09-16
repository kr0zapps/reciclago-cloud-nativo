import { Sector, DEFAULT_SECTORES } from '../data/sectors.data';

/**
 * Detecta el cuadrante/sector municipal correspondiente según la dirección
 * y el tipo de material del residuo ingresado.
 */
export function detectSector(direccion: string, materialName: string = ''): Sector {
  const dir = (direccion || '').toLowerCase();
  if (dir.includes('costanera') || dir.includes('llanquihue') || dir.includes('guindos') || dir.includes('vicente')) {
    return DEFAULT_SECTORES[1];
  }
  if (dir.includes('chico') || dir.includes('mirador') || dir.includes('decher') || dir.includes('colón') || dir.includes('colon')) {
    return DEFAULT_SECTORES[0];
  }
  if (dir.includes('ensenada') || dir.includes('colonos') || dir.includes('225')) {
    return DEFAULT_SECTORES[2];
  }
  if (dir.includes('braunau') || dir.includes('klein')) {
    return DEFAULT_SECTORES[3];
  }
  const mat = (materialName || '').toLowerCase();
  if (mat.includes('vidrio')) return DEFAULT_SECTORES[1];
  if (mat.includes('cartón') || mat.includes('carton') || mat.includes('papel')) return DEFAULT_SECTORES[0];
  if (mat.includes('plástic') || mat.includes('plastic')) return DEFAULT_SECTORES[2];
  return DEFAULT_SECTORES[1];
}

/** Mapa de nombre de día en español a número JS (0=domingo, 1=lunes, ...) */
export const DAY_NAME_TO_NUMBER: Record<string, number> = {
  'domingo': 0,
  'lunes': 1,
  'martes': 2,
  'miércoles': 3,
  'miercoles': 3,
  'jueves': 4,
  'viernes': 5,
  'sábado': 6,
  'sabado': 6
};

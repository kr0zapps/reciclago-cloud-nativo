export interface QuadrantCardInfo {
  id: string;
  cuadranteNumber: number;
  name: string;
  shortName: string;
  day: string;
  hours: string;
  categoryKey: string;
  materialNombre: string;
  materialDescripcion?: string;
  materialInstrucciones?: string;
  requisitos: string;
  image: string;
  binImage: string;
  badgeColor: string;
  iconClass: string;
  diaModificado?: boolean;
  diaOriginal?: string;
  motivoModificacion?: string;
}

export const INITIAL_QUADRANTS: QuadrantCardInfo[] = [
  {
    id: 'cuadrante-1',
    cuadranteNumber: 1,
    name: 'Puerto Chico',
    shortName: 'Puerto Chico',
    day: 'Lunes',
    hours: '08:00 a 17:00 hrs',
    categoryKey: 'VIDRIO',
    materialNombre: 'Vidrio',
    materialDescripcion: 'Botellas, frascos conserveros y envases de vidrio transparente o color',
    materialInstrucciones: 'Enjuagar botellas y frascos, retirar tapas y corchos. No incluir cerámica, ampolletas ni espejos.',
    requisitos: 'Limpios y secos',
    image: 'assets/stitch/quadrant_puerto_chico.png',
    binImage: 'assets/bin_vidrio_clean.png',
    badgeColor: '#236836',
    iconClass: 'fa-solid fa-wine-bottle'
  },
  {
    id: 'cuadrante-2',
    cuadranteNumber: 2,
    name: 'Costanera',
    shortName: 'Costanera',
    day: 'Miércoles',
    hours: '08:00 a 17:00 hrs',
    categoryKey: 'CARTON',
    materialNombre: 'Cartón',
    materialDescripcion: 'Cajas de cartón corrugado, papel kraft, diarios y revistas limpias',
    materialInstrucciones: 'Aplanar cajas para reducir volumen. Mantener seco y libre de restos de grasa, comida o cintas adhesivas excesivas.',
    requisitos: 'Limpios y secos',
    image: 'assets/stitch/quadrant_costanera.png',
    binImage: 'assets/bin_carton_clean.png',
    badgeColor: '#176fa9',
    iconClass: 'fa-solid fa-box-open'
  },
  {
    id: 'cuadrante-3',
    cuadranteNumber: 3,
    name: 'Ensenada',
    shortName: 'Ensenada',
    day: 'Viernes',
    hours: '08:30 a 16:30 hrs',
    categoryKey: 'PLASTICO',
    materialNombre: 'Plásticos PET/PEAD',
    materialDescripcion: 'Botellas plásticas de bebidas (PET 1) y envases de detergente/lácteos (PEAD 2)',
    materialInstrucciones: 'Lavar, escurrir, aplastar para reducir volumen y volver a colocar la tapa plástica.',
    requisitos: 'Limpios y secos',
    image: 'assets/stitch/quadrant_ensenada.png',
    binImage: 'assets/bin_plasticos_clean.png',
    badgeColor: '#c4871d',
    iconClass: 'fa-solid fa-bottle-water'
  },
  {
    id: 'cuadrante-4',
    cuadranteNumber: 4,
    name: 'Nueva Braunau',
    shortName: 'Nueva Braunau',
    day: 'Martes',
    hours: '08:00 a 17:00 hrs',
    categoryKey: 'LATAS',
    materialNombre: 'Latas',
    materialDescripcion: 'Latas de bebidas de aluminio y tarros de conserva de hojalata',
    materialInstrucciones: 'Enjuagar para evitar olores y vectores sanitarios. Aplastar si es posible.',
    requisitos: 'Limpios y secos',
    image: 'assets/stitch/quadrant_braunau.png',
    binImage: 'assets/bin_latas_clean.png',
    badgeColor: '#c94b43',
    iconClass: 'fa-solid fa-can-food'
  }
];

export interface SectorInfo {
  id: string;
  name: string;
  shortName: string;
  day: string;
  hours: string;
  cuadranteNumber?: number;
  material?: string;
  callesPrincipales?: string;
  camionPatente?: string;
}

export const ALL_HOME_SECTORS: SectorInfo[] = INITIAL_QUADRANTS.map(q => ({
  id: q.id,
  cuadranteNumber: q.cuadranteNumber,
  name: `Cuadrante ${q.cuadranteNumber}: ${q.name}`,
  shortName: q.shortName,
  day: q.day,
  hours: q.hours,
  material: q.materialNombre
}));

export const POPULAR_HOME_SECTORS: SectorInfo[] = [...ALL_HOME_SECTORS];

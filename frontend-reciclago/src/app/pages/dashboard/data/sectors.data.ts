export interface Waypoint {
  name: string;
  detail: string;
  eta: string;
  distancia: string;
  x: number;
  y: number;
  estado: string;
}

export interface Sector {
  id: number;
  numero: number;
  nombre: string;
  sector: string;
  dia: string;
  horario: string;
  direccionEjemplo: string;
  cuadrante: string;
  patente: string;
  calles: string;
  material: string;
  materialPrincipal: string;
  waypoints: Waypoint[];
  enRuta?: boolean;
  fechaTexto?: string;
}

export interface Residuo {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  tipo?: string;
  instrucciones?: string;
  precioBase?: number;
  especial?: boolean;
  activo?: boolean;
  semanal?: boolean;
}

export type EstadoCamion = 'DISPONIBLE' | 'EN_RUTA' | 'MANTENIMIENTO';

export interface Camion {
  id: number;
  patente: string;
  capacidadKilos?: number;
  capacidadMaximaKg?: number;
  capacidadTotalKg?: number;
  capacidadDisponibleKg?: number;
  modelo?: string;
  estado?: EstadoCamion;
}

export interface Pickup {
  id: number;
  fecha?: string;
  fechaTexto?: string;
  fechaProgramada?: string;
  codigoRetiro?: string;
  residuoNombre?: string;
  kilosRecolectados?: number;
  pesoRealKg?: number;
  pesoEstimadoKg?: number;
  direccion?: string;
  estado?: string;
  comentarios?: string;
  observaciones?: string;
  motivoCancelacion?: string;
  camionPatente?: string;
  camionId?: number;
  vecinoNombre?: string;
  vecinoEmail?: string;
}

export const DEFAULT_SECTORES: Sector[] = [
  {
    id: 1,
    numero: 1,
    nombre: 'Puerto Chico y El Mirador',
    sector: 'Sector Puerto Chico',
    dia: 'Lunes',
    horario: '08:00 – 17:00 hrs',
    direccionEjemplo: 'Calle Decher 410, Puerto Chico',
    cuadrante: 'Cuadrante 1: Puerto Chico y Mirador',
    patente: 'PV-RC-2027',
    calles: 'Colo Colo, Colón, Decher, Mirador, Walker Martínez, Imperial Norte',
    material: 'Papel, Cartón y Latas',
    materialPrincipal: 'Cartón y Papel',
    waypoints: [
      {
        name: 'Av. Colón con Walker Martínez',
        detail: 'Ingreso al cuadrante Puerto Chico',
        eta: '15 min',
        distancia: '700 m',
        x: 8,
        y: 72,
        estado: 'En tránsito'
      },
      {
        name: 'Calle Colo Colo esq. Decher',
        detail: 'Recolección campanas de reciclaje',
        eta: '12 min',
        distancia: '520 m',
        x: 28,
        y: 72,
        estado: 'Recolección activa'
      },
      {
        name: 'Plaza El Mirador (Punto Limpio)',
        detail: 'Vaciado de tolva comunitaria',
        eta: '8 min',
        distancia: '320 m',
        x: 28,
        y: 28,
        estado: 'Recolección activa'
      },
      {
        name: 'Calle Decher hacia Pasaje Mirador',
        detail: 'Avanzando por sector habitacional',
        eta: '5 min',
        distancia: '200 m',
        x: 52,
        y: 28,
        estado: 'Tránsito fluido'
      },
      {
        name: 'Calle Imperial Norte',
        detail: 'Próxima parada: Tu sector residencial',
        eta: '2 min',
        distancia: '70 m',
        x: 52,
        y: 72,
        estado: 'Aproximándose'
      },
      {
        name: 'Tu Domicilio (Calle Decher 410)',
        detail: '¡Camión municipal en tu puerta! Retiro en curso',
        eta: '¡Llegando ahora!',
        distancia: '0 m',
        x: 82,
        y: 72,
        estado: 'Retiro en tu domicilio'
      }
    ]
  },
  {
    id: 2,
    numero: 2,
    nombre: 'Costanera Sur y Llanquihue Sur',
    sector: 'Sector Lago',
    dia: 'Martes',
    horario: '08:00 – 17:00 hrs',
    direccionEjemplo: 'Calle Los Guindos 450, Costanera',
    cuadrante: 'Cuadrante 2: Costanera Sur y Llanquihue Sur',
    patente: 'PV-RC-2026',
    calles: 'Los Guindos, Av. Vicente Pérez Rosales, San Francisco, Imperial, Costanera, Santa Rosa',
    material: 'Vidrio, Plásticos y Latas',
    materialPrincipal: 'VIDRIO',
    waypoints: [
      {
        name: 'Av. Vicente Pérez Rosales con Los Guindos',
        detail: 'Punto de partida del camión recolector',
        eta: '14 min',
        distancia: '650 m',
        x: 8,
        y: 72,
        estado: 'En tránsito'
      },
      {
        name: 'Paseo Costanera esq. San Francisco',
        detail: 'Retiro en punto verde gastronómico',
        eta: '10 min',
        distancia: '450 m',
        x: 28,
        y: 72,
        estado: 'Recolección activa'
      },
      {
        name: 'Muelle Histórico Piedraplén',
        detail: 'Recolección campanas de vidrio',
        eta: '7 min',
        distancia: '300 m',
        x: 28,
        y: 28,
        estado: 'Recolección activa'
      },
      {
        name: 'Calle Santa Rosa hacia Cuadrante Residencial',
        detail: 'Avanzando por calle interior residencial',
        eta: '4 min',
        distancia: '180 m',
        x: 52,
        y: 28,
        estado: 'Tránsito fluido'
      },
      {
        name: 'Calle Imperial Poniente',
        detail: 'Próxima parada: Tu sector habitacional',
        eta: '2 min',
        distancia: '60 m',
        x: 52,
        y: 72,
        estado: 'Aproximándose'
      },
      {
        name: 'Tu Domicilio (Calle Los Guindos 450)',
        detail: '¡Camión municipal en tu puerta! Retiro en curso',
        eta: '¡Llegando ahora!',
        distancia: '0 m',
        x: 82,
        y: 72,
        estado: 'Retiro en tu domicilio'
      }
    ]
  },
  {
    id: 3,
    numero: 3,
    nombre: 'Ensenada y Colonos',
    sector: 'Sector Rural y Ensenada',
    dia: 'Miércoles',
    horario: '08:00 – 17:00 hrs',
    direccionEjemplo: 'Ruta 225 Km 42, Ensenada',
    cuadrante: 'Cuadrante 3: Ensenada y Colonos',
    patente: 'PV-RC-2028',
    calles: 'Ruta 225, Los Colonos, Pasaje Los Volcanes, Camino Ensenada',
    material: 'Plásticos (PET) y Envases',
    materialPrincipal: 'PLÁSTICOS (PET)',
    waypoints: [
      {
        name: 'Ruta 225 Km 35 (Cruce Ralún)',
        detail: 'Ingreso al cuadrante rural Ensenada',
        eta: '16 min',
        distancia: '800 m',
        x: 8,
        y: 72,
        estado: 'En tránsito'
      },
      {
        name: 'Camino Ensenada Centro (Punto Verde)',
        detail: 'Recolección en campanas rurales',
        eta: '12 min',
        distancia: '580 m',
        x: 28,
        y: 72,
        estado: 'Recolección activa'
      },
      {
        name: 'Escuela Rural Los Colonos',
        detail: 'Retiro en punto escolar sustentable',
        eta: '9 min',
        distancia: '380 m',
        x: 28,
        y: 28,
        estado: 'Recolección activa'
      },
      {
        name: 'Camino Los Colonos hacia sector habitacional',
        detail: 'Avanzando por camino vecinal rural',
        eta: '6 min',
        distancia: '260 m',
        x: 52,
        y: 28,
        estado: 'Tránsito fluido'
      },
      {
        name: 'Ruta 225 Km 40 (Acceso Vecinal)',
        detail: 'Próxima parada: Tu sector rural',
        eta: '3 min',
        distancia: '120 m',
        x: 52,
        y: 72,
        estado: 'Aproximándose'
      },
      {
        name: 'Tu Domicilio (Ruta 225 Km 42)',
        detail: '¡Camión municipal en tu puerta! Retiro en curso',
        eta: '¡Llegando ahora!',
        distancia: '0 m',
        x: 82,
        y: 72,
        estado: 'Retiro en tu domicilio'
      }
    ]
  },
  {
    id: 4,
    numero: 4,
    nombre: 'Población Nueva Braunau',
    sector: 'Sector Nueva Braunau',
    dia: 'Jueves',
    horario: '08:00 – 17:00 hrs',
    direccionEjemplo: 'Av. Otto Klein 210, Nueva Braunau',
    cuadrante: 'Cuadrante 4: Nueva Braunau',
    patente: 'PV-RC-2026',
    calles: 'Ruta V-50, Otto Klein, Las Rosas, Central, Pasaje Los Alerces',
    material: 'Vidrio, Cartón y Plásticos',
    materialPrincipal: 'VIDRIO',
    waypoints: [
      {
        name: 'Av. Otto Klein (Entrada Nueva Braunau)',
        detail: 'Ingreso cuadrante habitacional Nueva Braunau',
        eta: '14 min',
        distancia: '650 m',
        x: 8,
        y: 72,
        estado: 'En tránsito'
      },
      {
        name: 'Calle Las Rosas esq. Central',
        detail: 'Recolección campanas de reciclaje',
        eta: '11 min',
        distancia: '480 m',
        x: 28,
        y: 72,
        estado: 'Recolección activa'
      },
      {
        name: 'Plaza Nueva Braunau (Punto Verde)',
        detail: 'Retiro en punto comunitario',
        eta: '8 min',
        distancia: '350 m',
        x: 28,
        y: 28,
        estado: 'Recolección activa'
      },
      {
        name: 'Calle Central hacia cuadrante habitacional',
        detail: 'Avanzando por sector residencial',
        eta: '5 min',
        distancia: '220 m',
        x: 52,
        y: 28,
        estado: 'Tránsito fluido'
      },
      {
        name: 'Pasaje Los Alerces',
        detail: 'Próxima parada: Tu sector habitacional',
        eta: '2 min',
        distancia: '90 m',
        x: 52,
        y: 72,
        estado: 'Aproximándose'
      },
      {
        name: 'Tu Domicilio (Av. Otto Klein 210)',
        detail: '¡Camión municipal en tu puerta! Retiro en curso',
        eta: '¡Llegando ahora!',
        distancia: '0 m',
        x: 82,
        y: 72,
        estado: 'Retiro en tu domicilio'
      }
    ]
  }
];

export const DEFAULT_RESIDUOS: Residuo[] = [
  { id: 1, nombre: 'Vidrio', descripcion: 'Botellas y frascos limpios', categoria: 'VIDRIO' },
  { id: 2, nombre: 'Cartón y Papel', descripcion: 'Cajas secas y aplanadas', categoria: 'CARTON' },
  { id: 3, nombre: 'Plásticos (PET 1 / PEAD 2)', descripcion: 'Envases aplastados', categoria: 'PLASTICO' },
  { id: 4, nombre: 'Latas y Metales', descripcion: 'Aluminio y hojalata limpia', categoria: 'METAL' }
];

export const DEFAULT_CAMIONES: Camion[] = [
  { id: 1, patente: 'PV-RC-2026', capacidadKilos: 1500, estado: 'DISPONIBLE' },
  { id: 2, patente: 'PV-RC-2027', capacidadKilos: 3000, estado: 'DISPONIBLE' },
  { id: 3, patente: 'PV-RC-2028', capacidadKilos: 2000, estado: 'DISPONIBLE' }
];

/**
 * Interfaz que modela la respuesta del endpoint
 * GET /api/catalog/rotacion/semanal del BFF/Catálogo.
 */
export interface RotacionSemanal {
  numSemanaISO: number;
  slotSemana: number;           // 1=Vidrio, 2=Cartón, 3=Plástico, 4=Latas
  residuoCodigo: string;        // ej: 'VIDRIO', 'CARTON_PAPEL', 'PLASTICO_PET', 'LATAS_METALES'
  residuoNombre: string;        // ej: 'Plásticos (PET y PEAD)'
  descripcion: string | null;
  instrucciones: string | null;
  categoria: string | null;     // ej: 'PLASTICO'
  precioPorKg: number | null;
  vigenciaDesde: string;        // ISO date: '2026-09-21'
  vigenciaHasta: string;        // ISO date: '2026-09-27'
  residuoId?: number | null;
}

export interface RotacionConfig {
  modo: 'AUTOMATICO' | 'MANUAL';
  overrideCodigoResiduo: string | null;
  numSemanaActual: number;
  slotSemanaActual: number;
  residuoSemanalActual?: RotacionSemanal;
  semanas: Array<{
    slot: number;
    codigo: string;
    nombre: string;
    categoria: string;
    descripcion?: string;
  }>;
  sectoresOverrides?: Record<string, { dia?: string; materialCodigo?: string; materialNombre?: string }>;
}

export const SEMANAS_ROTACION_DEFAULT = [
  { slot: 1, codigo: 'VIDRIO', nombre: 'Vidrio', categoria: 'VIDRIO', descripcion: 'Botellas, frascos y recipientes de vidrio limpios' },
  { slot: 2, codigo: 'CARTON_PAPEL', nombre: 'Cartón y Papel', categoria: 'CARTON', descripcion: 'Cajas secas, periódicos, papel blanco y embalaje aplanado' },
  { slot: 3, codigo: 'PLASTICO_PET', nombre: 'Plásticos (PET y PEAD)', categoria: 'PLASTICO', descripcion: 'Botellas plásticas compactadas, bidones y envases limpios' },
  { slot: 4, codigo: 'LATAS_METALES', nombre: 'Latas y Metales', categoria: 'LATAS', descripcion: 'Aluminio de bebidas, hojalata y conservas limpias' },
];

export function loadLocalRotacionConfig(): { modo: 'AUTOMATICO' | 'MANUAL'; overrideCodigoResiduo: string | null } {
  try {
    const raw = localStorage.getItem('reciclago_rotacion_config');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return { modo: 'AUTOMATICO', overrideCodigoResiduo: null };
}

export function saveLocalRotacionConfig(config: { modo: 'AUTOMATICO' | 'MANUAL'; overrideCodigoResiduo: string | null }): void {
  try {
    localStorage.setItem('reciclago_rotacion_config', JSON.stringify(config));
  } catch {}
}

export function loadLocalSectorOverrides(): Record<string, { dia?: string; material?: string; materialPrincipal?: string }> {
  try {
    const raw = localStorage.getItem('reciclago_sectors_override');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}

export function saveLocalSectorOverrides(overrides: Record<string, { dia?: string; material?: string; materialPrincipal?: string }>): void {
  try {
    localStorage.setItem('reciclago_sectors_override', JSON.stringify(overrides));
  } catch {}
}

export function aplicarSectorOverrides(sectores: Sector[]): Sector[] {
  const overrides = loadLocalSectorOverrides();
  if (!overrides || Object.keys(overrides).length === 0) {
    return sectores;
  }
  return sectores.map(s => {
    const ov = overrides[s.nombre] || overrides[s.sector] || overrides[s.cuadrante];
    if (!ov) return s;
    return {
      ...s,
      dia: ov.dia || s.dia,
      material: ov.material || s.material,
      materialPrincipal: ov.materialPrincipal || s.materialPrincipal
    };
  });
}

/**
 * Catálogo local de los 4 residuos rotativos.
 * Espeja la lógica de RotacionSemanalService.java.
 * Sólo se usa como fallback offline cuando el catálogo no responde.
 */
const ROTACION_FALLBACK: Pick<RotacionSemanal, 'slotSemana' | 'residuoCodigo' | 'residuoNombre' | 'categoria'>[] = [
  { slotSemana: 1, residuoCodigo: 'VIDRIO',        residuoNombre: 'Vidrio',                categoria: 'VIDRIO'   },
  { slotSemana: 2, residuoCodigo: 'CARTON_PAPEL',  residuoNombre: 'Cartón y Papel',         categoria: 'CARTON'   },
  { slotSemana: 3, residuoCodigo: 'PLASTICO_PET',  residuoNombre: 'Plásticos (PET y PEAD)', categoria: 'PLASTICO' },
  { slotSemana: 4, residuoCodigo: 'LATAS_METALES', residuoNombre: 'Latas y Metales',        categoria: 'LATAS'    },
];

/**
 * Calcula la rotación semanal local (fallback offline).
 * Usa el número de semana ISO del año actual, igual que el backend.
 * Considera override manual guardado en localStorage si existe.
 * @returns RotacionSemanal con datos mínimos para que el UI no muestre vacío.
 */
export function calcularRotacionLocal(): RotacionSemanal {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000) + 1;
  const numSemanaISO = Math.ceil(dayOfYear / 7);
  const mod = numSemanaISO % 4;
  const slot = mod === 0 ? 4 : mod;

  const localConfig = loadLocalRotacionConfig();
  let entry = ROTACION_FALLBACK[slot - 1];

  if (localConfig.modo === 'MANUAL' && localConfig.overrideCodigoResiduo) {
    const overrideFound = ROTACION_FALLBACK.find(r => r.residuoCodigo === localConfig.overrideCodigoResiduo);
    if (overrideFound) {
      entry = overrideFound;
    }
  }

  // Calcular inicio y fin de la semana actual (lunes a domingo)
  const diaSemana = now.getDay(); // 0=Dom, 1=Lun...
  const diffLunes = (diaSemana === 0 ? -6 : 1 - diaSemana);
  const lunes = new Date(now);
  lunes.setDate(now.getDate() + diffLunes);
  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);

  const toISO = (d: Date) => d.toISOString().split('T')[0];

  return {
    numSemanaISO,
    slotSemana: entry.slotSemana,
    residuoCodigo: entry.residuoCodigo,
    residuoNombre: entry.residuoNombre,
    descripcion: null,
    instrucciones: null,
    categoria: entry.categoria,
    precioPorKg: null,
    vigenciaDesde: toISO(lunes),
    vigenciaHasta: toISO(domingo),
    residuoId: null,
  };
}

/** Fallback estático para demo offline. Se genera una vez al importar el módulo. */
export const DEFAULT_ROTACION_SEMANAL: RotacionSemanal = calcularRotacionLocal();

export function getNextDateForDay(dayName: string): string {
  const daysMap: Record<string, number> = {
    'domingo': 0, 'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3, 'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6
  };
  const targetDay = daysMap[dayName.toLowerCase()] ?? 2;
  const now = new Date();
  const currentDay = now.getDay();
  let diff = targetDay - currentDay;
  if (diff === 0) {
    return `¡Hoy (${dayName})! Recorrido en curso`;
  }
  if (diff < 0) diff += 7;
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + diff);
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${dayName} ${String(nextDate.getDate()).padStart(2, '0')} ${months[nextDate.getMonth()]}`;
}


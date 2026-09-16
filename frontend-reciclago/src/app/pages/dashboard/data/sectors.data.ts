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
}

export interface Camion {
  id: number;
  patente: string;
  capacidadKilos?: number;
  capacidadMaximaKg?: number;
  estado?: string;
}

export interface Pickup {
  id: number;
  fecha?: string;
  fechaTexto?: string;
  residuoNombre?: string;
  kilosRecolectados?: number;
  pesoRealKg?: number;
  pesoEstimadoKg?: number;
  direccion?: string;
  estado?: string;
  comentarios?: string;
  camionPatente?: string;
  camionId?: number;
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
  { id: 3, patente: 'PV-RC-2028', capacidadKilos: 2000, estado: 'EN_BASE' }
];

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
  const nextDate = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000);
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${dayName} ${String(nextDate.getDate()).padStart(2, '0')} ${months[nextDate.getMonth()]}`;
}

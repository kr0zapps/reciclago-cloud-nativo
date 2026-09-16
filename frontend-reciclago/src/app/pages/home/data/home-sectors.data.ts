export interface SectorInfo {
  id: string;
  name: string;
  shortName: string;
  day: string;
  hours: string;
}

export const ALL_HOME_SECTORS: SectorInfo[] = [
  { id: 'braunau', name: 'Población Nueva Braunau', shortName: 'Nueva Braunau', day: 'Martes', hours: '08:00 y 17:00 hrs.' },
  { id: 'chico', name: 'Puerto Chico / Los Colonos', shortName: 'Puerto Chico', day: 'Miércoles', hours: '08:00 y 17:00 hrs.' },
  { id: 'centro', name: 'Centro / Costanera', shortName: 'Costanera', day: 'Lunes', hours: '08:00 y 17:00 hrs.' },
  { id: 'ensenada', name: 'Ensenada / Ruta 225', shortName: 'Ensenada', day: 'Jueves', hours: '08:00 y 17:00 hrs.' },
  { id: 'mirador', name: 'El Mirador / Alta Esperanza', shortName: 'El Mirador', day: 'Viernes', hours: '08:00 y 17:00 hrs.' }
];

export const POPULAR_HOME_SECTORS: SectorInfo[] = [
  ALL_HOME_SECTORS[0],
  ALL_HOME_SECTORS[1],
  ALL_HOME_SECTORS[2],
  ALL_HOME_SECTORS[3]
];

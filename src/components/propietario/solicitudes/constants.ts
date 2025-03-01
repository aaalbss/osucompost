'use client';

// URL de la API
export const API_URL = '/api';

// Mapeo de etiquetas para mejor legibilidad
export const LABELS = {
  tipoResiduo: {
    'domesticos': 'Domésticos',
    'supermercados': 'Supermercados', 
    'fruterias': 'Fruterías',
    'comedores': 'Comedores',
    'horeca': 'Sector HORECA',
    'poda': 'Restos de poda',
    'agricolas': 'Restos agrícolas'
  },
  tipoContenedor: {
    'cubo16': 'Cubo 16 L',
    'cubo160': 'Cubo 160 L',
    'contenedor800': 'Contenedor 800 L',
    'contenedor1200': 'Contenedor 1200 L'
  },
  horario: {
    'manana': 'Mañana (9:00 a 13:00)',
    'tarde': 'Tarde (17:00 a 20:00)',
    'noche': 'Noche (a partir de las 23:00)'
  }
};

// Mapeo inverso de horarios API a fronted
export const HORARIO_MAPPING: Record<string, string> = {
  'M': 'manana',  // M -> mañana
  'T': 'tarde',   // T -> tarde
  'N': 'noche'    // N -> noche
};

// Mapeo inverso de tipos de residuo API a frontend
export const TIPO_RESIDUO_MAPPING: Record<string, string> = {
  'Organico': 'domesticos',
  'Supermercado': 'supermercados',
  'Fruteria': 'fruterias',
  'Comedor': 'comedores',
  'HORECA': 'horeca',
  'Poda': 'poda',
  'Agricola': 'agricolas'
};

// Mapeo de tipos de contenedor a capacidades
export const CAPACIDAD_MAP: Record<string, number> = {
  'cubo16': 16,
  'cubo160': 160,
  'contenedor800': 800,
  'contenedor1200': 1200
};

// Mapeo inverso de capacidad a tipo de contenedor
export const CAPACIDAD_TO_TIPO: Record<number, string> = {
  16: 'cubo16',
  160: 'cubo160',
  800: 'contenedor800',
  1200: 'contenedor1200'
};

// Mapeo de tipos de residuos a IDs
export const RESIDUO_ID_MAP: Record<string, number> = {
  'domesticos': 1,
  'supermercados': 2,
  'fruterias': 3,
  'comedores': 4,
  'horeca': 5,
  'poda': 6,
  'agricolas': 7
};

// Opciones para los selectores
export const OPCIONES_TIPO_RESIDUO = [
  { id: 'domesticos', label: 'Domésticos' },
  { id: 'supermercados', label: 'Supermercados' },
  { id: 'fruterias', label: 'Fruterías' },
  { id: 'comedores', label: 'Comedores' },
  { id: 'horeca', label: 'Sector HORECA' },
  { id: 'poda', label: 'Restos de poda' },
  { id: 'agricolas', label: 'Restos agrícolas' }
];

export const OPCIONES_TIPO_CONTENEDOR = [
  { id: 'cubo16', label: 'Cubo 16 L' },
  { id: 'cubo160', label: 'Cubo 160 L' },
  { id: 'contenedor800', label: 'Contenedor 800 L' },
  { id: 'contenedor1200', label: 'Contenedor 1200 L' }
];

export const OPCIONES_HORARIO = [
  { id: 'manana', label: 'Mañana (9:00 a 13:00)' },
  { id: 'tarde', label: 'Tarde (17:00 a 20:00)' },
  { id: 'noche', label: 'Noche (a partir de las 23:00)' }
];
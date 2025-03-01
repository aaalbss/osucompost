'use client';

export interface Propietario {
  dni: string;
  nombre: string;
  telefono: number;
  email: string;
  fuenteResiduo?: string; // Campo para almacenar la fuente de residuo seleccionada (UI)
  tipoContenedor?: string; // Campo para almacenar el tipo de contenedor seleccionado (UI)
  horario?: string; // Campo para almacenar el horario seleccionado (UI)
}

export interface PuntoRecogida {
  id: number;
  localidad: string;
  cp: number;
  provincia: string;
  direccion: string;
  dni: string; // Clave foránea a PROPIETARIO
  horario: string; // M (mañana), T (tarde), N (noche)
  tipo: string; // Fuente de residuo (Domestico, Supermercado, etc.)
  propietario: Propietario; // Propiedad añadida
}

export interface TipoResiduo {
  id: number;
  descripcion: string; // "Organico" o "NoOrganico"
}

export interface Contenedor {
  id: number;
  idTipoResiduo: number; // Clave foránea a TIPO_RESIDUO
  tipoResiduo: TipoResiduo; // Objeto completo de tipo residuo
  capacidad: number;
  idPuntoRecogida: number; // Clave foránea a PUNTO_RECOGIDA
  puntoRecogida?: {
    id: number;
    propietario?: Propietario;
  };
}

export interface Recogida {
  id: number;
  fechaSolicitud: string; // DATETIME en la base de datos
  fechaRecogidaEstimada: string; // DATETIME en la base de datos
  fechaRecogidaReal: string | null; // DATETIME en la base de datos, puede ser NULL
  incidencias: string | null; // VARCHAR(50), puede ser NULL
  idContenedor: number; // Clave foránea a CONTENEDORES
  contenedor?: {
    id: number;
  };
}

export interface Precio {
  id: number;
  idTipoResiduo: number; // Clave foránea a TIPO_RESIDUO
  fechaInicio: string; // DATETIME en la base de datos
  fechaFin: string | null; // DATETIME en la base de datos, puede ser NULL
  valor: number; // FLOAT en la base de datos
  tipoResiduo: TipoResiduo | null; // Nueva propiedad añadida
}

export interface Facturacion {
  id: number;
  dni: string; // Clave foránea a PROPIETARIO
  idTipoResiduo: number; // Clave foránea a TIPO_RESIDUO
  total: number; // FLOAT en la base de datos
  propietario: Propietario; // Propiedad añadida
  tipoResiduo: TipoResiduo; // Propiedad añadida
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Interfaces para el formulario de registro
export interface FormData {
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
  domicilio: string;
  localidad: string;
  cp: string;
  provincia: string;
  tipoResiduo: 'Organico' | 'Estructurante';
  fuente: 'Domesticos' | 'Supermercados' | 'Fruterias' | 'Comedores' | 'SectorHORECA' | 'RestosPoda' | 'RestosAgricolas';
  cantidad: 'Cubo 16 L' | 'Cubo 160 L' | 'Contenedor 800 L' | 'Contenedor 1200 L';
  frecuencia: 'Diaria' | '3 por semana' | '1 por semana' | 'Quincenal' | 'Ocasional';
  horario: 'manana' | 'tarde' | 'noche'; // Cambiar a formato interno
}

export interface FormErrors {
  nombre?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  domicilio?: string;
  localidad?: string;
  cp?: string;
  provincia?: string;
}

// Interfaces para componentes de la solicitud de recogida
export interface SolicitudRecogidaProps {
  propietarioDni?: string;
}

export interface ValoresOriginales {
  fuenteResiduo: string;
  tipoContenedor: string;
  horario: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
}

export interface TipoContenedorSelectProps {
  tipoContenedor: string;
  onChange: (value: string) => void;
}

export interface HorarioSelectProps {
  horario: string;
  onChange: (value: string) => void;
}

export interface DniInputProps {
  dni: string;
  setDni: (dni: string) => void;
  dniError: string;
}

export interface CalendarioRecogidaProps {
  fechaRecogida: Date;
  setFechaRecogida: (fecha: Date) => void;
  cargando: boolean;
}

export interface FuenteResiduoSelectProps {
  fuenteResiduo: string;
  onChange: (value: string) => void;
}

// Tipos de datos para estadísticas de recogida
export interface DatosRecogida {
  fecha: string;
  horario: 'M' | 'T' | 'N';
  capacidad: number;
  remuneracion: number;
}

export interface EstadisticasGraficosProps {
  datosRecogidas: DatosRecogida[];
}
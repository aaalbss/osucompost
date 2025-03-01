'use client';

// Interfaces para tipos de datos
export interface Contenedor {
  id: number;
  capacidad: number;
  tipoResiduo?: {
    id: number;
    descripcion: string;
  };
  puntoRecogida?: {
    propietario?: {
      dni: string;
    };
  };
}

export interface Propietario {
  dni: string;
  nombre: string;
  telefono: number;
  email: string;
  tipoResiduo?: string; // Valor del mapeo de tipo de residuo
  tipoContenedor?: string; // Valor del mapeo de tipo de contenedor
  horario?: string; // Valor del mapeo de horario
}

export interface PuntoRecogida {
  id: number;
  localidad: string;
  cp: number;
  provincia: string;
  direccion: string;
  horario: string;
  tipo: string;
  propietario: Propietario;
}

export interface ErrorResponse extends Error {
  message: string;
}

export interface ValoresOriginales {
  tipoResiduo: string;
  tipoContenedor: string;
  horario: string;
}

export interface OpcionSelect {
  id: string;
  label: string;
}

export interface ConfirmationModalProps {
  originalValue: string;
  newValue: string;
  labelKey: 'tipoResiduo' | 'tipoContenedor' | 'horario';
  onConfirm: () => void;
  onCancel: () => void;
}

export interface SolicitudRecogidaProps {
  propietarioDni?: string;
}

export interface AlertMessageProps {
  type: 'error' | 'success';
  title: string;
  message: string;
}

export interface DNIInputProps {
  dni: string;
  setDni: (dni: string) => void;
  dniError: string;
}

export interface TipoResiduoSelectProps {
  tipoResiduo: string;
  onChange: (value: string) => void;
}

export interface TipoContenedorSelectProps {
  tipoContenedor: string;
  onChange: (value: string) => void;
}

export interface HorarioSelectProps {
  horario: string;
  onChange: (value: string) => void;
}

export interface CalendarioRecogidaProps {
  fechaRecogida: Date;
  setFechaRecogida: (fecha: Date) => void;
  cargando: boolean;
}
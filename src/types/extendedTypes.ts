//extendedTypes.ts
'use client';

import { PuntoRecogida, TipoResiduo, Propietario } from './types';

// Extended interface for Contenedor used in the PropietarioPage
export interface ExtendedContenedor {
  id: number;
  capacidad: number;
  frecuencia: string;
  tipoResiduo: TipoResiduo;
  puntoRecogida: PuntoRecogida & { // Usa un intersection type para añadir propietario si no está ya en PuntoRecogida
    propietario?: Propietario; // Hacer opcional
  };
}

// Extended interface for Recogida used in the PropietarioPage
export interface ExtendedRecogida {
  id: number;
  fechaSolicitud: string;
  fechaRecogidaEstimada: string;
  fechaRecogidaReal: string | null;
  incidencias: string | null;
  contenedor: ExtendedContenedor;
  horarioSeleccionado?: string; // Nuevo campo para el horario específico de la recogida
  esPuntual?: boolean; // Nuevo campo para identificar recogidas puntuales
}

// Interface for Precio which was previously only defined in the page component
export interface Precio {
  id: number;
  fechaInicio: string;
  fechaFin: string | null;
  valor: number;
  tipoResiduo: TipoResiduo;
}
'use client';
import React from 'react';
import { getNombreResiduoPorId } from '@/utils/formatoResiduos';

interface TipoResiduoProps {
  id?: number;
  descripcion?: string;
  className?: string;
}

/**
 * Componente para mostrar correctamente el nombre de un tipo de residuo
 */
export const TipoResiduo: React.FC<TipoResiduoProps> = ({ 
  id, 
  descripcion, 
  className = ""
}) => {
  // Si tenemos ID, usar el mapeo; si no, mostrar la descripción tal cual
  const nombreFormateado = id ? getNombreResiduoPorId(id) : descripcion;
  
  return (
    <span className={className}>
      {nombreFormateado || descripcion || ''}
    </span>
  );
};
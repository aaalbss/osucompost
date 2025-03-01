'use client';

/**
 * Formatea una fecha ISO a formato local español
 * @param fecha Fecha en formato ISO
 * @returns Fecha formateada en español
 */
export const formatearFecha = (fecha: string): string => {
  if (!fecha) return 'No disponible';
  try {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Error al formatear la fecha:', e);
    return 'Formato de fecha inválido';
  }
};
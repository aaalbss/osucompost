'use client';

import { useState, useEffect } from 'react';
import { PuntoRecogida } from '../types';

// Define API_URL inline
const API_URL = '/api';

export const usePuntosRecogida = () => {
  const [puntosRecogida, setPuntosRecogida] = useState<PuntoRecogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarPuntosRecogida = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/puntos-recogida`);
        if (response.ok) {
          const data = await response.json();
          setPuntosRecogida(Array.isArray(data) ? data : [data]);
        } else {
          setError(`Error al cargar puntos de recogida: ${response.status}`);
        }
      } catch (err) {
        console.error('Error al cargar puntos de recogida:', err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };
    
    cargarPuntosRecogida();
  }, []);

  // Función actualizada para manejar tanto actualización como creación de un nuevo punto de recogida
  const actualizarPuntoRecogida = (nuevoPunto: PuntoRecogida, puntoAntiguo?: PuntoRecogida) => {
    // Actualizar el estado local
    setPuntosRecogida(prev => {
      if (puntoAntiguo) {
        // Si se proporciona un punto antiguo, reemplazarlo con el nuevo
        return prev.map(p => 
          p.id === puntoAntiguo.id ? nuevoPunto : p
        );
      } else {
        // Si no hay punto antiguo, simplemente agregar el nuevo
        return [...prev, nuevoPunto];
      }
    });
    
    return nuevoPunto;
  };

  return { 
    puntosRecogida, 
    setPuntosRecogida, 
    loading, 
    error, 
    actualizarPuntoRecogida 
  };
};
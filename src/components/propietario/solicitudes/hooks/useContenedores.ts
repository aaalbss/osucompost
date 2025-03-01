'use client';

import { useState, useEffect } from 'react';
import { Contenedor } from '../types';

// Define API_URL inline
const API_URL = '/api';

export const useContenedores = () => {
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarContenedores = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/contenedores`);
        if (response.ok) {
          const data = await response.json();
          setContenedores(Array.isArray(data) ? data : [data]);
        } else {
          setError(`Error al cargar contenedores: ${response.status}`);
        }
      } catch (err) {
        console.error('Error al cargar contenedores:', err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };
    
    cargarContenedores();
  }, []);

  // Función actualizada para manejar tanto actualización como creación de un nuevo contenedor
  const actualizarContenedor = (nuevoContenedor: Contenedor, contenedorAntiguo?: Contenedor) => {
    // Actualizar el estado local
    setContenedores(prev => {
      if (contenedorAntiguo) {
        // Si se proporciona un contenedor antiguo, reemplazarlo con el nuevo
        return prev.map(c => 
          c.id === contenedorAntiguo.id ? nuevoContenedor : c
        );
      } else {
        // Si no hay contenedor antiguo, simplemente agregar el nuevo
        return [...prev, nuevoContenedor];
      }
    });
    
    return nuevoContenedor;
  };

  return { 
    contenedores, 
    setContenedores, 
    loading, 
    error, 
    actualizarContenedor 
  };
};
'use client';

import { useEffect } from 'react';

/**
 * Componente para limpiar las sesiones de operarios al cargar la página principal
 */
const SessionCleaner: React.FC = () => {
  useEffect(() => {
    // Lista de claves relacionadas con la sesión de operario que queremos limpiar
    const clavesOperario: string[] = [
      'userUsername',
      'cookiesModalShown',
      'operarioUsername',
      'fromOperarios',
      'operarioAcceso'
    ];
    
    // Limpiar todas las claves de localStorage
    clavesOperario.forEach(clave => {
      if (localStorage.getItem(clave)) {
        console.log(`Limpiando sesión de operario: ${clave}`);
        localStorage.removeItem(clave);
      }
    });
    
  }, []);

  // Este componente no renderiza nada visible
  return null;
};

export default SessionCleaner;
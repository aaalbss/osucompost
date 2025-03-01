'use client';

import { useState, useEffect } from 'react';
import { Propietario, ValoresOriginales, Contenedor, PuntoRecogida } from '../types';

// Define inline constants
const HORARIO_MAPPING: Record<string, string> = {
  'M': 'manana',
  'T': 'tarde',
  'N': 'noche'
};

const TIPO_RESIDUO_MAPPING: Record<string, string> = {
  'Orgánico': 'Organico',
  'No Orgánico': 'NoOrganico',
  'Organico': 'Organico',
  'NoOrganico': 'NoOrganico'
};

const CAPACIDAD_TO_TIPO: Record<number, string> = {
  16: 'Cubo 16 L',
  160: 'Cubo 160 L',
  800: 'Contenedor 800 L',
  1200: 'Contenedor 1200 L'
};

export const usePropietario = (
  propietarioDni: string | undefined,
  contenedores: Contenedor[],
  puntosRecogida: PuntoRecogida[]
) => {
  const [propietarioData, setPropietarioData] = useState<Propietario | null>(null);
  const [valoresOriginales, setValoresOriginales] = useState<ValoresOriginales>({
    tipoResiduo: '',
    tipoContenedor: '',
    horario: ''
  });
  const [dniUsuario, setDniUsuario] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si se proporciona el DNI como prop, úsalo
    if (propietarioDni) {
      setDniUsuario(propietarioDni);
    } else {
      // De lo contrario, intenta obtenerlo del localStorage (cambiado de sessionStorage)
      const userDni = typeof window !== 'undefined' ? localStorage.getItem('userDni') : null;
      if (userDni) {
        setDniUsuario(userDni);
      }
    }
  }, [propietarioDni]);

  useEffect(() => {
    // Cargar valores originales del propietario
    const cargarValoresOriginales = async () => {
      if (!dniUsuario || puntosRecogida.length === 0 || contenedores.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Buscar el punto de recogida asociado al propietario con este DNI
        const puntoRecogidaDelPropietario = puntosRecogida.find(
          punto => punto.propietario?.dni === dniUsuario
        );
        
        if (puntoRecogidaDelPropietario) {
          // Si encuentra el punto de recogida, extraer info del propietario
          const propietario = puntoRecogidaDelPropietario.propietario;
          
          // Buscar contenedor del propietario para obtener tipo y capacidad
          const contenedorDelPropietario = contenedores.find(
            c => c.puntoRecogida?.propietario?.dni === dniUsuario
          );
          
          if (contenedorDelPropietario) {
            // Convertir horario de API a formato frontend
            const horarioFrontend = HORARIO_MAPPING[puntoRecogidaDelPropietario.horario] || '';
            
            // Convertir tipo residuo de API a formato frontend
            const tipoResiduoFrontend = contenedorDelPropietario.tipoResiduo?.descripcion 
              ? TIPO_RESIDUO_MAPPING[contenedorDelPropietario.tipoResiduo.descripcion] || ''
              : '';
            
            // Convertir capacidad a tipo contenedor
            const tipoContenedorFrontend = CAPACIDAD_TO_TIPO[contenedorDelPropietario.capacidad] || '';
            
            // Guardar datos originales
            setValoresOriginales({
              tipoResiduo: tipoResiduoFrontend,
              tipoContenedor: tipoContenedorFrontend,
              horario: horarioFrontend
            });
            
            // Guardar datos completos del propietario para actualizaciones
            setPropietarioData({
              ...propietario,
              tipoResiduo: tipoResiduoFrontend,
              tipoContenedor: tipoContenedorFrontend,
              horario: horarioFrontend
            });
          }
        }
      } catch (err) {
        console.error('Error al cargar valores originales:', err);
      } finally {
        setLoading(false);
      }
    };
    
    cargarValoresOriginales();
  }, [dniUsuario, puntosRecogida, contenedores]);

  return {
    propietarioData,
    setPropietarioData,
    valoresOriginales,
    setValoresOriginales,
    dniUsuario,
    loading
  };
};
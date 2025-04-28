'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Propietario } from '@/types/types';

interface PropietariosTableProps {
  propietarios: Propietario[];
  onDataUpdated?: () => void;
  selectedDni?: string | null;
  shouldHighlight?: boolean;
  onHighlightComplete?: () => void;
  onPuntoRecogidaClick?: (puntoId: number) => void;
}

const PropietariosTable: React.FC<PropietariosTableProps> = ({ 
  propietarios, 
  onDataUpdated,
  selectedDni = null,
  shouldHighlight = false,
  onHighlightComplete,
  onPuntoRecogidaClick
}) => {
  const [ordenPor, setOrdenPor] = useState<string>('nombre');
  const [direccionOrden, setDireccionOrden] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [highlightActive, setHighlightActive] = useState<boolean>(false);
  const selectedRowRef = useRef<HTMLTableRowElement>(null);

  // Efecto para gestionar el desplazamiento y el resaltado
  useEffect(() => {
    // Si debemos resaltar y tenemos un DNI seleccionado, activar
    if (shouldHighlight && selectedDni && !highlightActive) {
      setHighlightActive(true);
      
      // Si hay un propietario seleccionado, scroll hasta él
      if (selectedRowRef.current) {
        selectedRowRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [shouldHighlight, selectedDni, highlightActive]);

  // Efecto para añadir el evento de clic para desactivar el resaltado
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el resaltado está activo, lo desactivamos con el primer clic
      if (highlightActive) {
        setHighlightActive(false);
        // Notificar al componente padre que el resaltado se ha completado
        if (onHighlightComplete) {
          onHighlightComplete();
        }
      }
    };

    // Añadir event listener al documento
    document.addEventListener('click', handleClickOutside);

    // Limpiar event listener al desmontar
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [highlightActive, onHighlightComplete]);

  // Reordenar los propietarios para poner primero el seleccionado
  const getPropietariosOrdenados = () => {
    // Ordenamiento básico según el criterio seleccionado
    const ordenarPropietarios = (propietarios) => {
      return [...propietarios].sort((a, b) => {
        let valA, valB;

        switch (ordenPor) {
          case 'dni':
            valA = a.dni;
            valB = b.dni;
            break;
          case 'telefono':
            valA = a.telefono;
            valB = b.telefono;
            break;
          case 'email':
            valA = a.email?.toLowerCase() || '';
            valB = b.email?.toLowerCase() || '';
            break;
          case 'nombre':
          default:
            valA = a.nombre?.toLowerCase() || '';
            valB = b.nombre?.toLowerCase() || '';
            break;
        }

        // Comparar valores
        if (valA < valB) return direccionOrden === 'asc' ? -1 : 1;
        if (valA > valB) return direccionOrden === 'asc' ? 1 : -1;
        return 0;
      });
    };

    // Si hay un propietario seleccionado, lo movemos al principio
    if (selectedDni) {
      const selectedPropietario = propietarios.find(p => p.dni === selectedDni);
      const restPropietarios = propietarios.filter(p => p.dni !== selectedDni);
      
      const sortedRestPropietarios = ordenarPropietarios(restPropietarios);
      
      return selectedPropietario ? [selectedPropietario, ...sortedRestPropietarios] : ordenarPropietarios(propietarios);
    }

    return ordenarPropietarios(propietarios);
  };

  const propietariosOrdenados = getPropietariosOrdenados();

  // Función para cambiar el orden
  const cambiarOrden = (campo: string) => {
    if (ordenPor === campo) {
      setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenPor(campo);
      setDireccionOrden('asc');
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      {/* Mensajes de estado */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {exito && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 border-l-4 border-green-500" role="alert">
          <p>{exito}</p>
        </div>
      )}

      {/* Tabla de propietarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('dni')}
              >
                DNI
                {ordenPor === 'dni' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('nombre')}
              >
                Nombre
                {ordenPor === 'nombre' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('telefono')}
              >
                Teléfono
                {ordenPor === 'telefono' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('email')}
              >
                Email
                {ordenPor === 'email' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {propietariosOrdenados.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-sm text-center text-gray-500">
                  No se encontraron propietarios
                </td>
              </tr>
            ) : (
              propietariosOrdenados.map((propietario) => {
                const isSelected = selectedDni === propietario.dni;
                return (
                  <tr 
                    key={propietario.dni} 
                    ref={isSelected ? selectedRowRef : null}
                    className={`transition-all duration-300 ${
                      isSelected && highlightActive
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap">
                      {isSelected && highlightActive ? (
                        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {propietario.dni}
                        </span>
                      ) : (
                        propietario.dni
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {propietario.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {propietario.telefono}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {propietario.email}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropietariosTable;
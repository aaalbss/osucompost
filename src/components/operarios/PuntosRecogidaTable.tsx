'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PuntoRecogida, Contenedor } from '@/types/types';

interface PuntosRecogidaTableProps {
  puntosRecogida: PuntoRecogida[];
  contenedores?: Contenedor[];
  onNavigateToContenedor?: (contenedorId: number) => void;
  onNavigateToPropietario?: (dni: string) => void;
  selectedPuntoId?: number | null;
  shouldHighlight?: boolean;
  onHighlightComplete?: () => void;
}

const PuntosRecogidaTable: React.FC<PuntosRecogidaTableProps> = ({ 
  puntosRecogida,
  contenedores = [],
  onNavigateToContenedor,
  onNavigateToPropietario,
  selectedPuntoId = null,
  shouldHighlight = false,
  onHighlightComplete
}) => {
  const [ordenPor, setOrdenPor] = useState<string>('direccion');
  const [direccionOrden, setDireccionOrden] = useState<'asc' | 'desc'>('asc');
  const [highlightActive, setHighlightActive] = useState<boolean>(false);
  const selectedRowRef = useRef<HTMLTableRowElement>(null);
  
  // Efecto para gestionar el desplazamiento y el resaltado
  useEffect(() => {
    // Si debemos resaltar y tenemos un ID seleccionado, activar
    if (shouldHighlight && selectedPuntoId && !highlightActive) {
      setHighlightActive(true);
      
      // Si hay un punto seleccionado, scroll hasta él
      if (selectedRowRef.current) {
        selectedRowRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [shouldHighlight, selectedPuntoId, highlightActive]);

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
  
  // Mapeo de códigos de horario a texto descriptivo
  const mapearHorario = (horario: string): string => {
    switch (horario) {
      case 'M': return 'Mañana';
      case 'T': return 'Tarde';
      case 'N': return 'Noche';
      default: return horario;
    }
  };

  // Función para obtener contenedores asociados a un punto de recogida
  const getContenedoresPorPunto = (puntoId: number) => {
    // Verificar que puntoId sea un número válido
    if (!puntoId) return 'Sin contenedores';
    
    // Filtrar contenedores para este punto - maneja ambos casos de estructura de datos
    const contenedoresFiltrados = contenedores.filter(c => {
      if (!c.puntoRecogida) return false;
      
      // Caso 1: puntoRecogida es un objeto con id
      if (typeof c.puntoRecogida === 'object' && c.puntoRecogida.id) {
        return c.puntoRecogida.id === puntoId;
      }
      
      // Caso 2: puntoRecogida es directamente el ID
      if (typeof c.puntoRecogida === 'number') {
        return c.puntoRecogida === puntoId;
      }
      
      return false;
    });
    
    // Si no hay contenedores, devolver mensaje
    if (contenedoresFiltrados.length === 0) return 'Sin contenedores';
    
    // Formatear resultado - solo mostrando el ID
    return contenedoresFiltrados
      .map(c => `${c.id}`)
      .join(', ');
  };

  // Función para generar un código de barras SVG mejorado
  const renderBarcode = (id: string, isSingle: boolean = false) => {
    // Usamos un código simple similar a CODE39 para visualización
    // Configuración para un código de barras más visible
    const height = isSingle ? 36 : 24; // Mayor altura si es único
    const width = isSingle ? 3 : 2;    // Mayor ancho si es único
    const gap = 1;
    const totalWidth = id.length * (width + gap) * 3;
    
    // Generamos barras basadas en el ID
    const bars = [];
    let position = 0;
    
    for (let i = 0; i < id.length; i++) {
      const digit = parseInt(id[i], 10);
      // Para cada dígito creamos un patrón de barras único
      for (let j = 0; j < 3; j++) {
        // Variamos el ancho de la barra en función del dígito
        const barWidth = ((digit + j) % 3) + 1;
        bars.push(
          <rect 
            key={`${i}-${j}`} 
            x={position} 
            y="0" 
            width={barWidth * width / 2} 
            height={height}
            fill="black"
          />
        );
        position += barWidth * width / 2 + gap;
      }
    }
    
    return (
      <svg 
        width={totalWidth} 
        height={height} 
        viewBox={`0 0 ${totalWidth} ${height}`} 
        className={`inline-block align-middle ${isSingle ? 'w-full max-w-[140px]' : 'w-full max-w-[100px]'}`}
      >
        {bars}
      </svg>
    );
  };

  // Reordenar los puntos para poner primero el seleccionado
  const getPuntosOrdenados = () => {
    // Función para ordenar puntos según criterio
    const ordenarPuntos = (puntos) => {
      return [...puntos].sort((a, b) => {
        let valA, valB;

        switch (ordenPor) {
          case 'localidad':
            valA = a.localidad?.toLowerCase() || '';
            valB = b.localidad?.toLowerCase() || '';
            break;
          case 'cp':
            valA = a.cp || '';
            valB = b.cp || '';
            break;
          case 'provincia':
            valA = a.provincia?.toLowerCase() || '';
            valB = b.provincia?.toLowerCase() || '';
            break;
          case 'horario':
            valA = a.horario || '';
            valB = b.horario || '';
            break;
          case 'tipo':
            valA = a.tipo?.toLowerCase() || '';
            valB = b.tipo?.toLowerCase() || '';
            break;
          case 'propietario':
            valA = a.propietario?.nombre?.toLowerCase() || '';
            valB = b.propietario?.nombre?.toLowerCase() || '';
            break;
          case 'direccion':
          default:
            valA = a.direccion?.toLowerCase() || '';
            valB = b.direccion?.toLowerCase() || '';
            break;
        }

        // Comparar valores
        if (valA < valB) return direccionOrden === 'asc' ? -1 : 1;
        if (valA > valB) return direccionOrden === 'asc' ? 1 : -1;
        return 0;
      });
    };

    // Si hay un punto seleccionado, lo movemos al principio
    if (selectedPuntoId) {
      const selectedPunto = puntosRecogida.find(p => p.id === selectedPuntoId);
      const restPuntos = puntosRecogida.filter(p => p.id !== selectedPuntoId);
      
      const sortedRestPuntos = ordenarPuntos(restPuntos);
      
      return selectedPunto ? [selectedPunto, ...sortedRestPuntos] : ordenarPuntos(puntosRecogida);
    }

    return ordenarPuntos(puntosRecogida);
  };

  const puntosOrdenados = getPuntosOrdenados();

  // Función para cambiar el orden
  const cambiarOrden = (campo: string) => {
    if (ordenPor === campo) {
      setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenPor(campo);
      setDireccionOrden('asc');
    }
  };

  // Manejar clic en el contenedor
  const handleContenedorClick = (contenedorId: number) => {
    if (onNavigateToContenedor) {
      onNavigateToContenedor(contenedorId);
    } else {
      // Fallback si no se proporciona la función de navegación
      window.location.href = `/contenedores?id=${contenedorId}`;
    }
  };

  // Manejar clic en el propietario
  const handlePropietarioClick = (event, dni: string) => {
    event.stopPropagation(); // Evitar que se propague el clic
    if (onNavigateToPropietario) {
      onNavigateToPropietario(dni);
    } else {
      // Fallback si no se proporciona la función de navegación
      window.location.href = `/propietarios?dni=${dni}`;
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('direccion')}
              >
                Dirección
                {ordenPor === 'direccion' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('localidad')}
              >
                Localidad
                {ordenPor === 'localidad' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('cp')}
              >
                CP
                {ordenPor === 'cp' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('tipo')}
              >
                Fuente
                {ordenPor === 'tipo' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('horario')}
              >
                Horario
                {ordenPor === 'horario' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                onClick={() => cambiarOrden('propietario')}
              >
                Propietario
                {ordenPor === 'propietario' && (
                  <span className="ml-1">
                    {direccionOrden === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                Contenedores
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {puntosOrdenados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-sm text-center text-gray-500">
                  No se encontraron puntos de recogida
                </td>
              </tr>
            ) : (
              puntosOrdenados.map((punto) => {
                // Filtrar contenedores para este punto
                const contenedoresPunto = contenedores.filter(c => {
                  if (!c.puntoRecogida) return false;
                  if (typeof c.puntoRecogida === 'object' && c.puntoRecogida.id) {
                    return c.puntoRecogida.id === punto.id;
                  }
                  if (typeof c.puntoRecogida === 'number') {
                    return c.puntoRecogida === punto.id;
                  }
                  return false;
                });
                
                // Verificar si solo hay un contenedor para este punto
                const tieneSoloUnContenedor = contenedoresPunto.length === 1;
                
                // Verificar si este punto está seleccionado
                const isSelected = selectedPuntoId === punto.id;

                return (
                  <tr 
                    key={punto.id} 
                    ref={isSelected ? selectedRowRef : null}
                    className={`transition-all duration-300 ${
                      isSelected && highlightActive
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                      {isSelected && highlightActive ? (
                        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded">
                          {punto.direccion}
                        </span>
                      ) : (
                        punto.direccion
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {punto.localidad}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {punto.cp}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {punto.tipo}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {mapearHorario(punto.horario)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {punto.propietario?.dni ? (
                        <button
                          onClick={(e) => handlePropietarioClick(e, punto.propietario.dni)}
                          className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                          title="Ver detalles del propietario"
                        >
                          {punto.propietario.nombre}
                        </button>
                      ) : (
                        'Sin propietario'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500">
                      {contenedoresPunto.length === 0 ? (
                        'Sin contenedores'
                      ) : tieneSoloUnContenedor ? (
                        // Si solo hay un contenedor, mostrarlo más grande
                        <button
                          onClick={() => handleContenedorClick(contenedoresPunto[0].id)}
                          className="flex flex-col items-center px-2 py-2 mx-auto transition-all duration-300 rounded group hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          title={`Ver detalles del contenedor ${contenedoresPunto[0].id}`}
                          style={{ minWidth: '120px' }}
                        >
                          <span className="text-sm font-medium text-gray-700">ID:{contenedoresPunto[0].id}</span>
                          <div className="mt-2 transition-transform duration-300 group-hover:scale-110">
                            {renderBarcode(contenedoresPunto[0].id.toString(), true)}
                          </div>
                        </button>
                      ) : (
                        // Si hay múltiples contenedores, mostrarlos en fila
                        <div className="flex flex-wrap justify-center gap-3">
                          {contenedoresPunto.map(contenedor => (
                            <button
                              key={contenedor.id}
                              onClick={() => handleContenedorClick(contenedor.id)}
                              className="flex flex-col items-center px-2 py-1 transition-all duration-300 rounded group hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                              title={`Ver detalles del contenedor ${contenedor.id}`}
                            >
                              <span className="font-medium text-gray-700">ID:{contenedor.id}</span>
                              <div className="mt-1 transition-transform duration-300 group-hover:scale-110">
                                {renderBarcode(contenedor.id.toString(), false)}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
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

export default PuntosRecogidaTable;
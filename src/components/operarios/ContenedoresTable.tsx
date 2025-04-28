'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Contenedor, PuntoRecogida, TipoResiduo } from '@/types/types';
import JsBarcode from 'jsbarcode';

interface ContenedoresTableProps {
  contenedores: Contenedor[];
  puntosRecogida: PuntoRecogida[];
  tiposResiduo: TipoResiduo[];
  buscador?: string;
  selectedContenedorId?: number | null;
  shouldHighlight?: boolean;
  onHighlightComplete?: () => void;
  onPropietarioClick?: (dni: string) => void;
  onPuntoRecogidaClick?: (puntoId: number) => void;
}

const ContenedoresTable: React.FC<ContenedoresTableProps> = ({
  contenedores,
  puntosRecogida,
  tiposResiduo,
  buscador = '',
  selectedContenedorId = null,
  shouldHighlight = false,
  onHighlightComplete,
  onPropietarioClick,
  onPuntoRecogidaClick,
}) => {
  const [ordenPor, setOrdenPor] = useState<string>('capacidad');
  const [direccionOrden, setDireccionOrden] = useState<'desc' | 'asc'>('desc');
  const [filtroTipoResiduo, setFiltroTipoResiduo] = useState<number | null>(null);
  const [filtroUbicacion, setFiltroUbicacion] = useState<string>('');
  const [filtroPropietario, setFiltroPropietario] = useState<string>('');
  const [highlightActive, setHighlightActive] = useState<boolean>(false);
  const selectedRowRef = useRef<HTMLTableRowElement>(null);

  // Efecto para gestionar el desplazamiento y el resaltado
  useEffect(() => {
    // Si debemos resaltar y tenemos un ID seleccionado, activar
    if (shouldHighlight && selectedContenedorId && !highlightActive) {
      setHighlightActive(true);
      
      // Si hay un contenedor seleccionado, scroll hasta él
      if (selectedRowRef.current) {
        selectedRowRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [shouldHighlight, selectedContenedorId, highlightActive]);

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

  const obtenerPuntoRecogida = (idPuntoRecogida: number): PuntoRecogida | undefined => {
    return puntosRecogida.find(punto => punto.id === idPuntoRecogida);
  };

  // Componente interno para el código de barras
  const BarcodeComponent = ({ containerId }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    
    // Generar código de barras cuando el componente se monta
    React.useEffect(() => {
      if (containerId && svgRef.current) {
        try {
          JsBarcode(svgRef.current, containerId.toString(), {
            format: 'CODE128',
            width: 1.2,
            height: 30,
            displayValue: false,
            margin: 0
          });
        } catch (err) {
          console.error('Error generating barcode:', err);
        }
      }
    }, [containerId]);

    // Manejar impresión del código de barras
    const handlePrint = (event) => {
      // Evitar que el clic se propague y desactive el resaltado
      event.stopPropagation();
      
      const svgContent = svgRef.current?.outerHTML;
      if (!svgContent) return;
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Por favor, permite las ventanas emergentes para imprimir el código de barras.');
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Código de Barras - Contenedor ${containerId}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              svg {
                max-width: 100%;
                height: auto;
              }
              .id-container {
                margin-top: 10px;
                font-family: Arial, sans-serif;
                font-size: 16px;
              }
              @media print {
                @page {
                  size: auto;
                  margin: 10mm;
                }
              }
            </style>
          </head>
          <body>
            ${svgContent}
            <div class="id-container">ID: ${containerId}</div>
            <script>
              window.onload = function() {
                window.print();
                window.setTimeout(function() {
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    return (
      <div className="flex flex-col items-center cursor-pointer group" onClick={handlePrint} title="Clic para imprimir">
        <svg ref={svgRef} className="w-full max-w-[100px]"></svg>
        <div className="mt-1 text-xs text-gray-600">ID: {containerId}</div>
      </div>
    );
  };

  // Si tenemos un contenedor seleccionado, aseguramos que esté primero
  const getContenedoresOrdenados = () => {
    // Primero filtramos los contenedores según los criterios de filtro
    const contenedoresFiltrados = contenedores.filter(contenedor => {
      // Si hay un selectedContenedorId, aseguramos que ese contenedor siempre pase el filtro
      if (selectedContenedorId && contenedor.id === selectedContenedorId) {
        return true;
      }

      if (filtroTipoResiduo !== null && contenedor.tipoResiduo?.id !== filtroTipoResiduo) return false;

      const puntoRecogida = obtenerPuntoRecogida(
        contenedor.puntoRecogida?.id || contenedor.idPuntoRecogida
      );
      if (!puntoRecogida) return false;

      if (filtroUbicacion) {
        const termino = filtroUbicacion.toLowerCase();
        if (
          !puntoRecogida.direccion.toLowerCase().includes(termino) &&
          !puntoRecogida.localidad.toLowerCase().includes(termino)
        ) return false;
      }

      if (filtroPropietario) {
        const termino = filtroPropietario.toLowerCase();
        if (!puntoRecogida.propietario?.nombre.toLowerCase().includes(termino)) return false;
      }

      if (buscador) {
        const termino = buscador.toLowerCase();
        return (
          String(contenedor.id).includes(termino) ||
          puntoRecogida.direccion.toLowerCase().includes(termino) ||
          puntoRecogida.localidad.toLowerCase().includes(termino) ||
          puntoRecogida.propietario?.dni?.includes(termino) ||
          puntoRecogida.propietario?.nombre.toLowerCase().includes(termino) ||
          contenedor.capacidad.toString().includes(termino) ||
          contenedor.tipoResiduo?.descripcion.toLowerCase().includes(termino) ||
          (contenedor.frecuencia && contenedor.frecuencia.toLowerCase().includes(termino))
        );
      }

      return true;
    });

    // Si tenemos un contenedor seleccionado, lo movemos al principio
    if (selectedContenedorId) {
      // Dividimos los contenedores en dos grupos: el seleccionado y el resto
      const selectedContenedor = contenedoresFiltrados.find(c => c.id === selectedContenedorId);
      const restContenedores = contenedoresFiltrados.filter(c => c.id !== selectedContenedorId);
      
      // Ordenamos el resto según el criterio normal
      const sortedRestContenedores = sortContenedores(restContenedores);

      // Combinamos: primero el seleccionado, luego el resto ordenado
      return selectedContenedor ? [selectedContenedor, ...sortedRestContenedores] : sortedRestContenedores;
    } else {
      // Si no hay contenedor seleccionado, ordenamos normalmente
      return sortContenedores(contenedoresFiltrados);
    }
  };

  // Función auxiliar para ordenar contenedores según criterios
  const sortContenedores = (contenedoresToSort) => {
    return [...contenedoresToSort].sort((a, b) => {
      let valA, valB;

      switch (ordenPor) {
        case 'id':
          valA = a.id;
          valB = b.id;
          break;
        case 'tipoResiduo':
          valA = a.tipoResiduo?.descripcion.toLowerCase() || '';
          valB = b.tipoResiduo?.descripcion.toLowerCase() || '';
          break;
        case 'frecuencia':
          valA = a.frecuencia ? a.frecuencia.toLowerCase() : '';
          valB = b.frecuencia ? b.frecuencia.toLowerCase() : '';
          break;
        case 'direccion':
          valA = obtenerPuntoRecogida(a.puntoRecogida?.id || a.idPuntoRecogida)?.direccion.toLowerCase() || '';
          valB = obtenerPuntoRecogida(b.puntoRecogida?.id || b.idPuntoRecogida)?.direccion.toLowerCase() || '';
          break;
        case 'propietario':
          valA = obtenerPuntoRecogida(a.puntoRecogida?.id || a.idPuntoRecogida)?.propietario?.nombre.toLowerCase() || '';
          valB = obtenerPuntoRecogida(b.puntoRecogida?.id || b.idPuntoRecogida)?.propietario?.nombre.toLowerCase() || '';
          break;
        case 'capacidad':
        default:
          valA = a.capacidad;
          valB = b.capacidad;
          break;
      }

      if (valA < valB) return direccionOrden === 'asc' ? -1 : 1;
      if (valA > valB) return direccionOrden === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const contenedoresOrdenados = getContenedoresOrdenados();

  const cambiarOrden = (campo: string) => {
    if (ordenPor === campo) {
      setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenPor(campo);
      setDireccionOrden('asc');
    }
  };

  // Manejar clic en el propietario
  const handlePropietarioClick = (event, dni: string) => {
    event.stopPropagation(); // Evitar que se propague el clic
    if (onPropietarioClick) {
      onPropietarioClick(dni);
    }
  };

  // Manejar clic en la dirección (punto de recogida)
  const handlePuntoRecogidaClick = (event, puntoId: number) => {
    event.stopPropagation(); // Evitar que se propague el clic
    if (onPuntoRecogidaClick) {
      onPuntoRecogidaClick(puntoId);
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="flex flex-wrap gap-4 p-4 border-b border-gray-200 bg-gray-50">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Tipo de Residuo</label>
          <select
            className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={filtroTipoResiduo || ''}
            onChange={(e) => setFiltroTipoResiduo(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Todos</option>
            {tiposResiduo.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Ubicación</label>
          <input
            type="text"
            placeholder="Dirección o localidad"
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={filtroUbicacion}
            onChange={(e) => setFiltroUbicacion(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Propietario</label>
          <input
            type="text"
            placeholder="Nombre del propietario"
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={filtroPropietario}
            onChange={(e) => setFiltroPropietario(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-center divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { label: 'ID', key: 'id' },
                { label: 'CAPACIDAD', key: 'capacidad' },
                { label: 'TIPO RESIDUO', key: 'tipoResiduo' },
                { label: 'FRECUENCIA', key: 'frecuencia' },
                { label: 'UBICACIÓN', key: 'direccion' },
                { label: 'PROPIETARIO', key: 'propietario' },
                { label: 'CÓDIGO DE BARRAS', key: 'barcode' }
              ].map(({ label, key }) => (
                <th
                  key={key}
                  scope="col"
                  className={`px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase ${key !== 'barcode' ? 'cursor-pointer' : ''}`}
                  onClick={() => key !== 'barcode' && cambiarOrden(key)}
                >
                  {label}
                  {ordenPor === key && key !== 'barcode' && (
                    <span className="ml-1">{direccionOrden === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contenedoresOrdenados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-sm text-center text-gray-500">
                  No se encontraron contenedores
                </td>
              </tr>
            ) : (
              contenedoresOrdenados.map((contenedor) => {
                const punto = obtenerPuntoRecogida(contenedor.puntoRecogida?.id || contenedor.idPuntoRecogida);
                const isSelected = selectedContenedorId === contenedor.id;
                return (
                  <tr 
                    key={contenedor.id} 
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
                          {contenedor.id}
                        </span>
                      ) : (
                        contenedor.id
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap">
                      {contenedor.capacidad} L
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contenedor.tipoResiduo?.id === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contenedor.tipoResiduo?.descripcion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {contenedor.frecuencia || 'No especificada'}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {punto ? (
                        <>
                          <button
                            onClick={(e) => handlePuntoRecogidaClick(e, punto.id)}
                            className="hover:text-blue-600 hover:underline focus:outline-none"
                          >
                            <div>{punto.direccion}</div>
                            <div className="text-xs text-gray-400">{punto.localidad}, {punto.cp}</div>
                          </button>
                        </>
                      ) : 'Punto no encontrado'}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {punto?.propietario ? (
                        <>
                          <button
                            onClick={(e) => handlePropietarioClick(e, punto.propietario.dni)}
                            className="hover:text-blue-600 hover:underline focus:outline-none"
                          >
                            <div>{punto.propietario.nombre}</div>
                            <div className="text-xs text-gray-400">{punto.propietario.dni}</div>
                          </button>
                        </>
                      ) : 'Propietario no encontrado'}
                    </td>
                    <td className="flex flex-col items-center justify-center px-6 py-4">
                      <BarcodeComponent containerId={contenedor.id} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 text-sm text-gray-500 border-t border-gray-200 bg-gray-50">
        <p>{contenedoresOrdenados.length} contenedores encontrados</p>
      </div>
    </div>
  );
};

export default ContenedoresTable;
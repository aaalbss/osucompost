'use client';
import { PuntoRecogida } from '@/types/types';
import { MapPin, Clock, Building, Bookmark, Maximize, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import JsBarcode from 'jsbarcode';
import './dashboard-styles.css';

interface PickupPointsCardProps {
  puntosRecogida: PuntoRecogida[];
  contenedores?: {
    id: number;
    capacidad: number;
    frecuencia?: string;
    tipoResiduo: {
      id: number;
      descripcion: string;
    };
    puntoRecogida: {
      id: number;
      // otros campos...
    };
  }[];
}

const PickupPointsCard = ({ puntosRecogida, contenedores = [] }: PickupPointsCardProps) => {
  // Estado para almacenar los SVG como strings
  const [barcodeSvgs, setBarcodeSvgs] = useState<{[key: number]: string}>({});
  const [isLoading, setIsLoading] = useState<{[key: number]: boolean}>({});
  
  // Función para encontrar contenedores asociados a un punto de recogida
  const getContenedoresPorPunto = (puntoId: number) => {
    return contenedores.filter(
      contenedor => contenedor.puntoRecogida && contenedor.puntoRecogida.id === puntoId
    );
  };

  // Función para generar el SVG del código de barras como string
  const generateBarcodeSvg = (containerId: number) => {
    try {
      // Crear un elemento temporal para generar el código
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      
      // Generar código de barras en el elemento SVG
      JsBarcode(svgElement, containerId.toString(), {
        format: 'CODE128',
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 16,
        text: `Contenedor: ${containerId}`,
        margin: 10,
      });
      
      // Obtener el HTML del SVG como string
      const svgString = svgElement.outerHTML;
      
      // Almacenar en el estado
      setBarcodeSvgs(prev => ({
        ...prev,
        [containerId]: svgString
      }));
      
      // Marcar como cargado
      setIsLoading(prev => ({
        ...prev,
        [containerId]: false
      }));
      
      return svgString;
    } catch (error) {
      console.error(`Error al generar el código de barras para el contenedor ${containerId}:`, error);
      setIsLoading(prev => ({
        ...prev,
        [containerId]: false
      }));
      return null;
    }
  };

  // Efecto para generar los códigos de barras al cargar el componente
  useEffect(() => {
    // Marcar todos los contenedores como "cargando"
    const initialLoadingState: {[key: number]: boolean} = {};
    contenedores.forEach(contenedor => {
      initialLoadingState[contenedor.id] = true;
    });
    setIsLoading(initialLoadingState);
    
    // Generar los códigos de barras con un pequeño retraso para evitar bloqueo de UI
    const timeoutId = setTimeout(() => {
      contenedores.forEach(contenedor => {
        if (!barcodeSvgs[contenedor.id]) {
          generateBarcodeSvg(contenedor.id);
        }
      });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [contenedores]);

  // Función para imprimir el código de barras
  const handlePrintBarcode = (contenedorId: number) => {
    try {
      // Generar un nuevo SVG para impresión (con dimensiones diferentes)
      const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      
      JsBarcode(tempSvg, contenedorId.toString(), {
        format: 'CODE128',
        width: 2.5,
        height: 100,
        displayValue: true,
        fontSize: 18,
        text: `Contenedor: ${contenedorId}`,
        margin: 10,
      });
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Por favor, permite las ventanas emergentes para imprimir el código de barras.');
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Código de Barras - Contenedor ${contenedorId}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .barcode-container {
                border: 1px solid #ccc;
                padding: 20px;
                border-radius: 5px;
                background: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .info {
                margin-top: 20px;
                text-align: center;
              }
              svg {
                max-width: 100%;
                height: auto;
              }
              @media print {
                @page {
                  size: auto;
                  margin: 10mm;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              ${tempSvg.outerHTML}
            </div>
            <div class="info">
              <p><strong>ID Contenedor:</strong> ${contenedorId}</p>
              <button class="no-print" onclick="window.print()">Imprimir</button>
              <button class="no-print" onclick="window.close()">Cerrar</button>
            </div>
            <script>
              window.onload = function() {
                // Imprimir automáticamente
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Error generando código de barras para impresión:', error);
      alert('Error al generar el código de barras para impresión.');
    }
  };

  return (
    <div className="dashboard-card card-purple animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="card-header">
        <h2 className="card-title">
          <MapPin size={24} />
          Puntos de Recogida
        </h2>
      </div>
      <div className="card-body">
        {puntosRecogida.length > 0 ? (
          <div className="space-y-6">
            {puntosRecogida.map((punto, index) => {
              const contenedoresPunto = getContenedoresPorPunto(punto.id);
              
              return (
                <div 
                  key={punto.id} 
                  className="p-4 transition-all duration-300 border border-purple-100 rounded-lg bg-purple-50 hover:bg-purple-100"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Building size={18} className="text-purple-500" />
                      <div>
                        <p className="text-xs font-medium text-purple-700">Localidad</p>
                        <p className="font-medium">{punto.localidad}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bookmark size={18} className="text-purple-500" />
                      <div>
                        <p className="text-xs font-medium text-purple-700">Tipo</p>
                        <p className="font-medium">
                          <span className="badge badge-purple">{punto.tipo}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center col-span-2 gap-2">
                      <MapPin size={18} className="text-purple-500" />
                      <div>
                        <p className="text-xs font-medium text-purple-700">Dirección</p>
                        <p className="font-medium">{punto.direccion}</p>
                      </div>
                    </div>
                    <div className="flex items-center col-span-2 gap-2">
                      <Clock size={18} className="text-purple-500" />
                      <div>
                        <p className="text-xs font-medium text-purple-700">Horario</p>
                        <p className="font-medium">{punto.horario || "No especificado"}</p>
                      </div>
                    </div>
                  </div>
                   
                  {/* Sección de contenedores y códigos de barras */}
                  {contenedoresPunto.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-purple-200">
                      <p className="mb-4 text-sm font-medium text-purple-800">
                        Contenedores asociados: {contenedoresPunto.length}
                      </p>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {contenedoresPunto.map(contenedor => (
                          <div 
                            key={contenedor.id}
                            className="p-4 bg-white border border-purple-200 rounded-md shadow-sm"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-medium text-purple-700">ID: {contenedor.id}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="badge badge-purple">{contenedor.tipoResiduo.descripcion}</span>
                                  <span className="badge badge-outline-purple">{contenedor.capacidad} L</span>
                                  {contenedor.frecuencia && (
                                    <span className="flex items-center gap-1 badge badge-outline-purple">
                                      <Calendar size={14} />
                                      Recogida: {contenedor.frecuencia}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button 
                                onClick={() => handlePrintBarcode(contenedor.id)}
                                className="p-2 text-purple-600 rounded-md bg-purple-50 hover:bg-purple-100 hover:text-purple-800"
                                title="Imprimir código de barras"
                              >
                                <Maximize size={18} />
                              </button>
                            </div>
                            
                            {/* Contenedor del código de barras con renderizado seguro */}
                            <div 
                              className="p-4 mt-2 text-center bg-white border rounded-md barcode-container min-h-[100px] flex items-center justify-center"
                            >
                              {isLoading[contenedor.id] ? (
                                <div className="text-purple-400">
                                  Generando código de barras...
                                </div>
                              ) : barcodeSvgs[contenedor.id] ? (
                                <div dangerouslySetInnerHTML={{ __html: barcodeSvgs[contenedor.id] }} />
                              ) : (
                                <div className="text-purple-500">
                                  Error al generar el código de barras
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <MapPin size={48} className="mb-4 text-purple-300" />
            <p className="text-purple-600">No hay puntos de recogida registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupPointsCard;
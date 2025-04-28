'use client';

import React from 'react';
import { Users, MapPin, Package } from 'lucide-react';
import { Propietario, PuntoRecogida, Contenedor } from '@/types/types';

interface DashboardProps {
  propietarios: Propietario[];
  puntosRecogida: PuntoRecogida[];
  contenedores: Contenedor[];
  setVista: (vista: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  propietarios,
  puntosRecogida,
  contenedores,
  setVista
}) => {
  // Contadores
  const propietariosCount = propietarios.length;
  const puntosRecogidaCount = puntosRecogida.length;
  const contenedoresCount = contenedores.length;
  
  // Contar contenedores por tipo
  const contenedoresPorTipo = contenedores.reduce((acc, contenedor) => {
    const tipoId = contenedor.tipoResiduoId;
    acc[tipoId] = (acc[tipoId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  // Obtener contadores específicos (asumiendo que el ID 1 es Orgánico y el ID 2 es Estructurante)
  const organicosCount = contenedoresPorTipo[1] || 0;
  const estructurantesCount = contenedoresPorTipo[2] || 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Tarjeta de Propietarios */}
          <div 
            onClick={() => setVista('propietarios')}
            className="p-8 transition-all duration-300 border shadow-sm cursor-pointer bg-white/90 backdrop-blur-sm border-blue-100/30 rounded-xl hover:shadow-md hover:bg-white/95 group"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 mr-4 text-blue-400 rounded-full bg-blue-50/70">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-gray-600">Propietarios</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-6xl font-light text-blue-400 group-hover:text-blue-500">
                {propietariosCount}
              </span>
              <span className="ml-2 text-lg text-gray-400">clientes</span>
            </div>
            
            <p className="mb-5 text-base text-gray-500">Clientes registrados en el sistema</p>
            
            <div className="text-right">
              <span className="text-base text-blue-400 transition-colors group-hover:text-blue-500">
                Ver detalles →
              </span>
            </div>
          </div>

          {/* Tarjeta de Puntos de Recogida */}
          <div 
            onClick={() => setVista('puntosRecogida')}
            className="p-8 transition-all duration-300 border shadow-sm cursor-pointer bg-white/90 backdrop-blur-sm border-green-100/30 rounded-xl hover:shadow-md hover:bg-white/95 group"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 mr-4 text-green-400 rounded-full bg-green-50/70">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-gray-600">Puntos de Recogida</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-6xl font-light text-green-400 group-hover:text-green-500">
                {puntosRecogidaCount}
              </span>
              <span className="ml-2 text-lg text-gray-400">ubicaciones</span>
            </div>
            
            <p className="mb-5 text-base text-gray-500">Ubicaciones para recogida de residuos</p>
            
            <div className="text-right">
              <span className="text-base text-green-400 transition-colors group-hover:text-green-500">
                Ver detalles →
              </span>
            </div>
          </div>

          {/* Tarjeta de Contenedores */}
          <div 
            onClick={() => setVista('contenedores')}
            className="p-8 transition-all duration-300 border shadow-sm cursor-pointer bg-white/90 backdrop-blur-sm border-amber-100/30 rounded-xl hover:shadow-md hover:bg-white/95 group"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 mr-4 rounded-full text-amber-400 bg-amber-50/70">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-gray-600">Contenedores</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-6xl font-light text-amber-400 group-hover:text-amber-500">
                {contenedoresCount}
              </span>
              <span className="ml-2 text-lg text-gray-400">unidades</span>
            </div>
            
            <div className="mb-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="inline-block w-3.5 h-3.5 mr-2 bg-green-300 rounded-full"></span>
                  <span className="text-base text-gray-500">Orgánicos</span>
                </div>
                <span className="text-base text-gray-600">{organicosCount}</span>
              </div>
              
              <div className="w-full h-2.5 overflow-hidden bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-green-300" 
                  style={{ width: contenedoresCount ? `${(organicosCount / contenedoresCount) * 100}%` : '0%' }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <span className="inline-block w-3.5 h-3.5 mr-2 bg-amber-300 rounded-full"></span>
                  <span className="text-base text-gray-500">Estructurantes</span>
                </div>
                <span className="text-base text-gray-600">{estructurantesCount}</span>
              </div>
              
              <div className="w-full h-2.5 overflow-hidden bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-amber-300" 
                  style={{ width: contenedoresCount ? `${(estructurantesCount / contenedoresCount) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-base transition-colors text-amber-400 group-hover:text-amber-500">
                Ver detalles →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
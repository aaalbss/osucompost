// PuntosRecogidaList.tsx
import React from 'react';
import { Layers } from 'lucide-react';
import { PuntoRecogida } from './tipos';
import { COLORS } from './constantes';

export const PuntosRecogidaList: React.FC<{ puntoRecogida: PuntoRecogida[] }> = ({ puntoRecogida }) => {
  return (
    <div className="dashboard-card bg-white shadow-md rounded-lg p-6 lg:col-span-3">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Layers className="mr-2 text-indigo-500" />
        Distribución de Puntos de Recogida
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {puntoRecogida.map((punto, index) => (
          <div 
            key={punto.id} 
            className="bg-gray-100 p-4 rounded-lg flex items-center space-x-4"
          >
            <span 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <div>
              <p className="font-semibold text-gray-800">{punto.localidad}</p>
              <p className="text-sm text-gray-600">
                {punto.direccion} | CP: {punto.cp}
              </p>
              <p className="text-xs text-gray-500">{punto.tipo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
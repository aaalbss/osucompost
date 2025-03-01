'use client';

import React from 'react';
import { TipoContenedorSelectProps } from './types';
import { OPCIONES_TIPO_CONTENEDOR } from './constants';
import { CheckCircle } from 'lucide-react';

const TipoContenedorSelect: React.FC<TipoContenedorSelectProps> = ({ tipoContenedor, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block font-medium text-gray-700">Tipo de Contenedor a Recoger:</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPCIONES_TIPO_CONTENEDOR.map(option => (
          <div 
            key={option.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all duration-200
              ${tipoContenedor === option.id 
                ? 'border-green-500 bg-green-50 shadow-sm' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
            `}
            onClick={() => onChange(option.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{option.label}</h3>
              </div>
              {tipoContenedor === option.id && (
                <CheckCircle className="text-green-500" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Seleccione el tipo de contenedor que necesita para esta recogida.
      </p>
    </div>
  );
};

export default TipoContenedorSelect;
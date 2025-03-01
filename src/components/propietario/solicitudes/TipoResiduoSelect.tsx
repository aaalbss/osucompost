'use client';

import React from 'react';
import { Trash2, Recycle } from 'lucide-react';

interface TipoResiduoSelectProps {
  tipoResiduo: string;
  onChange: (value: string) => void;
}

// Opciones disponibles para tipo de residuo
const OPCIONES_TIPO_RESIDUO = [
  {
    id: 'Organico',
    label: 'Orgánico',
    description: 'Restos de comida, productos vegetales, etc.',
    icon: <Trash2 className="w-5 h-5 text-green-600" />
  },
  {
    id: 'NoOrganico',
    label: 'No Orgánico',
    description: 'Papel, cartón, plástico, vidrio, etc.',
    icon: <Recycle className="w-5 h-5 text-blue-600" />
  }
];

const TipoResiduoSelect: React.FC<TipoResiduoSelectProps> = ({ tipoResiduo, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block font-medium text-gray-700">Tipo de Residuo a Recoger:</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPCIONES_TIPO_RESIDUO.map(option => (
          <div 
            key={option.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all duration-200
              ${tipoResiduo === option.id 
                ? 'border-green-500 bg-green-50 shadow-sm' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
            `}
            onClick={() => onChange(option.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {option.icon}
              </div>
              <div>
                <h3 className="font-medium">
                  {option.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Seleccione el tipo de residuo que desea que se recoja.
      </p>
    </div>
  );
};

export default TipoResiduoSelect;
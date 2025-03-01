'use client';

import React from 'react';
import { HorarioSelectProps } from './types';
import { OPCIONES_HORARIO } from './constants';

const HorarioSelect: React.FC<HorarioSelectProps> = ({ horario, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block font-medium text-gray-700">Horario de Preferencia:</label>
      <div className="space-y-2">
        {OPCIONES_HORARIO.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <input 
              type="radio" 
              id={option.id} 
              name="horario" 
              value={option.id}
              checked={horario === option.id}
              onChange={() => onChange(option.id)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label htmlFor={option.id} className="text-sm text-gray-700">{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorarioSelect;
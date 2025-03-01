'use client';

import React from 'react';
import { DNIInputProps } from './types';

const DniInput: React.FC<DNIInputProps> = ({ dni, setDni, dniError }) => {
  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">DNI:</label>
      <input
        type="text"
        value={dni}
        onChange={(e) => setDni(e.target.value.toUpperCase())}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        placeholder="Introduzca su DNI (ej: 12345678A)"
        maxLength={9}
      />
      {dniError && (
        <p className="text-sm text-red-600">{dniError}</p>
      )}
    </div>
  );
};

export default DniInput;
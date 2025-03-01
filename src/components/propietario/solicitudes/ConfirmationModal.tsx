'use client';

import React from 'react';

interface ConfirmationModalProps {
  originalValue: string;
  newValue: string;
  labelKey: 'fuenteResiduo' | 'tipoContenedor' | 'horario';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  originalValue, 
  newValue, 
  labelKey, 
  onConfirm, 
  onCancel 
}) => {
  // Mapeo de claves a nombres más amigables
  const fieldLabels: Record<string, string> = {
    fuenteResiduo: 'Tipo de Residuo',
    tipoContenedor: 'Tipo de Contenedor',
    horario: 'Horario de Recogida'
  };

  // Convertir valores a versiones más amigables para el usuario si es necesario
  const getFormattedValue = (value: string, field: string) => {
    if (field === 'horario') {
      if (value === 'manana') return 'Mañana (09:00 a 13:00)';
      if (value === 'tarde') return 'Tarde (17:00 a 20:00)';
      if (value === 'noche') return 'Noche (a partir de las 23:00)';
    }
    
    if (field === 'fuenteResiduo') {
      // Formatear nombres de fuentes de residuos
      if (value === 'Domesticos') return 'Domésticos';
      if (value === 'Supermercados') return 'Supermercados';
      if (value === 'Fruterias') return 'Fruterías';
      if (value === 'Comedores') return 'Comedores';
      if (value === 'SectorHORECA') return 'Sector HORECA';
      if (value === 'RestosPoda') return 'Restos de poda';
      if (value === 'RestosAgricolas') return 'Restos agrícolas';
    }
    
    return value;
  };

  const formattedOriginal = getFormattedValue(originalValue, labelKey);
  const formattedNew = getFormattedValue(newValue, labelKey);
  const fieldLabel = fieldLabels[labelKey] || labelKey;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Confirmar Cambio</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="mb-4 text-center">
          <p className="mb-2">Está cambiando su selección de {fieldLabel} de</p>
          <p className="font-bold mb-2">{formattedOriginal} a {formattedNew}</p>
          <p className="text-gray-500 text-sm">
            Este cambio puede afectar los detalles de su recogida de residuos y actualizará sus preferencias guardadas. ¿Está seguro de que desea continuar?
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Confirmar Cambio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
// src/components/modals/SuccessModal.tsx
'use client';

import React, { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose }) => {
  // Color corporativo - verde oscuro
  const corporateGreen = '#2f4f27';
  useEffect(() => {
    // Cerrar el modal automáticamente después de 10 segundos
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        <div style={{ backgroundColor: corporateGreen }} className="p-4">
          <h3 className="text-xl font-bold text-white">Operación Exitosa</h3>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div style={{ backgroundColor: `${corporateGreen}20` }} className="rounded-full p-4">
              <svg style={{ color: corporateGreen }} className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          
          <p className="text-gray-700 text-center mb-8 text-lg">{message}</p>
          
          <div className="flex justify-center">
            <button
              onClick={onClose}
              style={{ backgroundColor: corporateGreen }}
              className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-md"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
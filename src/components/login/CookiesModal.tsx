'use client';

import React, { useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';

interface CookiesModalProps {
  onClose: () => void;
}

const CookiesModal: React.FC<CookiesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-800">Información de Cookies</h2>
        </div>
        
        <div className="space-y-4 text-gray-700">
          <p>
            Utilizamos cookies para mejorar su experiencia de usuario y garantizar 
            un acceso seguro a nuestra plataforma.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h3 className="font-semibold text-green-800 mb-2">¿Qué cookies utilizamos?</h3>
            <ul className="list-disc list-inside text-sm text-green-700">
              <li>Cookies de autenticación</li>
              <li>Cookies de preferencias de usuario</li>
              <li>Cookies de seguridad</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-600">
            Al continuar, acepta el uso de cookies para mantener su sesión 
            y mejorar su experiencia en nuestra plataforma.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiesModal;
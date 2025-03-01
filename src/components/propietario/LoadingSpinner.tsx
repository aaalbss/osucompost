// components/propietario/LoadingSpinner.tsx

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Cargando..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-green-800 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
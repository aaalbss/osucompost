// components/propietario/ErrorDisplay.tsx

import React from 'react';

interface ErrorDisplayProps {
  message: string;
  retryAction?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, retryAction }) => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-white via-[#E8EFE2] to-white"></div>
      <div className="relative z-10 flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{message}</p>
          
          {retryAction && (
            <button 
              onClick={retryAction}
              className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900 transition-colors"
            >
              Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
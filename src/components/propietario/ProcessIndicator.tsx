// src/components/propietario/ProcessIndicator.tsx
'use client';

import React from 'react';

interface ProcessStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProcessIndicatorProps {
  steps: ProcessStep[];
  currentStep: number;
  progress: number; // 0-100
}

const ProcessIndicator: React.FC<ProcessIndicatorProps> = ({
  steps,
  currentStep,
  progress
}) => {
  return (
    <div className="w-full">
      {/* Barra de progreso general */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Pasos del proceso */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Indicador del estado del paso */}
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full mr-3
              ${step.status === 'completed' ? 'bg-green-500 text-white' : ''}
              ${step.status === 'processing' ? 'bg-blue-500 text-white animate-pulse' : ''}
              ${step.status === 'error' ? 'bg-red-500 text-white' : ''}
              ${step.status === 'pending' ? 'bg-gray-200 text-gray-500' : ''}
            `}>
              {step.status === 'completed' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : step.status === 'error' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : step.status === 'processing' ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            
            {/* Etiqueta del paso */}
            <div className={`
              text-sm
              ${step.status === 'completed' ? 'text-green-600 font-medium' : ''}
              ${step.status === 'processing' ? 'text-blue-600 font-medium' : ''}
              ${step.status === 'error' ? 'text-red-600 font-medium' : ''}
              ${step.status === 'pending' ? 'text-gray-500' : ''}
            `}>
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessIndicator;
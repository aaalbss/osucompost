'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import './stylesRegisterForm.css';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps = 3 }) => (
  <div className="step-indicator">
    <div className="step-line"></div>
    {[1, 2, 3].map((step) => (
      <div key={step} className="step-container">
        <div
          className={`step-circle ${
            currentStep >= step ? 'active' : 'inactive'
          }`}
        >
          {currentStep > step ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <span className="text-white">{step}</span>
          )}
        </div>
        <span className="step-text">
          {step === 1 ? 'Propietario' : 
           step === 2 ? 'Ubicación' : 
           'Residuos'}
        </span>
      </div>
    ))}
  </div>
);

StepIndicator.displayName = 'StepIndicator';
export default StepIndicator;
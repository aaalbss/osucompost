'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FormData, FormErrors } from '@/types/types';
import './stylesRegisterForm.css';

interface FormStep1Props {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FormStep1: React.FC<FormStep1Props> = ({ formData, errors, handleChange }) => {
  return (
    <div className="fade-in">
      <div className="form-grid">
        <div className="form-group">
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`form-input ${errors.nombre ? 'error' : ''}`}
            placeholder="Nombre completo"
            required
          />
          {errors.nombre && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              {errors.nombre}
            </div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            className={`form-input ${errors.dni ? 'error' : ''}`}
            placeholder="DNI/CIF (12345678A)"
            required
          />
          {errors.dni && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              {errors.dni}
            </div>
          )}
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={`form-input ${errors.telefono ? 'error' : ''}`}
            placeholder="Teléfono (9 dígitos)"
            required
          />
          {errors.telefono && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              {errors.telefono}
            </div>
          )}
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Correo electrónico"
            required
          />
          {errors.email && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              {errors.email}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

FormStep1.displayName = 'FormStep1';
export default FormStep1;
'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FormData, FormErrors } from '@/types/types';
import './stylesRegisterForm.css';

interface FormStep2Props {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FormStep2: React.FC<FormStep2Props> = ({ formData, errors, handleChange }) => (
  <div className="fade-in">
    <div className="form-grid">
      <div className="form-group">
        <input
          type="text"
          name="domicilio"
          value={formData.domicilio}
          onChange={handleChange}
          className={`form-input ${errors.domicilio ? 'error' : ''}`}
          placeholder="Dirección completa"
          required
        />
        {errors.domicilio && (
          <div className="error-message">
            <AlertCircle className="error-icon" />
            {errors.domicilio}
          </div>
        )}
      </div>
      <div className="form-row">
        <div className="form-group">
          <input
            type="text"
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
            className={`form-input ${errors.localidad ? 'error' : ''}`}
            placeholder="Localidad"
            required
          />
          {errors.localidad && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              {errors.localidad}
            </div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="cp"
            value={formData.cp}
            onChange={handleChange}
            className={`form-input ${errors.cp ? 'error' : ''}`}
            placeholder="Código Postal"
            required
          />
          {errors.cp && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              {errors.cp}
            </div>
          )}
        </div>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="provincia"
          value={formData.provincia}
          onChange={handleChange}
          className={`form-input ${errors.provincia ? 'error' : ''}`}
          placeholder="Provincia"
          required
        />
        {errors.provincia && (
          <div className="error-message">
            <AlertCircle className="error-icon" />
            {errors.provincia}
          </div>
        )}
      </div>
    </div>
  </div>
);

FormStep2.displayName = 'FormStep2';
export default FormStep2;
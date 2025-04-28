'use client';

import React from 'react';
import { FormData } from '@/types/types';
import './stylesRegisterForm.css';

interface FormStep3Props {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FormStep3: React.FC<FormStep3Props> = ({ formData, handleChange }) => {
  return (
    <div className="fade-in">
      <div className="form-grid">
        <div className="select-wrapper">
          <select
            name="tipoResiduo"
            value={formData.tipoResiduo}
            onChange={handleChange}
            className="form-select"
            tabIndex={0}
          >
            <option value="Organico">Orgánicos</option>
            <option value="Estructurante">Estructurantes</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select
            name="fuente"
            value={formData.fuente}
            onChange={handleChange}
            className="form-select"
            tabIndex={0}
          >
            <option value="Domestico">Domésticos</option>
            <option value="Supermercado">Supermercados</option>
            <option value="Frutería">Fruterías</option>
            <option value="Comedor">Comedores</option>
            <option value="HORECA">Sector HORECA</option>
            <option value="Poda">Restos de poda</option>
            <option value="Agricola">Restos agrícolas</option>
          </select>
        </div>

        <div className="form-row">
          <div className="select-wrapper">
            <select
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              className="form-select"
              tabIndex={0}
            >
              <option value="Cubo 16 L">Cubo 16 L</option>
              <option value="Cubo 160 L">Cubo 160 L</option>
              <option value="Contenedor 800 L">Contenedor 800 L</option>
              <option value="Contenedor 1200 L">Contenedor 1200 L</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select
              name="frecuencia"
              value={formData.frecuencia || "Diaria"}
              onChange={handleChange}
              className="form-select"
              aria-label="Seleccionar frecuencia de recogida"
              tabIndex={0}
            >
              <option value="Diaria">Diaria</option>
              <option value="3 por semana">3 por semana</option>
              <option value="1 por semana">1 por semana</option>
              <option value="Quincenal">Quincenal</option>
              <option value="Ocasional">Ocasional</option>
            </select>
          </div>
        </div>

        <div className="select-wrapper">
          <select
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            className="form-select"
            tabIndex={0}
          >
            <option value="manana">Mañana (9:00 a 13:00)</option>
            <option value="tarde">Tarde (17:00 a 20:00)</option>
            <option value="noche">Noche (a partir de las 23:00)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

FormStep3.displayName = 'FormStep3';
export default FormStep3;
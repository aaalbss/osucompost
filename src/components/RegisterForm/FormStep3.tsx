'use client';

import React from 'react';
import { FormData } from '@/types/types';
import './stylesRegisterForm.css';

interface FormStep3Props {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FormStep3: React.FC<FormStep3Props> = ({ formData, handleChange }) => (
  <div className="fade-in">
    <div className="form-grid">
      <select
        name="tipoResiduo"
        value={formData.tipoResiduo}
        onChange={handleChange}
        className="form-select"
      >
        <option value="Organico">Orgánicos</option>
        <option value="Estructurante">Estructurantes</option>
      </select>

      <select
        name="fuente"
        value={formData.fuente}
        onChange={handleChange}
        className="form-select"
      >
        <option value="Domestico">Domésticos</option>
        <option value="Supermercado">Supermercados</option>
        <option value="Frutería">Fruterías</option>
        <option value="Comedor">Comedores</option>
        <option value="HORECA">Sector HORECA</option>
        <option value="Poda">Restos de poda</option>
        <option value="Agricola">Restos agrícolas</option>
      </select>

      <div className="form-row">
        <select
          name="cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          className="form-select"
        >
          <option value="Cubo 16 L">Cubo 16 L</option>
          <option value="Cubo 160 L">Cubo 160 L</option>
          <option value="Contenedor 800 L">Contenedor 800 L</option>
          <option value="Contenedor 1200 L">Contenedor 1200 L</option>
        </select>

        <select
          name="frecuencia"
          value={formData.frecuencia}
          onChange={handleChange}
          className="form-select"
        >
          <option value="Diaria">Diaria</option>
          <option value="3 por semana">3 por semana</option>
          <option value="1 por semana">1 por semana</option>
          <option value="Quincenal">Quincenal</option>
          <option value="Ocasional">Ocasional</option>
        </select>
      </div>

      <select
        name="horario"
        value={formData.horario}
        onChange={handleChange}
        className="form-select"
      >
        <option value="Mañana">Mañana (9:00 a 13:00)</option>
        <option value="Tarde">Tarde (17:00 a 20:00)</option>
        <option value="Noche">Noche (a partir de las 23:00)</option>
      </select>
    </div>
  </div>
);

FormStep3.displayName = 'FormStep3';
export default FormStep3;
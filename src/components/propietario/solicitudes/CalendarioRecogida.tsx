'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const CalendarioRecogida: React.FC = () => {
  const [fechaRecogida, setFechaRecogida] = useState<Date | null>(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const generarDiasCalendario = () => {
    const hoy = new Date();
    const diasCalendario = [];
    
    // Generar días para los próximos 30 días
    for (let i = 0; i < 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      diasCalendario.push(fecha);
    }
    
    return diasCalendario;
  };
  
  const seleccionarFecha = (fecha: Date) => {
    setFechaRecogida(fecha);
    setMostrarCalendario(false);
  };

  const esHoy = (fecha: Date) => {
    const hoy = new Date();
    return fecha.getDate() === hoy.getDate() &&
           fecha.getMonth() === hoy.getMonth() &&
           fecha.getFullYear() === hoy.getFullYear();
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="relative">
        <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
          <AlertCircle className="mr-2 text-green-600" /> 
          Fecha de Recogida
        </h2>
        
        <button
          type="button"
          onClick={() => setMostrarCalendario(!mostrarCalendario)}
          className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-green-50 focus:outline-none"
        >
          {fechaRecogida ? formatDate(fechaRecogida) : 'Seleccione una fecha'}
        </button>
        
        {mostrarCalendario && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(dia => (
                <div key={dia} className="text-xs font-medium text-gray-500">{dia}</div>
              ))}
              
              {generarDiasCalendario().map((dia, index) => {
                const esMismaFecha = fechaRecogida && 
                  dia.getDate() === fechaRecogida.getDate() &&
                  dia.getMonth() === fechaRecogida.getMonth() &&
                  dia.getFullYear() === fechaRecogida.getFullYear();
                
                const esDomingo = dia.getDay() === 0;
                const esSabado = dia.getDay() === 6;
                const deshabilitado = esHoy(dia) || esDomingo || esSabado;
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => !deshabilitado && seleccionarFecha(dia)}
                    disabled={deshabilitado}
                    className={`
                      p-2 rounded-lg text-sm transition-colors
                      ${esMismaFecha ? 'bg-green-100 text-green-800 font-bold' : ''}
                      ${deshabilitado 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'hover:bg-green-50 text-gray-700 cursor-pointer'}
                    `}
                  >
                    {dia.getDate()}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              No se permiten recogidas el día actual, sábados y domingos
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioRecogida;
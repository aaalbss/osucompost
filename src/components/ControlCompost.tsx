"use client";

import React, { useState, useEffect } from "react";

// Definimos la interfaz para los datos reales
interface SensorData {
  humidity?: number;
  temperature?: number;
  isConnected: boolean;
}

const ControlCompost: React.FC = () => {
  // Estado para los datos de las 6 composteras
  const [compostData, setCompostData] = useState<SensorData[]>(
    Array(6).fill({ isConnected: false })
  );

  // NUEVO: Estado para configurar el delay de la petición (en milisegundos)
  const [fetchDelay, setFetchDelay] = useState<number>(5000);

  // Función para convertir el valor raw del sensor a porcentaje 
  const calculateHumidityPercentage = (rawValue: number): number => {
    // Valores de la tabla:
    // 0% -> 3222.6 | 27% -> 2326.4 | 50% -> 2113.8 | 81% -> 1302.6
    
    if (rawValue >= 3222.6) return 0; // Totalmente seco
    
    let percentage = 0;

    if (rawValue > 2326.4) {
      percentage = 0 + (27 - 0) * ((3222.6 - rawValue) / (3222.6 - 2326.4));
    } else if (rawValue > 2113.8) {
      percentage = 27 + (50 - 27) * ((2326.4 - rawValue) / (2326.4 - 2113.8));
    } else {
      percentage = 50 + (81 - 50) * ((2113.8 - rawValue) / (2113.8 - 1302.6));
    }

    return Math.min(100, Math.max(0, percentage));
  };

  // Fetch de los datos reales
  useEffect(() => {
    const fetchCompostData = async () => {
      const newData: SensorData[] = [];

      for (let i = 1; i <= 6; i++) {
        try {
          const response = await fetch(`https://mi-hkmuqdpa8-adlinares-projects.vercel.app/data/${i}`);
          
          if (!response.ok) throw new Error("Error en la petición");
          
          const data = await response.json();

          if (data && typeof data.humidity === 'number' && typeof data.temperature === 'number') {
            newData.push({
              humidity: data.humidity,
              temperature: data.temperature,
              isConnected: true,
            });
          } else {
            newData.push({ isConnected: false });
          }
        } catch (error) {
          newData.push({ isConnected: false });
        }
      }
      setCompostData(newData);
    };

    // Hacer la primera petición inmediatamente
    fetchCompostData();

    // NUEVO: Usamos la variable fetchDelay para el setInterval.
    // Si fetchDelay es válido (mayor a 0), configuramos el intervalo.
    if (fetchDelay > 0) {
      const interval = setInterval(fetchCompostData, fetchDelay);
      return () => clearInterval(interval);
    }
    
  }, [fetchDelay]); // NUEVO: Añadimos fetchDelay como dependencia para que se actualice al cambiar.

  const renderCompostera = (index: number, data: SensorData) => {
    if (!data.isConnected || data.humidity === undefined || data.temperature === undefined) {
      return (
        <div key={index} className="bg-red-50 border-2 border-red-500 rounded-lg shadow-xl p-6 max-w-sm mr-5 w-96 h-80 flex flex-col justify-center items-center text-center">
          <h4 className="text-xl font-bold text-red-800 mb-4">
            Compostera {index + 1}
          </h4>
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <p className="text-xl font-bold text-red-600">Compostera Desconectada</p>
          <p className="text-sm text-red-400 mt-2">Sin lectura de sensores</p>
        </div>
      );
    }

    const humedadPorcentaje = calculateHumidityPercentage(data.humidity);

    return (
      <div key={index} className="bg-white rounded-lg shadow-2xl p-6 max-w-sm mr-5 w-96 h-80">
        <h4 className="text-xl font-bold text-center text-green-800 mb-4">
          Compostera {index + 1}
        </h4>

        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700">Humedad</p>
          <p className="text-3xl font-bold text-blue-600">{humedadPorcentaje.toFixed(2)}%</p>
          <p className="text-xs text-gray-400">Lectura sensor: {data.humidity}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${humedadPorcentaje}%` }}
            ></div>
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700">Temperatura</p>
          <p className="text-3xl font-bold text-red-600">{data.temperature.toFixed(2)}°C</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(data.temperature / 50) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // NUEVO: Manejador para el cambio de delay
  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    // Evitamos números negativos o NaN
    if (!isNaN(value) && value >= 1000) {
      setFetchDelay(value);
    } else if (e.target.value === "") {
      setFetchDelay(0); // Pausaría las peticiones si se deja en blanco
    }
  };

  return (
    <div>
      <h3 className="text-3xl font-bold text-center text-green-800 mb-2 mt-6">
        Humedad y Temperatura en Tiempo Real
      </h3>

      {/* NUEVO: Controles de configuración */}
      <div className="flex justify-center items-center mb-6 space-x-3 bg-gray-100 p-3 rounded-lg mx-auto max-w-md shadow-sm">
        <label htmlFor="delayInput" className="font-semibold text-gray-700">
          Actualizar cada (ms):
        </label>
        <input
          id="delayInput"
          type="number"
          min="1000"
          step="1000"
          value={fetchDelay}
          onChange={handleDelayChange}
          className="border border-gray-300 rounded-md p-2 w-28 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <span className="text-sm text-gray-500">
          ({(fetchDelay / 1000).toFixed(1)} segundos)
        </span>
      </div>

      <div className="flex flex-row justify-center m-5">
        {renderCompostera(0, compostData[0])}
        {renderCompostera(1, compostData[1])}
      </div>

      <div className="flex flex-row justify-center m-5">
        {renderCompostera(2, compostData[2])}
        {renderCompostera(3, compostData[3])}
      </div>

      <div className="flex flex-row justify-center m-5">
        {renderCompostera(4, compostData[4])}
        {renderCompostera(5, compostData[5])}
      </div>
    </div>
  );
};

export default ControlCompost;
"use client";

import React, { useState, useEffect, useCallback } from "react";

const ControlCompost: React.FC = () => {
  const [humedad, setHumedad] = useState(0);
  const [temperatura, setTemperatura] = useState(0);
  const [simulatedData, setSimulatedData] = useState<number[][]>([]); // [humedad, temperatura] x 5

  const calcularHumedad = useCallback((valorSensor: number): number => {
    const puntos = [
      { valor: 2500, porcentaje: 0 },
      { valor: 1980, porcentaje: 20 },
      { valor: 1700, porcentaje: 50 },
      { valor: 950, porcentaje: 80 },
    ];

    puntos.sort((a, b) => b.valor - a.valor);

    for (let i = 0; i < puntos.length - 1; i++) {
      const x0 = puntos[i].valor;
      const y0 = puntos[i].porcentaje;
      const x1 = puntos[i + 1].valor;
      const y1 = puntos[i + 1].porcentaje;

      if (valorSensor <= x0 && valorSensor >= x1) {
        const porcentaje = y0 + ((valorSensor - x0) * (y1 - y0)) / (x1 - x0);
        return parseFloat(porcentaje.toFixed(2));
      }
    }

    if (valorSensor > puntos[0].valor) return 0;
    if (valorSensor < puntos[puntos.length - 1].valor) return 100;

    return 0;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://mi-23vzalcl1-adlinares-projects.vercel.app/data/1");
        const data = await res.json();

        const humedadCalculada = calcularHumedad(data.humidity);
        setHumedad(humedadCalculada);
        setTemperatura(parseFloat(data.temperature));
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [calcularHumedad]);

  // Simula valores para compostera 2 a 6 (solo en cliente)
  useEffect(() => {
    const generateInitialData = (): number[][] => {
      return Array.from({ length: 5 }, () => [
        parseFloat((Math.random() * (89 - 58) + 58).toFixed(2)),
        parseFloat((Math.random() * (27 - 22) + 22).toFixed(2)),
      ]);
    };

    setSimulatedData(generateInitialData());

    const interval = setInterval(() => {
      setSimulatedData((prevData) =>
        prevData.map(([hum, temp]) => [
          parseFloat(Math.min(89, Math.max(58, hum + (Math.random() - 0.5) * 0.1)).toFixed(2)),
          parseFloat(Math.min(27, Math.max(22, temp + (Math.random() - 0.5) * 0.05)).toFixed(2)),
        ])
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderCompostera = (index: number, humedadVal: number, temperaturaVal: number) => (
    <div key={index} className="bg-white rounded-lg shadow-2xl p-6 max-w-sm mr-5 w-96 h-80">
      <h4 className="text-xl font-bold text-center text-green-800 mb-4">
        Compostera {index + 1}
      </h4>

      <div className="mb-4">
        <p className="text-lg font-semibold text-gray-700">Humedad</p>
        <p className="text-3xl font-bold text-blue-600">{typeof humedadVal === 'number' ? humedadVal.toFixed(2) : "N/A"}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${humedadVal}%` }}
          ></div>
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold text-gray-700">Temperatura</p>
        <p className="text-3xl font-bold text-red-600">{typeof temperaturaVal === 'number' ? temperaturaVal.toFixed(2) : "N/A"}°C</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-red-600 h-2.5 rounded-full"
            style={{ width: `${(temperaturaVal / 50) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h3 className="text-2xl font-bold text-center text-green-800 mb-4">
        Humedad y Temperatura en Tiempo Real
      </h3>

      {/* Compostera 1 (real) */}
      <div className="flex flex-row justify-center m-5">
        {renderCompostera(0, humedad, temperatura)}
        {simulatedData[0] && renderCompostera(1, simulatedData[0][0], simulatedData[0][1])}
      </div>

      <div className="flex flex-row justify-center m-5">
        {simulatedData[1] && renderCompostera(2, simulatedData[1][0], simulatedData[1][1])}
        {simulatedData[2] && renderCompostera(3, simulatedData[2][0], simulatedData[2][1])}
      </div>

      <div className="flex flex-row justify-center m-5">
        {simulatedData[3] && renderCompostera(4, simulatedData[3][0], simulatedData[3][1])}
        {simulatedData[4] && renderCompostera(5, simulatedData[4][0], simulatedData[4][1])}
      </div>
    </div>
  );
};

export default ControlCompost;

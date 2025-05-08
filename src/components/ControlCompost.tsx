"use client";

import React, { useState, useEffect } from "react";

const ControlCompost: React.FC = () => {
  const [simulatedData, setSimulatedData] = useState<number[][]>([]); // [humedad, temperatura] x 6

  // Simula valores para compostera 1 a 6 (todas)
  useEffect(() => {
    const generateInitialData = (): number[][] => {
      return Array.from({ length: 6 }, () => [
        parseFloat((Math.random() * (89 - 58) + 58).toFixed(2)), // humedad
        parseFloat((Math.random() * (27 - 22) + 22).toFixed(2)), // temperatura
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
        <p className="text-3xl font-bold text-blue-600">{humedadVal.toFixed(2)}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${humedadVal}%` }}
          ></div>
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold text-gray-700">Temperatura</p>
        <p className="text-3xl font-bold text-red-600">{temperaturaVal.toFixed(2)}°C</p>
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
        Humedad y Temperatura en Tiempo Real (Simulado)
      </h3>

      <div className="flex flex-row justify-center m-5">
        {simulatedData[0] && renderCompostera(0, simulatedData[0][0], simulatedData[0][1])}
        {simulatedData[1] && renderCompostera(1, simulatedData[1][0], simulatedData[1][1])}
      </div>

      <div className="flex flex-row justify-center m-5">
        {simulatedData[2] && renderCompostera(2, simulatedData[2][0], simulatedData[2][1])}
        {simulatedData[3] && renderCompostera(3, simulatedData[3][0], simulatedData[3][1])}
      </div>

      <div className="flex flex-row justify-center m-5">
        {simulatedData[4] && renderCompostera(4, simulatedData[4][0], simulatedData[4][1])}
        {simulatedData[5] && renderCompostera(5, simulatedData[5][0], simulatedData[5][1])}
      </div>
    </div>
  );
};

export default ControlCompost;

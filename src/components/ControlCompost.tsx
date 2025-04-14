import React, { useState, useEffect, useCallback } from "react";

const ControlCompost: React.FC = () => {
  const [humedad, setHumedad] = useState(0);
  const [temperatura, setTemperatura] = useState(0);

  // Función para calcular la humedad
  const calcularHumedad = useCallback((valorSensor: number): number => {
    const puntos = [
      { valor: 2500, porcentaje: 0 },
      { valor: 1980, porcentaje: 20 },
      { valor: 1700, porcentaje: 50 },
      { valor: 950, porcentaje: 80 },
    ];

    // Ordenamos los puntos de mayor a menor valor
    puntos.sort((a, b) => b.valor - a.valor);

    // Interpolación lineal
    for (let i = 0; i < puntos.length - 1; i++) {
      const x0 = puntos[i].valor;
      const y0 = puntos[i].porcentaje;
      const x1 = puntos[i + 1].valor;
      const y1 = puntos[i + 1].porcentaje;

      if (valorSensor <= x0 && valorSensor >= x1) {
        const porcentaje = y0 + ((valorSensor - x0) * (y1 - y0)) / (x1 - x0);
        return parseFloat(porcentaje.toFixed(2)); // Redondear a 2 decimales
      }
    }

    // Fuera de rango
    if (valorSensor > puntos[0].valor) {
      return 0;
    } else if (valorSensor < puntos[puntos.length - 1].valor) {
      return 100;
    }

    return 0; // Si el valor del sensor es extraño o no encaja, devolvemos 0 como valor predeterminado
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://mi-23vzalcl1-adlinares-projects.vercel.app/data/1");
        const data = await res.json();

        // Calcular la humedad usando el valor recibido del sensor
        const humedadCalculada = calcularHumedad(data.humidity);
        setHumedad(humedadCalculada); // Establece la humedad calculada
        setTemperatura(data.temperature);
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    };

    fetchData(); // Llamada inicial a la API
    const interval = setInterval(fetchData, 5000); // Llamada cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [calcularHumedad]); // Dependencia de `calcularHumedad`

  return (
    <div>
      <h3 className="text-2xl font-bold text-center text-green-800 mb-4">
        Humedad y Temperatura en Tiempo Real
      </h3>

      <div className="flex flex-row justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm mr-5 w-96 h-80">
          <h4 className="text-xl font-bold text-center text-green-800 mb-4">
            Compostera 1
          </h4>

          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-700">Humedad</p>
            <p className="text-3xl font-bold text-blue-600">{humedad}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${humedad}%` }}
              ></div>
            </div>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700">Temperatura</p>
            <p className="text-3xl font-bold text-red-600">{temperatura}°C</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{ width: `${(temperatura / 50) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlCompost;

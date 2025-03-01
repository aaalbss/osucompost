import React from 'react';
import { Box } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Recogida } from './tipos';

export const RecogidasCapacidad: React.FC<{ recogidas: Recogida[] }> = ({ recogidas }) => {
  // Agrupar recogidas por capacidad del contenedor
  const recogidaPorCapacidad = recogidas.reduce((acc, recogida) => {
    const capacidad = recogida.contenedor.capacidad;
    const tipoResiduo = recogida.contenedor.tipoResiduo.descripcion;

    if (!acc[capacidad]) {
      acc[capacidad] = {
        capacidad,
        totalRecogidas: 0,
        tiposResiduos: {}
      };
    }

    acc[capacidad].totalRecogidas++;

    // Contar tipos de residuo por capacidad
    if (!acc[capacidad].tiposResiduos[tipoResiduo]) {
      acc[capacidad].tiposResiduos[tipoResiduo] = 0;
    }
    acc[capacidad].tiposResiduos[tipoResiduo]++;

    return acc;
  }, {} as Record<number, { 
    capacidad: number, 
    totalRecogidas: number,
    tiposResiduos: Record<string, number>
  }>);

  // Transformar datos para el gráfico
  const chartData = Object.values(recogidaPorCapacidad)
    .map(item => ({
      name: `${item.capacidad} L`,
      totalRecogidas: item.totalRecogidas,
      ...item.tiposResiduos
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  // Obtener tipos de residuo únicos
  const tiposResiduoUnicos = [
    ...new Set(
      Object.values(recogidaPorCapacidad).flatMap(
        (capacidad) => Object.keys(capacidad.tiposResiduos)
      )
    )
  ];

  // Definir colores para tipos de residuo (paleta verde)
  const colorMap: Record<string, string> = {};
  const colors = [
    '#2F855A', // verde oscuro
    '#38A169', // verde
    '#48BB78', // verde medio
    '#68D391', // verde claro
    '#9AE6B4'  // verde muy claro
  ];
  
  tiposResiduoUnicos.forEach((tipo, index) => {
    colorMap[tipo] = colors[index % colors.length];
  });

  return (
    <div className="dashboard-card bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-green-800">
        <Box className="mr-2 text-green-600" />
        Recogidas por Capacidad de Contenedor
      </h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="name" 
            angle={0} 
            textAnchor="middle" 
            interval={0}
            height={40}
            tick={{ fill: '#2F855A' }}
          />
          <YAxis 
            label={{ 
              value: 'Número de Recogidas', 
              angle: -90, 
              position: 'insideLeft',
              fill: '#2F855A'
            }}
            tick={{ fill: '#2F855A' }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-4 shadow-lg rounded-md border border-green-100">
                    <p className="font-bold text-green-800">{data.name}</p>
                    <p className="text-green-700">Total Recogidas: {data.totalRecogidas}</p>
                    {tiposResiduoUnicos.map((tipo) => (
                      data[tipo] && (
                        <div key={tipo} className="flex items-center mt-1">
                          <div 
                            className="w-3 h-3 rounded-sm mr-2" 
                            style={{ backgroundColor: colorMap[tipo] }}
                          />
                          <p className="text-green-700">
                            {tipo}: {data[tipo]} recogidas
                          </p>
                        </div>
                      )
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: 20,
              color: '#2F855A'  
            }}
          />
          
          {/* Barra de total de recogidas */}
          <Bar 
            dataKey="totalRecogidas" 
            fill="#38A169" 
            name="Total Recogidas" 
            radius={[4, 4, 0, 0]}
          />

          {/* Barras por tipo de residuo */}
          {tiposResiduoUnicos.map((tipo) => (
            <Bar 
              key={tipo}
              dataKey={tipo} 
              stackId="a"
              fill={colorMap[tipo]} 
              name={tipo}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      
      {/* Resumen detallado */}
      <div className="mt-6 bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-green-800">Resumen Detallado de Capacidades</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="font-medium text-green-700">Capacidades Únicas</p>
            <p className="text-gray-700">{chartData.map(item => item.name).join(', ')}</p>
          </div>
          <div>
            <p className="font-medium text-green-700">Total de Recogidas</p>
            <p className="text-gray-700">{chartData.reduce((sum, item) => sum + item.totalRecogidas, 0)}</p>
          </div>
          <div>
            <p className="font-medium text-green-700">Tipos de Residuo</p>
            <p className="text-gray-700">{tiposResiduoUnicos.join(', ')}</p>
          </div>
        </div>

        {/* Tabla detallada de capacidades */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-green-100">
                <th className="p-2 text-left text-green-800">Capacidad</th>
                <th className="p-2 text-right text-green-800">Total Recogidas</th>
                {tiposResiduoUnicos.map(tipo => (
                  <th key={tipo} className="p-2 text-right text-green-800">{tipo}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map(item => (
                <tr key={item.name} className="border-b border-green-100">
                  <td className="p-2 font-medium text-green-700">{item.name}</td>
                  <td className="p-2 text-right text-green-700">{item.totalRecogidas}</td>
                  {tiposResiduoUnicos.map(tipo => (
                    <td key={tipo} className="p-2 text-right text-green-700">
                      {item[tipo] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-green-100">
                <td className="p-2 font-medium text-green-800">Total</td>
                <td className="p-2 text-right font-medium text-green-800">
                  {chartData.reduce((sum, item) => sum + item.totalRecogidas, 0)}
                </td>
                {tiposResiduoUnicos.map(tipo => (
                  <td key={tipo} className="p-2 text-right font-medium text-green-800">
                    {chartData.reduce((sum, item) => sum + (item[tipo] || 0), 0)}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
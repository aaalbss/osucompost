// TiposResiduoChart.tsx
import React from 'react';
import { Archive } from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Recogida } from './tipos';
import { COLORS } from './constantes';

export const TiposResiduoChart: React.FC<{ recogidas: Recogida[] }> = ({ recogidas }) => {
  const tiposResiduoData = recogidas.reduce((acc, recogida) => {
    const tipo = recogida.contenedor.tipoResiduo.descripcion;
    acc[tipo] = (acc[tipo] || 0) + recogida.contenedor.capacidad;
    return acc;
  }, {} as Record<string, number>);

  const tiposResiduoChartData = Object.entries(tiposResiduoData).map(
    ([tipo, capacidad]) => ({ name: tipo, value: capacidad })
  );

  return (
    <div className="dashboard-card bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Archive className="mr-2 text-purple-500" />
        Tipos de Residuo
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={tiposResiduoChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {tiposResiduoChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
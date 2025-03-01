// HorariosChart.tsx
import React from 'react';
import { Clock } from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Recogida } from './tipos';
import { COLORS } from './constantes';

export const HorariosChart: React.FC<{ recogidas: Recogida[] }> = ({ recogidas }) => {
  const clasificacionPorHorarios = recogidas.reduce((acc, recogida) => {
    const fecha = new Date(recogida.fechaSolicitud);
    const hora = fecha.getHours();
    
    let periodo;
    if (hora >= 6 && hora < 12) {
      periodo = 'Mañana';
    } else if (hora >= 12 && hora < 18) {
      periodo = 'Tarde';
    } else {
      periodo = 'Noche';
    }
    
    acc[periodo] = (acc[periodo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const horarioChartData = Object.entries(clasificacionPorHorarios).map(
    ([periodo, cantidad]) => ({ name: periodo, value: cantidad })
  );

  return (
    <div className="dashboard-card bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Clock className="mr-2 text-blue-500" />
        Recogidas por Horario
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={horarioChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {horarioChartData.map((entry, index) => (
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
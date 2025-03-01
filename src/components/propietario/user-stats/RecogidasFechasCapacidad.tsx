import React, { useState } from 'react';
import { Calendar, Box, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Recogida } from './tipos';

// Función para determinar el periodo del día
const getPeriodoDia = (fecha: Date): string => {
  const hora = fecha.getHours();
  
  if (hora >= 6 && hora < 12) {
    return 'Mañana';
  } else if (hora >= 12 && hora < 18) {
    return 'Tarde';
  } else {
    return 'Noche';
  }
};

export const RecogidasFechasCapacidad: React.FC<{ recogidas: Recogida[] }> = ({ recogidas }) => {
  const [vistaDetallada, setVistaDetallada] = useState(false);
  const [filtroTipoResiduo, setFiltroTipoResiduo] = useState<string | null>(null);
  const [filtroPeriodoDia, setFiltroPeriodoDia] = useState<string | null>(null);

  // Agrupar recogidas por fecha, capacidad y horario
  const recogidaPorDetalles = recogidas.reduce((acc, recogida) => {
    // Formatear la fecha estimada
    const fechaEstimada = new Date(recogida.fechaRecogidaEstimada);
    const fechaFormateada = fechaEstimada.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Detalles del contenedor
    const capacidad = recogida.contenedor.capacidad;
    const tipoResiduo = recogida.contenedor.tipoResiduo.descripcion;
    const periodoDia = getPeriodoDia(fechaEstimada);

    // Filtros
    if (
      (filtroTipoResiduo && tipoResiduo !== filtroTipoResiduo) ||
      (filtroPeriodoDia && periodoDia !== filtroPeriodoDia)
    ) {
      return acc;
    }

    // Clave única que combina fecha, capacidad, tipo de residuo y periodo del día
    const clave = `${fechaFormateada}-${capacidad}L-${tipoResiduo}-${periodoDia}`;

    if (!acc[clave]) {
      acc[clave] = {
        fecha: fechaFormateada,
        capacidad,
        tipoResiduo,
        periodoDia,
        total: 0,
        detalle: []
      };
    }

    acc[clave].total++;
    acc[clave].detalle.push(recogida);

    return acc;
  }, {} as Record<string, { 
    fecha: string, 
    capacidad: number, 
    tipoResiduo: string, 
    periodoDia: string,
    total: number,
    detalle: Recogida[]
  }>);

  // Transformar datos para el gráfico
  const chartData = Object.values(recogidaPorDetalles)
    .sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return dateA.getTime() - dateB.getTime();
    });
  
  // Obtener tipos de residuos únicos
  const tiposResiduoUnicos = [...new Set(recogidas.map(r => r.contenedor.tipoResiduo.descripcion))];
  
  // Obtener períodos del día únicos
  const periodosUnicos = ['Mañana', 'Tarde', 'Noche'];

  // Calcular el total de recogidas
  const totalRecogidas = chartData.reduce((sum, item) => sum + item.total, 0);
  
  return (
    <div className="dashboard-card bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center text-green-800 mb-3 md:mb-0">
          <Calendar className="mr-2 text-green-600" />
          <Box className="mr-2 text-green-600" />
          <Clock className="mr-2 text-green-600" />
          Recogidas Detalladas
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div>
            <select 
              value={filtroTipoResiduo || ''}
              onChange={(e) => setFiltroTipoResiduo(e.target.value || null)}
              className="px-3 py-1 bg-green-50 text-green-800 rounded-md border border-green-200 mr-2"
            >
              <option value="">Todos los residuos</option>
              {tiposResiduoUnicos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            
            <select 
              value={filtroPeriodoDia || ''}
              onChange={(e) => setFiltroPeriodoDia(e.target.value || null)}
              className="px-3 py-1 bg-green-50 text-green-800 rounded-md border border-green-200 mr-2"
            >
              <option value="">Todos los períodos</option>
              {periodosUnicos.map(periodo => (
                <option key={periodo} value={periodo}>{periodo}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => setVistaDetallada(!vistaDetallada)}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            {vistaDetallada ? 'Vista Simple' : 'Vista Detallada'}
          </button>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="fecha"
                angle={-45} 
                textAnchor="end" 
                height={100}
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
                      <div className="bg-white p-4 shadow-lg rounded-md max-w-xs border border-green-100">
                        <p className="font-bold text-green-800">{data.fecha}</p>
                        <p className="text-green-700">Capacidad: {data.capacidad} L</p>
                        <p className="text-green-700">Tipo de Residuo: {data.tipoResiduo}</p>
                        <p className="text-green-700">Periodo del Día: {data.periodoDia}</p>
                        <p className="text-green-700 font-medium">Total Recogidas: {data.total}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20, color: '#2F855A' }} />
              <Bar 
                dataKey="total" 
                fill="#38A169" 
                name="Número de Recogidas"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Tabla detallada */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-100">
                  <th className="p-2 text-left text-green-800">Fecha</th>
                  <th className="p-2 text-left text-green-800">Capacidad</th>
                  <th className="p-2 text-left text-green-800">Tipo Residuo</th>
                  <th className="p-2 text-left text-green-800">Periodo Día</th>
                  <th className="p-2 text-right text-green-800">Recogidas</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={index} className="border-b border-green-100">
                    <td className="p-2 text-green-700">{item.fecha}</td>
                    <td className="p-2 text-green-700">{item.capacidad} L</td>
                    <td className="p-2 text-green-700">{item.tipoResiduo}</td>
                    <td className="p-2 text-green-700">{item.periodoDia}</td>
                    <td className="p-2 text-right text-green-700 font-medium">{item.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-green-100">
                  <td colSpan={4} className="p-2 text-green-800 font-medium">Totales</td>
                  <td className="p-2 text-right text-green-800 font-medium">{totalRecogidas}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      ) : (
        <div className="py-10 text-center">
          <p className="text-green-700">No hay datos disponibles para los filtros seleccionados.</p>
        </div>
      )}
      
      {/* Resumen estadístico */}
      <div className="mt-6 bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-green-800">Resumen General</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-medium text-green-700">Total de Fechas</p>
            <p className="text-gray-700">{chartData.length}</p>
          </div>
          <div>
            <p className="font-medium text-green-700">Total de Recogidas</p>
            <p className="text-gray-700">{totalRecogidas}</p>
          </div>
          <div>
            <p className="font-medium text-green-700">Capacidades Únicas</p>
            <p className="text-gray-700">
              {[...new Set(chartData.map(item => `${item.capacidad} L`))].join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
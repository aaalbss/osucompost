import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, BarChart2, PieChart } from 'lucide-react';
import { Recogida } from './tipos';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, 
  Pie, Cell, AnimationTiming
} from 'recharts';
import { getNombreResiduoPorId } from '@/utils/formatoResiduos';

// Función para determinar el periodo del día basado en el campo horario
const getPeriodoDia = (recogida: Recogida): string => {
  const horario = recogida.contenedor.puntoRecogida.horario;
  
  switch(horario) {
    case 'M':
      return 'Mañana';
    case 'T':
      return 'Tarde';
    case 'N':
      return 'Noche';
    default:
      return 'No especificado';
  }
};

// Componente de tarjeta de resumen que puede expandirse/contraerse
const ResumenPeriodoCard = ({ 
  periodo, 
  data, 
  color 
}: { 
  periodo: string; 
  data: { 
    total: number; 
    capacidadTotal: number; 
    tipos: Record<string, number>; 
  }; 
  color: string;
}) => {
  const [expandido, setExpandido] = useState(false);
  const tiposResiduo = Object.entries(data.tipos);

  return (
    <div 
      className={`rounded-lg transition-all duration-300 overflow-hidden ${
        expandido ? 'bg-white shadow-md' : 'bg-green-50'
      }`}
    >
      <div 
        className={`p-4 flex justify-between items-center cursor-pointer ${
          expandido ? 'border-b border-green-100' : ''
        }`}
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex items-center">
          <div 
            className="w-4 h-4 mr-3 rounded-full" 
            style={{ backgroundColor: color }}
          ></div>
          <h4 className="font-medium text-green-800">{periodo}</h4>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-green-700 sm:inline">
            {data.total} recogidas
          </span>
          <button 
            className="text-green-600 transition-colors hover:text-green-800"
            aria-label={expandido ? "Colapsar detalles" : "Expandir detalles"}
          >
            {expandido ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      
      {expandido && (
        <div className="p-4 text-green-700 bg-white animate-fadeIn">
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
            <div className="p-3 rounded bg-green-50">
              <p className="text-sm text-green-600">Total Recogidas</p>
              <p className="text-xl font-semibold">{data.total}</p>
            </div>
            <div className="p-3 rounded bg-green-50">
              <p className="text-sm text-green-600">Capacidad Total</p>
              <p className="text-xl font-semibold">{data.capacidadTotal} L</p>
            </div>
          </div>
          
          {tiposResiduo.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-green-800">Por tipo de residuo:</p>
              <div className="space-y-2">
                {tiposResiduo.map(([tipoId, cantidad]) => {
                  // Asumiendo que tipoId es realmente el ID numérico
                  // Si no, necesitarás ajustar esto para obtener el ID correcto
                  const tipoIdNumerico = parseInt(tipoId);
                  const nombreFormateado = Number.isNaN(tipoIdNumerico) 
                    ? getNombreResiduoPorId(1) // Fallback a Orgánico si no podemos parsear el ID
                    : getNombreResiduoPorId(tipoIdNumerico);
                  
                  return (
                    <div key={tipoId} className="flex justify-between p-2 rounded bg-green-50/50">
                      <span>{nombreFormateado || tipoId}:</span>
                      <span className="font-medium">
                        {cantidad} {cantidad === 1 ? 'recogida' : 'recogidas'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RecogidasHorario: React.FC<{ 
  recogidas: Recogida[]; 
  usuarioId?: number // ID del usuario actual, opcional
}> = ({ recogidas, usuarioId }) => {
  const [activeChart, setActiveChart] = useState<'bar' | 'pie'>('bar');
  const [showDetalles, setShowDetalles] = useState(false);

  // Filtrar recogidas: solo aquellas asociadas al usuario actual (si se proporciona usuarioId)
  // y que tengan fechaRecogidaReal distinto de null
  const recogidasFiltradas = recogidas.filter(recogida => {
    // Verificar si la fechaRecogidaReal no es null
    const tieneFechaRecogida = recogida.fechaRecogidaReal !== null;
    
    // Si se proporciona usuarioId, verificar si la recogida está asociada a ese usuario
    const esDelUsuario = usuarioId 
      ? recogida.usuarioId === usuarioId || recogida.usuario?.id === usuarioId
      : true; // Si no se proporciona usuarioId, consideramos todas las recogidas
    
    // La recogida debe cumplir ambas condiciones
    return tieneFechaRecogida && esDelUsuario;
  });

  // Agrupar recogidas por periodo del día
  const recogidaPorPeriodo = recogidasFiltradas.reduce((acc, recogida) => {
    const periodoDia = getPeriodoDia(recogida);
    
    if (!acc[periodoDia]) {
      acc[periodoDia] = {
        nombre: periodoDia,
        total: 0,
        capacidadTotal: 0,
        tipos: {}
      };
    }
    
    acc[periodoDia].total++;
    acc[periodoDia].capacidadTotal += recogida.contenedor.capacidad;
    
    // Contabilizar por tipo de residuo y usar el ID como clave
    const tipoResiduoId = recogida.contenedor.tipoResiduo.id;
    if (!acc[periodoDia].tipos[tipoResiduoId]) {
      acc[periodoDia].tipos[tipoResiduoId] = 0;
    }
    acc[periodoDia].tipos[tipoResiduoId]++;

    return acc;
  }, {} as Record<string, { 
    nombre: string;
    total: number;
    capacidadTotal: number;
    tipos: Record<string | number, number>;
  }>);

  // Preparar datos para los gráficos
  const periodosOrdenados = ['Mañana', 'Tarde', 'Noche', 'No especificado'].filter(
    periodo => recogidaPorPeriodo[periodo]
  );
  
  const dataBarChart = periodosOrdenados.map(periodo => ({
    nombre: periodo,
    total: recogidaPorPeriodo[periodo]?.total || 0,
    capacidad: recogidaPorPeriodo[periodo]?.capacidadTotal || 0
  }));

  const dataPieChart = periodosOrdenados.map(periodo => ({
    name: periodo,
    value: recogidaPorPeriodo[periodo]?.total || 0
  }));

  // Colores para cada periodo con gradientes más atractivos
  const COLORS = {
    'Mañana': '#4ade80', // verde más claro
    'Tarde': '#22c55e',  // verde medio
    'Noche': '#166534',   // verde oscuro
    'No especificado': '#94a3b8' // gris
  };

  const COLORS_ARRAY = Object.values(COLORS);
  
  // Calcular el total de recogidas y capacidad
  const totalRecogidas = Object.values(recogidaPorPeriodo).reduce((sum, p) => sum + p.total, 0);
  const totalCapacidad = Object.values(recogidaPorPeriodo).reduce((sum, p) => sum + p.capacidadTotal, 0);

  // Animación personalizada para los gráficos
  const animationProps = {
    animationBegin: 0,
    animationDuration: 1000,
    animationEasing: 'ease' as AnimationTiming
  };

  // Si no hay datos filtrados, mostrar mensaje informativo
  if (recogidasFiltradas.length === 0) {
    return (
      <div className="p-6 transition-all duration-300 bg-white rounded-lg shadow-md">
        <h2 className="flex items-center mb-4 text-xl font-semibold text-green-800">
          <Clock className="mr-2 text-green-600" />
          Recogidas por Horario
        </h2>
        <div className="py-8 text-center text-green-700">
          No hay recogidas completadas para mostrar. Solo se muestran recogidas con fecha de recogida real.
        </div>
      </div>
    );
  }

  // Si no hay datos agrupados por periodo, mostrar mensaje informativo
  if (periodosOrdenados.length === 0) {
    return (
      <div className="p-6 transition-all duration-300 bg-white rounded-lg shadow-md">
        <h2 className="flex items-center mb-4 text-xl font-semibold text-green-800">
          <Clock className="mr-2 text-green-600" />
          Recogidas por Horario
        </h2>
        <div className="py-8 text-center text-green-700">
          No hay datos disponibles sobre recogidas por horario.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 transition-all duration-300 bg-white rounded-lg shadow-md">
      <h2 className="flex items-center mb-6 text-xl font-semibold text-green-800">
        <Clock className="mr-2 text-green-600" />
        Recogidas Completadas por Horario
      </h2>

      {/* Selector de tipo de gráfico */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center p-1 rounded-lg bg-green-50">
          <button
            className={`flex items-center px-4 py-2 rounded-md transition-all ${
              activeChart === 'bar' 
                ? 'bg-white shadow-sm text-green-800' 
                : 'text-green-600 hover:bg-white/50'
            }`}
            onClick={() => setActiveChart('bar')}
          >
            <BarChart2 size={18} className="mr-2" />
            Barras
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-md transition-all ${
              activeChart === 'pie' 
                ? 'bg-white shadow-sm text-green-800' 
                : 'text-green-600 hover:bg-white/50'
            }`}
            onClick={() => setActiveChart('pie')}
          >
            <PieChart size={18} className="mr-2" />
            Circular
          </button>
        </div>
      </div>

      {/* Contenedor del gráfico */}
      <div className="mb-6 bg-white rounded-lg">
        <div className="w-full h-80">
          {activeChart === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={dataBarChart} 
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                {...animationProps}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="nombre" 
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
                        <div className="p-4 bg-white border border-green-100 rounded-md shadow-lg">
                          <p className="font-bold text-green-800">{data.nombre}</p>
                          <p className="text-green-700">Total Recogidas: {data.total}</p>
                          <p className="text-green-700">Capacidad Total: {data.capacidad} L</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 20, color: '#2F855A' }} />
                <Bar 
                  dataKey="total" 
                  name="Número de Recogidas" 
                  radius={[4, 4, 0, 0]}
                  fill="#38A169"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart {...animationProps}>
                <Pie
                  data={dataPieChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  animationBegin={0}
                  animationDuration={1200}
                >
                  {dataPieChart.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS] || COLORS_ARRAY[index % COLORS_ARRAY.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value} recogidas`, name]}
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #C6F6D5',
                    borderRadius: '4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tabla de resumen */}
      <div className="p-4 mb-6 overflow-x-auto rounded-lg bg-green-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-green-800">Resumen por Periodo</h3>
          <div className="text-sm text-green-700">
            Total: <span className="font-medium">{totalRecogidas} recogidas completadas</span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-100">
              <th className="p-2 text-left text-green-800">Periodo</th>
              <th className="p-2 text-center text-green-800">Total Recogidas</th>
              <th className="p-2 text-center text-green-800">% del Total</th>
              <th className="p-2 text-right text-green-800">Capacidad Total (L)</th>
            </tr>
          </thead>
          <tbody>
            {periodosOrdenados.map((periodo) => {
              const data = recogidaPorPeriodo[periodo];
              const porcentaje = (data.total / totalRecogidas) * 100;

              return (
                <tr key={periodo} className="transition-colors border-b border-green-100 hover:bg-green-100/50">
                  <td className="p-2 text-green-700">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 mr-2 rounded-full" 
                        style={{ backgroundColor: COLORS[periodo as keyof typeof COLORS] }}
                      ></div>
                      {periodo}
                    </div>
                  </td>
                  <td className="p-2 text-center text-green-700">{data.total}</td>
                  <td className="p-2 text-center text-green-700">{porcentaje.toFixed(1)}%</td>
                  <td className="p-2 text-right text-green-700">{data.capacidadTotal}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-green-100">
              <td className="p-2 font-medium text-green-800">Total</td>
              <td className="p-2 font-medium text-center text-green-800">{totalRecogidas}</td>
              <td className="p-2 font-medium text-center text-green-800">100%</td>
              <td className="p-2 font-medium text-right text-green-800">{totalCapacidad}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Botón para mostrar/ocultar detalles */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowDetalles(!showDetalles)}
          className="flex items-center px-4 py-2 text-green-700 transition-all rounded-md bg-green-50 hover:bg-green-100"
        >
          {showDetalles ? (
            <>
              <ChevronUp size={18} className="mr-2" />
              Ocultar detalles por periodo
            </>
          ) : (
            <>
              <ChevronDown size={18} className="mr-2" />
              Mostrar detalles por periodo
            </>
          )}
        </button>
      </div>

      {/* Detalles por periodo (expandibles) */}
      {showDetalles && (
        <div className="grid grid-cols-1 gap-4 mt-4 animate-fadeIn">
          {periodosOrdenados.map(periodo => (
            <ResumenPeriodoCard
              key={periodo}
              periodo={periodo}
              data={recogidaPorPeriodo[periodo]}
              color={COLORS[periodo as keyof typeof COLORS] || '#94a3b8'}
            />
          ))}
        </div>
      )}
    </div>
  );
};
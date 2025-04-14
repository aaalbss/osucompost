import React, { useState, useMemo } from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, BarChart as BarChartIcon } from 'lucide-react';
import { Recogida } from './tipos';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface RemuneracionContenedoresProps {
  recogidas: Recogida[];
}

export const RemuneracionContenedores: React.FC<RemuneracionContenedoresProps> = ({ recogidas }) => {
  // Estado para el tipo de visualización
  const [tipoVisualizacion, setTipoVisualizacion] = useState<'tabla' | 'grafico'>('grafico');
  const [tipoGrafico, setTipoGrafico] = useState<'barra' | 'pie'>('barra');
  const [highlightedCapacidad, setHighlightedCapacidad] = useState<number | null>(null);
  
  // Filtrar recogidas con fechaRecogidaReal distinto de null
  const recogidasCompletadas = useMemo(() => {
    return recogidas.filter(recogida => recogida.fechaRecogidaReal !== null);
  }, [recogidas]);

  // Factor de conversión de litros a kg
  const FACTOR_KG = 0.25; // 0,25 kg/L

  // Datos para la tabla y gráficos de remuneración
  const datosRemuneracion = useMemo(() => {
    const capacidadesGroup = recogidasCompletadas.reduce((acc, recogida) => {
      const capacidadLitros = recogida.contenedor.capacidad;
      const capacidadKg = capacidadLitros * FACTOR_KG;
      
      if (!acc[capacidadLitros]) {
        acc[capacidadLitros] = {
          capacidadLitros,
          capacidadKg,
          numContenedores: 0,
          remuneracion: 0,
          porcentaje: 0
        };
      }
      
      acc[capacidadLitros].numContenedores += 1;
      // Remuneración es kg * 0,02
      acc[capacidadLitros].remuneracion += capacidadKg * 0.02;
      
      return acc;
    }, {} as Record<number, { 
      capacidadLitros: number;
      capacidadKg: number; 
      numContenedores: number; 
      remuneracion: number;
      porcentaje: number;
    }>);
    
    // Calcular el total de remuneración
    const totalRemuneracion = Object.values(capacidadesGroup).reduce(
      (sum, item) => sum + item.remuneracion, 0
    );
    
    // Calcular el porcentaje para cada capacidad
    Object.values(capacidadesGroup).forEach(item => {
      item.porcentaje = (item.remuneracion / totalRemuneracion) * 100;
    });
    
    return Object.values(capacidadesGroup).sort((a, b) => a.capacidadLitros - b.capacidadLitros);
  }, [recogidas]);

  // Datos formateados para el gráfico de barras
  const datosBarras = useMemo(() => {
    return datosRemuneracion.map(item => ({
      name: `${item.capacidadKg.toFixed(1)} kg`,
      Remuneración: Number(item.remuneracion.toFixed(2)),
      Contenedores: item.numContenedores,
      fill: highlightedCapacidad === item.capacidadLitros ? '#059669' : '#10B981'
    }));
  }, [datosRemuneracion, highlightedCapacidad]);

  // Datos formateados para el gráfico de pie
  const datosPie = useMemo(() => {
    return datosRemuneracion.map(item => ({
      name: `${item.capacidadKg.toFixed(1)} kg`,
      value: Number(item.remuneracion.toFixed(2)),
      numContenedores: item.numContenedores,
      capacidadLitros: item.capacidadLitros,
      capacidadKg: item.capacidadKg
    }));
  }, [datosRemuneracion]);

  // Cálculo de totales
  const totales = useMemo(() => {
    return datosRemuneracion.reduce(
      (acc, item) => {
        acc.totalContenedores += item.numContenedores;
        acc.totalRemuneracion += item.remuneracion;
        return acc;
      },
      { totalContenedores: 0, totalRemuneracion: 0 }
    );
  }, [datosRemuneracion]);

  // Calcular total acumulado de kg
  const totalKgAcumulado = useMemo(() => {
    return datosRemuneracion.reduce((total, item) => {
      // Multiplicamos el número de contenedores por la capacidad en kg de cada uno
      return total + (item.numContenedores * item.capacidadKg);
    }, 0);
  }, [datosRemuneracion]);

  // Calcular remuneración media por contenedor
  const remuneracionMedia = useMemo(() => {
    if (totales.totalContenedores === 0) return 0;
    return totales.totalRemuneracion / totales.totalContenedores;
  }, [totales]);

  // Distribución visual de la remuneración
  const distribucionVisual = useMemo(() => {
    return datosRemuneracion.map(item => ({
      capacidadLitros: item.capacidadLitros,
      capacidadKg: item.capacidadKg,
      porcentaje: item.porcentaje,
      remuneracion: item.remuneracion
    }));
  }, [datosRemuneracion]);

  // Colores para los gráficos
  const COLORS = ['#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534'];

  // Si no hay datos, mostrar mensaje
  if (recogidasCompletadas.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <DollarSign size={48} className="mx-auto mb-4 text-green-200" />
          <h3 className="mb-1 text-lg font-medium text-green-800">Sin datos de remuneración</h3>
          <p>No hay información de remuneración disponible</p>
        </div>
      </div>
    );
  }

  // Función para manejar el hover en la barra de distribución
  const handleDistribucionHover = (capacidad: number) => {
    setHighlightedCapacidad(capacidad);
  };

  // Función para manejar el fin del hover
  const handleDistribucionLeave = () => {
    setHighlightedCapacidad(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-full min-h-[600px] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-xl font-semibold text-green-800">
          <DollarSign className="mr-2 text-green-600" />
          Remuneración por cantidad
        </h2>

        {/* Selector de visualización */}
        <div className="flex p-1 rounded-lg bg-green-50">
          <button 
            className={`px-3 py-1 text-sm rounded-md transition-all ${
              tipoVisualizacion === 'grafico' ? 'bg-white text-green-700 shadow-sm' : 'text-green-600'
            }`}
            onClick={() => setTipoVisualizacion('grafico')}
          >
            Gráfico
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md transition-all ${
              tipoVisualizacion === 'tabla' ? 'bg-white text-green-700 shadow-sm' : 'text-green-600'
            }`}
            onClick={() => setTipoVisualizacion('tabla')}
          >
            Tabla
          </button>
        </div>
      </div>

      {/* Resumen de totales en tarjetas */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-3 rounded-lg bg-green-50">
          <p className="text-sm text-green-700">Total Contenedores</p>
          <p className="text-2xl font-bold text-green-800">{totales.totalContenedores}</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50">
          <p className="text-sm text-green-700">Remuneración Total</p>
          <p className="text-2xl font-bold text-green-800">{totales.totalRemuneracion.toFixed(2)} €</p>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
          <div>
            <p className="text-sm text-green-700">Total Acumulado</p>
            <p className="text-2xl font-bold text-green-800">{totalKgAcumulado.toFixed(1)} kg</p>
          </div>
          <div className="p-2 bg-green-200 rounded-full">
            <TrendingUp className="text-green-800" size={20} />
          </div>
        </div>
      </div>
      
      {tipoVisualizacion === 'grafico' && (
        <div className="mb-6">
          {/* Selector de tipo de gráfico */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center p-1 rounded-lg bg-green-50">
              <button
                className={`flex items-center px-3 py-1 text-sm rounded-md transition-all ${
                  tipoGrafico === 'barra' 
                    ? 'bg-white shadow-sm text-green-800' 
                    : 'text-green-600 hover:bg-white/50'
                }`}
                onClick={() => setTipoGrafico('barra')}
              >
                <BarChartIcon size={16} className="mr-1" />
                Barras
              </button>
              <button
                className={`flex items-center px-3 py-1 text-sm rounded-md transition-all ${
                  tipoGrafico === 'pie' 
                    ? 'bg-white shadow-sm text-green-800' 
                    : 'text-green-600 hover:bg-white/50'
                }`}
                onClick={() => setTipoGrafico('pie')}
              >
                <span className="mr-1">○</span>
                Circular
              </button>
            </div>
          </div>

          {/* Contenedor del gráfico */}
          <div className="h-64 mt-2">
            {tipoGrafico === 'barra' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={datosBarras}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fill: '#2F855A' }} />
                  <YAxis tick={{ fill: '#2F855A' }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'Remuneración' ? `${value} €` : value,
                      name
                    ]}
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #C6F6D5',
                      borderRadius: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="Remuneración" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    onMouseEnter={(data) => {
                      // Encontrar capacidad en litros correspondiente
                      const datosItem = datosRemuneracion.find(
                        item => `${item.capacidadKg.toFixed(1)} kg` === data.name
                      );
                      if (datosItem) {
                        setHighlightedCapacidad(datosItem.capacidadLitros);
                      }
                    }}
                    onMouseLeave={() => setHighlightedCapacidad(null)}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosPie}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1500}
                    onMouseEnter={(_, index) => {
                      const capacidad = datosPie[index].capacidadLitros;
                      setHighlightedCapacidad(capacidad);
                    }}
                    onMouseLeave={() => setHighlightedCapacidad(null)}
                  >
                    {datosPie.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={highlightedCapacidad === entry.capacidadLitros ? 
                          '#059669' : COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => {
                      const entry = datosPie.find(item => item.name === name);
                      return [
                        `${value} € (${entry?.numContenedores} contenedores)`,
                        'Remuneración'
                      ];
                    }}
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #C6F6D5',
                      borderRadius: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
      
      {tipoVisualizacion === 'tabla' && (
        <div className="mb-6 overflow-x-auto animate-fadeIn">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-green-100">
                <th className="p-2 text-left text-green-800">Peso (kg)</th>
                <th className="p-2 text-center text-green-800">Nº Contenedores</th>
                <th className="p-2 text-right text-green-800">Remuneración (€)</th>
                <th className="p-2 text-right text-green-800">% del Total</th>
              </tr>
            </thead>
            <tbody>
              {datosRemuneracion.map((item) => (
                <tr 
                  key={item.capacidadLitros} 
                  className={`border-b border-green-100 transition-colors hover:bg-green-50 ${
                    highlightedCapacidad === item.capacidadLitros ? 'bg-green-50' : ''
                  }`}
                  onMouseEnter={() => handleDistribucionHover(item.capacidadLitros)}
                  onMouseLeave={handleDistribucionLeave}
                >
                  <td className="p-2 text-green-700">{item.capacidadKg.toFixed(1)} kg</td>
                  <td className="p-2 text-center text-green-700">{item.numContenedores}</td>
                  <td className="p-2 text-right text-green-700">{item.remuneracion.toFixed(2)} €</td>
                  <td className="p-2 text-right text-green-700">{item.porcentaje.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-green-100">
                <td className="p-2 font-medium text-green-800">Total</td>
                <td className="p-2 font-medium text-center text-green-800">{totales.totalContenedores}</td>
                <td className="p-2 font-medium text-right text-green-800">{totales.totalRemuneracion.toFixed(2)} €</td>
                <td className="p-2 font-medium text-right text-green-800">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      
      {/* Distribución visual de remuneración */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-green-700">Distribución de Remuneración</h3>
        <div className="flex h-8 overflow-hidden bg-gray-100 rounded-full">
          {distribucionVisual.map((item, index) => (
            <div 
              key={item.capacidadLitros}
              className="flex items-center justify-center h-full text-xs font-medium text-white transition-all"
              style={{ 
                width: `${item.porcentaje}%`, 
                backgroundColor: highlightedCapacidad === item.capacidadLitros 
                  ? '#059669' : getColorForIndex(index),
                transition: 'all 0.3s ease-in-out',
                transform: highlightedCapacidad === item.capacidadLitros ? 'scaleY(1.15)' : 'scaleY(1)'
              }}
              title={`${item.capacidadKg.toFixed(1)} kg: ${item.remuneracion.toFixed(2)}€`}
              onMouseEnter={() => handleDistribucionHover(item.capacidadLitros)}
              onMouseLeave={handleDistribucionLeave}
            >
              {item.porcentaje > 5 && `${item.capacidadKg.toFixed(1)} kg: ${item.remuneracion.toFixed(2)}€`}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2 text-xs">
          {distribucionVisual.map((item, index) => (
            <div 
              key={item.capacidadLitros} 
              className={`flex items-center p-1 rounded-md transition-colors ${
                highlightedCapacidad === item.capacidadLitros ? 'bg-green-100' : ''
              }`}
              onMouseEnter={() => handleDistribucionHover(item.capacidadLitros)}
              onMouseLeave={handleDistribucionLeave}
            >
              <div 
                className="w-3 h-3 mr-1 rounded-full" 
                style={{ 
                  backgroundColor: getColorForIndex(index),
                  transition: 'transform 0.2s ease',
                  transform: highlightedCapacidad === item.capacidadLitros ? 'scale(1.2)' : 'scale(1)'
                }}
              ></div>
              <span className="text-green-700">{item.capacidadKg.toFixed(1)} kg: {item.remuneracion.toFixed(2)}€</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="p-4 rounded-lg bg-green-50">
        <h3 className="mb-3 font-medium text-green-800">Información Adicional</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-600">Total Acumulado</p>
              <ArrowUpRight className="text-green-500" size={16} />
            </div>
            <p className="mt-1 text-xl font-semibold text-green-700">{totalKgAcumulado.toFixed(1)} kg</p>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-600">Remuneración media por contenedor</p>
              <ArrowUpRight className="text-green-500" size={16} />
            </div>
            <p className="mt-1 text-xl font-semibold text-green-700">{remuneracionMedia.toFixed(2)} €</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Función para obtener colores para la visualización
const getColorForIndex = (index: number): string => {
  const colors = [
    '#4ADE80', // verde claro
    '#22C55E', // verde medio
    '#16A34A', // verde
    '#15803D', // verde oscuro
    '#166534'  // verde muy oscuro
  ];
  return colors[index % colors.length];
};
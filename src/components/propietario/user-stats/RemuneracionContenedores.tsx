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

  // Datos para la tabla y gráficos de remuneración
  const datosRemuneracion = useMemo(() => {
    const capacidadesGroup = recogidas.reduce((acc, recogida) => {
      const capacidad = recogida.contenedor.capacidad;
      
      if (!acc[capacidad]) {
        acc[capacidad] = {
          capacidad,
          numContenedores: 0,
          remuneracion: 0,
          porcentaje: 0
        };
      }
      
      acc[capacidad].numContenedores += 1;
      // Remuneración es capacidad * 0.02€/L
      acc[capacidad].remuneracion += capacidad * 0.02;
      return acc;
    }, {} as Record<number, { 
      capacidad: number; 
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
    
    return Object.values(capacidadesGroup).sort((a, b) => a.capacidad - b.capacidad);
  }, [recogidas]);

  // Datos formateados para el gráfico de barras
  const datosBarras = useMemo(() => {
    return datosRemuneracion.map(item => ({
      name: `${item.capacidad} L`,
      Remuneración: Number(item.remuneracion.toFixed(2)),
      Contenedores: item.numContenedores,
      fill: highlightedCapacidad === item.capacidad ? '#059669' : '#10B981'
    }));
  }, [datosRemuneracion, highlightedCapacidad]);

  // Datos formateados para el gráfico de pie
  const datosPie = useMemo(() => {
    return datosRemuneracion.map(item => ({
      name: `${item.capacidad} L`,
      value: Number(item.remuneracion.toFixed(2)),
      numContenedores: item.numContenedores,
      capacidad: item.capacidad
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

  // Calcular capacidad más rentable
  const capacidadMasRentable = useMemo(() => {
    if (datosRemuneracion.length === 0) return 0;
    
    return datosRemuneracion.reduce((max, item) => {
      const rentabilidadPorContenedor = item.remuneracion / item.numContenedores;
      return rentabilidadPorContenedor > max.rentabilidad 
        ? { capacidad: item.capacidad, rentabilidad: rentabilidadPorContenedor }
        : max;
    }, { capacidad: 0, rentabilidad: 0 }).capacidad;
  }, [datosRemuneracion]);

  // Calcular remuneración media por contenedor
  const remuneracionMedia = useMemo(() => {
    if (totales.totalContenedores === 0) return 0;
    return totales.totalRemuneracion / totales.totalContenedores;
  }, [totales]);

  // Distribución visual de la remuneración
  const distribucionVisual = useMemo(() => {
    return datosRemuneracion.map(item => ({
      capacidad: item.capacidad,
      porcentaje: item.porcentaje,
      remuneracion: item.remuneracion
    }));
  }, [datosRemuneracion]);

  // Colores para los gráficos
  const COLORS = ['#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534'];

  // Si no hay datos, mostrar mensaje
  if (recogidas.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <DollarSign size={48} className="mx-auto mb-4 text-green-200" />
          <h3 className="text-lg font-medium text-green-800 mb-1">Sin datos de remuneración</h3>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center text-green-800">
          <DollarSign className="mr-2 text-green-600" />
          Remuneración por Capacidad
        </h2>

        {/* Selector de visualización */}
        <div className="flex bg-green-50 rounded-lg p-1">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-700">Total Contenedores</p>
          <p className="text-2xl font-bold text-green-800">{totales.totalContenedores}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-700">Remuneración Total</p>
          <p className="text-2xl font-bold text-green-800">{totales.totalRemuneracion.toFixed(2)} €</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-green-700">Capacidad más Rentable</p>
            <p className="text-2xl font-bold text-green-800">{capacidadMasRentable} L</p>
          </div>
          <div className="bg-green-200 p-2 rounded-full">
            <TrendingUp className="text-green-800" size={20} />
          </div>
        </div>
      </div>
      
      {tipoVisualizacion === 'grafico' && (
        <div className="mb-6">
          {/* Selector de tipo de gráfico */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center bg-green-50 rounded-lg p-1">
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
                      const capacidad = parseInt(data.name);
                      setHighlightedCapacidad(capacidad);
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
                      const capacidad = datosPie[index].capacidad;
                      setHighlightedCapacidad(capacidad);
                    }}
                    onMouseLeave={() => setHighlightedCapacidad(null)}
                  >
                    {datosPie.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={highlightedCapacidad === entry.capacidad ? 
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
        <div className="overflow-x-auto mb-6 animate-fadeIn">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-green-100">
                <th className="p-2 text-left text-green-800">Capacidad (L)</th>
                <th className="p-2 text-center text-green-800">Nº Contenedores</th>
                <th className="p-2 text-right text-green-800">Remuneración (€)</th>
                <th className="p-2 text-right text-green-800">% del Total</th>
              </tr>
            </thead>
            <tbody>
              {datosRemuneracion.map((item) => (
                <tr 
                  key={item.capacidad} 
                  className={`border-b border-green-100 transition-colors hover:bg-green-50 ${
                    highlightedCapacidad === item.capacidad ? 'bg-green-50' : ''
                  }`}
                  onMouseEnter={() => handleDistribucionHover(item.capacidad)}
                  onMouseLeave={handleDistribucionLeave}
                >
                  <td className="p-2 text-green-700">{item.capacidad} L</td>
                  <td className="p-2 text-center text-green-700">{item.numContenedores}</td>
                  <td className="p-2 text-right text-green-700">{item.remuneracion.toFixed(2)} €</td>
                  <td className="p-2 text-right text-green-700">{item.porcentaje.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-green-100">
                <td className="p-2 font-medium text-green-800">Total</td>
                <td className="p-2 text-center font-medium text-green-800">{totales.totalContenedores}</td>
                <td className="p-2 text-right font-medium text-green-800">{totales.totalRemuneracion.toFixed(2)} €</td>
                <td className="p-2 text-right font-medium text-green-800">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      
      {/* Distribución visual de remuneración */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-green-700">Distribución de Remuneración</h3>
        <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
          {distribucionVisual.map((item, index) => (
            <div 
              key={item.capacidad}
              className="h-full flex items-center justify-center text-xs text-white font-medium transition-all"
              style={{ 
                width: `${item.porcentaje}%`, 
                backgroundColor: highlightedCapacidad === item.capacidad 
                  ? '#059669' : getColorForIndex(index),
                transition: 'all 0.3s ease-in-out',
                transform: highlightedCapacidad === item.capacidad ? 'scaleY(1.15)' : 'scaleY(1)'
              }}
              title={`${item.capacidad}L: ${item.remuneracion.toFixed(2)}€`}
              onMouseEnter={() => handleDistribucionHover(item.capacidad)}
              onMouseLeave={handleDistribucionLeave}
            >
              {item.porcentaje > 5 && `${item.capacidad}L: ${item.remuneracion.toFixed(2)}€`}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap mt-2 text-xs gap-2">
          {distribucionVisual.map((item, index) => (
            <div 
              key={item.capacidad} 
              className={`flex items-center p-1 rounded-md transition-colors ${
                highlightedCapacidad === item.capacidad ? 'bg-green-100' : ''
              }`}
              onMouseEnter={() => handleDistribucionHover(item.capacidad)}
              onMouseLeave={handleDistribucionLeave}
            >
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ 
                  backgroundColor: getColorForIndex(index),
                  transition: 'transform 0.2s ease',
                  transform: highlightedCapacidad === item.capacidad ? 'scale(1.2)' : 'scale(1)'
                }}
              ></div>
              <span className="text-green-700">{item.capacidad}L: {item.remuneracion.toFixed(2)}€</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3 text-green-800">Información Adicional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-sm text-green-600">Capacidad más rentable</p>
              <ArrowUpRight className="text-green-500" size={16} />
            </div>
            <p className="text-xl font-semibold text-green-700 mt-1">{capacidadMasRentable} L</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-sm text-green-600">Remuneración media por contenedor</p>
              <ArrowUpRight className="text-green-500" size={16} />
            </div>
            <p className="text-xl font-semibold text-green-700 mt-1">{remuneracionMedia.toFixed(2)} €</p>
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
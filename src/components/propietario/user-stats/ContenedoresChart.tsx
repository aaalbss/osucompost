import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, 
  Pie, Cell
} from 'recharts';
import { Package, Layers, PieChart as PieChartIcon, BarChart as BarChartIcon, LayoutList } from 'lucide-react';
import { getNombreResiduoPorId } from '@/utils/formatoResiduos';
import { Recogida } from './tipos';

interface ContenedoresChartProps {
  recogidas: Recogida[];
}

export const ContenedoresChart: React.FC<ContenedoresChartProps> = ({ recogidas }) => {
  // Estados para interactividad
  const [visualizacion, setVisualizacion] = useState<'grafico' | 'tabla'>('grafico');
  const [tipoGrafico, setTipoGrafico] = useState<'anillo' | 'barra'>('anillo');
  const [seccionActiva, setSeccionActiva] = useState<'tamano' | 'tipo'>('tamano');
  const [selectedCapacidad, setSelectedCapacidad] = useState<number | null>(null);

  // Colores para los gráficos
  const COLORS = ['#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534'];
  
  // Datos para el gráfico de cantidad por tamaño
  const cantidadPorTamano = useMemo(() => {
    const capacidadesCount = recogidas.reduce((acc, recogida) => {
      const capacidad = recogida.contenedor.capacidad;
      acc[capacidad] = (acc[capacidad] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    return Object.entries(capacidadesCount).map(([capacidad, cantidad]) => ({
      name: `${capacidad} L`,
      value: cantidad,
      capacidad: Number(capacidad),
      fill: selectedCapacidad === Number(capacidad) ? '#059669' : undefined
    })).sort((a, b) => a.capacidad - b.capacidad);
  }, [recogidas, selectedCapacidad]);

  // Datos para el gráfico de capacidad total por tipo
  const capacidadPorTipo = useMemo(() => {
    const tiposCapacidad = recogidas.reduce((acc, recogida) => {
      const tipoId = recogida.contenedor.tipoResiduo.id;
      const capacidad = recogida.contenedor.capacidad;
      
      if (!acc[tipoId]) {
        acc[tipoId] = {
          id: tipoId,
          nombre: getNombreResiduoPorId(tipoId) || recogida.contenedor.tipoResiduo.descripcion,
          capacidadTotal: 0,
          cantidad: 0
        };
      }
      
      acc[tipoId].capacidadTotal += capacidad;
      acc[tipoId].cantidad += 1;
      return acc;
    }, {} as Record<number, { id: number; nombre: string; capacidadTotal: number; cantidad: number; }>);
    
    return Object.values(tiposCapacidad).map(tipo => ({
      name: tipo.nombre,
      value: tipo.capacidadTotal,
      cantidad: tipo.cantidad,
      id: tipo.id
    }));
  }, [recogidas]);

  // Datos para gráfico de barras
  const datosBarras = useMemo(() => {
    if (seccionActiva === 'tamano') {
      return cantidadPorTamano.map(item => ({
        name: item.name,
        Cantidad: item.value,
        fill: selectedCapacidad === item.capacidad ? '#059669' : '#10B981'
      }));
    } else {
      return capacidadPorTipo.map(item => ({
        name: item.name,
        Capacidad: item.value,
        Cantidad: item.cantidad
      }));
    }
  }, [cantidadPorTamano, capacidadPorTipo, seccionActiva, selectedCapacidad]);

  // Datos para la tabla de resumen
  const datosPorCapacidad = useMemo(() => {
    const capacidadesGroup = recogidas.reduce((acc, recogida) => {
      const capacidad = recogida.contenedor.capacidad;
      
      if (!acc[capacidad]) {
        acc[capacidad] = {
          capacidad,
          cantidad: 0,
          capacidadTotal: 0,
          porcentaje: 0
        };
      }
      
      acc[capacidad].cantidad += 1;
      acc[capacidad].capacidadTotal += capacidad;
      return acc;
    }, {} as Record<number, { 
      capacidad: number; 
      cantidad: number; 
      capacidadTotal: number;
      porcentaje: 0 
    }>);
    
    // Calcular el porcentaje
    const totalCantidad = Object.values(capacidadesGroup).reduce((sum, item) => sum + item.cantidad, 0);
    Object.values(capacidadesGroup).forEach(item => {
      item.porcentaje = (item.cantidad / totalCantidad) * 100;
    });
    
    return Object.values(capacidadesGroup).sort((a, b) => a.capacidad - b.capacidad);
  }, [recogidas]);

  // Cálculo de totales
  const totales = useMemo(() => {
    return datosPorCapacidad.reduce(
      (acc, item) => {
        acc.totalCantidad += item.cantidad;
        acc.totalCapacidad += item.capacidadTotal;
        return acc;
      },
      { totalCantidad: 0, totalCapacidad: 0 }
    );
  }, [datosPorCapacidad]);

  // Cálculo de estadísticas adicionales
  const estadisticas = useMemo(() => {
    // Capacidad media
    const capacidadMedia = totales.totalCapacidad / totales.totalCantidad;
    
    // Capacidad más común
    const capacidadMasComun = [...datosPorCapacidad].sort((a, b) => b.cantidad - a.cantidad)[0]?.capacidad || 0;
    
    return {
      capacidadMedia,
      capacidadMasComun
    };
  }, [datosPorCapacidad, totales]);
  
  // Si no hay datos, mostrar mensaje
  if (recogidas.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Package size={48} className="mx-auto mb-4 text-green-200" />
          <h3 className="text-lg font-medium text-green-800 mb-1">Sin datos de contenedores</h3>
          <p>No hay información de contenedores disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-full min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-800 flex items-center">
          <Package className="mr-2 text-green-600" />
          Distribución de Contenedores
        </h2>

        {/* Selector de visualización */}
        <div className="flex bg-green-50 rounded-lg p-1">
          <button 
            className={`px-3 py-1 text-sm rounded-md transition-all ${
              visualizacion === 'grafico' ? 'bg-white text-green-700 shadow-sm' : 'text-green-600'
            }`}
            onClick={() => setVisualizacion('grafico')}
          >
            <PieChartIcon size={16} className="inline mr-1" />
            Gráfico
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md transition-all ${
              visualizacion === 'tabla' ? 'bg-white text-green-700 shadow-sm' : 'text-green-600'
            }`}
            onClick={() => setVisualizacion('tabla')}
          >
            <LayoutList size={16} className="inline mr-1" />
            Tabla
          </button>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-green-50 p-3 rounded-lg flex items-center">
          <div className="p-2 mr-3 bg-green-100 rounded-full">
            <Package size={20} className="text-green-700" />
          </div>
          <div>
            <p className="text-xs text-green-600">Total Contenedores</p>
            <p className="text-xl font-semibold text-green-800">{totales.totalCantidad}</p>
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg flex items-center">
          <div className="p-2 mr-3 bg-green-100 rounded-full">
            <Layers size={20} className="text-green-700" />
          </div>
          <div>
            <p className="text-xs text-green-600">Capacidad Total</p>
            <p className="text-xl font-semibold text-green-800">{totales.totalCapacidad} L</p>
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-green-600">Capacidad Media</p>
          <p className="text-xl font-semibold text-green-800">{estadisticas.capacidadMedia.toFixed(0)} L</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-green-600">Capacidad más Común</p>
          <p className="text-xl font-semibold text-green-800">{estadisticas.capacidadMasComun} L</p>
        </div>
      </div>

      {visualizacion === 'grafico' && (
        <div>
          {/* Pestañas para cambiar entre visualizaciones */}
          <div className="flex justify-between items-center mb-2">
            <div className="border-b border-green-100 flex">
              <button
                className={`px-4 py-2 text-sm ${
                  seccionActiva === 'tamano' 
                    ? 'text-green-700 border-b-2 border-green-500 font-medium' 
                    : 'text-green-600 hover:text-green-800'
                }`}
                onClick={() => setSeccionActiva('tamano')}
              >
                Cantidad por Tamaño
              </button>
              <button
                className={`px-4 py-2 text-sm ${
                  seccionActiva === 'tipo' 
                    ? 'text-green-700 border-b-2 border-green-500 font-medium' 
                    : 'text-green-600 hover:text-green-800'
                }`}
                onClick={() => setSeccionActiva('tipo')}
              >
                Capacidad por Tipo
              </button>
            </div>

            {/* Selector de tipo de gráfico */}
            <div className="flex bg-green-50 rounded-lg p-1">
              <button
                className={`px-3 py-1 text-xs rounded-md flex items-center ${
                  tipoGrafico === 'anillo' 
                    ? 'bg-white text-green-700 shadow-sm' 
                    : 'text-green-600 hover:bg-white/50'
                }`}
                onClick={() => setTipoGrafico('anillo')}
              >
                <PieChartIcon size={14} className="mr-1" />
                Anillo
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-md flex items-center ${
                  tipoGrafico === 'barra' 
                    ? 'bg-white text-green-700 shadow-sm' 
                    : 'text-green-600 hover:bg-white/50'
                }`}
                onClick={() => setTipoGrafico('barra')}
              >
                <BarChartIcon size={14} className="mr-1" />
                Barras
              </button>
            </div>
          </div>

          {/* Contenedor del gráfico */}
          <div className="bg-white rounded-lg p-2 mb-6">
            <div className="h-64">
              {tipoGrafico === 'anillo' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={seccionActiva === 'tamano' ? cantidadPorTamano : capacidadPorTipo}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      animationDuration={800}
                      animationBegin={0}
                      onMouseEnter={(_, index) => {
                        if (seccionActiva === 'tamano') {
                          const item = cantidadPorTamano[index];
                          setSelectedCapacidad(item.capacidad);
                        }
                      }}
                      onMouseLeave={() => {
                        setSelectedCapacidad(null);
                      }}
                    >
                      {(seccionActiva === 'tamano' ? cantidadPorTamano : capacidadPorTipo).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            seccionActiva === 'tamano' && selectedCapacidad === entry.capacidad 
                              ? '#059669' 
                              : COLORS[index % COLORS.length]
                          } 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => {
                        if (seccionActiva === 'tamano') {
                          return [`${value} contenedores`, 'Cantidad'];
                        } else {
                          const entry = capacidadPorTipo.find(item => item.name === name);
                          return [`${value} L (${entry?.cantidad} contenedores)`, 'Capacidad Total'];
                        }
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
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={datosBarras} 
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    animationDuration={800}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#2F855A' }} 
                      angle={seccionActiva === 'tipo' ? -45 : 0}
                      textAnchor={seccionActiva === 'tipo' ? 'end' : 'middle'}
                      height={60}
                    />
                    <YAxis 
                      tick={{ fill: '#2F855A' }} 
                      label={
                        seccionActiva === 'tamano' 
                          ? { value: 'Cantidad', angle: -90, position: 'insideLeft', fill: '#2F855A' }
                          : { value: 'Capacidad (L)', angle: -90, position: 'insideLeft', fill: '#2F855A' }
                      }
                    />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Cantidad') return [`${value} contenedores`, name];
                        return [`${value} L`, name];
                      }}
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #C6F6D5',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 20, color: '#2F855A' }} />
                    {seccionActiva === 'tamano' ? (
                      <Bar 
                        dataKey="Cantidad" 
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]} 
                        onMouseEnter={(data) => {
                          const capacidad = parseInt(data.name);
                          setSelectedCapacidad(capacidad);
                        }}
                        onMouseLeave={() => setSelectedCapacidad(null)}
                      />
                    ) : (
                      <>
                        <Bar dataKey="Capacidad" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Cantidad" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {visualizacion === 'tabla' && (
        <div className="overflow-x-auto animate-fadeIn">
          <table className="min-w-full text-sm mb-6">
            <thead>
              <tr className="bg-green-100">
                <th className="p-2 text-left text-green-800">Capacidad</th>
                <th className="p-2 text-center text-green-800">Cantidad</th>
                <th className="p-2 text-center text-green-800">% del Total</th>
                <th className="p-2 text-left text-green-800">Capacidad</th>
                <th className="p-2 text-right text-green-800">Total (L)</th>
              </tr>
            </thead>
            <tbody>
              {datosPorCapacidad.map((item) => (
                <tr 
                  key={item.capacidad} 
                  className={`border-b border-green-100 transition-colors hover:bg-green-50 ${
                    selectedCapacidad === item.capacidad ? 'bg-green-50' : ''
                  }`}
                  onMouseEnter={() => setSelectedCapacidad(item.capacidad)}
                  onMouseLeave={() => setSelectedCapacidad(null)}
                >
                  <td className="p-2 text-green-700">{item.capacidad} L</td>
                  <td className="p-2 text-center text-green-700">{item.cantidad}</td>
                  <td className="p-2 text-center text-green-700">{item.porcentaje.toFixed(1)}%</td>
                  <td className="p-2 text-green-700">{item.capacidad} L</td>
                  <td className="p-2 text-right text-green-700">{item.capacidadTotal}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-green-100">
                <td className="p-2 font-medium text-green-800">Total</td>
                <td className="p-2 text-center font-medium text-green-800">{totales.totalCantidad}</td>
                <td className="p-2 text-center font-medium text-green-800">100%</td>
                <td className="p-2 font-medium text-green-800">Total</td>
                <td className="p-2 text-right font-medium text-green-800">{totales.totalCapacidad} L</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      
      {/* Distribución visual */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 text-green-700">Distribución por Tamaño</h3>
        <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
          {datosPorCapacidad.map((item, index) => (
            <div 
              key={item.capacidad}
              className="h-full flex items-center justify-center text-xs text-white font-medium transition-all"
              style={{ 
                width: `${item.porcentaje}%`, 
                backgroundColor: selectedCapacidad === item.capacidad 
                  ? '#059669' : COLORS[index % COLORS.length],
                transition: 'all 0.3s ease-in-out',
                transform: selectedCapacidad === item.capacidad ? 'scaleY(1.15)' : 'scaleY(1)'
              }}
              title={`${item.capacidad}L: ${item.cantidad} contenedores`}
              onMouseEnter={() => setSelectedCapacidad(item.capacidad)}
              onMouseLeave={() => setSelectedCapacidad(null)}
            >
              {item.porcentaje > 5 && `${item.capacidad}L`}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap mt-2 gap-2">
          {datosPorCapacidad.map((item, index) => (
            <div 
              key={item.capacidad} 
              className={`text-xs flex items-center p-1 rounded-md transition-colors ${
                selectedCapacidad === item.capacidad ? 'bg-green-100' : ''
              }`}
              onMouseEnter={() => setSelectedCapacidad(item.capacidad)}
              onMouseLeave={() => setSelectedCapacidad(null)}
            >
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ 
                  backgroundColor: COLORS[index % COLORS.length],
                  transition: 'transform 0.2s ease',
                  transform: selectedCapacidad === item.capacidad ? 'scale(1.2)' : 'scale(1)'
                }}
              ></div>
              <span className="text-green-700">{item.capacidad}L: {item.cantidad} ({item.porcentaje.toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen por tipo de residuo */}
      {capacidadPorTipo.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3 text-green-800">Resumen por Tipo de Residuo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capacidadPorTipo.map((tipo, index) => (
              <div key={tipo.name} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <p className="font-medium text-green-700">{tipo.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-green-600">Contenedores</p>
                    <p className="text-lg font-semibold text-green-800">{tipo.cantidad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Capacidad Total</p>
                    <p className="text-lg font-semibold text-green-800">{tipo.value} L</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
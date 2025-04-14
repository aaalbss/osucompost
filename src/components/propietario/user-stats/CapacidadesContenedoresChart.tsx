import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box } from 'lucide-react';
import { Recogida } from './tipos';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export const CapacidadesContenedoresChart: React.FC<{ 
  recogidas: Recogida[],
  usuarioId?: number // ID del usuario actual, opcional
}> = ({ recogidas, usuarioId }) => {
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

  // Si no hay recogidas filtradas, mostrar mensaje informativo
  if (recogidasFiltradas.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md dashboard-card">
        <h2 className="flex items-center mb-4 text-xl font-semibold text-green-800">
          <Box className="mr-2 text-green-600" />
          Distribución de Contenedores
        </h2>
        <div className="py-8 text-center text-green-700">
          No hay recogidas completadas para mostrar. Solo se muestran recogidas con fecha de recogida real.
        </div>
      </div>
    );
  }

  // Agrupar capacidades de contenedores
  const capacidadesAgrupadas = recogidasFiltradas.reduce((acc, recogida) => {
    const capacidad = recogida.contenedor.capacidad;
    
    if (!acc[capacidad]) {
      acc[capacidad] = {
        cantidad: 0,
        capacidadTotal: 0
      };
    }
    
    acc[capacidad].cantidad++;
    acc[capacidad].capacidadTotal += capacidad;
    
    return acc;
  }, {} as Record<number, { cantidad: number, capacidadTotal: number }>);

  // Preparar datos para el gráfico
  const capacidades = Object.keys(capacidadesAgrupadas).map(Number).sort((a, b) => a - b);
  const cantidades = capacidades.map(cap => capacidadesAgrupadas[cap].cantidad);
  const capacidadesTotales = capacidades.map(cap => capacidadesAgrupadas[cap].capacidadTotal);

  // Paleta de colores verde
  const backgroundColor = [
    'rgba(56, 161, 105, 0.8)',   // verde oscuro
    'rgba(72, 187, 120, 0.8)',   // verde medio
    'rgba(104, 211, 145, 0.8)',  // verde claro
    'rgba(154, 230, 180, 0.8)',  // verde muy claro
    'rgba(198, 246, 213, 0.8)'   // verde pálido
  ];

  const borderColor = backgroundColor.map(color => color.replace('0.8', '1'));

  // Datos para el gráfico de cantidad de contenedores
  const dataCantidad = {
    labels: capacidades.map(cap => `${cap} L`),
    datasets: [
      {
        label: 'Número de Contenedores',
        data: cantidades,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }
    ]
  };

  // Datos para el gráfico de capacidad total
  const dataCapacidadTotal = {
    labels: capacidades.map(cap => `${cap} L`),
    datasets: [
      {
        label: 'Capacidad Total (L)',
        data: capacidadesTotales,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }
    ]
  };

  // Opciones comunes de configuración
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12
          },
          color: '#2F855A'
        },
        title: {
          color: '#2F855A'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2F855A',
        bodyColor: '#2F855A',
        borderColor: '#C6F6D5',
        borderWidth: 1,
        padding: 10,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += context.parsed;
              if (context.dataset.label === 'Capacidad Total (L)') {
                label += ' L';
              }
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dashboard-card">
      <h2 className="flex items-center mb-4 text-xl font-semibold text-green-800">
        <Box className="mr-2 text-green-600" />
        Distribución de Contenedores Recogidos
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Número de Contenedores */}
        <div className="p-4 bg-white rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-center text-green-700">
            Cantidad por Tamaño
          </h3>
          <Doughnut data={dataCantidad} options={options} />
        </div>
        
        {/* Gráfico de Capacidad Total */}
        <div className="p-4 bg-white rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-center text-green-700">
            Capacidad Total por Tipo
          </h3>
          <Doughnut data={dataCapacidadTotal} options={options} />
        </div>
      </div>

      {/* Resumen Detallado */}
      <div className="p-4 mt-6 rounded-lg bg-green-50">
        <h3 className="mb-3 font-semibold text-green-800">Resumen de Contenedores Recogidos</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-100">
                  <th className="p-2 text-left text-green-800">Capacidad</th>
                  <th className="p-2 text-right text-green-800">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {capacidades.map((cap, index) => (
                  <tr key={cap} className="border-b border-green-100">
                    <td className="p-2 text-green-700">{cap} L</td>
                    <td className="p-2 text-right text-green-700">{cantidades[index]}</td>
                  </tr>
                ))}
                <tr className="bg-green-100">
                  <td className="p-2 font-medium text-green-800">Total</td>
                  <td className="p-2 font-medium text-right text-green-800">{cantidades.reduce((a, b) => a + b, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-100">
                  <th className="p-2 text-left text-green-800">Capacidad</th>
                  <th className="p-2 text-right text-green-800">Total (L)</th>
                </tr>
              </thead>
              <tbody>
                {capacidades.map((cap, index) => (
                  <tr key={cap} className="border-b border-green-100">
                    <td className="p-2 text-green-700">{cap} L</td>
                    <td className="p-2 text-right text-green-700">{capacidadesTotales[index]}</td>
                  </tr>
                ))}
                <tr className="bg-green-100">
                  <td className="p-2 font-medium text-green-800">Total</td>
                  <td className="p-2 font-medium text-right text-green-800">{capacidadesTotales.reduce((a, b) => a + b, 0)} L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
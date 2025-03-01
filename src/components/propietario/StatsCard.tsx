'use client';
import { ExtendedRecogida } from '@/types/extendedTypes';
import { BarChart, LineChart, Scale, Recycle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './dashboard-styles.css';

interface StatsCardProps {
  recogidas: ExtendedRecogida[];
}

const StatsCard = ({ recogidas }: StatsCardProps) => {
  // Calcular estadísticas de recogidas
  const totalRecogidas = recogidas.length;
  const capacidadTotal = recogidas.reduce((sum, recogida) => sum + recogida.contenedor.capacidad, 0);
  const promedioCapacidad = totalRecogidas > 0 ? (capacidadTotal / totalRecogidas).toFixed(2) : 0;
  
  // Nuevos cálculos
  const PRECIO_POR_LITRO = 0.02; // €/L
  const FACTOR_CONVERSION_KG = 0.625; // kg/L
  
  const acumuladoTotalLitros = recogidas.reduce((sum, recogida) => {
    return sum + (recogida.contenedor.capacidad);
  }, 0);
  
  const kgTotales = acumuladoTotalLitros * FACTOR_CONVERSION_KG;
  const remuneracionTotal = acumuladoTotalLitros * PRECIO_POR_LITRO;

  // Calcular recogidas por tipo de residuo
  const recogidasPorTipo = recogidas.reduce((acc, recogida) => {
    const tipoResiduo = recogida.contenedor.tipoResiduo.descripcion;
    acc[tipoResiduo] = (acc[tipoResiduo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Animación para contadores
  const [animatedValues, setAnimatedValues] = useState({
    totalRecogidas: 0,
    capacidadTotal: 0,
    promedioCapacidad: 0,
    acumuladoTotalLitros: 0,
    kgTotales: 0,
    remuneracionTotal: 0
  });

  useEffect(() => {
    // Animación simple de contadores
    const duration = 1500;
    const steps = 20;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep += 1;
      const progress = Math.min(currentStep / steps, 1);
      
      setAnimatedValues({
        totalRecogidas: Math.floor(progress * totalRecogidas),
        capacidadTotal: parseFloat((progress * capacidadTotal).toFixed(1)),
        promedioCapacidad: parseFloat((progress * parseFloat(promedioCapacidad as string)).toFixed(1)),
        acumuladoTotalLitros: parseFloat((progress * acumuladoTotalLitros).toFixed(1)),
        kgTotales: parseFloat((progress * kgTotales).toFixed(1)),
        remuneracionTotal: parseFloat((progress * remuneracionTotal).toFixed(2)),
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [totalRecogidas, capacidadTotal, promedioCapacidad, acumuladoTotalLitros, kgTotales, remuneracionTotal]);

  return (
    <div className="dashboard-card card-blue animate-fadeIn" style={{ animationDelay: '0.3s' }}>
      <div className="card-header">
        <h2 className="card-title text-lg sm:text-xl">
          <BarChart size={24} />
          Estadísticas de Recogidas
        </h2>
      </div>
      <div className="card-body">
        <div className="stat-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="stat-card bg-blue-50 p-4 rounded-lg">
            <Recycle size={24} className="text-blue-500 mb-2" />
            <p className="stat-title text-blue-700 text-sm sm:text-base">Total Recogidas</p>
            <p className="stat-value text-blue-900 text-xl sm:text-2xl">{animatedValues.totalRecogidas}</p>
          </div>
          <div className="stat-card bg-green-50 p-4 rounded-lg">
            <LineChart size={24} className="text-green-500 mb-2" />
            <p className="stat-title text-green-700 text-sm sm:text-base">Capacidad Total</p>
            <p className="stat-value text-green-900 text-xl sm:text-2xl">{animatedValues.capacidadTotal} <span className="text-sm font-normal">L</span></p>
          </div>
          <div className="stat-card bg-indigo-50 p-4 rounded-lg">
            <BarChart size={24} className="text-indigo-500 mb-2" />
            <p className="stat-title text-indigo-700 text-sm sm:text-base">Promedio</p>
            <p className="stat-value text-indigo-900 text-xl sm:text-2xl">{animatedValues.promedioCapacidad} <span className="text-sm font-normal">L</span></p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Scale size={20} className="text-blue-500" />
            <span>Cálculos de residuos</span>
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="data-value">
                <span className="data-label">Total residuos:</span>
                <span className="font-semibold">{animatedValues.acumuladoTotalLitros.toFixed(2)} L</span>
              </div>
              <div className="data-value">
                <span className="data-label">Peso total:</span>
                <span className="font-semibold">{animatedValues.kgTotales.toFixed(2)} kg</span>
              </div>
              <div className="data-value">
                <span className="data-label">Remuneración:</span>
                <span className="font-semibold text-green-600 pulse">{animatedValues.remuneracionTotal.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Recycle size={20} className="text-blue-500" />
            <span>Recogidas por tipo</span>
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            {Object.entries(recogidasPorTipo).map(([tipo, cantidad], index) => (
              <div 
                key={tipo} 
                className="data-value mb-2 pb-2 border-b border-blue-100 last:mb-0 last:pb-0 last:border-0"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <span className="data-label flex items-center">
                  <span className="w-3 h-3 inline-block rounded-full bg-blue-500 mr-2"></span>
                  {tipo}:
                </span>
                <span className="badge badge-blue">{cantidad} contenedores</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link 
            href="/propietario/stats"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Más detalles
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
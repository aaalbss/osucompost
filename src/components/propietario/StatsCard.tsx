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
  // Filtrar solo las recogidas con fechaRecogidaReal no nula
  const recogidasRealizadas = recogidas.filter(recogida => recogida.fechaRecogidaReal !== null);
  
  // Calcular estadísticas solo de recogidas realizadas
  const totalRecogidas = recogidasRealizadas.length;
  const capacidadTotal = recogidasRealizadas.reduce((sum, recogida) => sum + recogida.contenedor.capacidad, 0);
  const promedioCapacidad = totalRecogidas > 0 ? (capacidadTotal / totalRecogidas).toFixed(2) : 0;
  
  // Nuevos cálculos
  const PRECIO_POR_LITRO = 0.02; // €/L
  const FACTOR_CONVERSION_KG = 0.25; // kg/L
  
  const acumuladoTotalLitros = recogidasRealizadas.reduce((sum, recogida) => {
    return sum + (recogida.contenedor.capacidad);
  }, 0);
  
  const kgTotales = acumuladoTotalLitros * FACTOR_CONVERSION_KG;
  const remuneracionTotal = kgTotales * PRECIO_POR_LITRO;

  // Calcular recogidas por tipo de residuo
  const recogidasPorTipo = recogidasRealizadas.reduce((acc, recogida) => {
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
        <h2 className="text-lg card-title sm:text-xl">
          <BarChart size={24} />
          Estadísticas de Recogidas Realizadas
        </h2>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 gap-4 stat-grid sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 rounded-lg stat-card bg-blue-50">
            <Recycle size={24} className="mb-2 text-blue-500" />
            <p className="text-sm text-blue-700 stat-title sm:text-base">Total Recogidas</p>
            <p className="text-xl text-blue-900 stat-value sm:text-2xl">{animatedValues.totalRecogidas}</p>
          </div>
          <div className="p-4 rounded-lg stat-card bg-green-50">
            <LineChart size={24} className="mb-2 text-green-500" />
            <p className="text-sm text-green-700 stat-title sm:text-base">Capacidad Total</p>
            <p className="text-xl text-green-900 stat-value sm:text-2xl">{animatedValues.capacidadTotal} <span className="text-sm font-normal">L</span></p>
          </div>
          <div className="p-4 rounded-lg stat-card bg-indigo-50">
            <BarChart size={24} className="mb-2 text-indigo-500" />
            <p className="text-sm text-indigo-700 stat-title sm:text-base">Promedio</p>
            <p className="text-xl text-indigo-900 stat-value sm:text-2xl">{animatedValues.promedioCapacidad} <span className="text-sm font-normal">L</span></p>
          </div>
        </div>
        
        <div className="pt-6 mt-8 border-t border-gray-100">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
            <Scale size={20} className="text-blue-500" />
            <span>Cálculos de residuos</span>
          </h3>
          <div className="p-4 rounded-lg bg-blue-50">
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

        <div className="pt-6 mt-8 border-t border-gray-100">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
            <Recycle size={20} className="text-blue-500" />
            <span>Recogidas por tipo</span>
          </h3>
          <div className="p-4 rounded-lg bg-blue-50">
            {Object.entries(recogidasPorTipo).map(([tipo, cantidad], index) => (
              <div 
                key={tipo} 
                className="pb-2 mb-2 border-b border-blue-100 data-value last:mb-0 last:pb-0 last:border-0"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <span className="flex items-center data-label">
                  <span className="inline-block w-3 h-3 mr-2 bg-blue-500 rounded-full"></span>
                  {tipo}:
                </span>
                <span className="badge badge-blue">{cantidad} contenedores</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6 mt-8 text-center border-t border-gray-100">
          <Link 
            href="/propietario/stats"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
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
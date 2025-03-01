'use client';
import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { RecogidasHorario } from './RecogidasHorario';
import { ContenedoresChart } from './ContenedoresChart';
import { CapacidadesContenedoresChart } from './CapacidadesContenedoresChart';
import { RemuneracionContenedores } from './RemuneracionContenedores';
import { RecogidasCapacidad } from './RecogidasCapacidad';
import { Recogida, PuntoRecogida } from './tipos';
import { getNombreResiduoPorId } from '@/utils/formatoResiduos';

interface UserStatsProps {
  propietarioDni: string;
}

const UserStats: React.FC<UserStatsProps> = ({ propietarioDni }) => {
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  const [puntoRecogida, setPuntoRecogida] = useState<PuntoRecogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recocidasResponse = await fetch('/api/recogidas');
        const recocidasData: Recogida[] = await recocidasResponse.json();
        
        const ownerRecogidas = recocidasData.filter(
          (recogida) => {
            if (!recogida.contenedor?.puntoRecogida?.propietario) {
              console.warn('Incomplete recogida data:', recogida);
              return false;
            }
            return recogida.contenedor.puntoRecogida.propietario.dni === propietarioDni;
          }
        );
        
        const puntosResponse = await fetch('/api/puntos-recogida');
        const puntosData: PuntoRecogida[] = await puntosResponse.json();
        
        const ownerPuntos = puntosData.filter(
          (punto) => punto.propietario?.dni === propietarioDni
        );
        
        setRecogidas(ownerRecogidas);
        setPuntoRecogida(ownerPuntos);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Error fetching data');
        setLoading(false);
      }
    };

    if (propietarioDni) {
      fetchData();
    }
  }, [propietarioDni]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Contabilizar el número total de recogidas
  const totalRecogidas = recogidas.length;
  
  // Obtener tipos de residuo únicos con formato correcto
  const tiposResiduoUnicos = [...new Set(recogidas.map(r => {
    // Obtener nombre formateado según el ID
    return getNombreResiduoPorId(r.contenedor.tipoResiduo.id) || r.contenedor.tipoResiduo.descripcion;
  }))];
  
  // Calcular el acumulado total (número de contenedores * capacidad de cada contenedor)
  const acumuladoTotal = recogidas.reduce((sum, r) => {
    return sum + r.contenedor.capacidad;
  }, 0);
  
  // Calcular kg totales (acumulado total * 0.625)
  const kgTotales = acumuladoTotal * 0.625;
  
  // Calcular remuneración (acumulado total * 0.02€/L)
  const remuneracionTotal = acumuladoTotal * 0.02;

  return (
    <div className="stats-dashboard w-full space-y-6 px-2 sm:px-0">
      {/* Resumen general */}
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <div className="w-full">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Resumen General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-800">Total Recogidas</p>
              <p className="text-2xl font-bold text-green-700">{totalRecogidas}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-800">Tipos de Residuo</p>
              <p className="text-2xl font-bold text-green-700 truncate" title={tiposResiduoUnicos.join(', ')}>
                {tiposResiduoUnicos.join(', ')}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-800">Kg Estimados</p>
              <div className="text-2xl font-bold text-green-700 flex items-baseline justify-center">
                <span>{kgTotales.toFixed(1)}</span>
                <span className="ml-1">kg</span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-800">Remuneración</p>
              <p className="text-2xl font-bold text-green-700">{remuneracionTotal.toFixed(2)} €</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Recogidas por Horario */}
        <div className="w-full col-span-1 md:col-span-2">
          <RecogidasHorario recogidas={recogidas} />
        </div>
        
        {/* Gráfico de Distribución de Contenedores */}
      {/*   <div className="w-full h-full">
          <ContenedoresChart recogidas={recogidas} />
        </div>*/}
        
        {/* Gráfico de Capacidades de Contenedores */}
        <div className="w-full h-full">
          <CapacidadesContenedoresChart recogidas={recogidas} />
        </div>
        
        {/* Gráfico de Remuneración */}
        <div className="w-full h-full">
          <RemuneracionContenedores recogidas={recogidas} />
        </div>
        
        {/* Gráfico de Recogidas por Capacidad */}
       {/* <div className="w-full h-full">
          <RecogidasCapacidad recogidas={recogidas} />
        </div> */}
      </div>
    </div>
  );
};

export default UserStats;
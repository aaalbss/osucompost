'use client';
import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { RecogidasHorario } from './RecogidasHorario';
import { CapacidadesContenedoresChart } from './CapacidadesContenedoresChart';
import { RemuneracionContenedores } from './RemuneracionContenedores';
import { Recogida, PuntoRecogida } from './tipos';
import { getNombreResiduoPorId } from '@/utils/formatoResiduos';

interface UserStatsProps {
  propietarioDni: string;
  usuarioId?: number; // ID del usuario actual (opcional)
}

const UserStats: React.FC<UserStatsProps> = ({ propietarioDni, usuarioId }) => {
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  const [puntoRecogida, setPuntoRecogida] = useState<PuntoRecogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para recogidas filtradas (completadas)
  const [recogidasCompletadas, setRecogidasCompletadas] = useState<Recogida[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recocidasResponse = await fetch('/api/recogidas');
        const recocidasData: Recogida[] = await recocidasResponse.json();
        
        // Filtrar recogidas del propietario
        const ownerRecogidas = recocidasData.filter(
          (recogida) => {
            if (!recogida.contenedor?.puntoRecogida?.propietario) {
              console.warn('Incomplete recogida data:', recogida);
              return false;
            }
            
            return recogida.contenedor.puntoRecogida.propietario.dni === propietarioDni;
          }
        );
        
        // Guardar todas las recogidas del propietario
        setRecogidas(ownerRecogidas);
        
        // Ahora filtramos para obtener solo las completadas
        // (fechaRecogidaReal !== null y asociadas al usuario si se proporcionó usuarioId)
        const completadas = ownerRecogidas.filter(recogida => {
          // Verificar que tiene fecha de recogida real
          const tieneFechaRecogida = recogida.fechaRecogidaReal !== null;
          
          // Si se proporciona usuarioId, verificar si la recogida está asociada a ese usuario
          const esDelUsuario = usuarioId 
            ? recogida.usuarioId === usuarioId || recogida.usuario?.id === usuarioId
            : true; // Si no se proporciona usuarioId, consideramos todas las recogidas
          
          // La recogida debe cumplir ambas condiciones
          return tieneFechaRecogida && esDelUsuario;
        });
        
        // Guardar las recogidas completadas filtradas
        setRecogidasCompletadas(completadas);
        
        // Obtener puntos de recogida
        const puntosResponse = await fetch('/api/puntos-recogida');
        const puntosData: PuntoRecogida[] = await puntosResponse.json();
        
        const ownerPuntos = puntosData.filter(
          (punto) => punto.propietario?.dni === propietarioDni
        );
        
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
  }, [propietarioDni, usuarioId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Contabilizar el número total de recogidas completadas
  const totalRecogidas = recogidasCompletadas.length;
  
  // Obtener tipos de residuo únicos con formato correcto (solo de recogidas completadas)
  const tiposResiduoUnicos = [...new Set(recogidasCompletadas.map(r => {
    // Obtener nombre formateado según el ID
    return getNombreResiduoPorId(r.contenedor.tipoResiduo.id) || r.contenedor.tipoResiduo.descripcion;
  }))];
  
  // Calcular el acumulado total (número de contenedores * capacidad de cada contenedor)
  const acumuladoTotal = recogidasCompletadas.reduce((sum, r) => {
    return sum + r.contenedor.capacidad;
  }, 0);
  
  // Calcular kg totales (acumulado total * 0.25)
  const kgTotales = acumuladoTotal * 0.25;
  
  // Calcular remuneración (kg totales * 0.02€/kg)
  const remuneracionTotal = kgTotales * 0.02;


  return (
    <div className="w-full px-2 space-y-6 stats-dashboard sm:px-0">
      {/* Resumen general */}
      <div className="p-4 bg-white rounded-lg shadow-md sm:p-6">
        <div className="w-full">
          <h2 className="mb-4 text-xl font-semibold text-green-800">Resumen de Recogidas Completadas</h2>
      
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 text-center rounded-lg bg-green-50">
              <p className="text-sm text-green-800">Total Recogidas</p>
              <p className="text-2xl font-bold text-green-700">{totalRecogidas}</p>
            </div>
            <div className="p-4 text-center rounded-lg bg-green-50">
              <p className="text-sm text-green-800">Tipos de Residuo</p>
              <p className="text-2xl font-bold text-green-700 truncate" title={tiposResiduoUnicos.join(', ')}>
                {tiposResiduoUnicos.length > 0 ? tiposResiduoUnicos.join(', ') : "Ninguno"}
              </p>
            </div>
            <div className="p-4 text-center rounded-lg bg-green-50">
              <p className="text-sm text-green-800">Kg Estimados</p>
              <div className="flex items-baseline justify-center text-2xl font-bold text-green-700">
                <span>{kgTotales.toFixed(1)}</span>
                <span className="ml-1">kg</span>
              </div>
            </div>
            <div className="p-4 text-center rounded-lg bg-green-50">
              <p className="text-sm text-green-800">Remuneración</p>
              <p className="text-2xl font-bold text-green-700">{remuneracionTotal.toFixed(2)} €</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mostrar mensaje si no hay recogidas completadas */}
      {recogidasCompletadas.length === 0 && (
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <p className="text-lg text-green-700">
            No hay recogidas completadas para mostrar. Solo se consideran recogidas con fecha de recogida real.
          </p>
        </div>
      )}

      {/* Gráficos (solo se muestran si hay recogidas completadas) */}
      {recogidasCompletadas.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Gráfico de Recogidas por Horario */}
          <div className="w-full col-span-1 md:col-span-2">
            <RecogidasHorario recogidas={recogidasCompletadas} usuarioId={usuarioId} />
          </div>
          
          {/* Gráfico de Capacidades de Contenedores */}
          <div className="w-full h-full">
            <CapacidadesContenedoresChart recogidas={recogidasCompletadas} usuarioId={usuarioId} />
          </div>
          
          {/* Gráfico de Remuneración */}
          <div className="w-full h-full">
            <RemuneracionContenedores recogidas={recogidasCompletadas} usuarioId={usuarioId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStats;
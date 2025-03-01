'use client';
import React, { useEffect, useState } from 'react';
import { ExtendedRecogida } from '@/types/extendedTypes';
import { CalendarDays, Clock, MapPin, AlertTriangle } from 'lucide-react';
import './dashboard-styles.css';

// Define props interface
interface ProximasRecogidasProps {
  recogidas: ExtendedRecogida[];
}

const ProximasRecogidas: React.FC<ProximasRecogidasProps> = ({ recogidas }) => {
  const [ahora, setAhora] = useState<Date>(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAhora(new Date());
    }, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const proximasRecogidas = recogidas
    .filter(recogida => 
      // Incluir recogidas sin fecha de recogida real y futuras
      !recogida.fechaRecogidaReal && 
      new Date(recogida.fechaRecogidaEstimada) > ahora
    )
    .sort((a, b) => 
      new Date(a.fechaRecogidaEstimada).getTime() - 
      new Date(b.fechaRecogidaEstimada).getTime()
    );

  const obtenerInfoFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleString('es-ES', { month: 'short' }).replace('.', '');
    const diaSemana = fecha.toLocaleString('es-ES', { weekday: 'short' }).replace('.', '');
    return { dia, mes, diaSemana };
  };

  // Nueva función para obtener hora basada en el horario
  const obtenerHora = (recogida: ExtendedRecogida) => {
    // Verificar si existe horario en puntoRecogida
    const horario = recogida.horarioSeleccionado || recogida.contenedor?.puntoRecogida?.horario;
    
    if (horario === 'M') {
      return '10:00'; // Horario de mañana
    } else if (horario === 'T') {
      return '16:00'; // Horario de tarde
    } else if (horario === 'N') {
      return '22:00'; // Horario de noche
    } else {
      // Si no hay horario específico, usar la hora de la fecha estimada
      const fecha = new Date(recogida.fechaRecogidaEstimada);
      return fecha.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="dashboard-card card-green animate-fadeIn" style={{ animationDelay: '0.5s' }}>
      <div className="card-header">
        <h2 className="card-title">
          <CalendarDays size={24} />
          Próximas Recogidas
        </h2>
      </div>
      
      <div className="card-body">
        {proximasRecogidas.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} className="text-green-300 mb-4" />
            <p className="text-green-600">No hay recogidas programadas próximamente.</p>
          </div>
        ) : (
          <div className="recogidas-grid ">
            {proximasRecogidas.map((recogida, index) => {
              const { dia, mes, diaSemana } = obtenerInfoFecha(recogida.fechaRecogidaEstimada);
              const hora = obtenerHora(recogida);
              const tipoResiduo = recogida.contenedor?.tipoResiduo?.descripcion || 'No especificado';
              const esOrganico = tipoResiduo.toLowerCase().includes('organico');
              
              // Obtener texto para el horario
              const textoHorario = (recogida.horarioSeleccionado || recogida.contenedor?.puntoRecogida?.horario) === 'M' 
                ? 'Mañana' 
                : (recogida.horarioSeleccionado || recogida.contenedor?.puntoRecogida?.horario) === 'T'
                  ? 'Tarde'
                  : (recogida.horarioSeleccionado || recogida.contenedor?.puntoRecogida?.horario) === 'N'
                    ? 'Noche'
                    : hora;
              
              return (
                <div 
                  key={recogida.id} 
                  className="next-pickup animate-fadeIn"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div 
                    className="pickup-date" 
                    style={{ 
                      backgroundColor: esOrganico ? '#10b981' : '#3b82f6'
                    }}
                  >
                    <span className="date-month">{mes}</span>
                    <span className="date-day">{dia}</span>
                    <span className="date-month">{diaSemana}</span>
                    <div className="flex items-center gap-1 mt-1 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                      <Clock size={12} />
                      {textoHorario}
                    </div>
                  </div>
                  
                  <div className="pickup-details">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`badge ${esOrganico ? 'badge-green' : 'badge-blue'} pickup-type`}>
                        {tipoResiduo}
                      </span>
                      <span className="badge badge-purple">
                        {recogida.contenedor?.capacidad || 'N/A'} litros
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-2 bg-gray-50 p-2 rounded">
                      <MapPin size={16} className={esOrganico ? 'text-green-500' : 'text-blue-500'} />
                      <div className="text-sm text-gray-700">
                        {recogida.contenedor?.puntoRecogida?.direccion}, 
                        <span className="font-medium ml-1">{recogida.contenedor?.puntoRecogida?.localidad}</span>
                      </div>
                    </div>
                    
                    {recogida.incidencias && (
                      <div className="flex items-start gap-2 mt-2 bg-amber-50 p-2 rounded border-l-2 border-amber-400">
                        <AlertTriangle size={16} className="text-amber-500" />
                        <div className="text-sm text-amber-800">
                          {recogida.incidencias}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProximasRecogidas;
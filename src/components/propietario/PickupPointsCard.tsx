'use client';
import { PuntoRecogida } from '@/types/types';
import { MapPin, Clock, Building, Bookmark } from 'lucide-react';
import './dashboard-styles.css';

interface PickupPointsCardProps {
  puntosRecogida: PuntoRecogida[];
}

const PickupPointsCard = ({ puntosRecogida }: PickupPointsCardProps) => {
  return (
    <div className="dashboard-card card-purple animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="card-header">
        <h2 className="card-title">
          <MapPin size={24} />
          Puntos de Recogida
        </h2>
      </div>
      <div className="card-body">
        {puntosRecogida.length > 0 ? (
          <div className="space-y-4">
            {puntosRecogida.map((punto, index) => (
              <div 
                key={punto.id} 
                className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-all duration-300"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building size={18} className="text-purple-500" />
                    <div>
                      <p className="text-xs text-purple-700 font-medium">Localidad</p>
                      <p className="font-medium">{punto.localidad}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark size={18} className="text-purple-500" />
                    <div>
                      <p className="text-xs text-purple-700 font-medium">Tipo</p>
                      <p className="font-medium">
                        <span className="badge badge-purple">{punto.tipo}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin size={18} className="text-purple-500" />
                    <div>
                      <p className="text-xs text-purple-700 font-medium">Dirección</p>
                      <p className="font-medium">{punto.direccion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Clock size={18} className="text-purple-500" />
                    <div>
                      <p className="text-xs text-purple-700 font-medium">Horario</p>
                      <p className="font-medium">{punto.horario}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <MapPin size={48} className="text-purple-300 mb-4" />
            <p className="text-purple-600">No hay puntos de recogida registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupPointsCard;
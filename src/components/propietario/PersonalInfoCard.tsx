'use client';
import { Propietario } from '@/types/types';
import { UserCircle, Phone, Mail, Calendar, CreditCard } from 'lucide-react';
import './dashboard-styles.css';

interface PersonalInfoCardProps {
  propietario: Propietario;
  fechaAlta: string;
  formatearFecha: (fecha: string) => string;
}

const PersonalInfoCard = ({ propietario, fechaAlta, formatearFecha }: PersonalInfoCardProps) => {
  // Extraer solo la fecha sin la hora para mostrar en "Cliente desde"
  const fechaCorta = formatearFecha(fechaAlta).split(',')[0];
  
  return (
    <div className="dashboard-card card-green animate-fadeIn" style={{ animationDelay: '0.1s' }}>
      <div className="card-header bg-gradient-to-r from-green-50 to-emerald-50">
        <h2 className="card-title">
          <UserCircle size={24} />
          Información Personal
        </h2>
      </div>
      
      <div className="card-body">
        {/* Cabecera con avatar y nombre */}
        <div className="profile-header">
          <div className="profile-avatar">
            <UserCircle size={40} />
          </div>
          <div>
            <h3 className="profile-name">{propietario.nombre}</h3>
            <p className="profile-since">Cliente desde {fechaCorta}</p>
          </div>
        </div>
        
        {/* Tarjetas de información */}
        <div className="info-card">
          <CreditCard size={20} className="info-icon" />
          <div className="info-content">
            <p className="info-label">DNI</p>
            <p className="info-value">{propietario.dni}</p>
          </div>
        </div>
        
        <div className="info-card">
          <Phone size={20} className="info-icon" />
          <div className="info-content">
            <p className="info-label">Teléfono</p>
            <p className="info-value">{propietario.telefono}</p>
          </div>
        </div>
        
        <div className="info-card">
          <Mail size={20} className="info-icon" />
          <div className="info-content">
            <p className="info-label">Email</p>
            <a 
              href={`mailto:${propietario.email}`} 
              className="info-value text-blue-600 hover:text-blue-800 transition-colors"
            >
              {propietario.email}
            </a>
          </div>
        </div>
        
        <div className="info-card">
          <Calendar size={20} className="info-icon" />
          <div className="info-content">
            <p className="info-label">Fecha de alta</p>
            <p className="info-value">{formatearFecha(fechaAlta)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
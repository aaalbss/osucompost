'use client';
import { Propietario } from '@/types/types';
import { UserCircle, Phone, Mail, CreditCard, Package } from 'lucide-react';
import './dashboard-styles.css';

interface PersonalInfoCardProps {
  propietario: Propietario;
  tipoContenedor?: string;
}

const PersonalInfoCard = ({ propietario, tipoContenedor }: PersonalInfoCardProps) => {
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
        
        {/* Nuevo campo para el tipo de contenedor */}
        {tipoContenedor && (
          <div className="info-card">
            <Package size={20} className="info-icon" />
            <div className="info-content">
              <p className="info-label">Tipo de contenedor</p>
              <p className="info-value">{tipoContenedor}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoCard;
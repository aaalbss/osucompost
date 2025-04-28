'use client';

import React, { useState, useEffect } from 'react';
import { Home, Users, MapPin, Menu, X, LogOut, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OperariosHeaderProps {
  setVista: (vista: string) => void;
  vistaActual: string;
  onLogout?: () => void; // Añadimos esta prop para manejar el cierre de sesión
}

const OperariosHeader: React.FC<OperariosHeaderProps> = ({ 
  setVista, 
  vistaActual = 'dashboard',
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Add scroll listener for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to handle navigation
  const navigateTo = (vista: string) => {
    if (vista === 'home') {
      // Navegar a la página principal (page.tsx)
      router.push('/');
    } else {
      // Cambiar la vista dentro del dashboard de operarios
      setVista(vista);
      setIsMobileMenuOpen(false);
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Eliminar la información de sesión del localStorage
    localStorage.removeItem('userUsername');
    localStorage.removeItem('cookiesModalShown');
    
    // Si se proporciona una función onLogout, la llamamos
    if (onLogout) {
      onLogout();
    } else {
      // Si no, redirigimos a la página principal
      router.push('/');
    }
    
    // Cerramos el menú móvil si está abierto
    setIsMobileMenuOpen(false);
  };

  // Determine if a route is active
  const isActive = (vista: string) => {
    return vistaActual === vista;
  };

  // Efecto para ocultar headers adicionales
  useEffect(() => {
    // Buscar y ocultar cualquier header adicional
    const headers = document.querySelectorAll('header');
    if (headers.length > 1) {
      // El primer header es nuestro componente, los demás se ocultan
      for (let i = 1; i < headers.length; i++) {
        headers[i].style.display = 'none';
      }
    }
  }, []);

  return (
    <>
      <header 
        className={`custom-header bg-white border-b border-green-100 sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-md py-2' : 'shadow-sm py-4'
        }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* OSUCOMPOST Title/Logo with hover effect */}
            <div 
              className="relative text-2xl font-bold text-green-800 cursor-pointer group"
              onClick={() => navigateTo('home')}
            >
              OSUCOMPOST
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </div>
            
            {/* Desktop Navigation Menu - Hidden on mobile */}
            <div className="items-center hidden space-x-4 md:flex">
              {/* Home Button - Cambiado a "Zona Operarios" */}
              <button 
                onClick={() => navigateTo('dashboard')}
                className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                  isActive('dashboard')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <Home className="mr-2" size={20} />
                <span>Zona Operarios</span>
              </button>
              
              {/* Propietarios Button */}
              <button 
                onClick={() => navigateTo('propietarios')}
                className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                  isActive('propietarios')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <Users className="mr-2" size={20} />
                <span>Propietarios</span>
              </button>
              
              {/* Puntos de Recogida Button */}
              <button 
                onClick={() => navigateTo('puntosRecogida')}
                className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                  isActive('puntosRecogida')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <MapPin className="mr-2" size={20} />
                <span>Puntos de Recogida</span>
              </button>
              
              {/* Contenedores Button */}
              <button 
                onClick={() => navigateTo('contenedores')}
                className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                  isActive('contenedores')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <Trash2 className="mr-2" size={20} />
                <span>Contenedores</span>
              </button>
              
              {/* Botón de cerrar sesión */}
              <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-white transition-all duration-200 bg-red-600 rounded hover:bg-red-700"
              >
                <LogOut className="mr-2" size={20} />
                <span>Salir</span>
              </button>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="flex md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-green-800 transition-all duration-200 rounded hover:bg-green-50"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Sidebar - Shown only on mobile */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} onClick={() => setIsMobileMenuOpen(false)}>
        </div>

        <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-6">
              <div 
                className="text-xl font-bold text-green-800 cursor-pointer"
                onClick={() => navigateTo('home')}
              >
                OSUCOMPOST
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            
            <div className="flex flex-col flex-1 gap-4">
              {/* Mobile Navigation Items - Cambiado a "Zona Operarios" */}
              <button 
                onClick={() => navigateTo('dashboard')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ${
                  isActive('dashboard')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <Home size={20} />
                Zona Operarios
              </button>
              
              <button 
                onClick={() => navigateTo('propietarios')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ${
                  isActive('propietarios')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <Users size={20} />
                Propietarios
              </button>
              
              <button 
                onClick={() => navigateTo('puntosRecogida')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ${
                  isActive('puntosRecogida')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <MapPin size={20} />
                Puntos de Recogida
              </button>
              
              <button 
                onClick={() => navigateTo('contenedores')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ${
                  isActive('contenedores')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <Trash2 size={20} />
                Contenedores
              </button>
              
              {/* Botón de cerrar sesión en el menú móvil */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 mt-auto text-white transition duration-300 bg-red-600 rounded-md hover:bg-red-700"
              >
                <LogOut size={20} />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default OperariosHeader;
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, User, BarChart2, Calendar, Menu, X } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

interface UserHeaderProps {
  onOpenMenu?: () => void;
  propietarioNombre?: string;
}

const UserHeader = ({ onOpenMenu, propietarioNombre = 'Usuario' }: UserHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOperario, setIsOperario] = useState(false);
  
  // Estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState('/');
  
  // Verificar si es un operario al montar el componente
  useEffect(() => {
    const operarioAcceso = localStorage.getItem("operarioAcceso") === "true";
    const fromOperarios = localStorage.getItem("fromOperarios") === "true";
    setIsOperario(operarioAcceso && fromOperarios);
    
    console.log(`Usuario actual: ${propietarioNombre}, Es operario: ${operarioAcceso && fromOperarios}`);
  }, [propietarioNombre]);

  // Set active route based on current pathname
  useEffect(() => {
    setActiveRoute(pathname || '');
  }, [pathname]);

  // Add scroll listener for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para mostrar el modal antes de navegar
  const handleNavigationWithConfirm = (path: string) => {
    setNavigationTarget(path);
    setShowConfirmModal(true);
  };

  // Función para confirmar la navegación
  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    setIsMobileMenuOpen(false); // Cerrar menú móvil si está abierto
    router.push(navigationTarget);
  };

  // Función para cancelar la navegación
  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
  };

  // Function to handle navigation
  const navigateTo = (path: string) => {
    if (path === '/') {
      // Si es navegación a inicio, mostrar confirmación
      handleNavigationWithConfirm(path);
    } else {
      // Para otras rutas, navegar directamente
      router.push(path);
      setIsMobileMenuOpen(false);
    }
  };

  // Determine if a route is active
  const isActive = (path: string) => {
    return activeRoute === path || activeRoute.startsWith(path);
  };

  // Find and hide duplicate header
  useEffect(() => {
    // Busca el header duplicado en el DOM
    const duplicateHeaders = document.querySelectorAll('h1');
    duplicateHeaders.forEach(header => {
      if (header.textContent === 'OSUCOMPOST' && 
          header !== document.querySelector('header .cursor-pointer')) {
        // Oculta el header duplicado si no es nuestro componente
        const parentHeader = header.closest('header');
        if (parentHeader && parentHeader !== document.querySelector('header')) {
          parentHeader.style.display = 'none';
        }
      }
    });
  }, []);

  const handleOpenSideMenu = () => {
    if (onOpenMenu) {
      onOpenMenu();
    }
  }

  return (
    <>
      <header 
        className={`bg-white border-b border-green-100 sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'shadow-md py-2' : 'shadow-sm py-4'
        }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* OSUCOMPOST Title/Logo with hover effect */}
            <div 
              className="relative text-2xl font-bold text-green-800 cursor-pointer group"
              onClick={() => handleNavigationWithConfirm('/')}
            >
              OSUCOMPOST
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </div>
            
            {/* Desktop Navigation Menu - Hidden on mobile */}
            <div className="items-center hidden space-x-4 md:flex">
              {/* Home Button */}
              <button 
                onClick={() => handleNavigationWithConfirm('/')}
                className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                  isActive('/') && !isActive('/propietario')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <Home className="mr-2" size={20} />
                <span>Inicio</span>
              </button>
              
              {/* Zona de usuario Button */}
              <button 
                onClick={() => navigateTo('/propietario')}
                className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                  isActive('/propietario') && !isActive('/propietario/stats') && !isActive('/propietario/solicitud-recogida')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <User className="mr-2" size={20} />
                <span>Zona de usuario</span>
              </button>
              
              {/* Estadísticas Button */}
              <button 
                onClick={() => navigateTo('/propietario/stats')}
                className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                  isActive('/propietario/stats') 
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <BarChart2 className="mr-2" size={20} />
                <span>Estadísticas</span>
              </button>
              
              {/* Solicitar Recogida Button - Solo mostrar si NO es un operario */}
              {!isOperario && (
                <button 
                  onClick={() => navigateTo('/propietario/solicitud-recogida')}
                  className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                    isActive('/propietario/solicitud-recogida')
                      ? 'bg-green-600 text-white' 
                      : 'text-green-800 hover:bg-green-50'
                  }`}
                >
                  <Calendar className="mr-2" size={20} />
                  <span>Solicitar Recogida</span>
                </button>
              )}
              
              {/* Configuración Button */}
              <button 
                onClick={handleOpenSideMenu}
                className="flex items-center px-4 py-2 text-green-800 transition-all duration-200 rounded hover:bg-green-50"
              >
                <Menu className="mr-2" size={20} />
                <span>Más</span>
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
                onClick={() => handleNavigationWithConfirm('/')}
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
              {/* Mobile Navigation Items */}
              <button 
                onClick={() => handleNavigationWithConfirm('/')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ${
                  isActive('/') && !isActive('/propietario')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <Home size={20} />
                Inicio
              </button>
              
              <button 
                onClick={() => navigateTo('/propietario')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ${
                  isActive('/propietario') && !isActive('/propietario/stats') && !isActive('/propietario/solicitud-recogida')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <User size={20} />
                Zona de usuario
              </button>
              
              <button 
                onClick={() => navigateTo('/propietario/stats')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ${
                  isActive('/propietario/stats')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
              >
                <BarChart2 size={20} />
                Estadísticas
              </button>
              
              {/* Solicitar Recogida Button - Solo mostrar si NO es un operario */}
              {!isOperario && (
                <button 
                  onClick={() => navigateTo('/propietario/solicitud-recogida')}
                  className={`py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ${
                    isActive('/propietario/solicitud-recogida')
                      ? 'bg-green-600 text-white' 
                      : 'text-green-800 hover:bg-green-50'
                  }`}
                >
                  <Calendar size={20} />
                  Solicitar Recogida
                </button>
              )}
              
              <div className="my-2 border-t border-gray-200"></div>
              
              <button 
                onClick={handleOpenSideMenu}
                className="flex items-center gap-2 px-4 py-2 text-green-800 transition duration-300 rounded-md hover:bg-green-50"
              >
                <Menu size={20} />
                Más opciones
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de confirmación para navegación a inicio */}
      <ConfirmModal
        isOpen={showConfirmModal}
        message="¿Está seguro que desea salir de la zona de usuario?Esto cerrará su sesión."
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
    </>
  );
};

export default UserHeader;
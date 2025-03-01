'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, BarChart2, Bell, Menu } from 'lucide-react';

interface UserHeaderProps {
  onOpenMenu?: () => void;
  propietarioNombre?: string;
}

const UserHeader = ({ onOpenMenu, propietarioNombre = 'Usuario' }: UserHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Function to handle navigation
  const navigateTo = (path: string) => {
    router.push(path);
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

  return (
    <header 
      className={`bg-white border-b border-green-100 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md py-2' : 'shadow-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* OSUCOMPOST Title/Logo with hover effect */}
          <div 
            className="cursor-pointer text-green-800 font-bold text-2xl relative group"
            onClick={() => navigateTo('/')}
          >
            OSUCOMPOST
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </div>
          
          {/* Navigation Menu */}
          <div className="flex items-center space-x-4">
            {/* Zona de usuario Button */}
            <button 
              onClick={() => navigateTo('/propietario')}
              className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                isActive('/propietario') && !isActive('/propietario/stats') && !isActive('/propietario/solicitud-recogida')
                  ? 'bg-green-600 text-white' 
                  : 'text-green-800 hover:bg-green-50'
              }`}
            >
              <Home className="mr-2" size={20} />
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
            
            {/* Solicitar Recogida Button */}
            <button 
              onClick={() => navigateTo('/propietario/solicitud-recogida')}
              className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                isActive('/propietario/solicitud-recogida')
                  ? 'bg-green-600 text-white' 
                  : 'text-green-800 hover:bg-green-50'
              }`}
            >
              <Bell className="mr-2" size={20} />
              <span>Solicitar Recogida</span>
            </button>
            
            {/* Configuración Button */}
            <button 
              onClick={onOpenMenu}
              className="flex items-center px-4 py-2 text-green-800 hover:bg-green-50 rounded transition-all duration-200"
            >
              <Menu className="mr-2" size={20} />
              <span>Más</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserHeader from '@/components/propietario/UserHeader';
import UserStats from '@/components/propietario/user-stats/UserStats';
import { 
  User, 
  LogOut, 
  Settings, 
  X
} from 'lucide-react';

export default function PropietarioStatsPage() {
  const [propietarioDni, setPropietarioDni] = useState<string | null>(null);
  const [propietarioNombre, setPropietarioNombre] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const dni = localStorage.getItem('userDni');
    const nombre = localStorage.getItem('userNombre');

    if (!dni) {
      // Redirect to login if no DNI is found
      router.push('/login');
      return;
    }

    setPropietarioDni(dni);
    setPropietarioNombre(nombre);
  }, [router]);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('userDni');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userNombre');

    // Redirect to login page
    router.push('/login');
  };

  const handleOpenMenu = () => {
    setIsSideMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsSideMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  if (!propietarioDni) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <UserHeader 
        onOpenMenu={handleOpenMenu} 
        propietarioNombre={propietarioNombre || 'Usuario'}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-green-800">Tus Estadísticas</h1>
          </div>
          
          {propietarioDni && (
            <UserStats propietarioDni={propietarioDni} />
          )}
        </div>
      </main>

      {/* Side Menu */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-green-800">Menú</h2>
              <button 
                onClick={handleCloseMenu}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <User size={24} className="text-green-800" />
                  </div>
                  <div>
                    <p className="font-medium">{propietarioNombre || 'Usuario'}</p>
                    <p className="text-sm text-gray-500">{propietarioDni}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => navigateTo('/perfil')}
                  className="w-full text-left py-2 px-3 rounded hover:bg-green-50 text-gray-700 flex items-center"
                >
                  <Settings size={18} className="mr-2 text-green-700" />
                  Configuración de cuenta
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-3 rounded hover:bg-red-50 text-red-600 flex items-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut, UserMinus, X } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

interface SidebarMenuProps {
  menuAbierto: boolean;
  setMenuAbierto: (estado: boolean) => void;
  onLogout: () => void;
  onUnregister: () => void;
}

const SidebarMenu = ({ menuAbierto, setMenuAbierto, onLogout, onUnregister }: SidebarMenuProps) => {
  const router = useRouter();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [accionConfirmacion, setAccionConfirmacion] = useState<'logout' | 'unregister' | 'home'>('logout');
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleActionClick = (accion: 'logout' | 'unregister' | 'home') => {
    setAccionConfirmacion(accion);
    setMostrarConfirmacion(true);
  };

  const handleConfirm = () => {
    if (accionConfirmacion === 'logout') {
      onLogout();
      // Redirigir a la página principal usando el router de Next.js
      router.push('/');
    } else if (accionConfirmacion === 'unregister') {
      onUnregister();
      // Redirigir a la página principal usando el router de Next.js
      router.push('/');
    } else if (accionConfirmacion === 'home') {
      // Redirigir a la página principal sin ejecutar logout o unregister
      router.push('/');
    }
    
    setMostrarConfirmacion(false);
    setMenuAbierto(false); // Cerrar el menú después de confirmar la acción
  };

  const handleCancel = () => {
    setMostrarConfirmacion(false);
  };

  return (
    <>
      {/* Overlay para dispositivos móviles */}
      {menuAbierto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuAbierto(false)}
        ></div>
      )}
      
      {/* Menú lateral */}
      <div 
        className={`fixed top-0 ${isMobile ? 'left-0' : 'right-0'} w-64 h-full bg-white shadow-lg transform ${
          menuAbierto 
            ? 'translate-x-0' 
            : isMobile ? '-translate-x-full' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Menú</h3>
            <button 
              onClick={() => setMenuAbierto(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            {/* Botón de Inicio */}
            <button 
              onClick={() => handleActionClick('home')}
              className="py-2 px-4 bg-green-800/10 text-green-800 rounded-md hover:bg-green-200 transition duration-300 flex items-center gap-2"
            >
              <Home className="h-5 w-5" />
              Ir a Inicio
            </button>
            
            {/* Cerrar Sesión */}
            <button 
              onClick={() => handleActionClick('logout')}
              className="py-2 px-4 bg-green-800/10 text-green-800 rounded-md hover:bg-green-200 transition duration-300 flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
            
            {/* Darse de Baja */}
            <button 
              onClick={() => handleActionClick('unregister')}
              className="py-2 px-4 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition duration-300 flex items-center gap-2"
            >
              <UserMinus className="h-5 w-5" />
              Darse de Baja
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación usando el componente ConfirmModal */}
      <ConfirmModal
        isOpen={mostrarConfirmacion}
        message={
          accionConfirmacion === 'unregister' 
            ? '¿Está seguro que desea darse de baja del sistema? Esta acción no se puede deshacer y se eliminarán todos sus datos.'
            : accionConfirmacion === 'logout'
              ? '¿Está seguro que desea cerrar la sesión?'
              : '¿Está seguro que desea salir de la zona de usuario? Esto cerrará su sesión.'
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default SidebarMenu;
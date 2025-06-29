'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut, UserMinus, X, ArrowLeft } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

interface SidebarMenuProps {
  menuAbierto: boolean;
  setMenuAbierto: (estado: boolean) => void;
  onLogout: () => void;
  onUnregister: () => void;
  isOperario?: boolean;
}

const SidebarMenu = ({ 
  menuAbierto, 
  setMenuAbierto, 
  onLogout, 
  onUnregister,
  isOperario = false
}: SidebarMenuProps) => {
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
    // Si es un operario y la acción es darse de baja, mostrar un mensaje
    if (isOperario && accion === 'unregister') {
      alert("Esta acción no está disponible en el modo operario.");
      return;
    }

    // Para operarios, el logout es volver a la lista de propietarios, no requiere confirmación
    if (isOperario && accion === 'logout') {
      onLogout();
      setMenuAbierto(false);
      return;
    }

    setAccionConfirmacion(accion);
    setMostrarConfirmacion(true);
  };

  const handleConfirm = () => {
    if (accionConfirmacion === 'logout') {
      onLogout();
      // Cerrar el menú después de confirmar
      setMenuAbierto(false);
    } else if (accionConfirmacion === 'unregister') {
      onUnregister();
    } else if (accionConfirmacion === 'home') {
      // Redirigir a la página principal sin ejecutar logout o unregister
      router.push('/');
    }
    
    setMostrarConfirmacion(false);
  };

  const handleCancel = () => {
    setMostrarConfirmacion(false);
  };

  return (
    <>
      {/* Overlay para dispositivos móviles */}
      {menuAbierto && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
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
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {isOperario ? 'Menú de Operario' : 'Menú'}
            </h3>
            <button 
              onClick={() => setMenuAbierto(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex flex-col flex-1 gap-4">
            {/* Botón de Inicio - común para ambos tipos de usuario */}
            <button 
              onClick={() => handleActionClick('home')}
              className="flex items-center gap-2 px-4 py-2 text-green-800 transition duration-300 rounded-md bg-green-800/10 hover:bg-green-200"
            >
              <Home className="w-5 h-5" />
              Ir a Inicio
            </button>
            
            {/* Botones específicos para operarios */}
            {isOperario ? (
              <button 
                onClick={() => onLogout()}
                className="flex items-center gap-2 px-4 py-2 text-blue-800 transition duration-300 rounded-md bg-blue-800/10 hover:bg-blue-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a lista de propietarios
              </button>
            ) : (
              <>
                {/* Cerrar Sesión - solo para propietarios */}
                <button 
                  onClick={() => handleActionClick('logout')}
                  className="flex items-center gap-2 px-4 py-2 text-green-800 transition duration-300 rounded-md bg-green-800/10 hover:bg-green-200"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
                
                {/* Darse de Baja - solo para propietarios */}
                <button 
                  onClick={() => handleActionClick('unregister')}
                  className="flex items-center gap-2 px-4 py-2 text-red-800 transition duration-300 bg-red-100 rounded-md hover:bg-red-200"
                >
                  <UserMinus className="w-5 h-5" />
                  Darse de Baja
                </button>
              </>
            )}
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
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [accionConfirmacion, setAccionConfirmacion] = useState<'logout' | 'unregister'>('logout');

  const handleActionClick = (accion: 'logout' | 'unregister') => {
    setAccionConfirmacion(accion);
    setMostrarConfirmacion(true);
  };

  const handleConfirm = () => {
    if (accionConfirmacion === 'logout') {
      onLogout();
    } else {
      onUnregister();
    }
    setMostrarConfirmacion(false);
    
    // Redirigir a la página principal usando el router de Next.js
    router.push('/');
  };

  const handleCancel = () => {
    setMostrarConfirmacion(false);
  };

  return (
    <>
      {/* Menú lateral */}
      <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform ${menuAbierto ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Menú</h3>
            <button 
              onClick={() => setMenuAbierto(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <button 
              onClick={() => handleActionClick('logout')}
              className="py-2 px-4 bg-green-800/10 text-green-800 rounded-md hover:bg-blue-200 transition duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 0v14h12V3H4z" clipRule="evenodd" />
                <path d="M7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
              </svg>
              Cerrar Sesión
            </button>
            
            <button 
              onClick={() => handleActionClick('unregister')}
              className="py-2 px-4 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Darse de Baja
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación usando el componente ConfirmModal */}
      <ConfirmModal
        isOpen={mostrarConfirmacion}
        message={accionConfirmacion === 'unregister' 
          ? '¿Está seguro que desea darse de baja del sistema? Esta acción no se puede deshacer y se eliminarán todos sus datos.'
          : '¿Está seguro que desea cerrar la sesión?'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default SidebarMenu;
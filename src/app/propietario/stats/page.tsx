// /propietario/stats/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserHeader from '@/components/propietario/UserHeader';
import UserStats from '@/components/propietario/user-stats/UserStats';
import { 
  User, 
  LogOut, 
  Settings, 
  X,
  ArrowLeft
} from 'lucide-react';

// Función de utilidad para limpiar sesiones de manera segura
const limpiarSesion = (tipoSesion: 'operario' | 'propietario' | 'todas') => {
  // Claves específicas del operario
  const clavesOperario = [
    'userUsername',
    'operarioUsername',
    'fromOperarios',
    'operarioAcceso',
  ];
  
  // Claves específicas del propietario
  const clavesPropietario = [
    'userDni',
    'userEmail',
    'userNombre',
  ];
  
  // Claves compartidas
  const clavesCompartidas = [
    'propietarioDni',
    'propietarioEmail',
    'propietarioNombre',
    'cookiesModalShown'
  ];
  
  // Determinar qué claves limpiar
  let clavesALimpiar: string[] = [];
  
  if (tipoSesion === 'operario' || tipoSesion === 'todas') {
    clavesALimpiar = [...clavesALimpiar, ...clavesOperario];
  }
  
  if (tipoSesion === 'propietario' || tipoSesion === 'todas') {
    clavesALimpiar = [...clavesALimpiar, ...clavesPropietario];
  }
  
  if (tipoSesion === 'todas') {
    clavesALimpiar = [...clavesALimpiar, ...clavesCompartidas];
  }
  
  // Limpiar las claves seleccionadas
  clavesALimpiar.forEach(clave => {
    if (localStorage.getItem(clave)) {
      console.log(`Limpiando: ${clave}`);
      localStorage.removeItem(clave);
    }
  });
  
  // Si estamos limpiando todo, usar clear es más efectivo
  if (tipoSesion === 'todas') {
    localStorage.clear();
  }
  
  // Caducar cookies de sesión
  document.cookie = "operarioSesion=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "propietarioSesion=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export default function PropietarioStatsPage() {
  const [propietarioDni, setPropietarioDni] = useState<string | null>(null);
  const [propietarioNombre, setPropietarioNombre] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isOperario, setIsOperario] = useState(false);
  const [comesFromOperarios, setComesFromOperarios] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    // Función para verificar la validez de la sesión
    const verificarSesion = () => {
      // Si estamos en modo operario, verificar credenciales
      const operarioAcceso = localStorage.getItem("operarioAcceso") === "true";
      const fromOperarios = localStorage.getItem("fromOperarios") === "true";
      
      if (operarioAcceso) {
        setIsOperario(true);
        setComesFromOperarios(fromOperarios);
        
        if (fromOperarios) {
          // Si venimos de operarios, verificar que tengamos operarioUsername
          const operarioUsername = localStorage.getItem('operarioUsername');
          if (!operarioUsername) {
            console.log("Sesión de operario inválida, redirigiendo...");
            setTimeout(() => window.location.href = "/", 100);
            return false;
          }
          
          // Obtener DNI y nombre del propietario desde las claves de operario
          const propDni = localStorage.getItem('propietarioDni');
          const propNombre = localStorage.getItem('propietarioNombre');
          
          if (!propDni) {
            console.log("Falta información del propietario, redirigiendo...");
            setTimeout(() => window.location.href = "/operarios", 100);
            return false;
          }
          
          setPropietarioDni(propDni);
          setPropietarioNombre(propNombre);
          
        } else {
          // Si estamos en modo operario pero no venimos de operarios,
          // algo está mal - limpiar y redirigir
          console.log("Estado de sesión de operario inconsistente, limpiando...");
          limpiarSesion('operario');
          setTimeout(() => window.location.href = "/", 100);
          return false;
        }
      } else {
        // Para propietario normal, verificar que tengamos userDni
        const userDni = localStorage.getItem("userDni");
        const userNombre = localStorage.getItem("userNombre");
        
        if (!userDni) {
          console.log("Sesión de propietario inválida, redirigiendo...");
          setTimeout(() => window.location.href = "/login", 100);
          return false;
        }
        
        setPropietarioDni(userDni);
        setPropietarioNombre(userNombre);
      }
      
      return true;
    };

    // Verificar sesión al inicio
    const sesionValida = verificarSesion();
    if (!sesionValida) {
      // Si la sesión no es válida, detener la carga de datos
      return;
    }
  }, [router]);

  // Función para redirigir a operarios con inicio de sesión automático
  const volverAOperariosConAutoLogin = () => {
    setIsRedirecting(true);
    try {
      console.log("Iniciando proceso de redirección a operarios con auto-login...");
      
      // Guardar el nombre de usuario del operario antes de limpiar datos
      const operarioUsername = localStorage.getItem('operarioUsername') || 'OSUCOMPOST';
      
      // Limpiar completamente localStorage antes de establecer nuevos valores
      localStorage.clear();
      
      // Establecer credenciales del operario directamente
      localStorage.setItem('userUsername', operarioUsername);
      
      // Crear retroalimentación visual antes de redirigir
      const loadingElement = document.createElement('div');
      loadingElement.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(255, 255, 255, 0.9); z-index: 9999; 
                    display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; 
                      border-top: 5px solid #4CAF50; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 20px; font-size: 16px;">Volviendo a la página de operarios...</p>
        </div>
        <style>
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      `;
      document.body.appendChild(loadingElement);
      
      // Redirigir después de un breve retraso para permitir que se muestre la animación
      setTimeout(() => {
        console.log("Redirigiendo a operarios...");
        window.location.href = "/operarios";
      }, 800);
      
    } catch (error) {
      console.error("Error en redirección:", error);
      setIsRedirecting(false);
      alert("Error al redirigir. Intente nuevamente.");
    }
  };

  // Función para volver a la página principal del propietario
  const volverAPropietario = () => {
    // Si es un operario, mantener el modo operario al volver a la ficha
    if (isOperario && comesFromOperarios) {
      router.push('/propietario');
    } else {
      // Si es un propietario normal, volver a su página
      router.push('/propietario');
    }
  };

  const handleLogout = () => {
    // Si es un operario, volver a la página de operarios
    if (isOperario && comesFromOperarios) {
      volverAOperariosConAutoLogin();
      return;
    }
    
    // Para un propietario normal, cerrar sesión
    limpiarSesion('propietario');
    router.push('/login');
  };

  const handleOpenMenu = () => {
    setIsSideMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsSideMenuOpen(false);
  };

  // Mostrar pantalla de redirección si estamos en ese proceso
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#E8EFE2] to-white">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 mx-auto mb-4 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <p className="text-gray-700">Volviendo a la lista de propietarios...</p>
          <p className="mt-2 text-sm text-gray-500">Por favor, espere mientras se redirige.</p>
        </div>
      </div>
    );
  }

  if (!propietarioDni) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 border-t-2 border-green-700 rounded-full animate-spin"></div>
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
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Botón para volver a la ficha del propietario */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={volverAPropietario}
              className="flex items-center px-3 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-md hover:bg-green-200"
            >
              <ArrowLeft className="mr-2" size={16} />
              Volver a la ficha
            </button>
            
            <h1 className="text-2xl font-bold text-green-800">Estadísticas</h1>
            
            {/* Espacio vacío para mantener el centro del título */}
            <div className="w-28"></div>
          </div>
          
          {/* Si es modo operario, mostrar banner informativo */}
          {isOperario && comesFromOperarios && (
            <div className="p-4 mb-6 border-2 border-green-400 rounded-lg shadow-md bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Modo Operario</h3>
                  <p className="mb-0 text-green-700">
                    Está viendo las estadísticas de <span className="font-medium">{propietarioNombre}</span> en modo operario
                  </p>
                </div>
                <button 
                  onClick={volverAOperariosConAutoLogin}
                  className="flex items-center px-4 py-2 text-white transition-colors bg-green-600 rounded-md shadow hover:bg-green-700"
                  disabled={isRedirecting}
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Volver a Operarios
                </button>
              </div>
            </div>
          )}
          
          {/* Componente de estadísticas */}
          {propietarioDni && (
            <UserStats propietarioDni={propietarioDni} />
          )}
        </div>
      </main>

      {/* Side Menu */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 transition-opacity bg-black bg-opacity-50">
          <div className="absolute top-0 right-0 w-64 h-full transition-transform transform bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
                <div className="flex items-center mb-4 space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <User size={24} className="text-green-800" />
                  </div>
                  <div>
                    <p className="font-medium">{propietarioNombre || 'Usuario'}</p>
                    <p className="text-sm text-gray-500">{propietarioDni}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {!isOperario && (
                  <button 
                    onClick={() => router.push('/perfil')}
                    className="flex items-center w-full px-3 py-2 text-left text-gray-700 rounded hover:bg-green-50"
                  >
                    <Settings size={18} className="mr-2 text-green-700" />
                    Configuración de cuenta
                  </button>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-left text-red-600 rounded hover:bg-red-50"
                >
                  <LogOut size={18} className="mr-2" />
                  {isOperario && comesFromOperarios ? 'Volver a Operarios' : 'Cerrar sesión'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
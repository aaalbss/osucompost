'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OperariosHeader from '@/components/operarios/OperariosHeader';
import PropietariosTable from '@/components/operarios/PropietariosTable';
import PuntosRecogidaTable from '@/components/operarios/PuntosRecogidaTable';
import ContenedoresTable from '@/components/operarios/ContenedoresTable';
import Dashboard from '@/components/operarios/Dashboard';
import { 
  propietarioAPI, 
  puntosRecogidaAPI, 
  contenedorAPI
} from '@/services/api';
import { 
  Propietario, 
  PuntoRecogida, 
  Contenedor, 
  TipoResiduo
} from '@/types/types';

const OperariosPageClient: React.FC = () => {
  // Estados para los datos
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [puntosRecogida, setPuntosRecogida] = useState<PuntoRecogida[]>([]);
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<string>('dashboard');
  
  // Estados para elementos seleccionados
  const [selectedContenedorId, setSelectedContenedorId] = useState<number | null>(null);
  const [selectedPropietarioDni, setSelectedPropietarioDni] = useState<string | null>(null);
  const [selectedPuntoRecogidaId, setSelectedPuntoRecogidaId] = useState<number | null>(null);
  
  // Estados para control de resaltado
  const [shouldHighlightContenedor, setShouldHighlightContenedor] = useState<boolean>(false);
  const [shouldHighlightPropietario, setShouldHighlightPropietario] = useState<boolean>(false);
  const [shouldHighlightPuntoRecogida, setShouldHighlightPuntoRecogida] = useState<boolean>(false);
  
  const [tiposResiduo] = useState<TipoResiduo[]>([
    { id: 1, descripcion: 'Organico' },
    { id: 2, descripcion: 'Estructurante' }
  ]);
  
  const router = useRouter();

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userUsername = localStorage.getItem('userUsername');
    if (!userUsername || userUsername !== 'OSUCOMPOST') {
      // Redirigir al login si no está autenticado
      router.push('/');
    }
  }, [router]);

  // Detector de cierre de sesión al salir de la página
  useEffect(() => {
    // Función para manejar el evento beforeunload
    const handleBeforeUnload = () => {
      // En algunos navegadores, el localStorage no se elimina inmediatamente
      // al cerrar la pestaña, así que no hacemos nada aquí
    };

    // Función para manejar la navegación
    const handleRouteChange = () => {
      // Cerrar sesión al cambiar de ruta
      localStorage.removeItem('userUsername');
    };

    // Agregar event listeners para detectar salida
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Limpiar event listeners al desmontar el componente
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Cerrar sesión al desmontar el componente
      localStorage.removeItem('userUsername');
    };
  }, []);

  // Ocultar cualquier header global al montar el componente
  useEffect(() => {
    const headers = document.querySelectorAll('header');
    headers.forEach(header => {
      if (!header.classList.contains('custom-header')) {
        header.style.display = 'none';
      }
    });
    
    return () => {
      headers.forEach(header => {
        if (!header.classList.contains('custom-header')) {
          header.style.display = '';
        }
      });
    };
  }, []);
  
  // Cargar datos al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Inicializar variables con arrays vacíos por defecto
        let todosPropietarios: Propietario[] = [];
        let todosPuntosRecogida: PuntoRecogida[] = [];
        let todosContenedores: Contenedor[] = [];
        
        // Cargar datos con manejo de errores individual para cada solicitud
        try {
          todosPropietarios = await obtenerTodosPropietarios();
        } catch (err) {
          console.error('Error al obtener propietarios:', err);
        }
        
        try {
          todosPuntosRecogida = await puntosRecogidaAPI.obtenerTodos();
        } catch (err) {
          console.error('Error al obtener puntos de recogida:', err);
        }
        
        try {
          todosContenedores = await contenedorAPI.obtenerTodos();
        } catch (err) {
          console.error('Error al obtener contenedores:', err);
        }
        
        // Verificar que todos los datos son arrays
        setPropietarios(Array.isArray(todosPropietarios) ? todosPropietarios : []);
        setPuntosRecogida(Array.isArray(todosPuntosRecogida) ? todosPuntosRecogida : []);
        setContenedores(Array.isArray(todosContenedores) ? todosContenedores : []);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar datos. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);
  
  // Obtener propietarios a partir de puntos de recogida
  const obtenerTodosPropietarios = async (): Promise<Propietario[]> => {
    try {
      const puntos = await puntosRecogidaAPI.obtenerTodos();
      
      // Verificar si puntos es un array antes de usar map
      if (!Array.isArray(puntos)) {
        console.error('Los puntos de recogida no son un array:', puntos);
        return [];
      }
      
      // Verificar que cada punto tenga un propietario válido antes de incluirlo
      const puntosConPropietarioValido = puntos.filter(
        punto => punto && punto.propietario && punto.propietario.dni
      );
      
      const propietariosUnicos = Array.from(
        new Map(puntosConPropietarioValido.map(punto => [punto.propietario.dni, punto.propietario]))
      ).map(([, propietario]) => propietario);
      
      return propietariosUnicos;
    } catch (error) {
      console.error('Error al obtener propietarios:', error);
      return [];
    }
  };

  // Actualizar estado de resaltado cuando cambia la vista
  useEffect(() => {
    // Si la vista cambia a 'contenedores' y tenemos un ID seleccionado, activar el resaltado
    if (vista === 'contenedores' && selectedContenedorId) {
      setShouldHighlightContenedor(true);
    } else {
      // Si la vista cambia a algo diferente, desactivar el resaltado
      setShouldHighlightContenedor(false);
      // Y si no estamos en la vista de contenedores, limpiar el ID seleccionado
      if (vista !== 'contenedores') {
        setSelectedContenedorId(null);
      }
    }

    // Lo mismo para propietarios
    if (vista === 'propietarios' && selectedPropietarioDni) {
      setShouldHighlightPropietario(true);
    } else {
      setShouldHighlightPropietario(false);
      if (vista !== 'propietarios') {
        setSelectedPropietarioDni(null);
      }
    }

    // Lo mismo para puntos de recogida
    if (vista === 'puntosRecogida' && selectedPuntoRecogidaId) {
      setShouldHighlightPuntoRecogida(true);
    } else {
      setShouldHighlightPuntoRecogida(false);
      if (vista !== 'puntosRecogida') {
        setSelectedPuntoRecogidaId(null);
      }
    }
  }, [vista, selectedContenedorId, selectedPropietarioDni, selectedPuntoRecogidaId]);

  // Función para navegar a un contenedor específico
  const handleNavigateToContenedor = (contenedorId: number) => {
    // Verificamos si es una nueva selección o ya estaba seleccionado
    if (selectedContenedorId !== contenedorId || vista !== 'contenedores') {
      setSelectedContenedorId(contenedorId);
      setShouldHighlightContenedor(true);
      setVista('contenedores');
    }
  };

  // Función para navegar a un propietario específico
  const handleNavigateToPropietario = (dni: string) => {
    // Verificamos si es una nueva selección o ya estaba seleccionado
    if (selectedPropietarioDni !== dni || vista !== 'propietarios') {
      setSelectedPropietarioDni(dni);
      setShouldHighlightPropietario(true);
      setVista('propietarios');
    }
  };

  // Función para navegar a un punto de recogida específico
  const handleNavigateToPuntoRecogida = (puntoId: number) => {
    // Verificamos si es una nueva selección o ya estaba seleccionado
    if (selectedPuntoRecogidaId !== puntoId || vista !== 'puntosRecogida') {
      setSelectedPuntoRecogidaId(puntoId);
      setShouldHighlightPuntoRecogida(true);
      setVista('puntosRecogida');
    }
  };

  // Manejar cuando se completa un resaltado
  const handleHighlightComplete = (type: 'contenedor' | 'propietario' | 'puntoRecogida') => {
    if (type === 'contenedor') {
      setShouldHighlightContenedor(false);
    } else if (type === 'propietario') {
      setShouldHighlightPropietario(false);
    } else if (type === 'puntoRecogida') {
      setShouldHighlightPuntoRecogida(false);
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('userUsername');
    localStorage.removeItem('cookiesModalShown');
    router.push('/');
  };

  // Función personalizada para manejar la navegación
  const handleNavigation = (vista: string) => {
    if (vista === 'home') {
      // Cerrar sesión y navegar a la página principal cuando se hace clic en el logo
      handleLogout();
    } else {
      // Para otras vistas, actualizar el estado local
      setVista(vista);
    }
  };

  // Asegurarse de que los datos pasados a los componentes siempre sean arrays válidos
  const propietariosSeguro = Array.isArray(propietarios) ? propietarios : [];
  const puntosRecogidaSeguro = Array.isArray(puntosRecogida) ? puntosRecogida : [];
  const contenedoresSeguro = Array.isArray(contenedores) ? contenedores : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#E8EFE2] to-white">
      {/* Estilos globales para ocultar headers adicionales */}
      <style jsx global>{`
        header:not(:first-child) {
          display: none !important;
        }
      `}</style>
      
      {/* Renderizamos el header con nuestra función personalizada */}
      <OperariosHeader 
        setVista={handleNavigation}
        vistaActual={vista}
        onLogout={handleLogout}
      />
      
      {/* Contenido basado en la vista seleccionada */}
      <div className="container px-4 py-8 mx-auto">
        {error && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {vista === 'dashboard' && (
              <>
                <h1 className="mb-10 text-2xl font-semibold text-center text-gray-700">Panel de Control</h1>
                <Dashboard 
                  propietarios={propietariosSeguro}
                  puntosRecogida={puntosRecogidaSeguro}
                  contenedores={contenedoresSeguro}
                  setVista={setVista}
                />
              </>
            )}
            
            {vista === 'propietarios' && (
              <>
                <h1 className="mb-6 text-2xl font-semibold text-gray-700">Propietarios</h1>
                <PropietariosTable 
                  propietarios={propietariosSeguro}
                  selectedDni={selectedPropietarioDni}
                  shouldHighlight={shouldHighlightPropietario}
                  onHighlightComplete={() => handleHighlightComplete('propietario')}
                  onPuntoRecogidaClick={handleNavigateToPuntoRecogida}
                />
              </>
            )}
            
            {vista === 'puntosRecogida' && (
              <>
                <h1 className="mb-6 text-2xl font-semibold text-gray-700">Puntos de Recogida</h1>
                <PuntosRecogidaTable 
                  puntosRecogida={puntosRecogidaSeguro}
                  contenedores={contenedoresSeguro}
                  onNavigateToContenedor={handleNavigateToContenedor}
                  onNavigateToPropietario={handleNavigateToPropietario}
                  selectedPuntoId={selectedPuntoRecogidaId}
                  shouldHighlight={shouldHighlightPuntoRecogida}
                  onHighlightComplete={() => handleHighlightComplete('puntoRecogida')}
                />
              </>
            )}
            
            {vista === 'contenedores' && (
              <>
                <h1 className="mb-6 text-2xl font-semibold text-gray-700">Contenedores</h1>
                <ContenedoresTable
                  contenedores={contenedoresSeguro}
                  puntosRecogida={puntosRecogidaSeguro}
                  tiposResiduo={tiposResiduo}
                  selectedContenedorId={selectedContenedorId}
                  shouldHighlight={shouldHighlightContenedor}
                  onHighlightComplete={() => handleHighlightComplete('contenedor')}
                  onPropietarioClick={handleNavigateToPropietario}
                  onPuntoRecogidaClick={handleNavigateToPuntoRecogida}
                  buscador=""
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OperariosPageClient;
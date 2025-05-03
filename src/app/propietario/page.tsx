// /propietario/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Propietario, PuntoRecogida, Facturacion} from "@/types/types";
import { ExtendedRecogida, ExtendedContenedor } from "@/types/extendedTypes";
import { cascadeDeleteService } from "@/services/CascadeDeleteService";
import { contenedorAPI } from "@/services/api"; 
import { formatearTipoResiduo } from "@/utils/formatoResiduos";
import { ArrowLeft } from 'lucide-react';

// Importamos el único UserHeader disponible
import UserHeader from '@/components/propietario/UserHeader';
import Chatbot from "@/components/ChatBot";

import PersonalInfoCard from "@/components/propietario/PersonalInfoCard";
import StatsCard from "@/components/propietario/StatsCard";
import PickupPointsCard from "@/components/propietario/PickupPointsCard";
import BillingCard from "@/components/propietario/BillingCard";
import ProximasRecogidas from "@/components/propietario/ProximasRecogidas";
import SidebarMenu from "@/components/propietario/SidebarMenu";
import LoadingSpinner from "@/components/propietario/LoadingSpinner";
import ErrorDisplay from "@/components/propietario/ErrorDisplay";
import {
  fetchPropietarioData,
  fetchPropietarioBasicData,
} from "@/lib/dataFetcher";

// Tiempo máximo de carga antes de mostrar error
const LOADING_TIMEOUT = 15000; // 15 segundos

export default function PropietarioPage() {
  const router = useRouter();

  const [propietario, setPropietario] = useState<Propietario | null>(null);
  const [puntosRecogida, setPuntosRecogida] = useState<PuntoRecogida[]>([]);
  const [facturaciones, setFacturaciones] = useState<Facturacion[]>([]);
  const [recogidas, setRecogidas] = useState<ExtendedRecogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOperario, setIsOperario] = useState(false);
  const [contenedores, setContenedores] = useState<ExtendedContenedor[]>([]);  
  const [datosCargando, setDatosCargando] = useState({
    propietario: true,
    puntosRecogida: true,
    facturaciones: true,
    recogidas: true,
    contenedores: true,
  });
  
  // Estado para manejar la redirección
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Estado para identificar si venimos de operarios
  const [comesFromOperarios, setComesFromOperarios] = useState(false);

  // Determinar el tipo de contenedor basado en los contenedores cargados
  const tipoContenedor = contenedores.length > 0
  ? `${formatearTipoResiduo(contenedores[0].tipoResiduo).descripcion} - ${contenedores[0].capacidad} L`
  : undefined;

  useEffect(() => {
    // Función para verificar la validez de la sesión
    const verificarSesion = () => {
      // Si estamos en modo operario, verificar credenciales
      const operarioAcceso = localStorage.getItem("operarioAcceso") === "true";
      const fromOperarios = localStorage.getItem("fromOperarios") === "true";
      
      if (operarioAcceso) {
        if (fromOperarios) {
          // Si venimos de operarios, verificar que tengamos operarioUsername
          const operarioUsername = localStorage.getItem('operarioUsername');
          if (!operarioUsername) {
            console.log("Sesión de operario inválida, redirigiendo...");
            setTimeout(() => window.location.href = "/", 100);
            return false;
          }
        } else {
          // Si estamos en modo operario pero no venimos de operarios,
          // algo está mal - limpiar y redirigir
          console.log("Estado de sesión de operario inconsistente, limpiando...");
          localStorage.removeItem("operarioAcceso");
          localStorage.removeItem("fromOperarios");
          localStorage.removeItem("propietarioDni");
          localStorage.removeItem("propietarioEmail");
          localStorage.removeItem("propietarioNombre");
          localStorage.removeItem("operarioUsername");
          setTimeout(() => window.location.href = "/", 100);
          return false;
        }
      } else {
        // Para propietario normal, verificar que tengamos userDni
        const userDni = localStorage.getItem("userDni");
        if (!userDni) {
          console.log("Sesión de propietario inválida, redirigiendo...");
          setTimeout(() => window.location.href = "/area-cliente", 100);
          return false;
        }
      }
      
      return true;
    };

    // Verificar sesión al inicio
    const sesionValida = verificarSesion();
    if (!sesionValida) {
      // Si la sesión no es válida, detener la carga de datos
      return;
    }

    // Función para extraer datos del localStorage
    const getUserData = () => {
      if (typeof window !== "undefined") {
        // Comprobar si hay un acceso de operario
        const operarioAcceso = localStorage.getItem("operarioAcceso");
        const isOperario = operarioAcceso === "true";
        
        // Detectar si venimos de operarios
        const fromOperarios = localStorage.getItem("fromOperarios");
        setComesFromOperarios(fromOperarios === "true");
        
        // Dependiendo del tipo de acceso, buscar las claves correspondientes
        if (isOperario) {
          const userDni = localStorage.getItem("propietarioDni");
          const userEmail = localStorage.getItem("propietarioEmail");
          const nombrePropietario = localStorage.getItem("propietarioNombre");
          return { userDni, userEmail, nombrePropietario, isOperario };
        } else {
          const userDni = localStorage.getItem("userDni");
          const userEmail = localStorage.getItem("userEmail");
          return { userDni, userEmail, isOperario };
        }
      }
      return { userDni: null, userEmail: null, isOperario: false };
    };

    const loadInitialData = async () => {
      const { userDni, userEmail, isOperario } = getUserData();
      
      // Guardar el estado de operario para usarlo más adelante
      setIsOperario(isOperario);

      console.log("DNI recuperado:", userDni, "Email recuperado:", userEmail, "Es operario:", isOperario);

      if (!userDni) {
        console.log("Falta DNI, redirigiendo a la página de inicio...");
        window.location.href = "/";
        return;
      }

      // Configurar timeout para mostrar error si tarda demasiado
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log("Timeout de carga alcanzado");
          setLoading(false);
          setError(
            "Tiempo de espera excedido al cargar los datos. Por favor, intente de nuevo."
          );
        }
      }, LOADING_TIMEOUT);

      try {
        // Primero, intentar cargar solo los datos básicos del propietario
        console.log("Cargando datos básicos del propietario");
        setLoading(true);

        // Intenta obtener primero solo los datos básicos del propietario
        try {
          const basicPropietario = await fetchPropietarioBasicData(userDni);
          console.log(
            "Datos básicos del propietario cargados:",
            basicPropietario
          );

          if (!basicPropietario || !basicPropietario.dni) {
            throw new Error(
              "No se pudo obtener información básica del propietario"
            );
          }

          // Establecer datos básicos para mostrar algo mientras se carga el resto
          setPropietario(basicPropietario);
          setDatosCargando({ ...datosCargando, propietario: false });

          // Ahora cargar el resto de los datos en segundo plano
          try {
            console.log("Cargando datos completos del propietario");
            const fullData = await fetchPropietarioData(userDni);

            console.log("Datos completos recibidos:", fullData);

            // Actualizar el estado con los datos completos
            setPropietario(fullData.propietario);
            setPuntosRecogida(fullData.puntosRecogida);
            setFacturaciones(fullData.facturaciones);
            setRecogidas(fullData.recogidas);

            // Cargar los contenedores si hay puntos de recogida
            if (fullData.puntosRecogida.length > 0) {
              try {
                const contenedoresPunto = await contenedorAPI.obtenerPorPuntoRecogida(fullData.puntosRecogida[0].id);
                
                // Formatear el tipo de residuo en cada contenedor
                const contenedoresFormateados = contenedoresPunto.map(contenedor => ({
                  ...contenedor,
                  tipoResiduo: formatearTipoResiduo(contenedor.tipoResiduo)
                })) as ExtendedContenedor[];
                
                setContenedores(contenedoresFormateados);
              } catch (contenedorError) {
                console.error("Error al cargar contenedores:", contenedorError);
              } finally {
                setDatosCargando(prev => ({ ...prev, contenedores: false }));
              }
            } else {
              setDatosCargando(prev => ({ ...prev, contenedores: false }));
            }

            // Marcar todos los datos como cargados
            setDatosCargando(prev => ({
              ...prev,
              propietario: false,
              puntosRecogida: false,
              facturaciones: false,
              recogidas: false,
            }));
          } catch (fullDataError) {
            console.error("Error al cargar datos completos:", fullDataError);
            // Aún mostramos la página con datos básicos si falla la carga completa
          } finally {
            // Detener el spinner de carga ya que tenemos al menos los datos básicos
            setLoading(false);
          }
        } catch (basicDataError) {
          console.error(
            "Error al cargar datos básicos del propietario:",
            basicDataError
          );
          setError(
            basicDataError instanceof Error
              ? basicDataError.message
              : "Error al cargar datos básicos"
          );
          setLoading(false);
        }
      } catch (error) {
        console.error("Error en la carga de datos:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Error desconocido al cargar los datos"
        );
        setLoading(false);
      } finally {
        clearTimeout(timeoutId);
        // Si llegamos aquí y loading sigue siendo true, lo cambiamos a false
        if (loading) {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, []);

  // Función para redirigir a operarios con inicio de sesión automático
  const volverAOperariosConAutoLogin = () => {
    setIsRedirecting(true);
    try {
      console.log("Iniciando proceso de redirección a operarios con auto-login...");
      
      // Guardar el nombre de usuario del operario antes de limpiar datos
      const operarioUsername = localStorage.getItem('operarioUsername') || 'OSUCOMPOST';
      
      // Guardar un flag para indicar que debe mostrar la vista de propietarios al regresar
      localStorage.setItem('returnToView', 'propietarios');
      
      // Limpiar completamente localStorage antes de establecer nuevos valores
      // pero mantener las claves que queremos preservar
      const keysToPreserve = {
        operarioUsername: operarioUsername,
        returnToView: 'propietarios'
      };
      
      localStorage.clear();
      
      // Restaurar las claves preservadas
      for (const [key, value] of Object.entries(keysToPreserve)) {
        localStorage.setItem(key, value);
      }
      
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

  // Función para acceder a las estadísticas completas manteniendo el modo operario
  const verEstadisticasCompletas = () => {
    // Si ya estamos en modo operario, preservar esa información al ir a estadísticas
    if (isOperario && comesFromOperarios && propietario) {
      // Guardar los mismos datos para que persistan en la página de estadísticas
      console.log("Navegando a estadísticas en modo operario...");
      
      // Redirigir a la página de estadísticas
      router.push('/propietario/stats');
    } else {
      // Acceso normal a estadísticas para propietario
      router.push('/propietario/stats');
    }
  };

  // Función para volver a la lista de propietarios (si es operario) o cerrar sesión
  const volverAListaPropietarios = () => {
    if (isOperario && comesFromOperarios) {
      volverAOperariosConAutoLogin();
    } else {
      // Para un propietario normal, cerrar sesión como antes
      console.log("Cerrando sesión de propietario normal");
      if (typeof window !== "undefined") {
        localStorage.removeItem("userDni");
        localStorage.removeItem("userEmail");
      }
      
      // Redirigir a la página de inicio de sesión
      window.location.href = "/area-cliente";
    }
  };

  // Función para confirmar y ejecutar la baja del usuario
  const confirmarBaja = async () => {
    // Si es acceso de operario, no permitir la baja del usuario
    if (isOperario) {
      alert("Esta acción no está disponible en el modo operario.");
      return;
    }
    
    // Verificar que no estamos ya en proceso de eliminación
    if (isDeleting) {
      return;
    }

    // Verificar que el propietario existe y tiene un DNI válido
    if (!propietario || !propietario.dni) {
      console.error("Error de propietario:", propietario);
      alert("Error: No se pudo identificar su cuenta correctamente.");
      return;
    }

    const dni = propietario.dni.trim();
    if (!dni) {
      alert("Error: Su cuenta no tiene un identificador válido.");
      return;
    }

    console.log("Iniciando proceso de baja para DNI:", dni);

    // Mostrar modal de confirmación
    const confirmacion = window.confirm(
      "¿Está seguro que desea darse de baja? Esta acción eliminará su cuenta y todos los datos asociados como puntos de recogida, contenedores, recogidas y facturaciones. Esta acción no se puede deshacer."
    );

    if (confirmacion) {
      try {
        // Cambiar estado a eliminando y mostrar spinner
        setIsDeleting(true);
        setLoading(true);

        // Ejecutar la eliminación
        await cascadeDeleteService.eliminarPropietarioEnCascada(dni);

        console.log("Cuenta eliminada correctamente");
        // Eliminación exitosa, limpiar localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("userDni");
          localStorage.removeItem("userEmail");
        }

        // Redirigir inmediatamente a la página de inicio con parámetro para mostrar modal de éxito
        localStorage.removeItem("userDni");
        localStorage.removeItem("userEmail");
        
        // Forzar la redirección inmediata
        console.log("Redirigiendo a la página de inicio...");
        window.location.replace('/?mensaje=cuenta-eliminada');
      } catch (error) {
        console.error("Error al darse de baja:", error);
        alert(
          "Ha ocurrido un error al intentar dar de baja su cuenta. Por favor, inténtelo de nuevo más tarde."
        );
        setIsDeleting(false);
        setLoading(false);
      }
    }
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

  // Mostrar spinner de carga mientras se obtienen los datos básicos
  if (loading) return <LoadingSpinner message="Cargando datos del propietario..." />;

  // Mostrar mensaje de error si hay algún problema
  if (error)
    return (
      <ErrorDisplay
        message={error}
        retryAction={() => window.location.reload()}
      />
    );

  // Si no hay propietario después de la carga, mostrar mensaje
  if (!propietario)
    return (
      <div className="relative min-h-screen">
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-white via-[#E8EFE2] to-white"></div>
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <p className="text-xl text-gray-700">
              No se pudo obtener la información del propietario.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-white transition-colors bg-green-800 rounded hover:bg-green-900"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen">
      {/* Fondo con gradiente fijo */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-white via-[#E8EFE2] to-white"></div>

      {/* Header con UserHeader que ya tienes */}
      <div className="relative z-10">
        <UserHeader 
          onOpenMenu={() => setMenuAbierto(true)}
          propietarioNombre={propietario.nombre}
        />

        {/* Menú lateral */}
        <SidebarMenu
          menuAbierto={menuAbierto}
          setMenuAbierto={setMenuAbierto}
          onLogout={volverAListaPropietarios}
          onUnregister={confirmarBaja}
          isOperario={isOperario && comesFromOperarios}
        />


      <main className="container p-8 mx-auto space-y-8">
        {/* Área de acciones principales - SOLO CON EL BOTÓN DE AÑADIR CONTENEDOR */}
        <div className="flex justify-center mb-8">
          {/* Mostrar el botón de nuevo contenedor solo si NO es un operario */}
          {!isOperario && (
            <button 
              onClick={() => router.push('/propietario/nueva-recogida')}
              className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Añadir nuevo contendor
            </button>
          )}
        </div>

        {/* Para operarios que vienen de operarios, mostrar un mensaje y botón de retorno */}
        {isOperario && comesFromOperarios && (
          <div className="p-4 mb-8 border-2 border-green-400 rounded-lg shadow-md bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">Modo Operario</h3>
                <p className="mb-2 text-green-700">
                  Está viendo la ficha de <span className="font-medium">{propietario.nombre}</span> en modo operario
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* PersonalInfoCard con tipo de contenedor */}
          <PersonalInfoCard
            propietario={propietario}
            tipoContenedor={tipoContenedor}
          />

          <StatsCard recogidas={recogidas} />
          <PickupPointsCard
            puntosRecogida={puntosRecogida} 
            contenedores={contenedores}/>
          <BillingCard facturaciones={facturaciones} />
          
          <div className="md:col-span-2">
            <ProximasRecogidas recogidas={recogidas} />
          </div>
        </div>
      </main>
      </div>

      {/* Chatbot fijo en la esquina inferior derecha - solo para usuarios reales */}
      {!isOperario && (
        <div className="fixed bottom-0 right-0 z-50 p-4">
          <Chatbot />
        </div>
      )}
    </div>
  );
}
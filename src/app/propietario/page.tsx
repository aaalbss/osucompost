"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Propietario, PuntoRecogida, Facturacion} from "@/types/types";
import { ExtendedRecogida, ExtendedContenedor } from "@/types/extendedTypes";
import { cascadeDeleteService } from "@/services/CascadeDeleteService";
import { contenedorAPI } from "@/services/api"; // Asegúrate de importar contenedorAPI
import  {formatearTipoResiduo} from "@/utils/formatoResiduos"; // Asegúrate de importar GetTipoResiduo

import UserHeader from "@/components/propietario/UserHeader";
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
  const [contenedores, setContenedores] = useState<ExtendedContenedor[]>([]);  const [datosCargando, setDatosCargando] = useState({
    propietario: true,
    puntosRecogida: true,
    facturaciones: true,
    recogidas: true,
    contenedores: true, // Añadir contenedores al estado de carga
  });

  // Determinar el tipo de contenedor basado en los contenedores cargados
  const tipoContenedor = contenedores.length > 0
  ? `${formatearTipoResiduo(contenedores[0].tipoResiduo).descripcion} - ${contenedores[0].capacidad} L`
  : undefined;

  useEffect(() => {
    // Función para extraer datos del localStorage
    const getUserData = () => {
      if (typeof window !== "undefined") {
        const userDni = localStorage.getItem("userDni");
        const userEmail = localStorage.getItem("userEmail");
        return { userDni, userEmail };
      }
      return { userDni: null, userEmail: null };
    };

    const loadInitialData = async () => {
      const { userDni, userEmail } = getUserData();

      console.log("DNI recuperado:", userDni, "Email recuperado:", userEmail);

      if (!userDni || !userEmail) {
        console.log("Falta DNI o email, redirigiendo a la página de inicio...");
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

  /// Función para cerrar sesión
  const cerrarSesion = async () => {
    // Limpiar datos de localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("userDni");
      localStorage.removeItem("userEmail");
    }

    // Redirigir a la página de inicio de sesión
    window.location.href = "/area-cliente";
  };

  // Función para confirmar y ejecutar la baja del usuario
  const confirmarBaja = async () => {
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
        // Primero limpiamos el localStorage
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

  // Mostrar spinner de carga mientras se obtienen los datos básicos
  if (loading) return <LoadingSpinner message="Cargando sus datos..." />;

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

      {/* Header con botón de menú */}
      <div className="relative z-10">
        <UserHeader onOpenMenu={() => setMenuAbierto(true)} />

        {/* Menú lateral */}
        <SidebarMenu
          menuAbierto={menuAbierto}
          setMenuAbierto={setMenuAbierto}
          onLogout={cerrarSesion}
          onUnregister={confirmarBaja}
        />

        <main className="container p-8 mx-auto space-y-8">
          {/* Botón nuevo para solicitar recogida */}
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => router.push('/propietario/nueva-recogida')}
              className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Añadir nuevo contendor
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* PersonalInfoCard con tipo de contenedor */}
            <PersonalInfoCard
              propietario={propietario}
              tipoContenedor={tipoContenedor}
            />

            <StatsCard recogidas={recogidas} />
            <PickupPointsCard
             puntosRecogida={puntosRecogida} 
             contenedores = {contenedores}/>
            <BillingCard facturaciones={facturaciones} />
            
            <div className="md:col-span-2">
              <ProximasRecogidas recogidas={recogidas} />
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot fijo en la esquina inferior derecha */}
      <div className="fixed bottom-0 right-0 z-50 p-4">
        <Chatbot />
      </div>
    </div>
  );
}
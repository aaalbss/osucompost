'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserHeader from "@/components/propietario/UserHeader";
import SolicitudRecogida from "@/components/propietario/solicitudes/SolicitudRecogida";

export default function SolicitudRecogidaPage() {
  const router = useRouter();
  const [propietarioDni, setPropietarioDni] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getUserDni = () => {
      try {
        if (typeof window !== "undefined") {
          // Intentar obtener DNI tanto de localStorage como de sessionStorage
          const dniLocalStorage = localStorage.getItem("userDni");
          const dniSessionStorage = sessionStorage.getItem("userDni");
          
          // Usar el primero que esté disponible
          const dni = dniLocalStorage || dniSessionStorage;
          
          if (!dni) {
            console.log("No se encontró DNI en storage, redirigiendo a login");
            router.push("/login");
            return null;
          }
          
          return dni;
        }
      } catch (error) {
        console.error("Error al acceder al storage:", error);
        setError("Error al acceder a la información de usuario. Por favor, inicie sesión nuevamente.");
      }
      return null;
    };

    const dni = getUserDni();
    if (dni) {
      setPropietarioDni(dni);
      // Guardar en ambos para asegurar consistencia
      try {
        localStorage.setItem("userDni", dni);
        sessionStorage.setItem("userDni", dni);
      } catch (error) {
        console.error("Error al guardar DNI en storage:", error);
      }
    }
    setIsLoading(false);
  }, [router]);

  // Manejar cierre y éxito
  const handleClose = () => {
    router.push('/propietario');
  };

  const handleSuccess = () => {
    router.push('/propietario');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Mostrar un mensaje si no hay DNI en lugar de renderizar null
  if (!propietarioDni) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Sesión no iniciada</h2>
          <p className="text-gray-700 mb-4">
            No se ha detectado una sesión activa. Por favor, inicie sesión para continuar.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-white via-[#E8EFE2] to-white"></div>

      <div className="relative z-10">
        <UserHeader />

        <main className="container mx-auto p-8">
          <SolicitudRecogida 
            propietarioDni={propietarioDni} 
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        </main>
      </div>
    </div>
  );
}
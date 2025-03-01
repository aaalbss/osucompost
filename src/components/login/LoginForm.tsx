'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { propietarioAPI } from '@/services/api';

export default function LoginForm() {
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Verificando DNI:', dni);
      // Verificar propietario usando la función de tu API
      const propietario = await propietarioAPI.verificarDNI(dni);
      console.log('Respuesta de verificarDNI:', propietario);

      // Verificar si el email coincide
      if (propietario && propietario.email === email) {
        console.log('Credenciales válidas, guardando en localStorage');
        
        // Usar localStorage en lugar de cookies
        localStorage.setItem('userDni', dni);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('cookiesModalShown', 'true');
        
        console.log('Datos guardados correctamente, redirigiendo...');
        
        // Redirigir usando window.location para recargar la página completamente
        window.location.href = '/propietario';
        return;
      } else {
        // Credenciales incorrectas
        console.log('Credenciales incorrectas');
        setError('Correo electrónico o DNI incorrectos');
      }
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      
      // Manejo de diferentes tipos de errores
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          setError('No se encontró un propietario con ese DNI');
        } else {
          setError('Error al iniciar sesión. Por favor, verifique sus credenciales.');
        }
      } else {
        setError('Error inesperado al iniciar sesión');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="flex flex-col items-center">
        <label htmlFor="dni" className="block text-sm font-bold text-green-800">
          DNI
        </label>
        <input
          id="dni"
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="mt-1 text-center w-full px-3 py-2 border border-green-800/30 rounded-md bg-white/50 focus:ring-2 focus:ring-green-800 focus:border-transparent"
          placeholder="Introduce tu DNI"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col items-center">
        <label htmlFor="email" className="block text-sm font-bold text-green-800">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 text-center w-full px-3 py-2 border border-green-800/30 rounded-md bg-white/50 focus:ring-2 focus:ring-green-800 focus:border-transparent"
          placeholder="Introduce tu correo electrónico"
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50/80 p-2 rounded text-center">{error}</p>
      )}

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-800 hover:bg-green-900 transition-colors duration-200 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
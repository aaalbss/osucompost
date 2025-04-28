'use client';
import { useState, useEffect } from 'react';

export default function LoginFormDos() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('userUsername');
    if (user === 'OSUCOMPOST') {
      window.location.href = '/operarios';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (username === 'OSUCOMPOST' && password === '@OsuComp0st!2025') {
        localStorage.setItem('userUsername', username);
        localStorage.setItem('cookiesModalShown', 'true');
        window.location.href = '/operarios';
        return;
      } else {
        setError('Nombre de usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error inesperado al iniciar sesión');
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 mt-8 space-y-6 shadow-md bg-white/50 backdrop-blur-md rounded-xl"
    >
      <div className="flex flex-col items-center">
        <label htmlFor="username" className="block text-sm font-bold text-green-800">
          Nombre de Usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 mt-1 text-center border rounded-md border-green-800/30 bg-white/60 focus:ring-2 focus:ring-green-800 focus:border-transparent"
          placeholder="Introduce tu usuario"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col items-center">
        <label htmlFor="password" className="block text-sm font-bold text-green-800">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mt-1 text-center border rounded-md border-green-800/30 bg-white/60 focus:ring-2 focus:ring-green-800 focus:border-transparent"
          placeholder="Introduce tu contraseña"
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <p className="p-2 text-sm text-center text-red-500 rounded bg-red-50/80">{error}</p>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 text-white transition-colors duration-200 bg-green-800 border border-transparent rounded-md shadow-sm hover:bg-green-900 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}

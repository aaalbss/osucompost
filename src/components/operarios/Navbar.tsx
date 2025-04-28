'use client';

import React, { useState } from 'react';

interface NavbarProps {
  setVista: (vista: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setVista }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="bg-green-600 shadow-lg">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">GestResiduos</span>
          </div>

          {/* Menú de navegación para pantallas medianas y grandes */}
          <div className="items-center hidden space-x-1 md:flex">
            <button
              onClick={() => setVista('dashboard')}
              className="px-3 py-2 text-white transition duration-300 rounded-md hover:bg-green-700"
            >
              Dashboard
            </button>
            <button
              onClick={() => setVista('propietarios')}
              className="px-3 py-2 text-white transition duration-300 rounded-md hover:bg-green-700"
            >
              Propietarios
            </button>
            <button
              onClick={() => setVista('puntosRecogida')}
              className="px-3 py-2 text-white transition duration-300 rounded-md hover:bg-green-700"
            >
              Puntos de Recogida
            </button>
            <button
              onClick={() => setVista('contenedores')}
              className="px-3 py-2 text-white transition duration-300 rounded-md hover:bg-green-700"
            >
              Contenedores
            </button>
            
          </div>

          {/* Botón de menú para dispositivos móviles */}
          <div className="flex items-center md:hidden">
            <button
              className="text-white hover:text-green-200 focus:outline-none"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuAbierto ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable para dispositivos móviles */}
      {menuAbierto && (
        <div className="px-2 pt-2 pb-3 space-y-1 bg-green-600 md:hidden">
          <button
            onClick={() => {
              setVista('dashboard');
              setMenuAbierto(false);
            }}
            className="block w-full px-3 py-2 text-left text-white rounded-md hover:bg-green-700"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setVista('propietarios');
              setMenuAbierto(false);
            }}
            className="block w-full px-3 py-2 text-left text-white rounded-md hover:bg-green-700"
          >
            Propietarios
          </button>
          <button
            onClick={() => {
              setVista('puntosRecogida');
              setMenuAbierto(false);
            }}
            className="block w-full px-3 py-2 text-left text-white rounded-md hover:bg-green-700"
          >
            Puntos de Recogida
          </button>
          <button
            onClick={() => {
              setVista('contenedores');
              setMenuAbierto(false);
            }}
            className="block w-full px-3 py-2 text-left text-white rounded-md hover:bg-green-700"
          >
            Contenedores
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
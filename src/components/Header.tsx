'use client';
import { useState } from 'react';
import Link from 'next/link';
import NavButton from "@/components/NavButton";
import Title from "@/components/Title";
import { Home, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <Title text="OSUCOMPOST" />
          </Link>
        </div>

        <div className="flex items-center">
          {/* Navegación escritorio */}
          <nav className="hidden mr-4 md:block">
            <ul className="flex space-x-4">
              <NavButton href="/#about" text="Sobre Nosotros" />
              <NavButton href="/#reward" text="Sistema de Recogida" />
              <NavButton href="/#products" text="Productos" />
              <NavButton href="/#contact" text="Contacto" />
              {/* Boton de compostaje desde pantalla ancha */}
              <NavButton href="/compostaje" text="VerMicompostaje" />
              <NavButton href="/recursos-educativos" text="Recursos educativos" />
              <NavButton href="/area-cliente" text="Área Cliente" />
              <NavButton href="/login-operarios" text="Área de Operarios" />
            </ul>
          </nav>

          {/* Botón de inicio en la esquina derecha (escritorio) */}
          <Link
            href="/"
            className="items-center hidden px-3 py-2 text-green-800 transition-colors rounded-md md:flex hover:bg-green-200"
            aria-label="Ir a página principal"
          >
            <Home className="text-green-800" size={20} />
          </Link>

          {/* Versión móvil - solo icono home */}
          <Link
            href="/"
            className="flex items-center p-2 mr-2 md:hidden"
            aria-label="Ir a página principal"
          >
            <Home size={24} className="text-green-800" />
          </Link>

          {/* Menú hamburguesa para móviles */}
          <button
            className="p-2 text-green-800 md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable - Versión mejorada */}
      {isMenuOpen && (
        <div className="py-4 bg-white md:hidden">
          <nav className="container px-6 mx-auto">
            <div className="grid grid-cols-1 gap-3">
              {/* Botones principales con estilo mejorado */}
              <Link href="/#about" className="px-5 py-3 font-medium text-center text-green-800 transition-colors bg-white rounded-lg shadow-md hover:bg-green-50">
                Sobre Nosotros
              </Link>
              <Link href="/#reward" className="px-5 py-3 font-medium text-center text-green-800 transition-colors bg-white rounded-lg shadow-md hover:bg-green-50">
                Sistema de Recogida
              </Link>
              <Link href="/#products" className="px-5 py-3 font-medium text-center text-green-800 transition-colors bg-white rounded-lg shadow-md hover:bg-green-50">
                Productos
              </Link>
              <Link href="/#contact" className="px-5 py-3 font-medium text-center text-green-800 transition-colors bg-white rounded-lg shadow-md hover:bg-green-50">
                Contacto
              </Link>
              {/* Funcionalidad de consultar las composteras para movil */}
              <Link href="/compostaje" className="px-5 py-3 font-medium text-center text-green-800 transition-colors bg-white rounded-lg shadow-md hover:bg-green-50">
                VerMicompostaje
              </Link>

              {/* Separador visual sutil */}
              <div className="my-1 border-t border-gray-100"></div>

              {/* Botones secundarios */}
              <Link href="/recursos-educativos" className="px-5 py-3 font-medium text-center text-green-800 transition-colors bg-white rounded-lg shadow-md hover:bg-green-50">
                Recursos educativos
              </Link>
              <Link href="/area-cliente" className="px-5 py-3 font-medium text-center text-green-800 transition-colors bg-white rounded-lg shadow-md hover:bg-green-100">
                Área Cliente
              </Link>
              <Link href="/operarios" className="px-5 py-3 font-medium text-center text-green-800 transition-colors bg-white rounded-lg shadow-md hover:bg-green-100">
                Área Operarios
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
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
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
			<Title text="OSUCOMPOST" />
		  </Link>
        </div>
        
        <div className="flex items-center">
          {/* Navegación escritorio */}
          <nav className="hidden md:block mr-4">
            <ul className="flex space-x-4">
              <NavButton href="/#about" text="Sobre Nosotros" />
              <NavButton href="/#reward" text="Sistema de Recogida" />
              <NavButton href="/#products" text="Productos" />
              <NavButton href="/#contact" text="Contacto" />
			  {/* Boton de compostaje desde pantalla ancha */}
			  <NavButton href="/compostaje" text="VerMicompostaje" />
              <NavButton href="/recursos-educativos" text="Recursos educativos" />
              <NavButton href="/area-cliente" text="Área Cliente" />
            </ul>
          </nav>
          
          {/* Botón de inicio en la esquina derecha (escritorio) */}
          <Link 
            href="/" 
            className="hidden md:flex items-center px-3 py-2 hover:bg-green-200 text-green-800 rounded-md transition-colors"
            aria-label="Ir a página principal"
          >
            <Home className="text-green-800" size={20} />
          </Link>
          
          {/* Versión móvil - solo icono home */}
          <Link 
            href="/" 
            className="md:hidden flex items-center mr-2 p-2"
            aria-label="Ir a página principal"
          >
            <Home size={24} className="text-green-800" />
          </Link>

          {/* Menú hamburguesa para móviles */}
          <button 
            className="md:hidden p-2 text-green-800"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable - Versión mejorada */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4">
          <nav className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-3">
              {/* Botones principales con estilo mejorado */}
              <Link href="/#about" className="py-3 px-5 rounded-lg bg-white shadow-md text-green-800 font-medium text-center hover:bg-green-50 transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/#reward" className="py-3 px-5 rounded-lg bg-white shadow-md text-green-800 font-medium text-center hover:bg-green-50 transition-colors">
                Sistema de Recogida
              </Link>
              <Link href="/#products" className="py-3 px-5 rounded-lg bg-white shadow-md text-green-800 font-medium text-center hover:bg-green-50 transition-colors">
                Productos
              </Link>
              <Link href="/#contact" className="py-3 px-5 rounded-lg bg-white shadow-md text-green-800 font-medium text-center hover:bg-green-50 transition-colors">
                Contacto
              </Link>
			  {/* Funcionalidad de consultar las composteras para movil */}
			  <Link href="/compostaje" className="py-3 px-5 rounded-lg bg-white shadow-md text-green-800 font-medium text-center hover:bg-green-50 transition-colors">
                VerMicompostaje
              </Link>
              
              {/* Separador visual sutil */}
              <div className="border-t border-gray-100 my-1"></div>
              
              {/* Botones secundarios */}
              <Link href="/recursos-educativos" className="py-3 px-5 rounded-lg bg-white shadow-md text-green-800 font-medium text-center hover:bg-green-50 transition-colors">
                Recursos educativos
              </Link>
              <Link href="/area-cliente" className="py-3 px-5 rounded-lg bg-white shadow-md text-green-800 font-medium text-center hover:bg-green-100 transition-colors">
                Área Cliente
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
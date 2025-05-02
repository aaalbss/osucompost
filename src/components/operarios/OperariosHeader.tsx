'use client';

import React, { useState, useEffect } from 'react';
import { Home, Users, MapPin, Menu, X, LogOut, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface OperariosHeaderProps {
  setVista: (vista: string) => void;
  vistaActual: string;
  onLogout?: () => void; // Añadimos esta prop para manejar el cierre de sesión
}

const OperariosHeader: React.FC<OperariosHeaderProps> = ({ 
  setVista, 
  vistaActual = 'dashboard',
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Add scroll listener for shadow effect with optimized performance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Uso de passive: true para mejorar el rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to handle navigation
  const navigateTo = (vista: string) => {
    if (vista === 'home') {
      // Navegar a la página principal (page.tsx)
      router.push('/');
    } else {
      // Cambiar la vista dentro del dashboard de operarios
      setVista(vista);
      setIsMobileMenuOpen(false);
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Eliminar la información de sesión del localStorage
    localStorage.removeItem('userUsername');
    localStorage.removeItem('cookiesModalShown');
    
    // Si se proporciona una función onLogout, la llamamos
    if (onLogout) {
      onLogout();
    } else {
      // Si no, redirigimos a la página principal
      router.push('/');
    }
    
    // Cerramos el menú móvil si está abierto
    setIsMobileMenuOpen(false);
  };

  // Determine if a route is active
  const isActive = (vista: string) => {
    return vistaActual === vista;
  };

  // Efecto para ocultar headers adicionales
  useEffect(() => {
    // Buscar y ocultar cualquier header adicional
    const headers = document.querySelectorAll('header');
    if (headers.length > 1) {
      // El primer header es nuestro componente, los demás se ocultan
      for (let i = 1; i < headers.length; i++) {
        headers[i].style.display = 'none';
      }
    }
  }, []);

  // Variantes para animaciones
  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.08, duration: 0.25 } // Reducido delay y duración
    }),
    hover: { 
      scale: 1.05, 
      transition: { type: "spring", stiffness: 500, damping: 10 } 
    },
    tap: { scale: 0.95 }
  };

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, type: "spring", stiffness: 120 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    closed: { 
      x: "-100%",
      opacity: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        duration: 0.3
      }
    },
    open: { 
      x: "0%",
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  };

  const mobileNavItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 350, damping: 24 }
    }
  };

  const overlayVariants = {
    closed: { opacity: 0, pointerEvents: "none" as "none" },
    open: { 
      opacity: 1, 
      pointerEvents: "auto" as "auto",
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <motion.header 
        className={`custom-header bg-white border-b border-green-100 sticky top-0 z-50 ${
          isScrolled ? 'shadow-md py-2' : 'shadow-sm py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* OSUCOMPOST Title/Logo with hover effect */}
            <motion.div 
              className="relative text-2xl font-bold text-green-800 cursor-pointer group"
              onClick={() => navigateTo('home')}
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              aria-label="Página de inicio"
            >
              OSUCOMPOST
              <motion.span 
                className="absolute -bottom-1 left-0 h-0.5 bg-green-600 will-change-[width]"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.25 }}
              ></motion.span>
            </motion.div>
            
            {/* Desktop Navigation Menu - Hidden on mobile */}
            <div className="items-center hidden space-x-4 md:flex">
              {/* Home Button - Cambiado a "Zona Operarios" */}
              <motion.button 
                onClick={() => navigateTo('dashboard')}
                className={`flex items-center px-4 py-2 rounded ${
                  isActive('dashboard')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
                variants={navItemVariants}
                custom={0}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <Home className="mr-2" size={20} />
                <span>Zona Operarios</span>
                {isActive('dashboard') && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-white"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 550, damping: 30 }}
                  />
                )}
              </motion.button>
              
              {/* Propietarios Button */}
              <motion.button 
                onClick={() => navigateTo('propietarios')}
                className={`flex items-center px-4 py-2 rounded ${
                  isActive('propietarios')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
                variants={navItemVariants}
                custom={1}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <Users className="mr-2" size={20} />
                <span>Propietarios</span>
                {isActive('propietarios') && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-white"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 550, damping: 30 }}
                  />
                )}
              </motion.button>
              
              {/* Puntos de Recogida Button */}
              <motion.button 
                onClick={() => navigateTo('puntosRecogida')}
                className={`flex items-center px-4 py-2 rounded ${
                  isActive('puntosRecogida')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
                variants={navItemVariants}
                custom={2}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <MapPin className="mr-2" size={20} />
                <span>Puntos de Recogida</span>
                {isActive('puntosRecogida') && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-white"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 550, damping: 30 }}
                  />
                )}
              </motion.button>
              
              {/* Contenedores Button */}
              <motion.button 
                onClick={() => navigateTo('contenedores')}
                className={`flex items-center px-4 py-2 rounded ${
                  isActive('contenedores')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
                variants={navItemVariants}
                custom={3}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <Trash2 className="mr-2" size={20} />
                <span>Contenedores</span>
                {isActive('contenedores') && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-white"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 550, damping: 30 }}
                  />
                )}
              </motion.button>
              
              {/* Botón de cerrar sesión */}
              <motion.button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                variants={navItemVariants}
                custom={4}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="mr-2" size={20} />
                <span>Salir</span>
              </motion.button>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="flex md:hidden">
              <motion.button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-green-800 rounded hover:bg-green-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMobileMenuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="will-change-transform"
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="will-change-transform"
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Sidebar - Shown only on mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.div 
          className="fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg md:hidden will-change-transform"
          variants={mobileMenuVariants}
          initial="closed"
          animate={isMobileMenuOpen ? "open" : "closed"}
          exit="closed"
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-6">
              <motion.div 
                className="text-xl font-bold text-green-800 cursor-pointer"
                onClick={() => navigateTo('home')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OSUCOMPOST
              </motion.div>
              <motion.button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <X size={24} className="text-gray-600" />
              </motion.button>
            </div>
            
            <div className="flex flex-col flex-1 gap-4">
              {/* Mobile Navigation Items */}
              <motion.button 
                onClick={() => navigateTo('dashboard')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 ${
                  isActive('dashboard')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
                variants={mobileNavItemVariants}
              >
                <Home size={20} />
                Zona Operarios
              </motion.button>
              
              <motion.button 
                onClick={() => navigateTo('propietarios')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 ${
                  isActive('propietarios')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
                variants={mobileNavItemVariants}
              >
                <Users size={20} />
                Propietarios
              </motion.button>
              
              <motion.button 
                onClick={() => navigateTo('puntosRecogida')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 ${
                  isActive('puntosRecogida')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
                variants={mobileNavItemVariants}
              >
                <MapPin size={20} />
                Puntos de Recogida
              </motion.button>
              
              <motion.button 
                onClick={() => navigateTo('contenedores')}
                className={`py-2 px-4 rounded-md flex items-center gap-2 ${
                  isActive('contenedores')
                    ? 'bg-green-600 text-white' 
                    : 'text-green-800 hover:bg-green-50'
                }`}
                variants={mobileNavItemVariants}
              >
                <Trash2 size={20} />
                Contenedores
              </motion.button>
              
              {/* Botón de cerrar sesión en el menú móvil */}
              <motion.button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 mt-auto text-white bg-red-600 rounded-md hover:bg-red-700"
                variants={mobileNavItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={20} />
                Salir
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.header>
    </>
  );
};

export default OperariosHeader;
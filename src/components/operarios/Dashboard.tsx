'use client';

import React, { useState, useEffect } from 'react';
import { Users, MapPin, Package } from 'lucide-react';
import { Propietario, PuntoRecogida, Contenedor } from '@/types/types';
import { motion } from 'framer-motion';

interface DashboardProps {
  propietarios: Propietario[];
  puntosRecogida: PuntoRecogida[];
  contenedores: Contenedor[];
  setVista: (vista: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  propietarios,
  puntosRecogida,
  contenedores,
  setVista
}) => {
  // Contadores
  const propietariosCount = propietarios.length;
  const puntosRecogidaCount = puntosRecogida.length;
  const contenedoresCount = contenedores.length;
  
  // Estado para controlar la animación de contador
  const [countAnimation, setCountAnimation] = useState({
    propietarios: 0,
    puntosRecogida: 0,
    contenedores: 0,
    organicos: 0,
    estructurantes: 0
  });

  // Contar contenedores por tipo de residuo de manera robusta
  const organicosCount = contenedores.filter(contenedor => {
    // Revisamos diferentes posibles propiedades para determinar el tipo
    const tipoInfo = contenedor.tipoResiduo || contenedor.tipoResiduoId || contenedor.tipo;
    
    // Si tipoInfo es un objeto con una propiedad id o descripcion
    if (typeof tipoInfo === 'object' && tipoInfo !== null) {
      // Comprobamos si tiene id=1 o descripcion que incluye "Organico"
      return tipoInfo.id === 1 || 
             (tipoInfo.descripcion && tipoInfo.descripcion.toLowerCase().includes('organico'));
    }
    
    // Si tipoInfo es un número, revisamos si es 1 (ID para Orgánico según el código original)
    if (typeof tipoInfo === 'number') {
      return tipoInfo === 1;
    }
    
    // Si tipoInfo es una cadena, comprobamos si contiene "Organico"
    if (typeof tipoInfo === 'string') {
      return tipoInfo.toLowerCase().includes('organico');
    }
    
    return false;
  }).length;
  
  const estructurantesCount = contenedores.filter(contenedor => {
    // Aplicamos la misma lógica para estructurantes
    const tipoInfo = contenedor.tipoResiduo || contenedor.tipoResiduoId || contenedor.tipo;
    
    if (typeof tipoInfo === 'object' && tipoInfo !== null) {
      return tipoInfo.id === 2 || 
             (tipoInfo.descripcion && tipoInfo.descripcion.toLowerCase().includes('estructurante'));
    }
    
    if (typeof tipoInfo === 'number') {
      return tipoInfo === 2;
    }
    
    if (typeof tipoInfo === 'string') {
      return tipoInfo.toLowerCase().includes('estructurante');
    }
    
    return false;
  }).length;

  // Efecto para animar contadores cuando se monta el componente
  useEffect(() => {
    // Iniciar con valores en 0
    setCountAnimation({
      propietarios: 0,
      puntosRecogida: 0,
      contenedores: 0,
      organicos: 0,
      estructurantes: 0
    });
    
    // Animar hacia los valores finales más rápido
    const timer = setTimeout(() => {
      setCountAnimation({
        propietarios: propietariosCount,
        puntosRecogida: puntosRecogidaCount,
        contenedores: contenedoresCount,
        organicos: organicosCount,
        estructurantes: estructurantesCount
      });
    }, 200);  // Reducido de 300 a 200ms
    
    return () => clearTimeout(timer);
  }, [propietariosCount, puntosRecogidaCount, contenedoresCount, organicosCount, estructurantesCount]);

  // Variantes para animaciones de cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.15, // Reducir delay para una secuencia más rápida
        duration: 0.4,
        type: "spring",
        stiffness: 180, // Aumentar stiffness para más rebote
        damping: 20 // Reducir damping para más rebote pero controlado
      }
    }),
    hover: { 
      y: -8,
      scale: 1.02, // Pequeño zoom
      boxShadow: "0 14px 28px rgba(0, 0, 0, 0.08), 0 10px 10px rgba(0, 0, 0, 0.04)",
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 25 
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Tarjeta de Propietarios */}
          <motion.div 
            onClick={() => setVista('propietarios')}
            custom={0}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
            className="p-8 transition-all duration-300 border shadow-sm cursor-pointer bg-white/90 backdrop-blur-sm border-blue-100/30 rounded-xl hover:shadow-md hover:bg-white/95 group will-change-transform"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, delay: 0.2 }}
                className="p-3 mr-4 text-blue-400 rounded-full bg-blue-50/70"
              >
                <Users className="w-7 h-7" />
              </motion.div>
              <h3 className="text-xl font-medium text-gray-600">Propietarios</h3>
            </div>
            
            <div className="mb-6">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-6xl font-light text-blue-400 group-hover:text-blue-500"
              >
                <motion.span
                  animate={{ count: countAnimation.propietarios }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.3,
                    ease: "easeOut"
                  }}
                >
                  {Math.round(countAnimation.propietarios)}
                </motion.span>
              </motion.span>
              <span className="ml-2 text-lg text-gray-400">clientes</span>
            </div>
            
            <p className="mb-5 text-base text-gray-500">Clientes registrados en el sistema</p>
            
            <div className="text-right">
              <motion.span 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-base text-blue-400 transition-colors group-hover:text-blue-500"
              >
                Ver detalles →
              </motion.span>
            </div>
          </motion.div>

          {/* Tarjeta de Puntos de Recogida */}
          <motion.div 
            onClick={() => setVista('puntosRecogida')}
            custom={1}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
            className="p-8 transition-all duration-300 border shadow-sm cursor-pointer bg-white/90 backdrop-blur-sm border-green-100/30 rounded-xl hover:shadow-md hover:bg-white/95 group will-change-transform"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, delay: 0.3 }}
                className="p-3 mr-4 text-green-400 rounded-full bg-green-50/70"
              >
                <MapPin className="w-7 h-7" />
              </motion.div>
              <h3 className="text-xl font-medium text-gray-600">Puntos de Recogida</h3>
            </div>
            
            <div className="mb-6">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-6xl font-light text-green-400 group-hover:text-green-500"
              >
                <motion.span
                  animate={{ count: countAnimation.puntosRecogida }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.5,
                    ease: "easeOut"
                  }}
                >
                  {Math.round(countAnimation.puntosRecogida)}
                </motion.span>
              </motion.span>
              <span className="ml-2 text-lg text-gray-400">ubicaciones</span>
            </div>
            
            <p className="mb-5 text-base text-gray-500">Ubicaciones para recogida de residuos</p>
            
            <div className="text-right">
              <motion.span 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-base text-green-400 transition-colors group-hover:text-green-500"
              >
                Ver detalles →
              </motion.span>
            </div>
          </motion.div>

          {/* Tarjeta de Contenedores */}
          <motion.div 
            onClick={() => setVista('contenedores')}
            custom={2}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
            className="p-8 transition-all duration-300 border shadow-sm cursor-pointer bg-white/90 backdrop-blur-sm border-amber-100/30 rounded-xl hover:shadow-md hover:bg-white/95 group will-change-transform"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, delay: 0.4 }}
                className="p-3 mr-4 rounded-full text-amber-400 bg-amber-50/70"
              >
                <Package className="w-7 h-7" />
              </motion.div>
              <h3 className="text-xl font-medium text-gray-600">Contenedores</h3>
            </div>
            
            <div className="mb-6">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-6xl font-light text-amber-400 group-hover:text-amber-500"
              >
                <motion.span
                  animate={{ count: countAnimation.contenedores }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.6,
                    ease: "easeOut"
                  }}
                >
                  {Math.round(countAnimation.contenedores)}
                </motion.span>
              </motion.span>
              <span className="ml-2 text-lg text-gray-400">unidades</span>
            </div>
            
            <div className="mb-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="inline-block w-3.5 h-3.5 mr-2 bg-green-300 rounded-full"></span>
                  <span className="text-base text-gray-500">Orgánicos</span>
                </div>
                <motion.span 
                  animate={{ count: countAnimation.organicos }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.8,
                    ease: "easeOut"
                  }}
                  className="text-base text-gray-600"
                >
                  {Math.round(countAnimation.organicos)}
                </motion.span>
              </div>
              
              <motion.div 
                className="w-full h-2.5 overflow-hidden bg-gray-100 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <motion.div 
                  className="h-full bg-green-300 will-change-[width]" 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: contenedoresCount ? `${(organicosCount / contenedoresCount) * 100}%` : '0%' 
                  }}
                  transition={{ 
                    delay: 0.9, 
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1] // Curva de Bézier personalizada para movimiento fluido
                  }}
                ></motion.div>
              </motion.div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <span className="inline-block w-3.5 h-3.5 mr-2 bg-amber-300 rounded-full"></span>
                  <span className="text-base text-gray-500">Estructurantes</span>
                </div>
                <motion.span 
                  animate={{ count: countAnimation.estructurantes }}
                  transition={{ 
                    duration: 0.8,
                    delay: 1,
                    ease: "easeOut"
                  }}
                  className="text-base text-gray-600"
                >
                  {Math.round(countAnimation.estructurantes)}
                </motion.span>
              </div>
              
              <motion.div 
                className="w-full h-2.5 overflow-hidden bg-gray-100 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <motion.div 
                  className="h-full bg-amber-300 will-change-[width]"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: contenedoresCount ? `${(estructurantesCount / contenedoresCount) * 100}%` : '0%' 
                  }}
                  transition={{ 
                    delay: 1.1, 
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                ></motion.div>
              </motion.div>
            </div>
            
            <div className="text-right">
              <motion.span 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-base transition-colors text-amber-400 group-hover:text-amber-500"
              >
                Ver detalles →
              </motion.span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
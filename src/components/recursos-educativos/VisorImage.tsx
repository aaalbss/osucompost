import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import Image from 'next/image';

const VisorImagen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const imagePath = "/images/si_o_no.jpeg";

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // Bloquear scroll de la página
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto'; // Restaurar scroll
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Imagen reducida para vista previa */}
      <div className="relative w-full max-w-md">
        <Image 
          src={imagePath} 
          alt="Imagen Si o No" 
          width={600}
          height={450}
          className="object-contain w-full max-h-[60vh] rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
        />

        {/* Botón de ampliar */}
        <button 
          onClick={openModal}
          className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-300"
        >
          <Maximize2 size={18} className="text-green-700" />
        </button>
      </div>

      {/* Modal de imagen ampliada */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-2" onClick={closeModal}>
          <div className="relative w-auto max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* Botón de cierre */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all duration-300"
              aria-label="Cerrar"
            >
              <X size={22} className="text-gray-800" />
            </button>

            {/* Imagen ampliada */}
            <Image
              src={imagePath} 
              alt="Imagen Si o No" 
              width={1200}
              height={900}
              className="object-contain max-w-screen max-h-screen rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisorImagen;

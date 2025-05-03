import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ChatIconProps {
  onClick: () => void;
  imageSrc: string;
  isOpen: boolean; // Nueva prop para controlar el estado del chat
}

const ChatIcon: React.FC<ChatIconProps> = ({ onClick, imageSrc, isOpen }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Si el chat está abierto, ocultar el mensaje y detener la animación
      setShowMessage(false);
      setIsAnimating(false);
      return;
    }

    // Solo crear los intervalos si el chat está cerrado
    const messageInterval = setInterval(() => {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }, 10000);

    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);

    // Limpiar los intervalos
    return () => {
      clearInterval(messageInterval);
      clearInterval(animationInterval);
    };
  }, [isOpen]); // Ejecutar el efecto cuando cambie el estado de isOpen

  return (
    <div className="relative">
      {showMessage && !isOpen && (
        <div className="absolute right-0 w-48 max-w-xs p-3 mb-2 bg-white rounded-lg shadow-lg bottom-full">
          <div className="text-sm text-gray-700">
            ¡Hola! soy CHAVO, ¿puedo ayudarle en algo?
          </div>
          <div className="absolute bottom-0 w-4 h-4 transform rotate-45 translate-y-1/2 bg-white right-8" />
        </div>
      )}
      <div 
        onClick={onClick} 
        className={`transform transition-transform duration-300 ${
          isAnimating && !isOpen ? 'translate-y-[-8px]' : ''
        }`}
      >
        <div className="cursor-pointer p-2.5 bg-transparent rounded-full inline-flex items-center justify-center w-20 h-20 shadow-lg hover:shadow-xl transition-shadow">
          <Image
            src={imageSrc}
            alt="Chat Icon"
            width={100}
            height={100}
            className="object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatIcon;
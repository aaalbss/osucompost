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
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg p-3 shadow-lg max-w-xs w-48">
          <div className="text-sm text-gray-700">
            ¡Hola! soy CHAVO, ¿puedo ayudarte en algo?
          </div>
          <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white" />
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
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatIcon;
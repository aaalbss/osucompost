import React, { useState, useEffect } from 'react';
import ChatIcon from './ChatIcon';
import ChatWindow from './ChatWindow';

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
  };

  // Efecto para mostrar el mensaje de bienvenida cuando se abre el chat
  useEffect(() => {
    // Si el chat está abierto y no ha saludado aún
    if (isOpen && !hasGreeted) {
      // Pequeño retraso para que se vea natural
      const timer = setTimeout(() => {
        setMessages([
          { sender: 'bot', text: '¡Hola! Soy CHAVO,el asistente virtual de OSUCOMPOST. ¿En qué puedo ayudarte hoy?' }
        ]);
        setHasGreeted(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasGreeted]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: message },
    ]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const contentType = res.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: data.message },
        ]);
      } else {
        const errorText = await res.text();
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: `Error: ${errorText}` },
        ]);
      }
    } catch (error) {
      console.error('Error al obtener la respuesta:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Hubo un error al obtener la respuesta.' },
      ]);
    } finally {
      setLoading(false);
    }

    setMessage('');
  };

  const chatIconImage = '/images/CHAVO.jpg'; // Ruta de la imagen del ícono

  return (
    <div className="chat-container">
      {/* Ícono para abrir/cerrar el chat */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <ChatIcon 
          onClick={toggleChatWindow} 
          imageSrc={chatIconImage}
          isOpen={isOpen} 
        />
      </div>
  
      {isOpen && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 999 }}>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            message={message}
            setMessage={setMessage}
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
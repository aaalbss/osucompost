import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ChatWindowProps {
  messages: { sender: string; text: string }[];
  onSendMessage: (message: string) => void;
  loading: boolean;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  loading,
  message,
  setMessage,
}) => {
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottomIfNeeded = () => {
    if (scrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottomIfNeeded();
  }, [messages, scrollToBottom]);

  const handleMessageSend = (message: string) => {
    onSendMessage(message);
    setScrollToBottom(true);
  };

  return (
    <div className="chat-window" style={styles.chatWindow}>
      <div className="messages-container" style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.sender === 'bot' && (
              <div style={styles.botAvatar}>
                <Image
                  src="/images/CHAVO.jpg"
                  alt="Chat Bot"
                  width={40}
                  height={40}
                  style={styles.avatarImage}
                />
              </div>
            )}
            <div
              style={{
                ...styles.messageContainer,
                ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage),
              }}
            >
              <p style={styles.messageText}>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !loading) {
              e.preventDefault();
              handleMessageSend(message);
            }
          }}
          placeholder="Escribe tu mensaje..."
          style={styles.textarea}
        />
        <button 
          onClick={() => handleMessageSend(message)} 
          disabled={loading} 
          style={styles.button}
        >
          {loading ? 'Cargando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatWindow: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    width: '600px',
    maxWidth: '100%',
    height: 'auto',
    minHeight: '80vh',
    maxHeight: '100vh',
    border: '2px solid rgb(25, 99, 51)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    overflowY: 'auto' as const,
    padding: '8px',
    gap: '12px',
    height: 'auto',
    minHeight: '50vh',
    maxHeight: '60vh',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: '8px',
  },
  messageContainer: {
    maxWidth: '75%',
    wordBreak: 'break-word' as const,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '16px',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  messageText: {
    margin: 0,
    padding: 0,
    fontSize: '14px',
    lineHeight: '1.5',
  },
  botAvatar: {
    marginRight: '8px',
    flexShrink: 0,
  },
  avatarImage: {
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '12px',
    backgroundColor: '#ffffff',
    paddingBottom: '10px',
    marginTop: 'auto',
  },
  userMessage: {
    backgroundColor: 'rgb(25, 99, 51)',
    color: '#ffffff',
    borderRadius: '16px 16px 0 16px',
  },
  botMessage: {
    backgroundColor: 'rgb(188, 220, 184)',
    color: 'rgb(0, 0, 0)',
    borderRadius: '16px 16px 16px 0',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    resize: 'none' as const,
    height: '80px',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '12px',
    backgroundColor: 'rgb(25, 99, 51)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    flexShrink: 0,
  },
} as const;

export default ChatWindow;
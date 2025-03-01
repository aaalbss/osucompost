// src/components/propietario/EnhancedConfirmModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ProcessIndicator from './ProcessIndicator';
import { CascadeDeleteStep } from '@/services/CascadeDeleteService';

interface EnhancedConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (onProgress: (progress: number, steps: CascadeDeleteStep[]) => void) => Promise<boolean>;
  onCancel: (successful?: boolean) => void;
}

const EnhancedConfirmModal: React.FC<EnhancedConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<CascadeDeleteStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWaitingForUser, setIsWaitingForUser] = useState(false);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes with a slight delay
      // to prevent visual glitches
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setSteps([]);
        setError(null);
        setIsCompleted(false);
        setIsWaitingForUser(false);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Esta función se ejecuta cuando el usuario hace clic en "Sí, darme de baja"
  const handleConfirm = () => {
    setIsProcessing(true);
    setError(null);
    
    // Crear una función de callback para actualizar el progreso
    const progressCallback = (currentProgress: number, updatedSteps: CascadeDeleteStep[]) => {
      console.log("Progreso actual:", currentProgress, "Pasos:", updatedSteps);
      setProgress(currentProgress);
      setSteps([...updatedSteps]); // Clone array to ensure re-render
      
      // Cuando el progreso está al 100%, marcamos como completado
      // y establecemos que estamos esperando al usuario
      if (currentProgress === 100) {
        console.log("Proceso completado");
        setIsCompleted(true);
        setIsWaitingForUser(true);
      }
    };
    
    // Iniciar el proceso de eliminación
    onConfirm(progressCallback)
      .then((success) => {
        console.log("Proceso finalizado con éxito:", success);
        // No cerramos automáticamente, esperamos a que el usuario haga clic en "Finalizar"
        setIsWaitingForUser(true);
      })
      .catch((err) => {
        console.error("Error en el proceso:", err);
        setError(err instanceof Error ? err.message : 'Ocurrió un error durante el proceso');
        setIsProcessing(false);
        setIsWaitingForUser(true); // También esperamos al usuario en caso de error
      });
  };

  // Función para finalizar el proceso (cuando el usuario hace clic en "Finalizar")
  const handleFinish = () => {
    onCancel(true); // Llamar a onCancel con true para indicar éxito
  };

  // Función para cerrar el modal sin finalizar (cuando el usuario hace clic en "Cerrar" o "Cancelar")
  const handleClose = () => {
    // Si estamos procesando, mostramos un mensaje de confirmación
    if (isProcessing && !isCompleted && !error) {
      if (window.confirm("¿Está seguro que desea cancelar el proceso? Esta acción podría dejar datos inconsistentes.")) {
        onCancel(false);
      }
    } else {
      onCancel(false); // Llamar a onCancel con false para indicar que no hay éxito
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className={`p-4 ${error ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-red-500'}`}>
          <h3 className="text-xl font-bold text-white">
            {error ? 'Error en el proceso' : isCompleted ? 'Proceso completado' : title}
          </h3>
        </div>
        
        <div className="p-6">
          {!isProcessing && !isCompleted && !error ? (
            <>
              <p className="text-gray-700 mb-6">{message}</p>
              
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  {cancelText}
                </button>
                
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  {confirmText}
                </button>
              </div>
            </>
          ) : (
            <>
              {error ? (
                <div className="mb-6">
                  <p className="text-red-600 font-medium mb-2">Ocurrió un error durante el proceso:</p>
                  <p className="text-gray-700">{error}</p>
                </div>
              ) : isCompleted ? (
                <div className="mb-6">
                  <p className="text-green-600 font-medium">El proceso se ha completado correctamente.</p>
                  <p className="text-gray-700 mt-2">Tu cuenta y todos los datos asociados han sido eliminados.</p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">Eliminando cuenta y datos asociados...</p>
                </div>
              )}
              
              {/* Indicador de progreso */}
              {steps.length > 0 && (
                <div className="mb-6">
                  <ProcessIndicator 
                    steps={steps} 
                    currentStep={steps.findIndex(step => step.status === 'processing')}
                    progress={progress}
                  />
                </div>
              )}
              
              <div className="flex justify-end">
                {error ? (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cerrar
                  </button>
                ) : isCompleted ? (
                  <button
                    onClick={handleFinish}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Finalizar
                  </button>
                ) : isProcessing ? (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedConfirmModal;
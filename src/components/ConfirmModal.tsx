'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[550px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="text-center mb-8">
              <p className="text-4xl text-[#2f4f27] font-bold mb-6">¡Atención!</p>
              <p className="text-xl text-gray-800 mx-auto max-w-[450px]">{message}</p>
            </div>
            <div className="flex justify-center gap-6">
              <button
                className="bg-[#3b6e35] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#2f4f27] transition-colors flex items-center justify-center gap-3 min-w-[120px]"
                onClick={onConfirm}
              >
                Aceptar
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 min-w-[120px]"
                onClick={onCancel}
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
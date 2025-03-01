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
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white p-5 rounded-lg shadow-lg w-[550px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="text-4xl text-[#2f4f27] font-bold text-center mb-6">¡Atención!</p>
            <p className="text-xl text-gray-800 text-center">{message}</p>
            <div className="flex justify-end gap-6 mt-6">
              <button
                className="bg-[#3b6e35] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#2f4f27] transition-colors flex items-center justify-center gap-3"
                onClick={onConfirm}
              >
                Aceptar
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
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

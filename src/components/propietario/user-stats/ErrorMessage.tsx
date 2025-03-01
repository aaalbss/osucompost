// ErrorMessage.tsx
import React from 'react';

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-50 p-4 rounded-lg text-red-700">
    {message}
  </div>
);
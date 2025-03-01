// LoadingSpinner.tsx
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-[500px]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
  </div>
);
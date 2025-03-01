'use client';

import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { AlertMessageProps } from './types';

const AlertMessage: React.FC<AlertMessageProps> = ({ type, title, message }) => {
  if (type === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-800">{title}</p>
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    );
  }

  if (type === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start">
        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-green-800">{title}</p>
          <p className="text-sm text-green-700">{message}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AlertMessage;
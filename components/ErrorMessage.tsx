
import React from 'react';
import { ExclamationTriangleIcon } from './Icons';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mt-6 flex items-center gap-3">
      <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

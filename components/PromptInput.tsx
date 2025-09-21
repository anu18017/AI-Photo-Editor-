
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder="e.g., add a cat wearing a wizard hat"
      rows={4}
      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-brand-purple-light focus:border-brand-purple-light transition duration-200 ease-in-out disabled:opacity-50"
    />
  );
};


import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(dragging);
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
      handleDragEvents(e, false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        onImageUpload(file);
      }
  }, [onImageUpload]);

  return (
    <div className="w-full">
      <label
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-brand-purple bg-gray-700/50' : 'border-gray-600 bg-gray-700 hover:bg-gray-700/80'}`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded preview" className="object-contain w-full h-full rounded-lg p-1" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400"/>
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP, etc.</p>
          </div>
        )}
        <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

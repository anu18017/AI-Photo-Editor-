import React from 'react';
import { Spinner } from './Spinner';
import { PhotoIcon, DownloadIcon } from './Icons';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
  text?: string;
  onDownload?: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading = false, text, onDownload }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700 flex flex-col h-full">
      <h3 className="text-xl font-bold text-gray-200 mb-4 text-center">{title}</h3>
      <div className="aspect-square w-full bg-gray-900/50 rounded-lg flex items-center justify-center overflow-hidden relative group">
        {isLoading ? (
          <div className="flex flex-col items-center text-gray-400">
            <Spinner />
            <p className="mt-4">AI is working its magic...</p>
          </div>
        ) : imageUrl ? (
          <>
            <img src={imageUrl} alt={title} className="object-contain w-full h-full" />
            {onDownload && (
              <button
                onClick={onDownload}
                className="absolute top-3 right-3 p-2 bg-gray-900/60 backdrop-blur-sm rounded-full text-white hover:bg-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple-light opacity-0 group-hover:opacity-100 transition-all duration-300"
                aria-label="Download image"
              >
                <DownloadIcon className="w-6 h-6" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
             <PhotoIcon className="w-24 h-24" />
            <p>Image will appear here</p>
          </div>
        )}
      </div>
       {text && !isLoading && (
        <div className="mt-4 p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
          <p className="text-sm text-gray-300 italic">{text}</p>
        </div>
      )}
    </div>
  );
};
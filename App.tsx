import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ImageDisplay } from './components/ImageDisplay';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { editImageWithNanoBanana } from './services/geminiService';
import type { EditedImageResult } from './types';
import { SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editedImage, setEditedImage] = useState<EditedImageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalImageFile(file);
    setEditedImage(null);
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setOriginalImageUrl(objectUrl);
    // Revoke previous object URL to prevent memory leaks
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImageFile || !prompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await editImageWithNanoBanana(originalImageFile, prompt);
      setEditedImage(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt]);
  
  const handleDownload = useCallback(() => {
    if (!editedImage?.url) return;

    const link = document.createElement('a');
    link.href = editedImage.url;
    
    // Determine file extension from MIME type for a proper filename
    const extension = editedImage.mimeType.split('/')[1] || 'png';
    link.download = `edited-image-${Date.now()}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [editedImage]);


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-4 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">1. Upload Image</h2>
            <ImageUploader onImageUpload={handleImageUpload} imageUrl={originalImageUrl} />

            <h2 className="text-2xl font-bold text-gray-100 mt-8 mb-6">2. Describe Your Edit</h2>
            <PromptInput
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />

            <h2 className="text-2xl font-bold text-gray-100 mt-8 mb-6">3. Generate!</h2>
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !originalImageFile || !prompt}
              className="w-full flex items-center justify-center gap-2 text-white bg-brand-purple hover:bg-brand-purple-light disabled:bg-gray-600 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:shadow-none"
            >
              {isLoading ? 'Generating...' : 'Apply Magic'}
              <SparklesIcon className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
             {error && <ErrorMessage message={error} />}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageDisplay title="Original" imageUrl={originalImageUrl} />
              <ImageDisplay
                title="Edited"
                imageUrl={editedImage?.url || null}
                isLoading={isLoading}
                text={editedImage?.text}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
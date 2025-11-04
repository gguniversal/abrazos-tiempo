
import React, { useRef, useCallback } from 'react';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload, imagePreviewUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };
  
  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl text-center flex flex-col items-center justify-between h-full">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div 
        onClick={handleClick}
        className="w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 bg-slate-50 dark:bg-slate-700/50 transition-colors duration-300"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Vista previa" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-slate-500 dark:text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Haz clic para subir una imagen</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

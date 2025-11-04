
import type { PhotoData } from '../types';

export const fileToBase64 = (file: File): Promise<PhotoData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.match(/:(.*?);/)?.[1];
      if (!mimeType) {
        reject(new Error("Could not determine file MIME type."));
        return;
      }
      const base64Data = result.split(',')[1];
      resolve({ data: base64Data, mimeType, dataUrl: result });
    };
    reader.onerror = (error) => reject(error);
  });
};

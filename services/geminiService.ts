import type { PhotoData } from '../types';

declare global {
  interface Window {
    adt_ajax: {
      api_url: string;
      nonce: string;
    };
  }
}

export const generateMemoryImage = async (
  oldPhoto: PhotoData | null,
  recentPhoto: PhotoData | null,
  name: string
): Promise<string> => {
  if (!oldPhoto || !recentPhoto) {
    throw new Error('Se requieren ambas fotos.');
  }

  const response = await fetch(window.adt_ajax.api_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': window.adt_ajax.nonce,
    },
    body: JSON.stringify({
      old_photo: oldPhoto,
      recent_photo: recentPhoto,
      name: name,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en el servidor de WordPress.');
  }

  const data = await response.json();

  if (data.success && data.imageData) {
    return data.imageData;
  } else {
    throw new Error(data.message || 'No se pudo generar la imagen desde WordPress.');
  }
};

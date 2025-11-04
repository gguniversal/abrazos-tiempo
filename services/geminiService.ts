import { GoogleGenAI, Modality } from "@google/genai";
import type { PhotoData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMemoryImage = async (
  oldPhoto: PhotoData,
  recentPhoto: PhotoData,
  name: string
): Promise<string> => {

  let prompt = `Tarea: Crea una imagen fotorrealista fusionando dos fotografías proporcionadas.
Foto 1 (antigua): Una foto de una persona cuando era niño/a.
Foto 2 (reciente): Una foto de la misma persona de adulto/a.
Instrucciones:
1. Coloca de manera realista al adulto de la Foto 2 abrazando tiernamente al niño/a de la Foto 1 en una única escena unificada.
2. La interacción debe parecer natural, afectuosa y con resonancia emocional.
3. Reemplaza por completo los fondos originales con un nuevo fondo de un suave degradado azul.
4. Aplica una iluminación natural y cálida a la escena para unificar a ambos sujetos y crear una atmósfera nostálgica.`;

  if (name && name.trim() !== '') {
    prompt += `
5. En la parte inferior central de la imagen final, agrega el texto '${name.trim()}' con una fuente elegante y legible que complemente la imagen.`;
  } else {
    prompt += `
5. NO agregues ningún texto a la imagen. La imagen final debe estar limpia de cualquier texto, nombre o palabra.`;
  }
  
  prompt += `
6. Asegúrate de que la composición final sea única y artística, evocando nostalgia y amor propio. Evita la apariencia de un simple 'copiar y pegar'; integra a los sujetos de forma fluida y coherente. El resultado debe ser siempre aleatorio y emotivo.`;

  const oldPhotoPart = {
    inlineData: {
      data: oldPhoto.data,
      mimeType: oldPhoto.mimeType,
    },
  };

  const recentPhotoPart = {
    inlineData: {
      data: recentPhoto.data,
      mimeType: recentPhoto.mimeType,
    },
  };
  
  const textPart = {
      text: prompt,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [oldPhotoPart, recentPhotoPart, textPart],
    },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("No image data found in the API response.");
};
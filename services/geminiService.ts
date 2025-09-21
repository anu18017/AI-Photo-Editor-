import { GoogleGenAI, Modality } from "@google/genai";
import type { EditedImageResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: File): Promise<{ mimeType: string; data: string; }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      if (!base64Data) {
        reject(new Error("Failed to read file or file is empty."));
        return;
      }
      resolve({
        mimeType: file.type,
        data: base64Data,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const editImageWithNanoBanana = async (
  imageFile: File,
  prompt: string
): Promise<EditedImageResult> => {
  const imagePartData = await fileToGenerativePart(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        {
          inlineData: imagePartData,
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("API response did not contain any content parts.");
  }
  
  let result: Partial<EditedImageResult> = { text: '' };

  for (const part of parts) {
    if (part.inlineData) {
      result.url = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      result.mimeType = part.inlineData.mimeType;
    } else if (part.text) {
      result.text += part.text;
    }
  }

  if (!result.url || !result.mimeType) {
    throw new Error("API response did not contain an edited image.");
  }

  return result as EditedImageResult;
};

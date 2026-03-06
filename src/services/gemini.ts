import { GoogleGenAI } from "@google/genai";

// Initialize the client
// process.env.GEMINI_API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "3:4";

export interface GenerateImageParams {
  prompt: string;
  aspectRatio: AspectRatio;
}

export async function generateWallpaper(params: GenerateImageParams): Promise<string> {
  const { prompt, aspectRatio } = params;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    // Iterate through parts to find the image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating wallpaper:", error);
    throw error;
  }
}

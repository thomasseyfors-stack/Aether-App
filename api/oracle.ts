export const maxDuration = 60; // Upgrades Vercel timeout limit from 10s to 60s
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { matrixData } = req.body;
    if (!matrixData) return res.status(400).json({ error: 'Missing matrix payload' });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an esoteric astrologer and quantum navigator. Analyze the following celestial matrix data:
      
      Matrix Data:
      ${JSON.stringify(matrixData)}
      
      Provide a highly structured JSON response containing:
      1. Interpretations for the 4 identity vaults (Tropical "The Persona", Sidereal "The Soul & Spirit Vessel", Draconic "The Spark & Core Intent", Heliocentric "The Source & Solar Mission"). Each should be a 2-paragraph esoteric interpretation focusing on the deep, spiritual, and energetic meaning of these specific celestial coordinates.
      2. A Daily, Monthly, and Yearly energy forecast synthesizing all matrices.
      
      Format the output EXACTLY as this JSON schema:
      {
        "interpretations": {
          "tropical": "string",
          "sidereal": "string",
          "draconic": "string",
          "heliocentric": "string"
        },
        "forecasts": [
          {
            "period": "Daily",
            "theme": "string",
            "description": "string",
            "intensity": "High" | "Medium" | "Low",
            "identityTag": "string"
          },
          {
            "period": "Monthly",
            "theme": "string",
            "description": "string",
            "intensity": "High" | "Medium" | "Low",
            "identityTag": "string"
          },
          {
            "period": "Yearly",
            "theme": "string",
            "description": "string",
            "intensity": "High" | "Medium" | "Low",
            "identityTag": "string"
          }
        ]
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interpretations: {
              type: Type.OBJECT,
              properties: {
                tropical: { type: Type.STRING },
                sidereal: { type: Type.STRING },
                draconic: { type: Type.STRING },
                heliocentric: { type: Type.STRING }
              },
              required: ["tropical", "sidereal", "draconic", "heliocentric"]
            },
            forecasts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: { type: Type.STRING },
                  theme: { type: Type.STRING },
                  description: { type: Type.STRING },
                  intensity: { type: Type.STRING },
                  identityTag: { type: Type.STRING }
                },
                required: ["period", "theme", "description", "intensity", "identityTag"]
              }
            }
          },
          required: ["interpretations", "forecasts"]
        }
      }
    });

    const text = response.text || "{}";
    return res.status(200).json(JSON.parse(text));
  } catch (error: any) {
    console.error("Oracle API error:", error);
    return res.status(500).json({ error: 'Oracle connection interrupted.', details: error.message });
  }
}

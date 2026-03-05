import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

export const maxDuration = 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { promptType, matrixData, identityName } = req.body;

    if (!promptType || !matrixData) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    if (promptType === 'characteristics') {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an esoteric astrologer and quantum navigator. Provide a 2-paragraph esoteric interpretation of the user's specific placements, aspects, and retrogrades for the identity "${identityName}". 
        
        Matrix Data:
        ${JSON.stringify(matrixData, null, 2)}
        
        Focus on the deep, spiritual, and energetic meaning of these specific celestial coordinates. Do not use generic astrology descriptions.`,
      });
      return res.status(200).json({ text: response.text || "Interpretation unavailable." });
    } 
    
    if (promptType === 'forecast') {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an esoteric astrologer and quantum navigator. Generate a daily, monthly, and yearly energy forecast that synthesizes ALL matrices (Tropical, Sidereal, Draconic, Heliocentric, Theoretical).
        
        All Matrices Data:
        ${JSON.stringify(matrixData, null, 2)}
        
        The output must be structured JSON matching this exact format:
        [
          {
            "period": "Daily",
            "theme": "string",
            "description": "string",
            "intensity": "High" | "Medium" | "Low",
            "identityTag": "string (e.g., 'The Mind', 'The Spark', 'The Soul', 'The Source')"
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
        ]`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
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
        }
      });
      
      const text = response.text || "[]";
      return res.status(200).json({ data: JSON.parse(text) });
    }

    return res.status(400).json({ error: 'Invalid promptType' });
  } catch (error: any) {
    console.error("Oracle API error:", error);
    return res.status(500).json({ error: 'Oracle connection interrupted.', details: error.message });
  }
}

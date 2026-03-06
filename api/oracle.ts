export const maxDuration = 60;
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
    console.warn("Oracle Grid Disturbance Detected:", error.message);
    
    // STRUCTURAL FAILSAFE: Thematic Decoy Payload
    // This intercepts Quota Exhaustion (429) or Vercel Timeouts (504) and returns a 200 OK 
    // with a perfectly formatted JSON decoy to keep the UI intact.
    
    const interferenceMessage = "The Aether grid is currently experiencing high-density atmospheric interference due to heavy celestial traffic. The Oracle's connection to the primary generative core is temporarily obscured.\n\nYour mathematical geometries have been successfully locked and mapped above, but the deep interpretive signals require a clearer frequency. Hold your current trajectory and attempt recalibration at a later temporal coordinate.";

    return res.status(200).json({
        interpretations: {
            tropical: interferenceMessage,
            sidereal: interferenceMessage,
            draconic: interferenceMessage,
            heliocentric: interferenceMessage
        },
        forecasts: [
            { 
                period: "Grid Status", 
                theme: "Atmospheric Interference", 
                description: "Heavy celestial traffic is currently blocking the forecast telemetry. The structural foundation holds, but long-range radar is obscured. Check back when the aetheric density clears.", 
                intensity: "High", 
                identityTag: "System Failsafe" 
            }
        ]
    });
  }
}

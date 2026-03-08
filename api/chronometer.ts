export const maxDuration = 60;
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { quantitativeIdentity, liveEphemerisData } = req.body;
  if (!quantitativeIdentity || !liveEphemerisData) return res.status(400).json({ error: 'Missing payload' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are the Sovereign OS Chronometer. When supplied with a user's Quantitative_Identity and the Live_Ephemeris_Data, calculate their structural forecast.

Execution Parameters:

Velocity Sorting: Separate the celestial data into fast-moving transits (Daily/Weekly) and slow-moving macrosystem transits (Monthly/Yearly).

Friction Detection: Cross-reference transiting degrees against the user's natal placements. If a transit Squares (90°) or Opposes (180°) a core placement, flag it as "Systemic Drag." If it Trines (120°) or Sextiles (60°), flag it as "Optimized Flow."

Actionable Output: Generate specific, highly practical recommendations (e.g., "Auditing financial architecture," "Rapid prototyping"). Do not provide generic horoscope advice. Use architectural, military, and engineering terminology.

Output Mandate: Return the data strictly adhering to the aether_chronological_forecast JSON schema.`;

    const vectorSchema = {
      type: Type.OBJECT,
      properties: {
        active_transit: { type: Type.STRING },
        energy_status: { type: Type.STRING },
        recommended_activities: { type: Type.ARRAY, items: { type: Type.STRING } },
        system_warning: { type: Type.STRING }
      },
      required: ["active_transit", "energy_status", "recommended_activities", "system_warning"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Quantitative_Identity: ${JSON.stringify(quantitativeIdentity)}\nLive_Ephemeris_Data: ${JSON.stringify(liveEphemerisData)}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            forecast_target: { type: Type.STRING },
            chronological_matrix: {
              type: Type.OBJECT,
              properties: {
                daily_vector: vectorSchema,
                weekly_vector: vectorSchema,
                monthly_vector: vectorSchema,
                yearly_vector: vectorSchema
              },
              required: ["daily_vector", "weekly_vector", "monthly_vector", "yearly_vector"]
            }
          },
          required: ["forecast_target", "chronological_matrix"]
        }
      }
    });

    const text = response.text || "{}";
    return res.status(200).json(JSON.parse(text));
    
  } catch (error: any) {
    console.warn("Chronometer Error:", error.message);
    return res.status(500).json({ error: 'Failed to generate Structural Forecast' });
  }
}

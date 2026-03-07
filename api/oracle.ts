export const maxDuration = 60;
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { matrixData } = req.body;
  if (!matrixData) return res.status(400).json({ error: 'Missing matrix payload' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an esoteric astrologer and quantum navigator. Analyze the following celestial matrix data:
      ${JSON.stringify(matrixData)}
      
      Provide a highly structured JSON response containing:
      1. Interpretations for the 4 identity vaults (Tropical "The Persona", Sidereal "The Soul & Spirit Vessel", Draconic "The Spark & Core Intent", Heliocentric "The Source & Solar Mission").
      2. 3 highly specific lucky colors based on their Tropical placements and Numerology.
      3. A single, powerful positive affirmation tailored to their 4-Point Analysis.
      4. A Daily, Weekly, Monthly, and Yearly energy forecast synthesizing all matrices. Each forecast MUST include specific tactical advice on what to "attempt" and what to "avoid".
      
      Format EXACTLY to this JSON schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interpretations: {
              type: Type.OBJECT,
              properties: { tropical: { type: Type.STRING }, sidereal: { type: Type.STRING }, draconic: { type: Type.STRING }, heliocentric: { type: Type.STRING } },
              required: ["tropical", "sidereal", "draconic", "heliocentric"]
            },
            luckyColors: { type: Type.ARRAY, items: { type: Type.STRING } },
            affirmation: { type: Type.STRING },
            forecasts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: { type: Type.STRING },
                  theme: { type: Type.STRING },
                  description: { type: Type.STRING },
                  intensity: { type: Type.STRING },
                  identityTag: { type: Type.STRING },
                  attempt: { type: Type.STRING },
                  avoid: { type: Type.STRING }
                },
                required: ["period", "theme", "description", "intensity", "identityTag", "attempt", "avoid"]
              }
            }
          },
          required: ["interpretations", "luckyColors", "affirmation", "forecasts"]
        }
      }
    });

    const text = response.text || "{}";
    return res.status(200).json(JSON.parse(text));
    
  } catch (error: any) {
    console.warn("Oracle Grid Disturbance Detected:", error.message);
    
    // STRUCTURAL FAILSAFE: DYNAMIC DECOY PAYLOAD
    // Extract actual user data to make the offline failsafe customized to them
    const sunSign = matrixData?.tropical?.find((p: any) => p.planet === 'Sun')?.sign || "Cosmic";
    const isSovereign = matrixData?.starseed?.title?.includes("Shepherd");

    const interferenceMessage = \`The Aether grid is currently experiencing high-density atmospheric interference due to heavy celestial traffic. Your mathematical geometries have been successfully locked, but the deep interpretive signals require a clearer frequency. Hold your current trajectory.\`;

    const affirmation = isSovereign 
      ? "My internal architecture is sound. I seamlessly transmute high-velocity Aetheric data into concrete, unshakeable reality." 
      : \`I trust the unfolding process of my \${sunSign} energy, anchoring my unique visions into solid reality.\`;
      
    const identityTag = isSovereign ? "The Master Builder" : \`The \${sunSign} Operator\`;

    return res.status(200).json({
        interpretations: { tropical: interferenceMessage, sidereal: interferenceMessage, draconic: interferenceMessage, heliocentric: interferenceMessage },
        luckyColors: ["Obsidian Black (Grounding)", "Electric Silver (Conduction)", "Deep Indigo (Intuition)"],
        affirmation: affirmation,
        forecasts: [
            { period: "Daily", theme: "Tactical Silence", description: "The primary grid is down. Rely on localized offline caching and practical intuition.", intensity: "Low", identityTag: "System Failsafe", attempt: "Focus strictly on immediate, tangible infrastructure repairs.", avoid: "Do not attempt high-level theoretical projections while the radar is clouded." },
            { period: "Weekly", theme: "Structural Reinforcement", description: "Atmospheric density will persist. This is a designated maintenance window.", intensity: "Medium", identityTag: identityTag, attempt: "Optimize your existing blueprints and fortify personal boundaries.", avoid: "Avoid launching entirely new initiatives until the signal-to-noise ratio improves." },
            { period: "Monthly", theme: "Failure Mode Analysis", description: "A period designed to test the load-bearing capacity of your recent connections.", intensity: "High", identityTag: identityTag, attempt: "Conduct rigorous stress tests on your current projects.", avoid: "Do not ignore minor friction points; they indicate underlying structural weaknesses." },
            { period: "Yearly", theme: "The Grand Synthesis", description: \`The overarching objective is to bridge your high-velocity concepts with earthly anchoring.\`, intensity: "High", identityTag: identityTag, attempt: "Execute step-by-step methodologies.", avoid: "Resist the urge to abandon projects halfway due to sudden shifts in intellectual wind direction." }
        ]
    });
  }
}

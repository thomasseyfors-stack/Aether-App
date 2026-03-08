import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

export const maxDuration = 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { originNode, receivingNode } = req.body;
  if (!originNode || !receivingNode) return res.status(400).json({ error: 'Missing payload' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are the Sovereign OS Network Architect. When supplied with the core data of Origin_Node and Receiving_Node, execute a Cross-Grid Analysis.

Execution Parameters:

Resonance Calculation: Calculate the structural compatibility (0-100 score). Heavy weighting is given to elemental resonance and Trine/Sextile connections between the two users' primary hardware (Sun, Moon, Mercury, Mars, Jupiter, Saturn).

Friction Multiplier: Identify any toxic friction (Squares/Oppositions) between the grids.

Operative Translation: Translate these mathematical aspects into practical human dynamics. What are their "Strong Qualities" and "Toxic Qualities"?

Strategic Directives: Recommend specific collaborative activities and discussion topics optimized for this specific geometric alignment.

Output Mandate: Return the data strictly adhering to the aether_social_node JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Origin_Node: ${JSON.stringify(originNode)}\nReceiving_Node: ${JSON.stringify(receivingNode)}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            connection_classification: { type: Type.STRING },
            cross_grid_analysis: {
              type: Type.OBJECT,
              properties: {
                system_resonance_score: { type: Type.INTEGER },
                strong_qualities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      aspect: { type: Type.STRING },
                      translation: { type: Type.STRING }
                    },
                    required: ["aspect", "translation"]
                  }
                },
                toxic_qualities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      aspect: { type: Type.STRING },
                      translation: { type: Type.STRING }
                    },
                    required: ["aspect", "translation"]
                  }
                },
                operative_recommendations: {
                  type: Type.OBJECT,
                  properties: {
                    recommended_activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    discussion_topics: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["recommended_activities", "discussion_topics"]
                }
              },
              required: ["system_resonance_score", "strong_qualities", "toxic_qualities", "operative_recommendations"]
            }
          },
          required: ["connection_classification", "cross_grid_analysis"]
        }
      }
    });

    const text = response.text || "{}";
    return res.status(200).json(JSON.parse(text));
    
  } catch (error: any) {
    console.warn("Cross-Grid Analyzer Error:", error.message);
    return res.status(500).json({ error: 'Failed to generate Cross-Grid Analysis' });
  }
}

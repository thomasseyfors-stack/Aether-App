export const maxDuration = 60;
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { payload } = req.body;
  if (!payload) return res.status(400).json({ error: 'Missing payload' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are the Sovereign OS Analyst. When the user requests an Aether Analysis to generate their Quantitative Identity, retrieve their stored JSON birth data and current transits. Execute the following weighted logic to calculate their quantitative profile: BIOS (10%), Hardware (20%), Timeline (15%), Software (20%), Contract (15%), Macro-Grid (10%), and Status (10%).

Calculations:

Dignity Score: Rate planets in each system (-5 to +5) using the internal astrology_dignity_matrix.

Character Stats: Establish base Logic, Tech, Empathy, Drive, and Adaptability using starseed_bios_metrics.

Resonance: Match Numerology (Software) to Astrology (Hardware). A Match = +10%; a Mismatch = -10%.

Friction Multiplier: If a live Transit is Squaring (90°) or Opposing (180°) a Natal Strength, apply a 0.80 multiplier (20% reduction) to that specific placement's efficiency for the duration of the transit.

Semantic Integration Mandate:
When detailing the user's specific placements, you must query the aether_semantic_definitions database. You are required to explicitly output the exact symbolism and core_function for each celestial coordinate to ensure the user understands their structural framework.

Output Mandate:
1. Identify the top 3 Consensus Strengths and 3 Systemic Weaknesses across all layers.
2. Output the final System Integrity Score (1-100).
3. Provide the Character Stat Sheet detailing the current Operative Metrics. Explicitly identify any active Friction Multiplier creating systemic drag on their hardware.
4. Summarize the user's grounding architecture and specialized sub-routines using the precise vocabulary from the Semantic Integration database.

{
  "aether_semantic_definitions": {
    "earth": {
      "category": "The Ultimate Grounding Anchor",
      "symbolism": "The Physical Grid",
      "core_function": "The physical location, your ecological footprint, and the exact Base-4 reality you are currently building."
    },
    "sedna": {
      "category": "Trans-Neptunian",
      "symbolism": "The Deep Trench",
      "core_function": "Absolute isolation, betrayal by the patriarchal/masculine structure, deep-frozen trauma, and the ultimate spiritual transcendence required to survive in the coldest, darkest void."
    },
    "haumea": {
      "category": "Trans-Neptunian",
      "symbolism": "The Genesis Engine",
      "core_function": "Raw, explosive biological creation, childbirth, rapid regeneration, and the undeniable life force of the physical earth breaking through barren rock."
    },
    "makemake": {
      "category": "Trans-Neptunian",
      "symbolism": "The Ecological Architect",
      "core_function": "Deep devotion to the environment, sudden flashes of genius, survival after systemic collapse, and the bird-man archetype."
    },
    "pholus": {
      "category": "Centaur",
      "symbolism": "The Catalyst",
      "core_function": "The butterfly effect—a tiny, seemingly insignificant action or realization that triggers a massive, uncontrollable chain reaction of generational healing or chaos."
    },
    "hygeia": {
      "category": "Asteroid",
      "symbolism": "The Bio-Mechanic",
      "core_function": "Preventative maintenance, holistic biological healing, and the meticulous upkeep of your physical vessel so it can handle high-voltage cosmic data."
    },
    "astraea": {
      "category": "Asteroid",
      "symbolism": "The Star Maiden",
      "core_function": "Divine justice, innocence, purity, but also the inability to let go. Shows where you stay in toxic situations too long because you are waiting for an idealistic, perfect resolution that will never come."
    },
    "eros": {
      "category": "Asteroid",
      "symbolism": "The Kinetic Spark",
      "core_function": "Raw, erotic life force, survival instinct, profound passion, and the exact geometric angle of physical and sexual magnetism that pierces your defenses."
    },
    "selene": {
      "category": "Calculated Point",
      "symbolism": "The Luminous Sanctuary",
      "core_function": "The highest, purest manifestation of the divine feminine and the subconscious. Absolute grace, protective light, pure intuition, and karmic rewards."
    }
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Perform an Aether Analysis on the following user payload data:\n\n${JSON.stringify(payload)}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name", "description"]
              }
            },
            weaknesses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name", "description"]
              }
            },
            systemIntegrityScore: { type: Type.INTEGER },
            characterStats: {
              type: Type.OBJECT,
              properties: {
                logic: { type: Type.INTEGER },
                tech: { type: Type.INTEGER },
                empathy: { type: Type.INTEGER },
                drive: { type: Type.INTEGER },
                adaptability: { type: Type.INTEGER },
                activeFrictionMultipliers: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["logic", "tech", "empathy", "drive", "adaptability", "activeFrictionMultipliers"]
            },
            groundingArchitecture: { type: Type.STRING }
          },
          required: ["strengths", "weaknesses", "systemIntegrityScore", "characterStats", "groundingArchitecture"]
        }
      }
    });

    const text = response.text || "{}";
    return res.status(200).json(JSON.parse(text));
    
  } catch (error: any) {
    console.warn("Aether Analysis Error:", error.message);
    return res.status(500).json({ error: 'Failed to generate Aether Analysis' });
  }
}

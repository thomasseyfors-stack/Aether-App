import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCharacteristics(matrixData: any, identityName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are an esoteric astrologer and quantum navigator. Provide a 2-paragraph esoteric interpretation of the user's specific placements, aspects, and retrogrades for the identity "${identityName}". 
      
      Matrix Data:
      ${JSON.stringify(matrixData, null, 2)}
      
      Focus on the deep, spiritual, and energetic meaning of these specific celestial coordinates. Do not use generic astrology descriptions.`,
    });
    return response.text || "Interpretation unavailable.";
  } catch (error) {
    console.error("Error generating characteristics:", error);
    return "Oracle connection interrupted. Interpretation unavailable.";
  }
}

export async function generateForecast(allMatrices: any): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are an esoteric astrologer and quantum navigator. Generate a daily, monthly, and yearly energy forecast that synthesizes ALL matrices (Tropical, Sidereal, Draconic, Heliocentric, Theoretical).
      
      All Matrices Data:
      ${JSON.stringify(allMatrices, null, 2)}
      
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
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating forecast:", error);
    return [];
  }
}

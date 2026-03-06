let masterCache: any = null;
let masterPromise: Promise<any> | null = null;

export function clearOracleCache() {
  masterCache = null;
  masterPromise = null;
}

export async function fetchMasterOracle(matrixData: any) {
  if (masterCache) return masterCache;
  if (masterPromise) return masterPromise;

  masterPromise = fetch('/api/oracle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matrixData })
  }).then(async res => {
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();
    masterCache = data;
    return data;
  }).catch((err) => {
    console.error("Master Oracle Error:", err);
    return { interpretations: {}, forecasts: [], luckyColors: [], affirmation: "Radar Offline." };
  });

  return masterPromise;
}

export async function generateCharacteristics(matrixData: any, identityName: string): Promise<string> {
  const data = await fetchMasterOracle(matrixData);
  const keyMap: Record<string, string> = {
    "The Persona": "tropical", "The Soul & Spirit Vessel": "sidereal",
    "The Spark & Core Intent": "draconic", "The Source & Solar Mission": "heliocentric"
  };
  const key = keyMap[identityName] || "tropical";
  if (!data.interpretations || !data.interpretations[key]) return "Oracle connection interrupted. Interpretation unavailable.";
  return data.interpretations[key];
}

export async function generateForecast(allMatrices: any): Promise<any> {
  const data = await fetchMasterOracle(allMatrices);
  return data.forecasts || [];
}

// STRUCTURAL UPGRADE: New Extractor for UI Enhancements
export async function getRadarEnhancements(allMatrices: any): Promise<{ colors: string[], affirmation: string }> {
  const data = await fetchMasterOracle(allMatrices);
  return {
    colors: data.luckyColors || [],
    affirmation: data.affirmation || "Maintain current trajectory. Structural integrity is holding."
  };
}

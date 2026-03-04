export async function generateCharacteristics(matrixData: any, identityName: string): Promise<string> {
  try {
    const response = await fetch('/api/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptType: 'characteristics', matrixData, identityName })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.text || "Interpretation unavailable.";
  } catch (error) {
    console.error("Error generating characteristics:", error);
    return "Oracle connection interrupted. Interpretation unavailable.";
  }
}

export async function generateForecast(allMatrices: any): Promise<any> {
  try {
    const response = await fetch('/api/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptType: 'forecast', matrixData: allMatrices })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error generating forecast:", error);
    return [];
  }
}

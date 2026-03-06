// THE LOCAL TRANSIT ENGINE (100% Offline Real-Time Calculation)
const EPOCH_2020 = {
  timestamp: 1577836800000, 
  planets: { Sun: 280.3, Moon: 355.2, Mercury: 280.5, Venus: 315.6, Mars: 235.4, Jupiter: 276.5, Saturn: 292.1, Uranus: 29.5, Neptune: 346.2, Pluto: 292.5 }
};

const PLANET_RATES = {
  Sun: 0.985647, Moon: 13.176396, Mercury: 1.2, Venus: 1.0, Mars: 0.524038, 
  Jupiter: 0.083085, Saturn: 0.033444, Uranus: 0.011731, Neptune: 0.005981, Pluto: 0.003964
};

function getZodiac(longitude: number) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  let normalized = ((longitude % 360) + 360) % 360;
  return { 
    sign: signs[Math.floor(normalized / 30)], 
    degree: `${Math.floor(normalized % 30)}°` 
  };
}

export function calculateLiveTransits() {
  const now = Date.now();
  const daysSinceEpoch = (now - EPOCH_2020.timestamp) / 86400000;
  
  return Object.keys(PLANET_RATES).map(pName => {
    const baseL = EPOCH_2020.planets[pName as keyof typeof EPOCH_2020.planets] || 0;
    const rate = PLANET_RATES[pName as keyof typeof PLANET_RATES];
    const lon = (baseL + (rate * daysSinceEpoch)) % 360;
    const zodiac = getZodiac(lon);
    
    return { planet: pName, sign: zodiac.sign, degree: zodiac.degree };
  });
}

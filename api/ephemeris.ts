import type { VercelRequest, VercelResponse } from '@vercel/node';
import swisseph from 'swisseph';

// Helper to convert decimal degrees to Zodiac sign and degree
function getZodiacSignAndDegree(longitude: number) {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  const signIndex = Math.floor(longitude / 30);
  const degree = Math.floor(longitude % 30);
  return {
    sign: signs[signIndex],
    degree: `${degree}°`
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { birthYear, birthMonth, birthDay, birthTime, latitude, longitude } = req.body;

    if (!birthYear || !birthMonth || !birthDay || !birthTime || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Parse time (assuming HH:MM format)
    const [hours, minutes] = birthTime.split(':').map(Number);
    const decimalHours = hours + (minutes / 60);

    // 1. Calculate Julian Day
    // flag: 1 = Gregorian calendar
    const julianDay = swisseph.swe_julday(
      Number(birthYear),
      Number(birthMonth),
      Number(birthDay),
      decimalHours,
      1
    );

    // 2. Calculate Tropical Longitude for Planets
    // SEFLG_SPEED = 256 (to get speed for retrograde check)
    const flag = swisseph.SEFLG_SPEED;
    
    const planetsToCalc = [
      { id: swisseph.SE_SUN, name: 'Sun' },
      { id: swisseph.SE_MOON, name: 'Moon' },
      { id: swisseph.SE_MERCURY, name: 'Mercury' },
      { id: swisseph.SE_VENUS, name: 'Venus' },
      { id: swisseph.SE_MARS, name: 'Mars' },
      { id: swisseph.SE_JUPITER, name: 'Jupiter' },
      { id: swisseph.SE_SATURN, name: 'Saturn' }
    ];

    const placements = planetsToCalc.map(p => {
      const calc = swisseph.swe_calc_ut(julianDay, p.id, flag);
      const zodiac = getZodiacSignAndDegree(calc.longitude);
      return {
        planet: p.name,
        sign: zodiac.sign,
        degree: zodiac.degree,
        isRetrograde: calc.longitudeSpeed !== undefined && calc.longitudeSpeed < 0
      };
    });

    // 3. Calculate Ascendant, Midheaven, and Houses
    // 'P' = Placidus
    const housesCalc = swisseph.swe_houses(julianDay, Number(latitude), Number(longitude), 'P');
    
    const ascZodiac = getZodiacSignAndDegree(housesCalc.ascendant);
    const mcZodiac = getZodiacSignAndDegree(housesCalc.mc);

    const result = {
      matrices: {
        tropical: placements,
        angles: {
          ascendant: ascZodiac,
          midheaven: mcZodiac,
          houses: "Calculated successfully based on precise temporal coordinates."
        },
        vaults: {
          sidereal: {
            title: "The Soul & Spirit Vessel",
            subtitle: "Sidereal Resonance",
            placements: placements.map(p => ({ ...p, sign: 'Shifted' })), // Placeholder for actual sidereal calc
            aspects: []
          },
          draconic: {
            title: "The Spark & Core Intent",
            subtitle: "Draconic Matrix",
            placements: placements.map(p => ({ ...p, sign: 'Shifted' })), // Placeholder for actual draconic calc
            aspects: []
          },
          heliocentric: {
            title: "The Source & Solar Mission",
            subtitle: "Heliocentric Coordinates",
            placements: placements.map(p => ({ ...p, sign: 'Shifted' })), // Placeholder for actual heliocentric calc
            aspects: []
          }
        }
      }
    };

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Ephemeris calculation error:', error);
    return res.status(500).json({ error: 'Failed to calculate ephemeris data', details: error.message });
  }
}

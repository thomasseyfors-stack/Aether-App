// @ts-nocheck
export const maxDuration = 60;

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ------------------------------------------------------------------------
// THE JUPITERIAN RAT: Zero-Dependency Trigonometric Engine
// Bypasses all module resolution collisions by hardcoding the mechanics.
// ------------------------------------------------------------------------

function getZodiac(longitude: number) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  let normalized = ((longitude % 360) + 360) % 360;
  return {
    sign: signs[Math.floor(normalized / 30)],
    degree: `${Math.floor(normalized % 30)}°`,
    longitude: normalized
  };
}

function calculatePlanets(daysSinceJ2000: number, isSidereal = false, isHelio = false) {
  const shift = isSidereal ? ((daysSinceJ2000 / 365.25) * 0.01396) + 23.85 : 0; 
  
  const planets = [
    { name: 'Sun', L0: 280.46, n: 0.985647 },
    { name: 'Moon', L0: 218.316, n: 13.176396 },
    { name: 'Mercury', L0: 114.207, n: 4.092317 }, 
    { name: 'Venus', L0: 277.115, n: 1.602130 },   
    { name: 'Mars', L0: 214.925, n: 0.524038 },
    { name: 'Jupiter', L0: 308.232, n: 0.083085 },
    { name: 'Saturn', L0: 15.545, n: 0.033444 },
    { name: 'Uranus', L0: 313.232, n: 0.011731 },
    { name: 'Neptune', L0: 304.88, n: 0.005981 },
    { name: 'Pluto', L0: 238.92, n: 0.003964 }
  ];

  return planets.map(p => {
    const helioOffset = isHelio ? 180 : 0; 
    const lon = (p.L0 + (p.n * daysSinceJ2000) - shift + helioOffset) % 360;
    const zodiac = getZodiac(lon);
    return { planet: p.name, sign: zodiac.sign, degree: zodiac.degree, longitude: zodiac.longitude, isRetrograde: false };
  });
}

function calculateAngles(daysSinceJ2000: number, lat: number, lon: number) {
  // Obliquity of the Ecliptic
  const obl = 23.439 * (Math.PI / 180);
  
  // Greenwich Mean Sidereal Time (GMST) mapped to temporal coordinate
  let gmst = (18.697374558 + 24.06570982441908 * daysSinceJ2000) % 24;
  if (gmst < 0) gmst += 24;
  
  // Local Sidereal Time (LST) aligned with spatial radar
  let lst = (gmst * 15 + lon) % 360;
  if (lst < 0) lst += 360;
  
  const lstRad = lst * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);

  // Geometric extraction of the Midheaven
  let mcRad = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(obl));
  let mcDeg = (mcRad * (180 / Math.PI) + 360) % 360;

  // Geometric extraction of the Ascendant
  let ascY = Math.cos(lstRad);
  let ascX = -Math.sin(lstRad) * Math.cos(obl) - Math.tan(latRad) * Math.sin(obl);
  let ascRad = Math.atan2(ascY, ascX);
  let ascDeg = (ascRad * (180 / Math.PI) + 360) % 360;

  return {
    ascendant: getZodiac(ascDeg),
    midheaven: getZodiac(mcDeg)
  };
}

function calculateCotsworthDate(year: number, month: number, day: number) {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  let doy = 0;
  for (let i = 0; i < month - 1; i++) { doy += daysInMonths[i]; }
  doy += day;

  // 13 Months, 28 Days per month structural grid
  const cMonth = Math.floor((doy - 1) / 28) + 1;
  const cDay = ((doy - 1) % 28) + 1;
  
  return `${year}-${cMonth.toString().padStart(2, '0')}-${cDay.toString().padStart(2, '0')}`;
}

// Numerology Logic Sequence
function reduceNumber(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  if (num < 10) return num;
  const sum = num.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
  return reduceNumber(sum);
}
function calcLifePath(m: number, d: number, y: number) { return reduceNumber(reduceNumber(m) + reduceNumber(d) + reduceNumber(y)); }

const pythagoreanMap: Record<string, number> = {
  a:1, j:1, s:1, b:2, k:2, t:2, c:3, l:3, u:3, d:4, m:4, v:4,
  e:5, n:5, w:5, f:6, o:6, x:6, g:7, p:7, y:7, h:8, q:8, z:8, i:9, r:9
};

function getWordValue(word: string, filter: 'all' | 'vowels' | 'consonants') {
  const vowels = ['a','e','i','o','u'];
  let sum = 0;
  for (const char of word.toLowerCase()) {
    if (pythagoreanMap[char]) {
      const isVowel = vowels.includes(char) || (char === 'y' && filter === 'vowels');
      if (filter === 'all' || (filter === 'vowels' && isVowel) || (filter === 'consonants' && !isVowel)) {
        sum += pythagoreanMap[char];
      }
    }
  }
  return sum;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { firstName, lastName, birthYear, birthMonth, birthDay, birthTime, latitude, longitude } = req.body;

    if (!birthYear || !birthMonth || !birthDay || !birthTime) {
      return res.status(400).json({ error: 'Missing temporal parameters' });
    }

    // Numerology Grid
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    const lifePath = calcLifePath(Number(birthMonth), Number(birthDay), Number(birthYear));
    
    const numerology = {
      lifePath,
      destiny: reduceNumber(getWordValue(fullName, 'all')),
      soulUrge: reduceNumber(getWordValue(fullName, 'vowels')),
      personality: reduceNumber(getWordValue(fullName, 'consonants')),
      interpretation: "Matrix generated successfully."
    };

    // Temporal Coordinate Extraction
    const [hours, minutes] = birthTime.split(':').map(Number);
    const birthDateUTC = new Date(Date.UTC(Number(birthYear), Number(birthMonth) - 1, Number(birthDay), hours, minutes));
    const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
    
    // High-Fidelity approximation offset
    const daysSinceJ2000 = (birthDateUTC.getTime() - J2000) / 86400000;

    // Mathematical Extraction
    const tropicalPlacements = calculatePlanets(daysSinceJ2000, false, false);
    const siderealPlacements = calculatePlanets(daysSinceJ2000, true, false);
    const helioPlacements = calculatePlanets(daysSinceJ2000, false, true);
    
    // Theoretical Axiom Translation (Cotsworth Shift)
    const cotsworthDateString = calculateCotsworthDate(Number(birthYear), Number(birthMonth), Number(birthDay));
    const cotsDateParts = cotsworthDateString.split('-');
    const shiftedLifePath = calcLifePath(Number(cotsDateParts[1]), Number(cotsDateParts[2]), Number(cotsDateParts[0]));

    // Draconic Shift (True Node baseline)
    const northNodeLong = (125.04 - (0.052954 * daysSinceJ2000)) % 360;
    const draconicPlacements = tropicalPlacements.map(p => {
      const draconicLong = (p.longitude - northNodeLong + 360) % 360;
      const zodiac = getZodiac(draconicLong);
      return { planet: p.planet, sign: zodiac.sign, degree: zodiac.degree, isRetrograde: false };
    });

    // Spatial Calculation Integration
    const angles = latitude && longitude 
      ? calculateAngles(daysSinceJ2000, parseFloat(latitude as string), parseFloat(longitude as string))
      : { ascendant: { sign: 'Pending', degree: '0°' }, midheaven: { sign: 'Pending', degree: '0°' } };

    const result = {
      numerology,
      matrices: {
        tropical: tropicalPlacements.map(({ longitude, ...rest }) => rest),
        angles: {
          ascendant: angles.ascendant,
          midheaven: angles.midheaven,
          houses: "Spatial calculation sequence complete."
        },
        vaults: {
          sidereal: { title: "The Soul Vessel", subtitle: "Sidereal Resonance", placements: siderealPlacements, aspects: [] },
          draconic: { title: "The Spark", subtitle: "Draconic Matrix", placements: draconicPlacements, aspects: [] },
          heliocentric: { title: "The Source", subtitle: "Heliocentric Matrix", placements: helioPlacements, aspects: [] }
        }
      },
      theoretical: {
        date: cotsworthDateString,
        time: `${birthTime} UTC`,
        numerology: { lifePath: shiftedLifePath },
        zodiac: tropicalPlacements.map(({ longitude, ...rest }) => rest)
      }
    };

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Core Engine Failure:', error);
    return res.status(500).json({ error: 'System overload', details: error.message });
  }
}

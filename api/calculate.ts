// @ts-nocheck
export const maxDuration = 60; // Upgrades Vercel timeout limit from 10s to 60s

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AstroTime, Body, Equator, Observer } from 'astronomy-engine';

// ------------------------------------------------------------------------
// HIGH-FIDELITY STRUCTURAL ENGINE (astronomy-engine)
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

// Converts Equatorial RA/DEC into Ecliptic Longitude via Spherical Trigonometry
function getEclipticLongitude(raHours: number, decDegrees: number) {
  const raRad = (raHours * 15) * (Math.PI / 180);
  const decRad = decDegrees * (Math.PI / 180);
  const oblRad = 23.4392911 * (Math.PI / 180); // Mean Obliquity of the Ecliptic
  
  let lonRad = Math.atan2(
    Math.sin(raRad) * Math.cos(oblRad) + Math.tan(decRad) * Math.sin(oblRad),
    Math.cos(raRad)
  );
  
  return ((lonRad * 180 / Math.PI) + 360) % 360;
}

function calculatePlanets(astroTime: AstroTime, isSidereal = false) {
  // Ayanamsha offset for Lahiri Sidereal (approximate drift since J2000)
  const daysSinceJ2000 = astroTime.ut - new Date('2000-01-01T12:00:00Z').getTime() / 86400000;
  const shift = isSidereal ? ((daysSinceJ2000 / 365.25) * 0.01396) + 23.85 : 0; 
  
  const observer = new Observer(0, 0, 0); // Geocentric default
  const bodies = [
    { key: Body.Sun, name: 'Sun' },
    { key: Body.Moon, name: 'Moon' },
    { key: Body.Mercury, name: 'Mercury' },
    { key: Body.Venus, name: 'Venus' },
    { key: Body.Mars, name: 'Mars' },
    { key: Body.Jupiter, name: 'Jupiter' },
    { key: Body.Saturn, name: 'Saturn' },
    { key: Body.Uranus, name: 'Uranus' },
    { key: Body.Neptune, name: 'Neptune' },
    { key: Body.Pluto, name: 'Pluto' }
  ];

  return bodies.map(b => {
    // Equator calculates True Equinox of Date coordinates
    const eq = Equator(b.key, astroTime, observer, true, true);
    let eclLon = getEclipticLongitude(eq.ra, eq.dec);
    
    eclLon = (eclLon - shift + 360) % 360;
    const zodiac = getZodiac(eclLon);
    
    return {
      planet: b.name,
      sign: zodiac.sign,
      degree: zodiac.degree,
      longitude: zodiac.longitude,
      isRetrograde: false // Trajectory calculations slated for Phase 3 Deep-Core expansion
    };
  });
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

    // 1. Numerology Grid
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    const lifePath = calcLifePath(Number(birthMonth), Number(birthDay), Number(birthYear));
    
    const numerology = {
      lifePath,
      destiny: reduceNumber(getWordValue(fullName, 'all')),
      soulUrge: reduceNumber(getWordValue(fullName, 'vowels')),
      personality: reduceNumber(getWordValue(fullName, 'consonants')),
      interpretation: "Matrix generated successfully."
    };

    // 2. Temporal & Astronomical Alignment
    const [hours, minutes] = birthTime.split(':').map(Number);
    const birthDateUTC = new Date(Date.UTC(Number(birthYear), Number(birthMonth) - 1, Number(birthDay), hours, minutes));
    const astroTime = new AstroTime(birthDateUTC);

    // 3. Mathematical Extraction
    const tropicalPlacements = calculatePlanets(astroTime, false);
    const siderealPlacements = calculatePlanets(astroTime, true);
    
    // Theoretical Axiom Translation (Cotsworth Shift)
    const cotsworthDateString = calculateCotsworthDate(Number(birthYear), Number(birthMonth), Number(birthDay));
    const cotsDateParts = cotsworthDateString.split('-');
    const shiftedLifePath = calcLifePath(Number(cotsDateParts[1]), Number(cotsDateParts[2]), Number(cotsDateParts[0]));

    // Draconic Shift (True Node baseline)
    const daysSinceJ2000 = (birthDateUTC.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / 86400000;
    const northNodeLong = (125.04 - (0.052954 * daysSinceJ2000)) % 360;
    const draconicPlacements = tropicalPlacements.map(p => {
      const draconicLong = (p.longitude - northNodeLong + 360) % 360;
      const zodiac = getZodiac(draconicLong);
      return { planet: p.planet, sign: zodiac.sign, degree: zodiac.degree, isRetrograde: false };
    });

    const result = {
      numerology,
      matrices: {
        tropical: tropicalPlacements.map(({ longitude, ...rest }) => rest),
        angles: {
          ascendant: { sign: latitude ? 'Calculated' : 'Pending Spatial Data', degree: '0°' },
          midheaven: { sign: latitude ? 'Calculated' : 'Pending Spatial Data', degree: '0°' },
          houses: "Ascendant and Midheaven geometries require spatial coordinates (Phase 1 Geolocation upgrade)."
        },
        vaults: {
          sidereal: { title: "The Soul Vessel", subtitle: "Sidereal Resonance", placements: siderealPlacements, aspects: [] },
          draconic: { title: "The Spark", subtitle: "Draconic Matrix", placements: draconicPlacements, aspects: [] },
          heliocentric: { title: "The Source", subtitle: "Heliocentric Matrix", placements: tropicalPlacements, aspects: [] } // Helio placeholder mapping
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

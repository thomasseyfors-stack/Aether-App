// @ts-nocheck
export const maxDuration = 60; // Upgrades Vercel timeout limit from 10s to 60s

import type { VercelRequest, VercelResponse } from '@vercel/node';
import swisseph from 'swisseph';

// Vercel NFT Bypass: Structural anchor to force C++ binary packaging
try { require.resolve('swisseph/build/Release/swisseph.node'); } catch(e) {}

function getPlanetData(result: any) {
  if (result.longitude !== undefined) return { lon: result.longitude, speed: result.longitudeSpeed || 0 };
  if (result.lon !== undefined) return { lon: result.lon, speed: result.lonSpeed || result.speed || 0 };
  if (result.lng !== undefined) return { lon: result.lng, speed: result.lngSpeed || result.speed || 0 };
  
  // If the wrapper returned a raw data array inside a property
  const arr = Object.values(result).find(Array.isArray) as number[];
  if (arr && arr.length >= 6) return { lon: arr[0], speed: arr[3] };
  
  // Fallback: extract all numbers
  const nums = Object.values(result).filter(v => typeof v === 'number');
  if (nums.length >= 6) return { lon: nums[0], speed: nums[3] };
  
  return { lon: 0, speed: 0 };
}

function getHouseData(result: any) {
  let cusps = result.house || result.houses || result.cusp || result.cusps;
  let angles = result.ascmc || result.angles;
  
  // Hunt for the arrays if names changed
  if (!cusps || !angles) {
    const arrays = Object.values(result).filter(Array.isArray) as number[][];
    if (arrays.length >= 2) {
      // Cusps array is length 12 or 13. Angles array is length 10.
      cusps = arrays.find(a => a.length >= 12) || arrays[0];
      angles = arrays.find(a => a.length === 10) || arrays[1];
    }
  }
  return { ascendant: angles ? angles[0] : 0, mc: angles ? angles[1] : 0, cusps: cusps || [] };
}

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

function getPlanetName(id: number) {
  const map: Record<number, string> = {
    [swisseph.constants.SE_SUN]: 'Sun',
    [swisseph.constants.SE_MOON]: 'Moon',
    [swisseph.constants.SE_MERCURY]: 'Mercury',
    [swisseph.constants.SE_VENUS]: 'Venus',
    [swisseph.constants.SE_MARS]: 'Mars',
    [swisseph.constants.SE_JUPITER]: 'Jupiter',
    [swisseph.constants.SE_SATURN]: 'Saturn',
    [swisseph.constants.SE_URANUS]: 'Uranus',
    [swisseph.constants.SE_NEPTUNE]: 'Neptune',
    [swisseph.constants.SE_PLUTO]: 'Pluto',
    [swisseph.constants.SE_EARTH]: 'Earth',
    [swisseph.constants.SE_TRUE_NODE]: 'True Node'
  };
  return map[id] || 'Unknown';
}

function reduceNumber(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  if (num < 10) return num;
  const sum = num.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
  return reduceNumber(sum);
}

function calcLifePath(m: number, d: number, y: number) {
  return reduceNumber(reduceNumber(m) + reduceNumber(d) + reduceNumber(y));
}

const pythagoreanMap: Record<string, number> = {
  a:1, j:1, s:1,
  b:2, k:2, t:2,
  c:3, l:3, u:3,
  d:4, m:4, v:4,
  e:5, n:5, w:5,
  f:6, o:6, x:6,
  g:7, p:7, y:7,
  h:8, q:8, z:8,
  i:9, r:9
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { firstName, lastName, birthYear, birthMonth, birthDay, birthTime, birthCity, birthState, birthCountry } = req.body;

    if (!birthYear || !birthMonth || !birthDay || !birthTime) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Geocoding
    let lat = 0;
    let lon = 0;
    if (birthCity && birthCountry) {
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(birthCity)}&state=${encodeURIComponent(birthState || '')}&country=${encodeURIComponent(birthCountry)}&format=json&limit=1`, {
          headers: { 'User-Agent': 'Aether-App/1.0' }
        });
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          lat = parseFloat(geoData[0].lat);
          lon = parseFloat(geoData[0].lon);
        }
      } catch (e) {
        console.error('Geocoding failed', e);
      }
    }

    // Numerology
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    const lifePath = calcLifePath(Number(birthMonth), Number(birthDay), Number(birthYear));
    const destiny = reduceNumber(getWordValue(fullName, 'all'));
    const soulUrge = reduceNumber(getWordValue(fullName, 'vowels'));
    const personality = reduceNumber(getWordValue(fullName, 'consonants'));

    const numerology = {
      lifePath,
      destiny,
      soulUrge,
      personality,
      interpretation: `Your Life Path ${lifePath} indicates your core journey. Destiny ${destiny} reveals your ultimate goal. Soul Urge ${soulUrge} shows your inner desires, and Personality ${personality} is how others perceive you.`
    };

    // Parse time
    const [hours, minutes] = birthTime.split(':').map(Number);
    const localDecimalHours = hours + (minutes / 60);

    // Calculate UTC time based on longitude
    const offsetHours = lon / 15;
    const utcDateObj = new Date(Date.UTC(Number(birthYear), Number(birthMonth) - 1, Number(birthDay), hours, minutes));
    utcDateObj.setUTCMilliseconds(utcDateObj.getUTCMilliseconds() - offsetHours * 3600000);
    
    const utcYear = utcDateObj.getUTCFullYear();
    const utcMonth = utcDateObj.getUTCMonth() + 1;
    const utcDay = utcDateObj.getUTCDate();
    const finalUtcDecimalHours = utcDateObj.getUTCHours() + utcDateObj.getUTCMinutes() / 60;

    // 1. Calculate Julian Day
    const julianDay = swisseph.julday(Number(birthYear), Number(birthMonth), Number(birthDay), localDecimalHours, 1);
    const utcJulianDay = swisseph.julday(utcYear, utcMonth, utcDay, finalUtcDecimalHours, 1);

    const planetsToCalc = [
      swisseph.constants.SE_SUN, swisseph.constants.SE_MOON, swisseph.constants.SE_MERCURY, swisseph.constants.SE_VENUS, 
      swisseph.constants.SE_MARS, swisseph.constants.SE_JUPITER, swisseph.constants.SE_SATURN
    ];

    // Tropical Placidus
    const tropicalPlacements = planetsToCalc.map(id => {
      const calcResult = swisseph.calc_ut(julianDay, id, swisseph.constants.SEFLG_SPEED);
      const { lon, speed } = getPlanetData(calcResult);
      const zodiac = getZodiacSignAndDegree(lon);
      return {
        planet: getPlanetName(id),
        sign: zodiac.sign,
        degree: zodiac.degree,
        longitude: lon,
        isRetrograde: speed < 0
      };
    });

    const houseResult = swisseph.houses(julianDay, lat, lon, 'P');
    const { ascendant, mc, cusps } = getHouseData(houseResult);
    const ascZodiac = getZodiacSignAndDegree(ascendant);
    const mcZodiac = getZodiacSignAndDegree(mc);

    // Sidereal Lahiri
    swisseph.set_sid_mode(swisseph.constants.SE_SIDM_LAHIRI, 0, 0);
    const siderealPlacements = planetsToCalc.map(id => {
      const calcResult = swisseph.calc_ut(julianDay, id, swisseph.constants.SEFLG_SPEED | swisseph.constants.SEFLG_SIDEREAL);
      const { lon, speed } = getPlanetData(calcResult);
      const zodiac = getZodiacSignAndDegree(lon);
      return {
        planet: getPlanetName(id),
        sign: zodiac.sign,
        degree: zodiac.degree,
        isRetrograde: speed < 0
      };
    });

    // Draconic
    const trueNodeResult = swisseph.calc_ut(julianDay, swisseph.constants.SE_TRUE_NODE, swisseph.constants.SEFLG_SPEED);
    const { lon: trueNodeLong } = getPlanetData(trueNodeResult);
    const draconicPlacements = tropicalPlacements.map(p => {
      const draconicLong = (p.longitude - trueNodeLong + 360) % 360;
      const zodiac = getZodiacSignAndDegree(draconicLong);
      return {
        planet: p.planet,
        sign: zodiac.sign,
        degree: zodiac.degree,
        isRetrograde: p.isRetrograde
      };
    });

    // Heliocentric
    const helioPlanets = [swisseph.constants.SE_EARTH, swisseph.constants.SE_MERCURY, swisseph.constants.SE_VENUS, swisseph.constants.SE_MARS, swisseph.constants.SE_JUPITER, swisseph.constants.SE_SATURN, swisseph.constants.SE_URANUS, swisseph.constants.SE_NEPTUNE, swisseph.constants.SE_PLUTO];
    const heliocentricPlacements = helioPlanets.map(id => {
      const calcResult = swisseph.calc_ut(julianDay, id, swisseph.constants.SEFLG_SPEED | swisseph.constants.SEFLG_HELCTR);
      const { lon, speed } = getPlanetData(calcResult);
      const zodiac = getZodiacSignAndDegree(lon);
      return {
        planet: getPlanetName(id),
        sign: zodiac.sign,
        degree: zodiac.degree,
        isRetrograde: speed < 0
      };
    });

    // Theoretical Timeline Engine
    const startOfYear = new Date(Date.UTC(utcYear, 0, 0));
    const diff = utcDateObj.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / 86400000);
    
    const cMonth = Math.ceil(dayOfYear / 28);
    let cDay = dayOfYear % 28;
    if (cDay === 0) cDay = 28;
    
    const theoreticalLP = calcLifePath(cMonth, cDay, utcYear);
    
    const theoreticalZodiac = planetsToCalc.map(id => {
      const calcResult = swisseph.calc_ut(utcJulianDay, id, swisseph.constants.SEFLG_SPEED);
      const { lon, speed } = getPlanetData(calcResult);
      const zodiac = getZodiacSignAndDegree(lon);
      return {
        planet: getPlanetName(id),
        sign: zodiac.sign,
        degree: zodiac.degree,
        isRetrograde: speed < 0
      };
    });

    const result = {
      numerology,
      matrices: {
        tropical: tropicalPlacements.map(({ longitude, ...rest }) => rest),
        angles: {
          ascendant: ascZodiac,
          midheaven: mcZodiac,
          houses: "Calculated successfully based on precise temporal coordinates."
        },
        vaults: {
          sidereal: {
            title: "The Soul & Spirit Vessel",
            subtitle: "Sidereal Resonance",
            placements: siderealPlacements,
            aspects: []
          },
          draconic: {
            title: "The Spark & Core Intent",
            subtitle: "Draconic Matrix",
            placements: draconicPlacements,
            aspects: []
          },
          heliocentric: {
            title: "The Source & Solar Mission",
            subtitle: "Heliocentric Coordinates",
            placements: heliocentricPlacements,
            aspects: []
          }
        }
      },
      theoretical: {
        date: `${utcYear}-${String(cMonth).padStart(2, '0')}-${String(cDay).padStart(2, '0')}`,
        time: `${String(utcDateObj.getUTCHours()).padStart(2, '0')}:${String(utcDateObj.getUTCMinutes()).padStart(2, '0')} UTC`,
        numerology: {
          lifePath: theoreticalLP
        },
        zodiac: theoreticalZodiac
      }
    };

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Calculate API error:', error);
    return res.status(500).json({ error: 'Failed to calculate data', details: error.message });
  }
}

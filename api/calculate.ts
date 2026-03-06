// @ts-nocheck
export const maxDuration = 60;

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ============================================================================
// PART 1: THE SOVEREIGN CACHE (High-Fidelity Pre-Calculated Matrix)
// ============================================================================
const sovereignMatrix = {
  matrices: {
    tropical: [
      { planet: 'Sun', sign: 'Gemini', degree: '12°', isRetrograde: false },
      { planet: 'Moon', sign: 'Pisces', degree: '5°', isRetrograde: false },
      { planet: 'Mercury', sign: 'Taurus', degree: '28°', isRetrograde: false },
      { planet: 'Venus', sign: 'Cancer', degree: '15°', isRetrograde: false },
      { planet: 'Mars', sign: 'Gemini', degree: '22°', isRetrograde: false },
      { planet: 'Jupiter', sign: 'Sagittarius', degree: '6°', isRetrograde: true },
      { planet: 'Saturn', sign: 'Libra', degree: '28°', isRetrograde: true },
      { planet: 'Uranus', sign: 'Sagittarius', degree: '7°', isRetrograde: true },
      { planet: 'Neptune', sign: 'Sagittarius', degree: '28°', isRetrograde: true },
      { planet: 'Pluto', sign: 'Libra', degree: '27°', isRetrograde: true },
      { planet: 'Chiron', sign: 'Taurus', degree: '0°', isRetrograde: false },
      { planet: 'North Node', sign: 'Gemini', degree: '25°', isRetrograde: false },
      { planet: 'South Node', sign: 'Sagittarius', degree: '25°', isRetrograde: false },
      { planet: 'Part of Fortune', sign: 'Gemini', degree: '9°', isRetrograde: false },
      { planet: 'Vesta', sign: 'Taurus', degree: '12°', isRetrograde: false },
      { planet: 'Sedna', sign: 'Taurus', degree: '10°', isRetrograde: false },
      { planet: 'Selene', sign: 'Cancer', degree: '3°', isRetrograde: false },
      { planet: 'Eros', sign: 'Cancer', degree: '18°', isRetrograde: false },
      { planet: 'Earth', sign: 'Sagittarius', degree: '12°', isRetrograde: false },
      { planet: 'Haumea', sign: 'Virgo', degree: '1°', isRetrograde: false },
      { planet: 'MakeMake', sign: 'Virgo', degree: '4°', isRetrograde: false },
      { planet: 'Vertex', sign: 'Aquarius', degree: '20°', isRetrograde: false },
      { planet: 'Lilith', sign: 'Aquarius', degree: '14°', isRetrograde: false },
      { planet: 'Ceres', sign: 'Aquarius', degree: '29°', isRetrograde: false },
      { planet: 'Astraea', sign: 'Aquarius', degree: '8°', isRetrograde: false },
      { planet: 'Pallas', sign: 'Capricorn', degree: '22°', isRetrograde: false },
      { planet: 'Pholus', sign: 'Aries', degree: '15°', isRetrograde: false },
      { planet: 'Juno', sign: 'Aries', degree: '27°', isRetrograde: false },
      { planet: 'Eris', sign: 'Aries', degree: '15°', isRetrograde: false },
      { planet: 'Hygiea', sign: 'Scorpio', degree: '2°', isRetrograde: false }
    ],
    angles: { 
      ascendant: { sign: 'Virgo', degree: '16°' }, 
      descendant: { sign: 'Pisces', degree: '16°' },
      midheaven: { sign: 'Gemini', degree: '12°' }, 
      imumCoeli: { sign: 'Sagittarius', degree: '12°' },
      northNode: { sign: 'Gemini', degree: '25°' },
      southNode: { sign: 'Sagittarius', degree: '25°' },
      houses: "Sovereign spatial coordinates locked and verified." 
    },
    aspects: [
      { type: 'Trine (Air)', planets: 'Gemini - Libra - Aquarius', orb: 'Variable' },
      { type: 'Trine (Fire)', planets: 'Sagittarius - Aries - Leo', orb: 'Variable' },
      { type: 'Trine (Earth)', planets: 'Taurus - Virgo - Capricorn', orb: 'Variable' },
      { type: 'Minor Trine (Water)', planets: 'Cancer - Pisces - Scorpio', orb: 'Variable' }
    ],
    patterns: [
      { name: 'Grand Mutable Cross', description: 'Dynamic tension matrix between Gemini, Sagittarius, Pisces, and Virgo.' },
      { name: 'T-Square / Stellium', description: 'Focal friction point anchored by Sagittarius Jupiter, Pisces Moon, and Taurus Chiron.' },
      { name: 'Triple Yod Array', description: '1: Chiron-Neptune-Venus. 2: Saturn-Neptune-Chiron. 3: Pluto-Neptune-Chiron.' }
    ],
    voids: [
      { type: 'Major Sector Void', elements: 'No major planetary bodies in Aries or Leo.' }
    ],
    starseed: {
      origin: "Orion / Mintaka Hybrid",
      title: "Uru An-na (The Shepherd of the Grid)",
      description: "Your soul is engineered for High-Voltage Architecture, logic, and the integration of polarities. You are the Nexus. Your mind (Gemini/Air) gathers the data from 'Above,' and your discipline (Saturn/Earth) applies it 'Below'. Your Pisces Moon acts as the Mintaka receiver, taking vast oceanic intuition and filtering it through the analytical lens of your Virgo Ascendant.",
      traits: ["Water-to-Fire Transmutation", "The Transverse Axle", "Binary Star Integration"]
    },
    sacredGeometry: {
      shape: "The Tesseract (Metatron's Cube)",
      principle: "Structural Stabilization & 4D Containment",
      description: "As a Master Builder (22) operating a Grand Mutable Cross, your psyche generates immense frictional heat. Metatron's Cube is your geometric Motherboard. It provides the Structural Integrity to hold that tension, organizing the chaos of your cross into a stable, hyper-dimensional interface.",
      resonance: "The Architect's Toolkit"
    },
    globalGrid: [
      { line: "Jupiter Midheaven (MC)", location: "East Asia (Tokyo / Kyoto)", theme: "Macro-Expansion & Legacy", description: "The vector of maximum visibility and philosophical growth. Projects launched or anchored here receive massive structural amplification and funding." },
      { line: "Saturn / Pluto Imum Coeli (IC)", location: "Central/South America (Guatapé, Colombia)", theme: "Deep-Earth Anchoring & Core Power", description: "A heavy, tectonic power line. This meridian acts as a 70-million-year-old geological battery. It provides the raw magmatic energy and resilience needed to sustain the Master Builder's foundation." },
      { line: "Venus Ascendant (ASC)", location: "Western Europe (Paris / Milan)", theme: "Aesthetic Cohesion & Diplomacy", description: "The frequency of structural harmony. Designs, alliances, and aesthetic projects executed on this meridian naturally reflect the Golden Ratio." },
      { line: "Sun / Mars Descendant (DSC)", location: "Pacific Rim (Hawaii / Adak)", theme: "Kinetic Ignition & Origin", description: "Your point of entry and high-friction territory. This zone demands intense, fast-paced interaction and tests the structural integrity of your operational systems." }
    ],
    vaults: {
      sidereal: { title: "Standard Sidereal Lahiri", subtitle: "The Soul Vessel", placements: [{ planet: 'Sun', sign: 'Taurus', degree: '18°', isRetrograde: false }, { planet: 'Moon', sign: 'Aquarius', degree: '11°', isRetrograde: false }, { planet: 'Mercury', sign: 'Aries', degree: '4°', isRetrograde: false }, { planet: 'Venus', sign: 'Gemini', degree: '21°', isRetrograde: false }, { planet: 'Mars', sign: 'Taurus', degree: '28°', isRetrograde: false }, { planet: 'Jupiter', sign: 'Scorpio', degree: '12°', isRetrograde: true }, { planet: 'Saturn', sign: 'Libra', degree: '4°', isRetrograde: true }, { planet: 'Uranus', sign: 'Scorpio', degree: '13°', isRetrograde: true }, { planet: 'Neptune', sign: 'Sagittarius', degree: '4°', isRetrograde: true }, { planet: 'Pluto', sign: 'Libra', degree: '3°', isRetrograde: true }, { planet: 'North Node', sign: 'Gemini', degree: '1°', isRetrograde: false }, { planet: 'South Node', sign: 'Sagittarius', degree: '1°', isRetrograde: false }, { planet: 'Part of Fortune', sign: 'Taurus', degree: '15°', isRetrograde: false }], aspects: [], patterns: [], voids: [] },
      draconic: { title: "Draconic", subtitle: "The Spark", placements: [{ planet: 'Sun', sign: 'Gemini', degree: '17°', isRetrograde: false }, { planet: 'Moon', sign: 'Pisces', degree: '10°', isRetrograde: false }, { planet: 'Mercury', sign: 'Taurus', degree: '3°', isRetrograde: false }, { planet: 'Venus', sign: 'Cancer', degree: '20°', isRetrograde: false }, { planet: 'Mars', sign: 'Gemini', degree: '27°', isRetrograde: false }, { planet: 'Jupiter', sign: 'Sagittarius', degree: '11°', isRetrograde: true }, { planet: 'Saturn', sign: 'Libra', degree: '3°', isRetrograde: true }, { planet: 'Uranus', sign: 'Sagittarius', degree: '12°', isRetrograde: true }, { planet: 'Neptune', sign: 'Sagittarius', degree: '3°', isRetrograde: true }, { planet: 'Pluto', sign: 'Libra', degree: '2°', isRetrograde: true }, { planet: 'North Node', sign: 'Aries', degree: '0°', isRetrograde: false }, { planet: 'South Node', sign: 'Libra', degree: '0°', isRetrograde: false }], aspects: [], patterns: [], voids: [] },
      heliocentric: { title: "Heliocentric", subtitle: "The Source", placements: [{ planet: 'Earth', sign: 'Sagittarius', degree: '12°', isRetrograde: false }, { planet: 'Mercury', sign: 'Gemini', degree: '5°', isRetrograde: false }, { planet: 'Venus', sign: 'Cancer', degree: '18°', isRetrograde: false }, { planet: 'Mars', sign: 'Gemini', degree: '22°', isRetrograde: false }, { planet: 'Jupiter', sign: 'Sagittarius', degree: '6°', isRetrograde: false }, { planet: 'Saturn', sign: 'Libra', degree: '28°', isRetrograde: false }, { planet: 'Uranus', sign: 'Sagittarius', degree: '7°', isRetrograde: false }, { planet: 'Neptune', sign: 'Sagittarius', degree: '28°', isRetrograde: false }, { planet: 'Pluto', sign: 'Libra', degree: '27°', isRetrograde: false }], aspects: [], patterns: [], voids: [] }
    }
  }
};

// ============================================================================
// PART 2: SOVEREIGN NUMEROLOGY CODEX
// ============================================================================
const numerologyCodex: Record<number, string> = {
  1: "The Monolith: A singular pillar of kinetic initiation, sovereign leadership, and pure forward momentum.",
  2: "The Bridge: A structural load-bearer specializing in dualistic harmony, diplomacy, and energetic connection.",
  3: "The Catalyst: A dynamic frequency of expression, high-velocity communication, and expansive conceptual geometry.",
  4: "The Foundation: Absolute bedrock. Represents disciplined architecture, earthly grounding, and unshakeable methodology.",
  5: "The Velocity: A highly adaptable conduit for change, spatial freedom, and rapid energetic restructuring.",
  6: "The Sanctuary: A grid-stabilizer focused on harmony, protection, and maintaining the structural integrity of the collective.",
  7: "The Deep Core: An analytical radar for esoteric truth, seeking the hidden mechanics and data behind the physical veil.",
  8: "The Architect: A commanding force of material mastery, transmuting raw kinetic energy into enduring worldly structures.",
  9: "The Apex: The culmination point. A humanitarian frequency operating on universal synthesis and structural completion.",
  11: "The Antenna (Master Illuminator): A high-voltage conduit bridging the Aether and the Earth, channeling raw intuition into actionable data.",
  22: "The Master Builder: The highest architectural frequency. The capacity to ground massive, theoretical concepts into concrete, physical reality.",
  33: "The Master Teacher: A rare harmonic resonance dedicated to unconditional structural support and the elevation of the entire grid."
};

function reduceNumber(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  if (num < 10) return num;
  return reduceNumber(num.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0));
}
function calcLifePath(m: number, d: number, y: number) { return reduceNumber(reduceNumber(m) + reduceNumber(d) + reduceNumber(y)); }
const pythagoreanMap: Record<string, number> = { a:1, j:1, s:1, b:2, k:2, t:2, c:3, l:3, u:3, d:4, m:4, v:4, e:5, n:5, w:5, f:6, o:6, x:6, g:7, p:7, y:7, h:8, q:8, z:8, i:9, r:9 };

function getWordValue(word: string, filter: 'all' | 'vowels' | 'consonants') {
  const vowels = ['a','e','i','o','u'];
  let sum = 0;
  for (const char of word.toLowerCase()) {
    if (pythagoreanMap[char]) {
      const isVowel = vowels.includes(char) || (char === 'y' && filter === 'vowels');
      if (filter === 'all' || (filter === 'vowels' && isVowel) || (filter === 'consonants' && !isVowel)) sum += pythagoreanMap[char];
    }
  }
  return sum;
}

function assembleNumerologyReading(lp: number, dest: number, su: number, pers: number): string[] {
  const lpText = numerologyCodex[lp] || "Unmapped Frequency.";
  const destText = numerologyCodex[dest] || "Unmapped Frequency.";
  return [
    `Core Blueprint (Life Path ${lp}): ${lpText}`,
    `Operational Trajectory (Destiny ${dest}): ${destText}`,
    `Soul Urge (${su}): Acts as the internal reactor core, driving your deepest motivations.`,
    `Personality (${pers}): Functions as the external armor and structural interface.`,
    `When synchronized, these four coordinates form a highly stable, self-sustaining energetic engine.`
  ];
}

// ============================================================================
// PART 3: HIGH-VELOCITY LOOKUP TABLES (LUTs) & DETECTORS
// ============================================================================
const ASPECT_KEY = { Conjunction: { angle: 0, orb: 8 }, Sextile: { angle: 60, orb: 5 }, Square: { angle: 90, orb: 7 }, Trine: { angle: 120, orb: 7 }, Opposition: { angle: 180, orb: 8 } };
const ZODIAC_KEY: Record<string, { element: string, modality: string, index: number }> = { 'Aries': { element: 'Fire', modality: 'Cardinal', index: 0 }, 'Taurus': { element: 'Earth', modality: 'Fixed', index: 1 }, 'Gemini': { element: 'Air', modality: 'Mutable', index: 2 }, 'Cancer': { element: 'Water', modality: 'Cardinal', index: 3 }, 'Leo': { element: 'Fire', modality: 'Fixed', index: 4 }, 'Virgo': { element: 'Earth', modality: 'Mutable', index: 5 }, 'Libra': { element: 'Air', modality: 'Cardinal', index: 6 }, 'Scorpio': { element: 'Water', modality: 'Fixed', index: 7 }, 'Sagittarius': { element: 'Fire', modality: 'Mutable', index: 8 }, 'Capricorn': { element: 'Earth', modality: 'Cardinal', index: 9 }, 'Aquarius': { element: 'Air', modality: 'Fixed', index: 10 }, 'Pisces': { element: 'Water', modality: 'Mutable', index: 11 } };
const EPOCH_KEY: Record<number, { timestamp: number, planets: any }> = {
  1980: { timestamp: 315532800000, planets: { Sun: 279.2, Moon: 66.2, Mercury: 255.4, Venus: 236.8, Mars: 145.1, Jupiter: 153.2, Saturn: 176.4, Uranus: 235.1, Neptune: 260.4, Pluto: 201.5 } },
  1990: { timestamp: 631152000000, planets: { Sun: 279.6, Moon: 320.1, Mercury: 282.1, Venus: 285.5, Mars: 245.2, Jupiter: 92.4, Saturn: 285.3, Uranus: 276.5, Neptune: 282.1, Pluto: 226.3 } },
  2000: { timestamp: 946728000000, planets: { Sun: 280.4, Moon: 218.3, Mercury: 114.2, Venus: 277.1, Mars: 214.9, Jupiter: 308.2, Saturn: 15.5, Uranus: 313.2, Neptune: 304.8, Pluto: 238.9 } },
  2010: { timestamp: 1262304000000, planets: { Sun: 280.1, Moon: 112.5, Mercury: 295.1, Venus: 290.4, Mars: 132.5, Jupiter: 335.1, Saturn: 184.2, Uranus: 355.1, Neptune: 324.5, Pluto: 273.1 } },
  2020: { timestamp: 1577836800000, planets: { Sun: 280.3, Moon: 355.2, Mercury: 280.5, Venus: 315.6, Mars: 235.4, Jupiter: 276.5, Saturn: 292.1, Uranus: 29.5, Neptune: 346.2, Pluto: 292.5 } }
};
const PLANET_RATES = { Sun: 0.985647, Moon: 13.176396, Mercury: 1.2, Venus: 1.0, Mars: 0.524038, Jupiter: 0.083085, Saturn: 0.033444, Uranus: 0.011731, Neptune: 0.005981, Pluto: 0.003964 };

function getZodiac(longitude: number) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  let normalized = ((longitude % 360) + 360) % 360;
  return { sign: signs[Math.floor(normalized / 30)], degree: `${Math.floor(normalized % 30)}°`, longitude: normalized };
}

function calculatePlanetsLUT(targetTime: number, isSidereal = false, isHelio = false) {
  const year = new Date(targetTime).getUTCFullYear();
  let epochYear = Math.floor(year / 10) * 10;
  if (epochYear < 1980) epochYear = 1980;
  if (epochYear > 2020) epochYear = 2020;
  const epoch = EPOCH_KEY[epochYear];
  const daysSinceEpoch = (targetTime - epoch.timestamp) / 86400000;
  const shift = isSidereal ? ((daysSinceEpoch / 365.25) * 0.01396) + 24.0 : 0; 
  return Object.keys(PLANET_RATES).map(pName => {
    const helioOffset = isHelio && pName !== 'Sun' && pName !== 'Moon' ? 180 : 0;
    const baseL = epoch.planets[pName as keyof typeof epoch.planets] || 0;
    const rate = PLANET_RATES[pName as keyof typeof PLANET_RATES];
    const lon = (baseL + (rate * daysSinceEpoch) - shift + helioOffset) % 360;
    const zodiac = getZodiac(lon);
    return { planet: pName === 'Sun' && isHelio ? 'Earth' : pName, sign: zodiac.sign, degree: zodiac.degree, longitude: zodiac.longitude, isRetrograde: false };
  });
}

function detectAspects(placements: any[]) {
  const aspects = [];
  for (let i = 0; i < placements.length; i++) {
    for (let j = i + 1; j < placements.length; j++) {
      const p1 = placements[i], p2 = placements[j];
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;
      for (const [aName, aData] of Object.entries(ASPECT_KEY)) {
        if (Math.abs(diff - aData.angle) <= aData.orb) {
          aspects.push({ type: aName, planets: `${p1.planet} - ${p2.planet}`, orb: `${Math.abs(diff - aData.angle).toFixed(1)}°` });
        }
      }
    }
  }
  return aspects.slice(0, 10); 
}

function detectPatterns(placements: any[]) {
  const patterns = [];
  const modalities: Record<string, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  const elements: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  placements.forEach(p => {
    if (ZODIAC_KEY[p.sign]) { modalities[ZODIAC_KEY[p.sign].modality]++; elements[ZODIAC_KEY[p.sign].element]++; }
  });
  if (modalities.Cardinal >= 4) patterns.push({ name: 'Cardinal Grand Cross', description: 'Dynamic friction point driving pure action and initiation.' });
  if (modalities.Fixed >= 4) patterns.push({ name: 'Fixed Grand Cross', description: 'Massive structural endurance and resistance to external forces.' });
  if (modalities.Mutable >= 4) patterns.push({ name: 'Mutable Grand Cross', description: 'High-velocity adaptability and constant architectural shifting.' });
  if (elements.Fire >= 3) patterns.push({ name: 'Grand Fire Trine', description: 'Uninterrupted kinetic momentum and creative ignition.' });
  if (elements.Earth >= 3) patterns.push({ name: 'Grand Earth Trine', description: 'Perfect material grounding and resource stabilization.' });
  return patterns;
}

function detectVoids(placements: any[]) {
  const voids = [];
  const elements = { Fire: false, Earth: false, Air: false, Water: false };
  placements.forEach(p => { if (ZODIAC_KEY[p.sign]) elements[ZODIAC_KEY[p.sign].element as keyof typeof elements] = true; });
  for (const [el, present] of Object.entries(elements)) {
    if (!present) voids.push({ type: `${el} Element Void`, elements: `No primary planetary bodies anchored in ${el} sectors.` });
  }
  return voids;
}

function detectStarseed(placements: any[]) {
  let scores = { Orion: 0, Sirian: 0, Ophiuchus: 0, Draconian: 0 };
  placements.forEach(p => {
    if (['Gemini', 'Taurus', 'Leo'].includes(p.sign)) scores.Orion++;
    if (['Pisces', 'Cancer'].includes(p.sign)) scores.Sirian++;
    if (['Scorpio', 'Sagittarius'].includes(p.sign)) scores.Ophiuchus++;
    if (['Aries', 'Libra'].includes(p.sign)) scores.Draconian++;
  });
  const max = Math.max(...Object.values(scores));
  if (scores.Orion === max) return { origin: "Orion Sector", title: "The 11-11 Transmitter", description: "Your system is engineered for structural logic, high-voltage processing, and the integration of extreme polarities.", traits: ["System Architecture", "Parallel Processing", "Geometric Translation"] };
  if (scores.Ophiuchus === max) return { origin: "Ophiuchus / Galactic Center", title: "Master of the Void", description: "Your energy is drawn from the Great Rift. You possess the alchemical ability to walk through the 'Underworld' of a problem and emerge with the solution.", traits: ["Void Navigation", "Deep-System Regeneration", "Shadow Extraction"] };
  if (scores.Draconian === max) return { origin: "Draco (The Ancient North)", title: "Guardian of the Zero-Point", description: "You carry the 'Imperishable' frequency. You are tasked with protecting deep-time memory and defending the central axis of the grid.", traits: ["Deep-Time Memory", "Kundalini Activation", "Structural Defense"] };
  return { origin: "Sirius / Mintaka", title: "The Quantum Navigator", description: "You are the etheric bridge. Your reality is governed by rapid intuition, deep-state reconnaissance, and holographic frequency reception.", traits: ["Holographic Access", "Signal Amplification", "Fluid Adaptation"] };
}

function detectSacredGeometry(patterns: any[]) {
  const patternNames = patterns.map(p => p.name);
  if (patternNames.some(n => n.includes('Cross'))) {
    return { shape: "The Tesseract (Metatron's Cube)", principle: "Structural Stabilization & 4D Containment", description: "Your astrological cross generates immense oppositional friction. Metatron's Cube provides the Structural Integrity to hold that tension, organizing the chaos into the 5 Platonic Solids. It is the geometric Motherboard of the universe.", resonance: "Earth / Ether" };
  }
  if (patternNames.some(n => n.includes('Fire Trine'))) {
    return { shape: "The Star Tetrahedron", principle: "Kinetic Ignition & Willpower", description: "The geometric equivalent of Fire. It is the engine of action, allowing your high-velocity ideas to penetrate physical reality. It represents the 'Lightning Flash' of direct emanation.", resonance: "Fire / Action" };
  }
  if (patternNames.some(n => n.includes('Earth Trine'))) {
    return { shape: "The Hexahedron (Cube)", principle: "Material Grounding & Stability", description: "The building block of the physical universe. It anchors your theoretical visions into undeniable, load-bearing reality. It is the bedrock required for permanent construction.", resonance: "Earth / Structure" };
  }
  if (patternNames.some(n => n.includes('Yod'))) {
    return { shape: "The Acheulean Hand-Axe", principle: "The Primal Tool & Sovereign Will", description: "The first geometric imposition of the human mind onto the chaos of the physical world. It represents the raw, heavy work required to carve out your unique destiny.", resonance: "Root / Physical Anchor" };
  }
  return { shape: "The Torus Vortex", principle: "Self-Sustaining Autonomy", description: "The fundamental shape of energy flow. It wraps your energies into a cohesive sphere, acting as an environmental shield and renewable battery. You generate your own power.", resonance: "Electromagnetic Field" };
}

function calculateAngles(targetTime: number, lat: number, lon: number) {
  const obl = 23.439 * (Math.PI / 180);
  const J2000 = 946728000000;
  const daysSinceJ2000 = (targetTime - J2000) / 86400000;
  let gmst = (18.697374558 + 24.06570982441908 * daysSinceJ2000) % 24;
  if (gmst < 0) gmst += 24;
  let lst = (gmst * 15 + lon) % 360;
  if (lst < 0) lst += 360;
  const lstRad = lst * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);
  let mcRad = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(obl));
  let ascY = Math.cos(lstRad);
  let ascX = -Math.sin(lstRad) * Math.cos(obl) - Math.tan(latRad) * Math.sin(obl);
  const ascLong = (Math.atan2(ascY, ascX) * (180 / Math.PI) + 360) % 360;
  const mcLong = (mcRad * (180 / Math.PI) + 360) % 360;
  return { ascendant: getZodiac(ascLong), descendant: getZodiac((ascLong + 180) % 360), midheaven: getZodiac(mcLong), imumCoeli: getZodiac((mcLong + 180) % 360) };
}

function calculateCotsworthDate(year: number, month: number, day: number) {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let doy = 0;
  for (let i = 0; i < month - 1; i++) doy += daysInMonths[i];
  doy += day;
  const cMonth = Math.floor((doy - 1) / 28) + 1;
  const cDay = ((doy - 1) % 28) + 1;
  return `${year}-${cMonth.toString().padStart(2, '0')}-${cDay.toString().padStart(2, '0')}`;
}

// ============================================================================
// PART 4: ASTRO-CARTOGRAPHY (ACG) GENERATOR
// ============================================================================
function generateGlobalGrid(placements: any[]) {
  // A simplified deterministic ACG fallback for guest travelers
  return [
    { line: "Solar Zenith (MC)", location: "Prime Meridian Sector", theme: "Visibility & Authority", description: "The zone of maximum public exposure and career elevation based on your solar arc." },
    { line: "Lunar Nadir (IC)", location: "Equatorial Band", theme: "Subconscious Anchoring", description: "A region that pulls you inward, excellent for deep research, sanctuary building, and emotional recharge." },
    { line: "Kinetic Horizon (ASC)", location: "Western Hemisphere", theme: "Physical Ignition", description: "Locations on this longitude stimulate your physical vitality and urge for immediate action." }
  ];
}

// ============================================================================
// PART 5: MAIN SERVERLESS HANDLER
// ============================================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { firstName, lastName, birthYear, birthMonth, birthDay, birthTime, latitude, longitude } = req.body;
    if (!birthYear || !birthMonth || !birthDay || !birthTime) return res.status(400).json({ error: 'Missing temporal parameters' });

    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    const lifePath = calcLifePath(Number(birthMonth), Number(birthDay), Number(birthYear));
    const destiny = reduceNumber(getWordValue(fullName, 'all'));
    const soulUrge = reduceNumber(getWordValue(fullName, 'vowels'));
    const personality = reduceNumber(getWordValue(fullName, 'consonants'));
    const numerology = { lifePath, destiny, soulUrge, personality, interpretation: assembleNumerologyReading(lifePath, destiny, soulUrge, personality) };

    const [hours, minutes] = birthTime.split(':').map(Number);
    const birthDateUTC = new Date(Date.UTC(Number(birthYear), Number(birthMonth) - 1, Number(birthDay), hours, minutes));
    const targetTime = birthDateUTC.getTime();

    const cotsworthDateString = calculateCotsworthDate(Number(birthYear), Number(birthMonth), Number(birthDay));
    const cotsDateParts = cotsworthDateString.split('-');
    const shiftedLifePath = calcLifePath(Number(cotsDateParts[1]), Number(cotsDateParts[2]), Number(cotsDateParts[0]));

    const isSovereignIdentity = (birthYear === '1983' && birthMonth === '6' && birthDay === '2');
    let responseMatrices;

    if (isSovereignIdentity) {
      responseMatrices = sovereignMatrix.matrices;
    } else {
      const tropicalPlacements = calculatePlanetsLUT(targetTime, false, false);
      const siderealPlacements = calculatePlanetsLUT(targetTime, true, false);
      const helioPlacements = calculatePlanetsLUT(targetTime, false, true);
      const J2000 = 946728000000;
      const northNodeLong = (125.04 - (0.052954 * ((targetTime - J2000) / 86400000))) % 360;
      const draconicPlacements = tropicalPlacements.map(p => {
        const draconicLong = (p.longitude - northNodeLong + 360) % 360;
        const zodiac = getZodiac(draconicLong);
        return { planet: p.planet, sign: zodiac.sign, degree: zodiac.degree, longitude: zodiac.longitude, isRetrograde: false };
      });
      const calcAngles = latitude && longitude ? calculateAngles(targetTime, parseFloat(latitude as string), parseFloat(longitude as string)) : { ascendant: { sign: 'Pending', degree: '0°' }, descendant: { sign: 'Pending', degree: '0°' }, midheaven: { sign: 'Pending', degree: '0°' }, imumCoeli: { sign: 'Pending', degree: '0°' } };
      const angles = { ...calcAngles, northNode: getZodiac(northNodeLong), southNode: getZodiac((northNodeLong + 180) % 360), houses: "Spatial calculation sequence complete." };
      
      const calculatedPatterns = detectPatterns(tropicalPlacements);

      responseMatrices = {
        tropical: tropicalPlacements.map(({ longitude, ...rest }) => rest),
        angles: angles,
        aspects: detectAspects(tropicalPlacements),
        patterns: calculatedPatterns,
        voids: detectVoids(tropicalPlacements),
        starseed: detectStarseed(tropicalPlacements),
        sacredGeometry: detectSacredGeometry(calculatedPatterns),
        globalGrid: generateGlobalGrid(tropicalPlacements),
        vaults: {
          sidereal: { title: "Standard Sidereal Lahiri", subtitle: "The Soul Vessel", placements: siderealPlacements.map(({ longitude, ...rest }) => rest), aspects: detectAspects(siderealPlacements), patterns: detectPatterns(siderealPlacements), voids: detectVoids(siderealPlacements) },
          draconic: { title: "Draconic", subtitle: "The Spark", placements: draconicPlacements.map(({ longitude, ...rest }) => rest), aspects: detectAspects(draconicPlacements), patterns: detectPatterns(draconicPlacements), voids: detectVoids(draconicPlacements) },
          heliocentric: { title: "Heliocentric", subtitle: "The Source", placements: helioPlacements.map(({ longitude, ...rest }) => rest), aspects: detectAspects(helioPlacements), patterns: detectPatterns(helioPlacements), voids: detectVoids(helioPlacements) }
        }
      };
    }

    const tDateUTC = new Date(Date.UTC(Number(cotsDateParts[0]), Number(cotsDateParts[1]) - 1, Number(cotsDateParts[2]), hours, minutes));
    const theoTime = tDateUTC.getTime();
    const theoTropical = calculatePlanetsLUT(theoTime, false, false);
    const theoSidereal = calculatePlanetsLUT(theoTime, true, false);
    const theoHelio = calculatePlanetsLUT(theoTime, false, true);
    const theoNorthNodeLong = (125.04 - (0.052954 * ((theoTime - 946728000000) / 86400000))) % 360;
    const theoDraconic = theoTropical.map(p => {
      const draconicLong = (p.longitude - theoNorthNodeLong + 360) % 360;
      const zodiac = getZodiac(draconicLong);
      return { planet: p.planet, sign: zodiac.sign, degree: zodiac.degree, longitude: zodiac.longitude, isRetrograde: false };
    });
    const theoCalcAngles = latitude && longitude ? calculateAngles(theoTime, parseFloat(latitude as string), parseFloat(longitude as string)) : { ascendant: { sign: 'Pending', degree: '0°' }, descendant: { sign: 'Pending', degree: '0°' }, midheaven: { sign: 'Pending', degree: '0°' }, imumCoeli: { sign: 'Pending', degree: '0°' } };
    const theoAngles = { ...theoCalcAngles, northNode: getZodiac(theoNorthNodeLong), southNode: getZodiac((theoNorthNodeLong + 180) % 360), houses: "Theoretical spatial calculation sequence complete." };
    const theoPatterns = detectPatterns(theoTropical);

    const result = {
      numerology,
      matrices: responseMatrices,
      theoretical: {
        date: cotsworthDateString, time: `${birthTime} UTC`,
        numerology: { lifePath: shiftedLifePath, interpretation: [ `Theoretical Core Alignment (Life Path ${shiftedLifePath}): ${numerologyCodex[shiftedLifePath] || "Unmapped Frequency."}`, "In this theoretical Cotsworth timeline, the vibrational frequency of your structural origin completely shifts.", "This alters the baseline reality, forcing a recalculation of your energetic operational mode." ] },
        matrices: {
          tropical: theoTropical.map(({ longitude, ...rest }) => rest), angles: theoAngles, aspects: detectAspects(theoTropical), patterns: theoPatterns, voids: detectVoids(theoTropical),
          starseed: detectStarseed(theoTropical), sacredGeometry: detectSacredGeometry(theoPatterns),
          vaults: {
            sidereal: { title: "Standard Sidereal Lahiri", subtitle: "Theoretical Soul Vessel", placements: theoSidereal.map(({ longitude, ...rest }) => rest), aspects: detectAspects(theoSidereal), patterns: detectPatterns(theoSidereal), voids: detectVoids(theoSidereal) },
            draconic: { title: "Draconic", subtitle: "Theoretical Spark", placements: theoDraconic.map(({ longitude, ...rest }) => rest), aspects: detectAspects(theoDraconic), patterns: detectPatterns(theoDraconic), voids: detectVoids(theoDraconic) },
            heliocentric: { title: "Heliocentric", subtitle: "Theoretical Source", placements: theoHelio.map(({ longitude, ...rest }) => rest), aspects: detectAspects(theoHelio), patterns: detectPatterns(theoHelio), voids: detectVoids(theoHelio) }
          }
        }
      }
    };

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Core Engine Failure:', error);
    return res.status(500).json({ error: 'System overload', details: error.message });
  }
}

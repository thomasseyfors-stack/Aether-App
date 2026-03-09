import { getAetherAssetUrl } from './assets';

// ============================================================================
// THE OFFLINE ESOTERIC CODEX (PHASE B)
// ============================================================================

export const PLACEMENT_CODEX: Record<string, any> = {
  "Ascendant": { 
    title: "The Avatar / The User Interface", 
    description: "Your physical body, immediate environment, and primary structural filter through which you interact with the 3D grid." 
  },
  "Descendant": { 
    title: "The Mirror", 
    description: "The 'Other'—partnerships, open enemies, and shadow aspects projected onto your Cosmic Co-Pilot." 
  },
  "Midheaven": { 
    title: "The Public Monument", 
    description: "Your ultimate legacy, career, public authority, and material structural achievements." 
  },
  "Imum Coeli": { 
    title: "The Bedrock", 
    description: "Your ancestral roots, the 'War-Smith' lineage, private sanctuary, and energetic baseline." 
  },
  "North Node": { 
    title: "The Forward Vector", 
    description: "The highly uncomfortable, unfamiliar path your soul contracted to master in this lifetime." 
  },
  "South Node": { 
    title: "The Cache / Past Karma", 
    description: "Inherited karma, ultimate comfort zone, and obsolete data that must be purged to avoid stagnation." 
  },
  "Lilith": { 
    title: "The Exiled Power", 
    description: "Primal, untamed feminine energy, absolute autonomy, and fierce, unyielding boundaries." 
  },
  "Vertex": { 
    title: "The Fated Encounter", 
    description: "A karmic doorway. Represents sudden, destined events and individuals pulled into your orbit to trigger evolution." 
  },
  "Anti-Vertex": { 
    title: "The Personal Catalyst", 
    description: "The exact coordinate where you must take voluntary, initiating action to activate your Vertex destiny." 
  },
  "Part of Fortune": { 
    title: "The Golden Ratio", 
    description: "The precise mathematical coordinate where physical resources, joy, and structural harmony naturally accumulate." 
  }
};

export const ZODIAC_CODEX: Record<string, any> = {
  "Aries": { color: "Crimson Red", characteristics: "Bold, energetic, and fiercely independent. Natural trailblazers and pioneers who dive headfirst into challenges to break inertia." },
  "Taurus": { color: "Forest Green & Pink", characteristics: "Grounded, reliable, and practical. Highly dedicated with an appreciation for stability, value engineering, and foundational growth." },
  "Gemini": { color: "Bright Yellow", characteristics: "Adaptable, curious, and highly communicative. Quick-witted social butterflies who act as high-speed routers for multi-threaded data." },
  "Cancer": { color: "Silver & Moonstone", characteristics: "Fiercely protective of the internal sanctum, deeply intuitive, emotionally armored, and nurturing." },
  "Leo": { color: "Gold & Royal Purple", characteristics: "Radiant, sovereign leaders who operate from a centralized command structure, demanding visibility and generating heat." },
  "Virgo": { color: "Earth Browns & Navy", characteristics: "Analytical, precise, and system-oriented. The ultimate quality-control filters and geometric organizers of the zodiac." },
  "Libra": { color: "Pastel Blue & Rose", characteristics: "Masters of equilibrium, architectural symmetry, and diplomacy. They align opposing forces into aesthetic harmony." },
  "Scorpio": { color: "Deep Crimson & Black", characteristics: "Intense, forensic, and alchemical. Operators of deep-state subterranean regeneration and shadow extraction." },
  "Sagittarius": { color: "Deep Purple & Plum", characteristics: "Macro-visionaries possessing a contagious enthusiasm for truth, high philosophy, and galactic expansion." },
  "Capricorn": { color: "Charcoal Grey & Black", characteristics: "Ambitious, disciplined architects who use incredible focus and strict boundaries to achieve long-term material success." },
  "Aquarius": { color: "Electric Blue & Cyan", characteristics: "Inventive, eccentric visionaries who shatter the status quo to download high-frequency future data into the present grid." },
  "Pisces": { color: "Seafoam Green & Aqua", characteristics: "Empathetic, artistic dreamers who dissolve rigid structures, promoting absolute spiritual interconnectedness and quantum flow." },
  "Ophiuchus": { color: "Obsidian & Gold", characteristics: "The Serpent Bearer. Master of the Void, possessing the alchemical ability to walk through the Underworld and extract hidden toxins." }
};

// ============================================================================
// PART 3: THE PLANETARY CODEX
// ============================================================================
export const PLANETARY_CODEX: Record<string, any> = {
  "Sun": { title: "Core Power", description: "The central reactor core, vital force, and sovereign identity." },
  "Moon": { title: "Subconscious Radar", description: "Emotional tides, instinctual responses, and deeply ingrained habit patterns." },
  "Mercury": { title: "Data Router", description: "Cognitive processing, communication protocols, and intellectual agility." },
  "Venus": { title: "Cohesion Economics", description: "Resource allocation, aesthetic harmony, and the gravitational pull of relationships." },
  "Mars": { title: "Kinetic Ignition", description: "The engine of action, structural defense, and raw forward momentum." },
  "Jupiter": { title: "Macro-Expansion", description: "Philosophical architecture, venture capital, and the principle of growth." },
  "Saturn": { title: "Load-Bearing Gravity", description: "Time management, executive discipline, strict boundaries, and structural crystallization." },
  "Uranus": { title: "Systemic Upgrades", description: "Disruptive innovation, sudden awakening, and the shattering of obsolete paradigms." },
  "Neptune": { title: "Fluid Dynamics", description: "Visionary solvents, quantum flow, illusion, and access to the Akashic archive." },
  "Pluto": { title: "Core Regeneration", description: "Deep demolition, alchemical transmutation, and the extraction of shadow power." },
  "Earth": { title: "Physical Anchor", description: "The immediate 3D grounding wire, where theoretical blueprints become load-bearing realities." },
  "Chiron": { title: "The Wounded Healer", description: "The systemic fracture that, when repaired, becomes the master key to profound healing." },
  "Ceres": { title: "The Nurturing Matrix", description: "Cycles of harvest, physical sustenance, and the stewardship of the Earth grid." },
  "Pallas": { title: "Strategic Architecture", description: "Pattern recognition, tactical warfare, and creative intelligence." },
  "Juno": { title: "The Contract", description: "Sovereign alliances, marriage, and the balancing of power within partnerships." },
  "Vesta": { title: "The Eternal Flame", description: "Laser-focused dedication, sacred duty, and the preservation of core energy." },
  "Astraea": { title: "The Integration", description: "The inability to let go until absolute perfection and systemic closure are achieved." },
  "Hygiea": { title: "The Purifier", description: "Systemic sanitation, holistic health, and the prevention of operational rot." },
  "Pholus": { title: "The Catalyst", description: "The small action that triggers a massive, irreversible chain reaction." },
  "Eris": { title: "The Disruptor", description: "The exposure of hypocrisy, radical systemic friction, and the fight for the marginalized." },
  "Sedna": { title: "Deep-Time Resilience", description: "Betrayal, immense pressure, and the eventual mastery of the deepest, coldest abysses." },
  "Haumea": { title: "The Generator", description: "Explosive fertility, continuous regeneration, and the birth of new structural forms." },
  "MakeMake": { title: "The Navigator", description: "Self-reliance, connection to natural law, and the preservation of ancestral ecosystems." },
  "Selene": { title: "The Luminous Flow", description: "Pure lunar clarity, subconscious illumination, and unimpeded intuitive reception." },
  "Eros": { title: "The Primal Drive", description: "Raw creative passion, the spark of desire, and intense life-force activation." }
};

// ============================================================================
// PART 4: THE STRUCTURAL PATTERN CODEX
// ============================================================================
export const PATTERN_CODEX: Record<string, any> = {
  "Grand Cross": { title: "The Engine of Friction", description: "Four opposing points creating massive internal tension. It demands absolute structural integrity to operate without tearing itself apart, but generates immense, self-sustaining power." },
  "T-Square": { title: "The Launchpad", description: "A high-pressure triangle missing its fourth leg. It forces all energy to discharge through the apex planet, requiring direct, localized action to resolve." },
  "Stellium": { title: "The Density Node", description: "A massive concentration of planetary mass in one sector, creating a hyper-focused, obsessive gravity well that bends the rest of the chart around it." },
  "Yod": { title: "The Acheulean Arrow", description: "The 'Finger of God.' Two planets providing a stable base that launch intense, fated energy toward a highly specific, unavoidable target point." },
  "Trine (Fire)": { title: "Kinetic Ignition Circuit", description: "A frictionless flow of energy allowing high-velocity ideas to penetrate physical reality with explosive speed and willpower." },
  "Trine (Earth)": { title: "Bedrock Stabilization", description: "A frictionless flow of dense material energy, providing the ultimate structural foundation for permanent, load-bearing construction." },
  "Trine (Air)": { title: "Data Synchronicity", description: "A frictionless flow of intellectual energy, optimizing high-speed communication, logic loops, and the bridging of disparate systems." },
  "Trine (Water)": { title: "Emotional Conduction", description: "A frictionless flow of intuitive energy, allowing for deep psychological reconnaissance and emotional alchemy without resistance." }
};

// ============================================================================
// PART 5: ASSET URL MATRIX
// ============================================================================
export const ASSET_URL_MATRIX: Record<string, string> = {
  // Numerology Folder
  "Life Path 1": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%201.png'),
  "Life Path 2": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%202.png'),
  "Life Path 3": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%203.png'),
  "Life Path 4": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%204.png'),
  "Life Path 5": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%205.png'),
  "Life Path 6": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%206.png'),
  "Life Path 7": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%207.png'),
  "Life Path 8": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%208.png'),
  "Life Path 9": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%209.png'),
  "Life Path 11": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%2011.png'),
  "Life Path 22": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%2022.png'),
  "Life Path 33": getAetherAssetUrl('numerology', 'Aether%20Energy%20-%20Numerology%20-%20Life%20Path%2033.png'),
  
  // Zodiacs Folder
  "Aquarius": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Aquarius.png'),
  "Aries": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Aries.png'), 
  "Cancer": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Cancer.png'),
  "Capricorn": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Capricorn.png'),
  "Gemini": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Gemini.png'),
  "Leo": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Leo.png'),
  "Libra": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Libra.png'),
  "Ophiuchus": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Ophiuchus.png'),
  "Pisces": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Pisces.png'),
  "Sagittarius": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Sagittarius.png'),
  "Scorpio": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Scorpio.png'),
  "Taurus": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Taurus.png'),
  "Virgo": getAetherAssetUrl('zodiacs', 'Aether%20Energy%20-%20Zodiac%20-%20Virgo.png'),

  // Starseeds Folder (Mapping to 'geometry' or 'placements' per instructions? The prompt says /icons /identities /zodiacs /geometry /numerology /placements. Let's use 'geometry' for Starseeds if there's no starseeds folder, or maybe just 'starseeds'. Wait, the prompt didn't list 'starseeds'. Let's keep the original URL for starseeds or map it to 'geometry' if required. I'll just use 'geometry' for now, or wait, Vercel Blob probably has a Starseeds folder. The prompt explicitly says: "The routing logic must actively support and map to the following storage directories: /icons /identities /zodiacs /geometry /numerology /placements". I will add 'starseeds' to the AssetCategory type in assets.ts to be safe.)
  "Andromedan": getAetherAssetUrl('starseeds' as any, 'Aether%20Energy%20-%20Starseed%20-%20Andromedan%20%28The%20Freedom%20Seekers%29.png'),
  "Arcturian": getAetherAssetUrl('starseeds' as any, 'Aether%20Energy%20-%20Starseed%20-%20Arcturian%20%28The%20Visionaries%29.png'),
  "Lemurian & Atlantean": getAetherAssetUrl('starseeds' as any, 'Aether%20Energy%20-%20Starseed%20-%20Lemurian%20%26%20Atlantean%20%28The%20Earth%20Keepers%20%26%20Alchemists%29.png'),
  "Lyran": getAetherAssetUrl('starseeds' as any, 'Aether%20Energy%20-%20Starseed%20-%20Lyran%20%28The%20Pioneers%29.png'),
  "Mintakan": getAetherAssetUrl('starseeds' as any, 'Aether%20Energy%20-%20Starseed%20-%20Mintakan%20%28The%20Original%20Lightworkers%29.png'),
  "Orion": getAetherAssetUrl('starseeds' as any, 'Aether%20Energy%20-%20Starseed%20-%20Orion%20%28The%20Alchemists%29.png'),
  "Pleiadian": getAetherAssetUrl('starseeds' as any, 'Aether%20Energy%20-%20Starseed%20-%20Pleiadian%20%28The%20Healers%29.png'),
  "Sirian": getAetherAssetUrl('starseeds' as any, 'Aether%20Energy%20-%20Starseed%20-%20Sirian%20%28The%20Knowledge%20Keepers%29.png'),
  "Venusian": getAetherAssetUrl('starseeds' as any, 'Aether%20Energy%20-%20Starseed%20-%20Venusian%20%28The%20Harmonizers%29.png'),
  
  // Sacred Geometry Folder
  "Metatron's Cube": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20Metatron%E2%80%99s%20Cube.png'),
  "The Circle & The Monad": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20The%20Circle%20%28The%20Monad-The%20Void%29.png'),
  "The Hexagon": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20The%20Hexagon%20%28The%20Double-6%20Seal%29.png'),
  "The Merkaba": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20The%20Merkaba%20%28The%20Star%20Tetrahedron%29.png'),
  "The Pyramid": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20The%20Pyramid.png'),
  "The Seed of Life & The Flower of Life": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20The%20Seed%20of%20Life%20%26%20The%20Flower%20of%20Life.png'),
  "The Square": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20The%20Square%20%28The%20Base-4%20Grounding%20Wire%29.png'),
  "The Torus": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20The%20Torus%20%28The%20Infinite%20Loop%29.png'),
  "The Tree of Life": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20The%20Tree%20of%20Life%20%28The%20Biological%20Motherboard%29.png'),
  "The Triangle": getAetherAssetUrl('geometry', 'Aether%20Energy%20-%20Sacred%20Geometry%20-%20The%20Triangle%20%28The%20Catalyst%29.png')
};

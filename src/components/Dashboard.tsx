import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lock, Unlock, Star, Moon, Sun, Activity, Beaker, Layers, Radio, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HorizonRadar from './HorizonRadar';
import ErrorBoundary from './ErrorBoundary';
import AetherLogo from './AetherLogo';

// Mock Celestial JSON Payload (Simulating API Response)
const mockCelestialData = {
  numerology: {
    lifePath: 7,
    expression: 9,
    interpretation: "Your Life Path 7 indicates a journey of seeking truth, wisdom, and understanding. The Expression 9 suggests a humanitarian approach, driven by compassion and universal love. Together, these vibrations create a powerful resonance for teaching, healing, and uncovering the deeper mysteries of the Aether."
  },
  placements: [
    { planet: 'Sun', sign: 'Scorpio', degree: '15°' },
    { planet: 'Moon', sign: 'Taurus', degree: '22°' },
    { planet: 'Mercury', sign: 'Sagittarius', degree: '5°' },
    { planet: 'Venus', sign: 'Libra', degree: '12°' },
    { planet: 'Mars', sign: 'Aries', degree: '28°' },
    { planet: 'Jupiter', sign: 'Cancer', degree: '14°' },
    { planet: 'Saturn', sign: 'Capricorn', degree: '9°' },
  ],
  angles: {
    ascendant: { sign: 'Capricorn', degree: '10°' },
    midheaven: { sign: 'Scorpio', degree: '2°' },
    houses: "Calculated successfully based on precise temporal coordinates."
  },
  vaults: {
    sidereal: {
      title: "The Soul & Spirit Vessel",
      subtitle: "Sidereal Resonance",
      placements: [
        { planet: 'Sun', sign: 'Libra', degree: '21°' },
        { planet: 'Moon', sign: 'Aries', degree: '28°' },
        { planet: 'Mercury', sign: 'Scorpio', degree: '11°', isRetrograde: true },
        { planet: 'Venus', sign: 'Virgo', degree: '18°' },
        { planet: 'Mars', sign: 'Pisces', degree: '4°' },
      ],
      aspects: [
        { type: 'Trine', planets: 'Sun - Mars', orb: '2°' },
        { type: 'Square', planets: 'Moon - Saturn', orb: '4°' }
      ]
    },
    draconic: {
      title: "The Spark & Core Intent",
      subtitle: "Draconic Matrix",
      placements: [
        { planet: 'Sun', sign: 'Gemini', degree: '5°' },
        { planet: 'Moon', sign: 'Sagittarius', degree: '12°' },
        { planet: 'Mercury', sign: 'Cancer', degree: '25°' },
        { planet: 'Venus', sign: 'Taurus', degree: '2°', isRetrograde: true },
        { planet: 'Mars', sign: 'Leo', degree: '18°' },
      ],
      aspects: [
        { type: 'Opposition', planets: 'Sun - Moon', orb: '7°' },
        { type: 'Trine', planets: 'Venus - Saturn', orb: '1°' }
      ]
    },
    heliocentric: {
      title: "The Source & Solar Mission",
      subtitle: "Heliocentric Coordinates",
      placements: [
        { planet: 'Earth', sign: 'Taurus', degree: '15°' },
        { planet: 'Mercury', sign: 'Aries', degree: '2°' },
        { planet: 'Venus', sign: 'Pisces', degree: '22°' },
        { planet: 'Mars', sign: 'Libra', degree: '28°' },
        { planet: 'Jupiter', sign: 'Capricorn', degree: '14°', isRetrograde: true },
      ],
      aspects: [
        { type: 'Square', planets: 'Earth - Mars', orb: '3°' },
        { type: 'Sextile', planets: 'Mercury - Jupiter', orb: '2°' }
      ]
    }
  }
};

export const ALL_ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function Dashboard({ payload, onEnterAxiom, onRecalibrate }: { payload: any, onEnterAxiom?: () => void, onRecalibrate: () => void }) {
  const [viewMode, setViewMode] = useState<'blueprint' | 'radar'>('blueprint');
  
  // Handle both the new MDV structure and fallback to old structure if needed
  const pii = payload?.pii || payload || {};
  const isDefaultTime = pii.isDefaultTime ?? true;
  
  const celestialData = {
    numerology: payload?.numerology,
    placements: payload?.matrices?.tropical,
    angles: payload?.matrices?.angles,
    vaults: payload?.matrices?.vaults
  };

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-nebula-purple/30 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-4">
            <AetherLogo className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-bold text-astral-gold tracking-widest uppercase mb-2">Aether Grid Active</h1>
              <p className="text-ash-grey text-sm tracking-widest uppercase">
                Telemetry Synchronized for {pii.firstName ?? 'Traveler'}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {onEnterAxiom && (
              <button 
                onClick={onEnterAxiom}
                className="flex items-center justify-center gap-2 bg-nebula-purple/20 hover:bg-nebula-purple/40 text-nebula-purple border border-nebula-purple/50 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest text-xs font-bold w-full sm:w-auto"
              >
                <Beaker className="w-4 h-4" />
                Theoretical Axiom
              </button>
            )}
            <button 
              onClick={onRecalibrate}
              className="flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest text-xs font-bold w-full sm:w-auto"
            >
              <RefreshCcw className="w-4 h-4" />
              Recalibrate
            </button>
          </div>
        </header>

        {/* View Mode Toggle */}
        <div className="flex bg-black/50 p-1 rounded-lg border border-ash-grey/10 w-full max-w-md mx-auto">
          <button
            onClick={() => setViewMode('blueprint')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === 'blueprint' 
                ? 'bg-obsidian text-astral-gold shadow-md border border-astral-gold/30' 
                : 'text-ash-grey hover:text-starlight-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            The Blueprint
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === 'radar' 
                ? 'bg-obsidian text-nebula-purple shadow-md border border-nebula-purple/30' 
                : 'text-ash-grey hover:text-starlight-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            The Radar
          </button>
        </div>

        {viewMode === 'blueprint' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <NumerologyCard data={celestialData?.numerology} />
            <TropicalPlacidusCard data={celestialData} isDefaultTime={isDefaultTime} />
            <OpenConductorsCard placements={celestialData?.placements} />
            
            {/* Progressive Disclosure Vaults */}
            {celestialData?.vaults && (
              <div className="pt-8 space-y-4 border-t border-ash-grey/10">
                <h3 className="text-ash-grey text-xs tracking-widest uppercase mb-4 text-center">Encrypted Sectors</h3>
                <VaultCard data={celestialData.vaults.sidereal} />
                <VaultCard data={celestialData.vaults.draconic} />
                <VaultCard data={celestialData.vaults.heliocentric} />
              </div>
            )}
          </div>
        ) : (
          <ErrorBoundary>
            <HorizonRadar payload={payload} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

export function NumerologyCard({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) {
    return <UnavailableCard title="Numerology Resonance" />;
  }

  return (
    <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-6 shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-nebula-purple"></span>
          Numerology Resonance
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/30 p-4 rounded-lg border border-ash-grey/5">
          <p className="text-ash-grey text-xs uppercase tracking-wider mb-1">Life Path</p>
          <p className="text-3xl font-bold text-astral-gold">{data?.lifePath ?? '?'}</p>
        </div>
        <div className="bg-black/30 p-4 rounded-lg border border-ash-grey/5">
          <p className="text-ash-grey text-xs uppercase tracking-wider mb-1">Expression</p>
          <p className="text-3xl font-bold text-astral-gold">{data?.expression ?? '?'}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-ash-grey/10 pt-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left text-sm text-starlight-white hover:text-astral-gold transition-colors uppercase tracking-wider"
        >
          <span>Interpretation Matrix</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isExpanded && (
          <div className="mt-4 text-ash-grey text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            {data?.interpretation ?? 'Interpretation unavailable.'}
          </div>
        )}
      </div>
    </section>
  );
}

export function TropicalPlacidusCard({ data, isDefaultTime }: { data: any, isDefaultTime: boolean }) {
  if (!data?.placements) {
    return <UnavailableCard title="Tropical Placidus" />;
  }

  return (
    <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-6 shadow-lg">
      <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-nebula-purple"></span>
        Tropical Placidus
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {data.placements.map((p: any, idx: number) => (
          <div key={idx} className="bg-black/30 p-3 rounded-lg border border-ash-grey/5 flex justify-between items-center">
            <span className="text-starlight-white text-sm">{p?.planet ?? 'Unknown'}</span>
            <div className="text-right">
              <span className="text-astral-gold text-xs block uppercase tracking-wider">{p?.sign ?? '---'}</span>
              <span className="text-ash-grey text-[10px]">{p?.degree ?? '0°'}</span>
            </div>
          </div>
        ))}
      </div>

      {!isDefaultTime && data?.angles ? (
        <AscendantData angles={data.angles} />
      ) : (
        <div className="bg-nebula-purple/10 border border-nebula-purple/30 rounded-lg p-4 text-center">
          <p className="text-nebula-purple text-xs uppercase tracking-widest">
            Temporal Coordinates Imprecise (12:00 PM Default)
          </p>
          <p className="text-ash-grey text-[10px] mt-1">
            Ascendant, Midheaven, and House calculations hidden to preserve structural integrity.
          </p>
        </div>
      )}
    </section>
  );
}

export function AscendantData({ angles }: { angles: any }) {
  return (
    <div className="border-t border-ash-grey/10 pt-6 mt-2">
      <h3 className="text-ash-grey text-xs tracking-widest uppercase mb-4">Angular Coordinates</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/30 p-4 rounded-lg border border-astral-gold/20">
          <p className="text-ash-grey text-xs uppercase tracking-wider mb-1">Ascendant</p>
          <p className="text-lg font-bold text-starlight-white">{angles?.ascendant?.sign ?? '---'}</p>
          <p className="text-astral-gold text-xs">{angles?.ascendant?.degree ?? '0°'}</p>
        </div>
        <div className="bg-black/30 p-4 rounded-lg border border-astral-gold/20">
          <p className="text-ash-grey text-xs uppercase tracking-wider mb-1">Midheaven</p>
          <p className="text-lg font-bold text-starlight-white">{angles?.midheaven?.sign ?? '---'}</p>
          <p className="text-astral-gold text-xs">{angles?.midheaven?.degree ?? '0°'}</p>
        </div>
      </div>
      <p className="text-ash-grey text-[10px] mt-4 text-center italic">
        {angles?.houses ?? 'House data computed.'}
      </p>
    </div>
  );
}

export function OpenConductorsCard({ placements }: { placements: any[] }) {
  if (!placements) return <UnavailableCard title="Open Conductors" />;

  const occupiedSigns = placements.map(p => p?.sign).filter(Boolean);
  const openSigns = ALL_ZODIAC_SIGNS.filter(sign => !occupiedSigns.includes(sign));

  return (
    <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-6 shadow-lg">
      <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-nebula-purple"></span>
        Open Conductors
      </h2>
      <p className="text-ash-grey text-xs mb-6">
        Unassigned zodiac sectors representing latent energetic pathways available for conscious integration.
      </p>
      
      <div className="flex flex-wrap gap-2">
        {openSigns.length > 0 ? (
          openSigns.map(sign => (
            <span key={sign} className="px-3 py-1 bg-black/50 border border-ash-grey/20 rounded-full text-ash-grey text-xs tracking-wider uppercase">
              {sign}
            </span>
          ))
        ) : (
          <span className="text-astral-gold text-xs uppercase tracking-widest">All sectors currently conducting.</span>
        )}
      </div>
    </section>
  );
}

export function VaultCard({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!data) return null;

  return (
    <motion.div 
      layout
      className={`bg-obsidian border rounded-xl overflow-hidden transition-all duration-500 ${
        isOpen 
          ? 'border-astral-gold/50 shadow-[0_0_30px_rgba(245,208,97,0.15)]' 
          : 'border-ash-grey/20 shadow-md hover:border-ash-grey/40'
      }`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
            isOpen ? 'bg-astral-gold/10 border border-astral-gold/50' : 'bg-black/50 border border-ash-grey/20 group-hover:border-ash-grey/50'
          }`}>
            {isOpen ? (
              <Unlock className="w-4 h-4 text-astral-gold" />
            ) : (
              <Lock className="w-4 h-4 text-ash-grey group-hover:text-starlight-white transition-colors" />
            )}
          </div>
          <div className="text-left">
            <h3 className={`text-sm font-semibold tracking-widest uppercase transition-colors duration-500 ${
              isOpen ? 'text-astral-gold' : 'text-starlight-white'
            }`}>
              {data.title}
            </h3>
            <p className="text-[10px] text-ash-grey tracking-widest uppercase mt-1">{data.subtitle}</p>
          </div>
        </div>
        <div className="text-ash-grey">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-astral-gold/20"
          >
            <div className="p-6 space-y-6">
              {/* Placements Matrix */}
              <div>
                <h4 className="text-nebula-purple text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Celestial Coordinates
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {data.placements?.map((p: any, idx: number) => (
                    <div key={idx} className="bg-black/40 p-3 rounded-lg border border-astral-gold/10 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-starlight-white text-sm">{p.planet}</span>
                        {p.isRetrograde && (
                          <span className="text-nebula-purple text-[10px] font-bold" title="Retrograde">Rx</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-astral-gold text-xs block uppercase tracking-wider">{p.sign}</span>
                        <span className="text-ash-grey text-[10px]">{p.degree}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aspects Matrix */}
              {data.aspects && data.aspects.length > 0 && (
                <div>
                  <h4 className="text-nebula-purple text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2">
                    <Star className="w-3 h-3" />
                    Significant Aspects
                  </h4>
                  <div className="space-y-2">
                    {data.aspects.map((aspect: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-black/20 px-4 py-2 rounded border border-ash-grey/5">
                        <span className="text-starlight-white text-xs uppercase tracking-wider">{aspect.type}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-astral-gold text-xs">{aspect.planets}</span>
                          <span className="text-ash-grey text-[10px] w-8 text-right">{aspect.orb}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function UnavailableCard({ title }: { title: string }) {
  return (
    <section className="bg-obsidian border border-red-900/30 rounded-xl p-6 shadow-lg">
      <h2 className="text-red-500/70 font-semibold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500/70"></span>
        {title}
      </h2>
      <p className="text-ash-grey text-xs uppercase tracking-widest">Telemetry Unavailable</p>
    </section>
  );
}

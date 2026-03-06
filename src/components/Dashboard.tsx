import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Lock, Unlock, Star, Moon, Sun, Activity, Beaker, Layers, Radio, RefreshCcw, Sparkles, CircleDot, Orbit, Asterisk, Network, Fingerprint, Wind, Hexagon, Globe, Download, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HorizonRadar from './HorizonRadar';
import ErrorBoundary from './ErrorBoundary';
import AetherLogo from './AetherLogo';
import { generateCharacteristics } from '../utils/geminiClient';
import { exportCodexPDF } from '../utils/exportEngine';

export const ALL_ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// ---------------------------------------------------------------------------
// THE GLYPH DICTIONARIES: Universal Esoteric Unicode
// ---------------------------------------------------------------------------
const planetSymbols: Record<string, string> = {
  'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂',
  'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇',
  'Earth': '⊕', 'Chiron': '⚷', 'North Node': '☊', 'South Node': '☋', 
  'Part of Fortune': '⊗', 'Ceres': '⚳', 'Pallas': '⚴', 'Juno': '⚵', 'Vesta': '⚶'
};

const zodiacSymbols: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏', 
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

// Structural Helper: Sorts raw celestial data into hierarchical pillars
const categorizePlacements = (placements: any[] = []) => {
  const luminaries: any[] = [];
  const majors: any[] = [];
  const minors: any[] = [];

  placements.forEach(p => {
    const name = p?.planet || '';
    if (['Sun', 'Moon', 'Earth'].includes(name)) {
      luminaries.push(p);
    } else if (['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(name)) {
      majors.push(p);
    } else {
      minors.push(p);
    }
  });

  return { luminaries, majors, minors };
};

export default function Dashboard({ payload, onEnterAxiom, onRecalibrate }: { payload: any, onEnterAxiom?: () => void, onRecalibrate: () => void }) {
  const [viewMode, setViewMode] = useState<'blueprint' | 'radar'>('blueprint');
  
  const pii = payload?.pii || payload || {};
  const isDefaultTime = pii.isDefaultTime === true;
  
  const celestialData = {
    numerology: payload?.numerology,
    starseed: payload?.matrices?.starseed,
    placements: payload?.matrices?.tropical,
    angles: payload?.matrices?.angles,
    aspects: payload?.matrices?.aspects || [],
    patterns: payload?.matrices?.patterns || [],
    voids: payload?.matrices?.voids || [],
    vaults: payload?.matrices?.vaults
  };

  const executeDataExtraction = () => {
    exportCodexPDF(payload, pii);
  };

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-6 font-sans w-full max-w-full overflow-x-hidden">
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        <header className="border-b border-ash-grey/20 pb-4 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-4">
            <AetherLogo className="w-12 h-12 md:w-16 md:h-16" />
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-starlight-white tracking-widest uppercase mb-1 md:mb-2 flex items-center gap-3">
                <Layers className="w-6 h-6 md:w-8 md:h-8 text-nebula-purple" /> Master Blueprint
              </h1>
              <p className="text-ash-grey text-sm tracking-widest uppercase">
                {pii.firstName} {pii.lastName} // Origin Coordinates Locked
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Tactical Data Exfiltration Button */}
            <button onClick={executeDataExtraction} className="flex items-center justify-center gap-2 bg-astral-gold/20 hover:bg-astral-gold/40 text-astral-gold border border-astral-gold/50 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest text-xs font-bold w-full sm:w-auto">
              <Download className="w-4 h-4" /> Extract Codex
            </button>

            {onEnterAxiom && (
              <button onClick={onEnterAxiom} className="flex items-center justify-center gap-2 bg-nebula-purple/20 hover:bg-nebula-purple/40 text-nebula-purple border border-nebula-purple/50 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest text-xs font-bold w-full sm:w-auto">
                <Beaker className="w-4 h-4" /> Theoretical Axiom
              </button>
            )}
            <button onClick={() => {
              const event = new CustomEvent('navigateGlobalGrid');
              window.dispatchEvent(event);
            }} className="flex items-center justify-center gap-2 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/50 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest text-xs font-bold w-full sm:w-auto">
              <Globe className="w-4 h-4" /> Cultural Matrix
            </button>
            <button onClick={() => {
                if (window.confirm("Are you sure you want to disconnect and clear the current calculation matrix?")) {
                  localStorage.removeItem('aether_guest');
                  localStorage.removeItem('aether_google_auth');
                  onRecalibrate();
                }
              }} className="flex items-center justify-center gap-2 bg-obsidian hover:bg-black/50 text-ash-grey border border-ash-grey/20 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest text-xs font-bold w-full sm:w-auto">
              <RefreshCcw className="w-4 h-4" /> Recalibrate
            </button>
          </div>
        </header>

        {/* View Mode Toggle */}
        <div className="flex bg-black/50 p-1 rounded-lg border border-ash-grey/10 w-full max-w-md mx-auto">
          <button onClick={() => setViewMode('blueprint')} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'blueprint' ? 'bg-obsidian text-astral-gold shadow-md border border-astral-gold/30' : 'text-ash-grey hover:text-starlight-white'}`}>
            <Layers className="w-4 h-4" /> The Blueprint
          </button>
          <button onClick={() => setViewMode('radar')} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'radar' ? 'bg-obsidian text-nebula-purple shadow-md border border-nebula-purple/30' : 'text-ash-grey hover:text-starlight-white'}`}>
            <Radio className="w-4 h-4" /> The Radar
          </button>
        </div>

        {/* --- DECOMPRESSED VERTICAL STACK --- */}
        {viewMode === 'blueprint' ? (
          <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
            
            <NumerologyCard data={celestialData?.numerology} />
            <StarseedCard data={celestialData?.placements ? payload?.matrices?.starseed : null} />
            <SacredGeometryCard data={celestialData?.placements ? payload?.matrices?.sacredGeometry : null} />
            
            {/* --- IDENTITY MATRICES (PASTE REAL BLOB URLS HERE) --- */}
            <IdentityMatrixCard 
              title="Tropical Placidus" 
              subtitle="The Persona" 
              data={celestialData} 
              isDefaultTime={isDefaultTime} 
              imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-mind.jpg" 
              isPrimary 
            />

            <div className="relative mt-8 md:mt-12 mb-4 md:mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ash-grey/20"></div></div>
              <div className="relative flex justify-center">
                <span className="bg-obsidian px-4 text-ash-grey text-xs md:text-sm uppercase tracking-widest font-bold flex items-center gap-2 border border-ash-grey/20 rounded-full py-1">
                  <Lock className="w-3 h-3 md:w-4 md:h-4" /> Encrypted Sectors
                </span>
              </div>
            </div>

            <IdentityMatrixCard 
              title="Standard Sidereal Lahiri" 
              subtitle="The Soul Vessel" 
              data={celestialData.vaults?.sidereal} 
              imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-soul.jpg" 
              isEncrypted 
            />
            <IdentityMatrixCard 
              title="Draconic" 
              subtitle="The Spark" 
              data={celestialData.vaults?.draconic} 
              imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-spark.jpg" 
              isEncrypted 
            />
            <IdentityMatrixCard 
              title="Heliocentric" 
              subtitle="The Source" 
              data={celestialData.vaults?.heliocentric} 
              imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-source.jpg" 
              isEncrypted 
            />
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

// ---------------------------------------------------------------------------
// HIERARCHICAL MATRIX COMPONENTS
// ---------------------------------------------------------------------------

export function IdentityMatrixCard({ title, subtitle, data, isDefaultTime = false, imageSrc, isPrimary = false, isEncrypted = false }: any) {
  const [isExpanded, setIsExpanded] = useState(isPrimary);

  if (!data || !data.placements) return <UnavailableCard title={title} />;

  // SEPARATE MAJORS AND MINORS
  const MAJORS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];
  const majorPlacements = data.placements.filter((p: any) => MAJORS.includes(p.planet));
  const minorPlacements = data.placements.filter((p: any) => !MAJORS.includes(p.planet));

  // PATTERN SYMBOLS
  const getPatternIcon = (name: string) => {
    if (name.includes('Cross')) return '⌖';
    if (name.includes('Square') || name.includes('Stellium')) return '⊤';
    if (name.includes('Trine')) return '△';
    if (name.includes('Yod')) return '⇡';
    return '✧';
  };

  return (
    <section className="bg-obsidian border border-ash-grey/20 rounded-xl overflow-hidden shadow-lg transition-all">
      <div className="flex flex-col md:flex-row">
        {imageSrc && (
          <div className="w-full md:w-1/4 lg:w-1/5 bg-black relative min-h-[120px] md:min-h-[auto] border-b md:border-b-0 md:border-r border-ash-grey/20">
            <img src={imageSrc} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent"></div>
          </div>
        )}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex items-start justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isEncrypted ? <Lock className="w-4 h-4 text-nebula-purple" /> : <Unlock className="w-4 h-4 text-astral-gold" />}
                <p className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase">{subtitle}</p>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-starlight-white uppercase tracking-wider">{title}</h2>
              {isDefaultTime && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Time unknown. Angles unverified.</p>}
            </div>
            <button className="text-ash-grey hover:text-starlight-white transition-colors p-2">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {isExpanded && (
            <div className="mt-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              
              <PlacementSection title="Major Planetary Bodies" icon={<Sun className="w-4 h-4 text-astral-gold" />} placements={majorPlacements} fallback="Awaiting geometric mapping." />
              
              {minorPlacements.length > 0 && (
                <PlacementSection title="Minor Celestial Objects" icon={<Asterisk className="w-4 h-4 text-nebula-purple" />} placements={minorPlacements} fallback="Awaiting deep-space telemetry scan." />
              )}

              {data.angles && <AscendantData angles={data.angles} />}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-ash-grey/10">
                <div>
                  <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Orbit className="w-4 h-4 text-astral-gold" /> Major Aspects
                  </h3>
                  {data.aspects && data.aspects.length > 0 ? (
                    <div className="space-y-2">
                      {data.aspects.map((aspect: any, idx: number) => (
                        <div key={idx} className="bg-black/30 p-2 md:p-3 rounded border border-ash-grey/5 flex justify-between items-center text-[10px] md:text-xs">
                          <span className="text-starlight-white font-medium">{aspect.type}</span>
                          <span className="text-astral-gold">{aspect.planets}</span>
                          <span className="text-ash-grey">{aspect.orb}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-ash-grey text-[10px] italic">Awaiting geometric mapping.</p>}
                </div>

                <div>
                  <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
                    <CircleDot className="w-4 h-4 text-nebula-purple" /> Structural Patterns
                  </h3>
                  {data.patterns && data.patterns.length > 0 ? (
                    <div className="space-y-3">
                      {data.patterns.map((pattern: any, idx: number) => (
                        <div key={idx} className="bg-black/30 p-3 rounded border border-ash-grey/5">
                          <h4 className="text-starlight-white font-bold text-sm flex items-center gap-2 mb-1">
                            <span className="text-astral-gold text-lg">{getPatternIcon(pattern.name)}</span> {pattern.name}
                          </h4>
                          <p className="text-ash-grey text-[10px] md:text-xs leading-relaxed">{pattern.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-ash-grey text-[10px] italic">Awaiting geometric mapping.</p>}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function PlacementSection({ title, icon, placements, fallback }: any) {
  if (!placements || placements.length === 0) return null;

  return (
    <div className="mb-4 md:mb-6">
      <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-3 md:mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {placements.map((p: any, idx: number) => (
          <div key={idx} className="bg-black/30 p-2 md:p-3 rounded border border-ash-grey/5 flex flex-col xl:flex-row xl:justify-between xl:items-center text-[10px] md:text-xs gap-1 overflow-hidden">
            <span className="text-starlight-white font-medium truncate">{p.planet}</span>
            <div className="flex items-center gap-1.5 xl:justify-end min-w-0">
              <span className="text-astral-gold uppercase tracking-wider truncate max-w-[75px] sm:max-w-none" title={p.sign}>
                {p.sign}
              </span>
              <span className="text-ash-grey font-mono whitespace-nowrap shrink-0">{p.degree}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sub-Component: List Rendering for Aspects/Patterns/Voids
function ListSection({ title, icon, items, renderItem, fallback }: { title: string, icon: React.ReactNode, items: any[], renderItem: Function, fallback: string }) {
  return (
    <div className="pt-2">
      <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2">
        {icon} {title}
      </h3>
      {items && items.length > 0 ? (
        <div className="space-y-2">{items.map((item, idx) => renderItem(item, idx))}</div>
      ) : (
        <p className="text-ash-grey text-[10px] italic px-2">{fallback}</p>
      )}
    </div>
  );
}

// ... (Keep existing NumerologyCard, AscendantData, UnavailableCard exactly as they were below this point)
export function NumerologyCard({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return <UnavailableCard title="Numerology Resonance" />;

  return (
    <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-4 md:p-6 shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-nebula-purple"></span> Numerology Resonance
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
        <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-ash-grey/5">
          <p className="text-ash-grey text-[10px] md:text-xs uppercase tracking-wider mb-1">Life Path</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-astral-gold">{data?.lifePath ?? '?'}</p>
          <p className="text-[8px] text-ash-grey/60 uppercase mt-1">Calculated via Date of Birth</p>
        </div>
        <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-ash-grey/5">
          <p className="text-ash-grey text-[10px] md:text-xs uppercase tracking-wider mb-1">Destiny</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-astral-gold">{data?.destiny ?? '?'}</p>
          <p className="text-[8px] text-ash-grey/60 uppercase mt-1">Calculated via Full Legal Name</p>
        </div>
        <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-ash-grey/5">
          <p className="text-ash-grey text-[10px] md:text-xs uppercase tracking-wider mb-1">Soul Urge</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-astral-gold">{data?.soulUrge ?? '?'}</p>
          <p className="text-[8px] text-ash-grey/60 uppercase mt-1">Calculated via Name Vowels</p>
        </div>
        <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-ash-grey/5">
          <p className="text-ash-grey text-[10px] md:text-xs uppercase tracking-wider mb-1">Personality</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-astral-gold">{data?.personality ?? '?'}</p>
          <p className="text-[8px] text-ash-grey/60 uppercase mt-1">Calculated via Name Consonants</p>
        </div>
      </div>

      <div className="mt-4 border-t border-ash-grey/10 pt-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-left text-sm text-starlight-white hover:text-astral-gold transition-colors uppercase tracking-wider">
          <span>Interpretation Matrix</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <div className="mt-4 text-ash-grey text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            {Array.isArray(data?.interpretation) ? (
              <ul className="space-y-3">
                {data.interpretation.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-astral-gold mt-1 text-xs">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="whitespace-pre-wrap">{data?.interpretation ?? 'Interpretation unavailable.'}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function AscendantData({ angles }: { angles: any }) {
  if (!angles) return null;

  // Render the angular coordinates with extreme overflow protection
  const AngleBox = ({ title, data }: { title: string, data: any }) => (
    <div className="bg-black/30 p-2 md:p-4 rounded-lg border border-astral-gold/20 overflow-hidden flex flex-col justify-center">
      <p className="text-ash-grey text-[9px] md:text-xs uppercase tracking-wider mb-1 truncate">{title}</p>
      
      <div className="flex flex-wrap items-center gap-1 md:gap-2 w-full min-w-0">
        <p className="text-sm md:text-lg font-bold text-starlight-white truncate max-w-[70%] md:max-w-[80%]" title={data?.sign}>
          {data?.sign ?? '---'} 
        </p>
        {/* If you are passing symbols into this component, they will render safely next to the truncated text */}
      </div>
      
      <p className="text-astral-gold text-[10px] md:text-xs mt-1 shrink-0">{data?.degree ?? '0°'}</p>
    </div>
  );

  return (
    <div className="border-t border-ash-grey/10 pt-4 md:pt-6 mt-2">
      <h3 className="text-ash-grey text-[10px] md:text-xs tracking-widest uppercase mb-3 md:mb-4">Angular Coordinates</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        <AngleBox title="Ascendant (ASC)" data={angles.ascendant} />
        <AngleBox title="Descendant (DSC)" data={angles.descendant} />
        <AngleBox title="Midheaven (MC)" data={angles.midheaven} />
        <AngleBox title="Imum Coeli (IC)" data={angles.imumCoeli} />
        <AngleBox title="North Node" data={angles.northNode} />
        <AngleBox title="South Node" data={angles.southNode} />
      </div>
      <p className="text-ash-grey text-[10px] mt-4 text-center italic">{angles.houses ?? 'House data computed.'}</p>
    </div>
  );
}

export function UnavailableCard({ title }: { title: string }) {
  return (
    <section className="bg-obsidian border border-red-900/30 rounded-xl p-6 shadow-lg">
      <h2 className="text-red-500/70 font-semibold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500/70"></span> {title}
      </h2>
      <p className="text-ash-grey text-xs uppercase tracking-widest">Telemetry Unavailable</p>
    </section>
  );
}

export function StarseedCard({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return null;

  return (
    <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-4 md:p-6 shadow-lg transition-all h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2">
          <Network className="w-4 h-4 text-astral-gold" /> Starseed Origin
        </h2>
      </div>
      
      <div className="flex-1 bg-black/30 p-4 rounded-lg border border-ash-grey/5 mb-4">
        <p className="text-nebula-purple text-[10px] md:text-xs uppercase tracking-wider mb-1">Primary Vector</p>
        <p className="text-lg md:text-xl font-bold text-starlight-white leading-tight mb-2">{data.origin}</p>
        <p className="text-astral-gold text-[10px] uppercase tracking-widest font-mono">{data.title}</p>
      </div>

      <div className="mt-auto border-t border-ash-grey/10 pt-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-left text-sm text-starlight-white hover:text-astral-gold transition-colors uppercase tracking-wider">
          <span>Origin Telemetry</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <div className="mt-4 text-ash-grey text-xs md:text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
            {/* STRUCTURAL UPGRADE: Bullet Point Rendering */}
            {Array.isArray(data.description) ? (
              <ul className="space-y-2">
                {data.description.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-astral-gold mt-0.5 text-xs">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{data.description}</p>
            )}
            <div className="pt-3 border-t border-ash-grey/10">
              <p className="text-starlight-white text-[10px] uppercase tracking-widest font-bold mb-2">Active Operational Traits:</p>
              <div className="flex flex-wrap gap-2">
                {data.traits?.map((trait: string, idx: number) => (
                  <span key={idx} className="text-[9px] uppercase tracking-widest border border-ash-grey/20 bg-black/50 text-ash-grey px-2 py-1 rounded">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function SacredGeometryCard({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return null;

  return (
    <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-4 md:p-6 shadow-lg transition-all h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2">
          <Hexagon className="w-4 h-4 text-emerald-400" /> Sacred Geometry
        </h2>
      </div>
      
      <div className="flex-1 bg-black/30 p-4 rounded-lg border border-ash-grey/5 mb-4">
        <p className="text-nebula-purple text-[10px] md:text-xs uppercase tracking-wider mb-1">Architectural Form</p>
        <p className="text-lg md:text-xl font-bold text-starlight-white leading-tight mb-2">{data.shape}</p>
        <p className="text-emerald-400 text-[10px] uppercase tracking-widest font-mono">{data.principle}</p>
      </div>

      <div className="mt-auto border-t border-ash-grey/10 pt-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-left text-sm text-starlight-white hover:text-astral-gold transition-colors uppercase tracking-wider">
          <span>Structural Analysis</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <div className="mt-4 text-ash-grey text-xs md:text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
            {/* STRUCTURAL UPGRADE: Bullet Point Rendering */}
            {Array.isArray(data.description) ? (
              <ul className="space-y-2">
                {data.description.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 text-xs">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{data.description}</p>
            )}
            <div className="pt-3 border-t border-ash-grey/10">
               <p className="text-starlight-white text-[10px] uppercase tracking-widest font-bold mb-2">Energetic Resonance / Elemental Lock:</p>
               <span className="text-[9px] uppercase tracking-widest border border-emerald-500/20 bg-emerald-900/10 text-emerald-400 px-2 py-1 rounded inline-block">
                  {data.resonance}
               </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

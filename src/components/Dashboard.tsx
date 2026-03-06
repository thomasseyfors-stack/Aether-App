import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Lock, Unlock, Star, Moon, Sun, Activity, Beaker, Layers, Radio, RefreshCcw, Sparkles, CircleDot, Orbit, Asterisk, Network, Fingerprint, Wind, Hexagon, Globe, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HorizonRadar from './HorizonRadar';
import ErrorBoundary from './ErrorBoundary';
import AetherLogo from './AetherLogo';
import { generateCharacteristics } from '../utils/geminiClient';

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

  // Tactical Data Exfiltration (PDF Print Render)
  const executeDataExtraction = () => {
    // This triggers the browser's native print dialog. 
    // The @media print CSS in index.css will handle the dark-mode formatting and hide the UI buttons.
    window.print();
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
  const [isOpen, setIsOpen] = useState(!isEncrypted);
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  const [oracleText, setOracleText] = useState<string | null>(null);
  const [isLoadingOracle, setIsLoadingOracle] = useState(false);

  useEffect(() => {
    if (isOracleOpen && !oracleText && !isLoadingOracle && data) {
      setIsLoadingOracle(true);
      generateCharacteristics(data, subtitle || title)
        .then(res => { setOracleText(res); setIsLoadingOracle(false); })
        .catch(() => { setOracleText("Oracle connection interrupted."); setIsLoadingOracle(false); });
    }
  }, [isOracleOpen, oracleText, isLoadingOracle, data, subtitle, title]);

  if (!data || (!data.placements && !data.matrices?.tropical)) {
    return <UnavailableCard title={title} />;
  }

  // Handle both primary payload structure and encrypted vault structure
  const rawPlacements = data.placements || data;
  const { luminaries, majors, minors } = categorizePlacements(rawPlacements);
  const aspects = data.aspects || [];
  const patterns = data.patterns || [];
  const voids = data.voids || [];
  const angles = data.angles;

  const toggleHeader = (
    <div className={`flex items-center gap-4 ${isEncrypted ? 'mb-0' : 'mb-6'}`}>
      {imageSrc && (
        <img src={imageSrc} alt={subtitle || title} referrerPolicy="no-referrer" className="w-12 h-12 rounded-full border border-ash-grey/30 object-cover shadow-lg" />
      )}
      <div className="text-left">
        <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2">
          {isEncrypted && (isOpen ? <Unlock className="w-3 h-3 text-astral-gold" /> : <Lock className="w-3 h-3 text-ash-grey" />)}
          {!isEncrypted && <span className="w-2 h-2 rounded-full bg-nebula-purple"></span>}
          {title}
        </h2>
        {subtitle && <p className="text-[10px] text-ash-grey tracking-widest uppercase mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const content = (
    <div className="space-y-6">
      {/* 1. Luminaries */}
      {luminaries.length > 0 && <PlacementSection title="Luminaries" icon={<CircleDot className="w-3 h-3 text-astral-gold" />} placements={luminaries} />}
      
      {/* 2. Major Planets */}
      {majors.length > 0 && <PlacementSection title="Major Planets" icon={<Orbit className="w-3 h-3 text-nebula-purple" />} placements={majors} />}
      
      {/* 3. Minor Objects (Asteroids, Comets, Nodes) */}
      <PlacementSection title="Minor Celestial Objects" icon={<Asterisk className="w-3 h-3 text-ash-grey" />} placements={minors} fallback="Awaiting deep-space telemetry scan." />
      
      {/* Angular Coordinates (Primary Only) */}
      {isPrimary && !isDefaultTime && angles && <AscendantData angles={angles} />}

      {/* 4. Aspects */}
      <ListSection title="Aspects" icon={<Network className="w-3 h-3 text-emerald-400" />} items={aspects} fallback="Awaiting geometric aspect mapping." renderItem={(a: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between bg-black/30 px-3 md:px-4 py-2 rounded border border-ash-grey/10">
          <span className="text-starlight-white text-[10px] md:text-xs uppercase tracking-wider">{a.type}</span>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-astral-gold text-[10px] md:text-xs">{a.planets}</span>
            <span className="text-ash-grey text-[10px] w-6 md:w-8 text-right">{a.orb}</span>
          </div>
        </div>
      )} />

      {/* 5. Patterns */}
      <ListSection title="Patterns" icon={<Fingerprint className="w-3 h-3 text-astral-gold" />} items={patterns} fallback="Awaiting structural pattern recognition." renderItem={(p: any, idx: number) => (
        <div key={idx} className="bg-black/30 px-3 md:px-4 py-2 rounded border border-ash-grey/10">
          <span className="text-astral-gold text-xs uppercase tracking-wider block">{p.name}</span>
          <span className="text-ash-grey text-[10px]">{p.description}</span>
        </div>
      )} />

      {/* 6. Voids */}
      <ListSection title="Voids (Open Conductors)" icon={<Wind className="w-3 h-3 text-slate-400" />} items={voids} fallback="All primary sectors currently conducting." renderItem={(v: any, idx: number) => (
        <div key={idx} className="bg-black/30 px-3 md:px-4 py-2 rounded border border-ash-grey/10 flex justify-between">
          <span className="text-starlight-white text-[10px] md:text-xs uppercase tracking-wider">{v.type}</span>
          <span className="text-ash-grey text-[10px]">{v.elements}</span>
        </div>
      )} />

      {/* Oracle Integration */}
      <div className="mt-4 border-t border-ash-grey/10 pt-4">
        <button onClick={() => setIsOracleOpen(!isOracleOpen)} className="flex items-center justify-between w-full text-left text-sm text-nebula-purple hover:text-astral-gold transition-colors uppercase tracking-wider">
          <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Oracle Interpretation</span>
          {isOracleOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isOracleOpen && (
          <div className="mt-4 text-ash-grey text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            {isLoadingOracle ? (
              <div className="flex items-center gap-2 text-astral-gold">
                <RefreshCcw className="w-4 h-4 animate-spin" />
                <span className="text-xs uppercase tracking-widest">Consulting Oracle...</span>
              </div>
            ) : (<div className="whitespace-pre-wrap">{oracleText}</div>)}
          </div>
        )}
      </div>
    </div>
  );

  if (isEncrypted) {
    return (
      <motion.div layout className={`bg-obsidian border rounded-xl overflow-hidden transition-all duration-500 ${isOpen ? 'border-astral-gold/50 shadow-[0_0_30px_rgba(245,208,97,0.15)]' : 'border-ash-grey/20 shadow-md hover:border-ash-grey/40'}`}>
        <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 md:p-5 flex items-center justify-between group">
          {toggleHeader}
          <div className="text-ash-grey">{isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="border-t border-astral-gold/20">
              <div className="p-4 md:p-6">{content}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-4 md:p-6 shadow-lg">
      {toggleHeader}
      {content}
    </section>
  );
}

// Sub-Component: Placement Grid Rendering (Upgraded with Esoteric Symbology)
function PlacementSection({ title, icon, placements, fallback }: { title: string, icon: React.ReactNode, placements: any[], fallback?: string }) {
  return (
    <div>
      <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2">
        {icon} {title}
      </h3>
      {placements.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {placements.map((p: any, idx: number) => (
            <div key={idx} className="bg-black/30 p-2 md:p-3 rounded-lg border border-ash-grey/10 flex justify-between items-center">
              <div className="flex items-center gap-1 md:gap-2">
                {/* Planet Glyph + Name */}
                <span className="text-starlight-white text-xs md:text-sm flex items-center gap-1">
                  <span className="text-nebula-purple font-serif text-sm md:text-base">{planetSymbols[p.planet] || ''}</span>
                  {p.planet}
                </span>
                {p.isRetrograde && <span className="text-red-400 text-[8px] font-bold border border-red-900/50 rounded px-1" title="Retrograde">Rx</span>}
              </div>
              <div className="text-right">
                {/* Zodiac Sign + Glyph */}
                <span className="text-astral-gold text-[10px] md:text-xs uppercase tracking-wider flex items-center justify-end gap-1">
                  {p.sign} <span className="text-astral-gold font-serif text-sm">{zodiacSymbols[p.sign] || ''}</span>
                </span>
                <span className="text-ash-grey text-[10px] block">{p.degree}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-ash-grey text-[10px] italic">{fallback}</p>
      )}
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

  const AngleBox = ({ title, data }: { title: string, data: any }) => (
    <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-astral-gold/20">
      <p className="text-ash-grey text-[10px] md:text-xs uppercase tracking-wider mb-1">{title}</p>
      <p className="text-base md:text-lg font-bold text-starlight-white flex items-center gap-2">
        {data?.sign ?? '---'} 
        <span className="text-astral-gold font-serif text-sm">{zodiacSymbols[data?.sign] || ''}</span>
      </p>
      <p className="text-astral-gold text-[10px] md:text-xs">{data?.degree ?? '0°'}</p>
    </div>
  );

  return (
    <div className="border-t border-ash-grey/10 pt-4 md:pt-6 mt-2">
      <h3 className="text-ash-grey text-[10px] md:text-xs tracking-widest uppercase mb-3 md:mb-4">Angular Coordinates</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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

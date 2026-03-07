import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Lock, Unlock, Star, Moon, Sun, Activity, Beaker, Layers, Radio, RefreshCcw, Sparkles, CircleDot, Orbit, Asterisk, Network, Fingerprint, Wind, Hexagon, Globe, Download, AlertTriangle, Palette, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HorizonRadar from './HorizonRadar';
import ErrorBoundary from './ErrorBoundary';
import AetherLogo from './AetherLogo';
import { generateCharacteristics } from '../utils/geminiClient';
import { exportCodexPDF } from '../utils/exportEngine';
import { PLACEMENT_CODEX, ZODIAC_CODEX, PLANETARY_CODEX, PATTERN_CODEX } from '../utils/codexLibrary';

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

// PATTERN SYMBOLS
const getPatternIcon = (name: string) => {
  if (name.includes('Cross')) return '⌖';
  if (name.includes('Square') || name.includes('Stellium')) return '⊤';
  if (name.includes('Trine')) return '△';
  if (name.includes('Yod')) return '⇡';
  return '✧';
};

export function IdentityMatrixCard({ title, data, icon }: any) {
  // Modal state stripped. Accordion logic delegated to sub-components.

  if (!data) return <UnavailableCard title={title} />;

  return (
    <section className="bg-obsidian border border-ash-grey/20 rounded-xl p-4 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-ash-grey/10 pb-3">
        <h2 className="text-astral-gold font-bold uppercase tracking-widest text-sm md:text-base flex items-center gap-2">
          {icon} {title}
        </h2>
      </div>

      <div className="flex-1 space-y-2">
        {/* The Angles bypass the vault to act as the permanent foundational anchor */}
        <AscendantData angles={data.angles} />

        <div className="mt-6">
          <CollapsibleVault title="Primary Architecture" icon={<Sun className="w-3 h-3"/>} defaultOpen={true}>
            <PlacementSection placements={data.placements} />
          </CollapsibleVault>
          
          {data.aspects && data.aspects.length > 0 && (
            <CollapsibleVault title="Major Aspects" icon={<Activity className="w-3 h-3"/>} defaultOpen={false}>
              <div className="space-y-2">
                {data.aspects.map((aspect: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-black/30 p-2 rounded border border-ash-grey/5 hover:border-ash-grey/20 transition-colors">
                    <span className="text-starlight-white text-xs font-medium">{aspect.planets}</span>
                    <span className="text-astral-gold text-[10px] uppercase tracking-widest">{aspect.type}</span>
                  </div>
                ))}
              </div>
            </CollapsibleVault>
          )}

          {data.patterns && data.patterns.length > 0 && (
            <CollapsibleVault title="Structural Patterns" icon={<Hexagon className="w-3 h-3"/>} defaultOpen={true}>
              <div className="space-y-3">
                {data.patterns.map((pattern: any, idx: number) => {
                  const codexEntry = Object.entries(PATTERN_CODEX).find(([key]) => pattern.name.includes(key));
                  const interpretation = codexEntry ? codexEntry[1].description : pattern.description;
                  const esotericTitle = codexEntry ? codexEntry[1].title : 'Structural Geometry';

                  return (
                    <div key={idx} className="bg-black/30 p-3 rounded border border-ash-grey/5 hover:border-nebula-purple/30 transition-colors">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className="text-starlight-white font-bold text-sm flex items-center gap-2">
                          <span className="text-astral-gold text-lg">{getPatternIcon(pattern.name)}</span> {pattern.name}
                        </h4>
                        <span className="text-[7px] md:text-[8px] uppercase tracking-widest text-nebula-purple bg-nebula-purple/10 border border-nebula-purple/30 px-1.5 py-0.5 rounded text-right shrink-0">
                          {esotericTitle}
                        </span>
                      </div>
                      <p className="text-ash-grey text-[10px] md:text-xs leading-relaxed mt-1">{interpretation}</p>
                    </div>
                  );
                })}
              </div>
            </CollapsibleVault>
          )}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// TACTICAL UI COMPONENTS
// ==========================================

function CollapsibleVault({ title, icon, children, defaultOpen = true }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 border border-ash-grey/10 bg-black/20 rounded-lg p-3 md:p-4 transition-colors hover:border-ash-grey/20">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left group">
        <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase flex items-center gap-2 group-hover:text-astral-gold transition-colors">
          {icon} {title}
        </h3>
        <div className="bg-black/40 p-1 rounded group-hover:bg-astral-gold/10 transition-colors">
          {isOpen ? <ChevronUp className="w-4 h-4 text-ash-grey group-hover:text-astral-gold" /> : <ChevronDown className="w-4 h-4 text-ash-grey group-hover:text-astral-gold" />}
        </div>
      </button>
      {isOpen && <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">{children}</div>}
    </div>
  );
}

export function PlacementSection({ title, icon, placements }: any) {
  // Initiating local state for the Accordion drop-down
  const [activeNode, setActiveNode] = useState<string | null>(null);

  if (!placements || placements.length === 0) return null;

  // The 8-Tier Structural Matrix
  const TIER_SORT_ORDER = [
    ['Midheaven', 'Imum Coeli', 'Ascendant', 'Descendant'], // Row 1: Angles
    ['North Node', 'South Node', 'Vertex', 'Anti-Vertex'], // Row 2: Axes
    ['Sun', 'Moon', 'Selene', 'Lilith'], // Row 3: Luminaries
    ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'], // Row 4: Major
    ['Earth', 'Chiron', 'Astraea', 'Hygiea'], // Row 5: Sensitive
    ['Eris', 'Eros', 'Ceres', 'Haumea'], // Row 6: High-Orbitals
    ['Vesta', 'Part of Fortune', 'Sedna', 'Juno'], // Row 7: Foundational
    ['Pallas', 'Pholus', 'MakeMake'] // Row 8: Minor
  ];

  return (
    <div className="mb-4 md:mb-6">
      <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-3 md:mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      
      <div className="space-y-4">
        {TIER_SORT_ORDER.map((tier, tierIdx) => {
          // Filter out placements that belong to the current structural tier
          const tierPlacements = placements.filter((p: any) => tier.includes(p.planet || p.name));
          
          if (tierPlacements.length === 0) return null;

          return (
            <div key={tierIdx} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 border-b border-ash-grey/10 pb-3">
              {tierPlacements.map((p: any, idx: number) => {
                const nodeName = p.planet || p.name;
                const nodeLore = PLANETARY_CODEX[nodeName] || PLACEMENT_CODEX[nodeName]; 
                const isExpanded = activeNode === nodeName;

                return (
                  <div 
                    key={idx} 
                    onClick={() => setActiveNode(isExpanded ? null : nodeName)}
                    className={`bg-black/30 p-2 md:p-3 rounded border flex flex-col justify-center gap-1 transition-all duration-300 cursor-pointer ${isExpanded ? 'border-astral-gold/50 bg-black/50 shadow-[0_0_15px_rgba(245,208,97,0.1)]' : 'border-ash-grey/5 hover:border-astral-gold/30'}`}
                  >
                    <span className="text-starlight-white font-medium text-[11px] md:text-xs hover:text-astral-gold transition-colors">{nodeName}</span>
                    <span className="text-nebula-purple text-[7px] md:text-[8px] uppercase tracking-widest leading-none">
                      {nodeLore?.title || 'System Node'}
                    </span>
                    
                    <div className="flex flex-wrap items-center justify-between mt-1 pt-1 border-t border-ash-grey/10">
                      <span className="text-astral-gold uppercase tracking-wider text-[10px] md:text-xs break-words">
                        {p.sign}
                      </span>
                      <span className="text-ash-grey font-mono text-[9px] md:text-[10px] opacity-70">
                        {p.degree}
                      </span>
                    </div>

                    {/* The Accordion Expansion Payload */}
                    {isExpanded && nodeLore?.description && (
                      <div className="mt-2 pt-2 border-t border-astral-gold/20 text-[10px] md:text-xs text-ash-grey leading-relaxed animate-in slide-in-from-top-1">
                        {nodeLore.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
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
    <section className="bg-obsidian border border-ash-grey/10 rounded-xl p-4 md:p-6 shadow-lg transition-all h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-nebula-purple"></span> Numerology Resonance
        </h2>
      </div>
      
      <div className="flex-1 bg-black/30 p-4 rounded-lg border border-ash-grey/5 mb-4 flex flex-col justify-center items-center text-center">
        {/* HIERARCHY INVERSION */}
        <p className="text-4xl md:text-5xl font-bold text-starlight-white leading-tight mb-1 drop-shadow-md">
          Life Path {data.lifePath}
        </p>
        <p className="text-nebula-purple text-xs md:text-sm font-semibold uppercase tracking-widest mb-4">
          {data.details?.title ?? '?'}
        </p>
        
        {data.details?.colors && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {data.details.colors.map((color: string, idx: number) => (
              <span key={idx} className="text-[10px] md:text-xs font-bold uppercase tracking-widest border border-nebula-purple/50 bg-nebula-purple/20 text-starlight-white px-3 py-1.5 rounded inline-block shadow-sm">
                {color}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-black/30 p-2 rounded-lg border border-ash-grey/5 text-center flex flex-col justify-center">
          <p className="text-ash-grey text-[8px] uppercase tracking-wider mb-0.5">Destiny</p>
          <p className="text-sm font-bold text-astral-gold">{data.destiny}</p>
        </div>
        <div className="bg-black/30 p-2 rounded-lg border border-ash-grey/5 text-center flex flex-col justify-center">
          <p className="text-ash-grey text-[8px] uppercase tracking-wider mb-0.5">Soul Urge</p>
          <p className="text-sm font-bold text-astral-gold">{data.soulUrge}</p>
        </div>
        <div className="bg-black/30 p-2 rounded-lg border border-ash-grey/5 text-center flex flex-col justify-center">
          <p className="text-ash-grey text-[8px] uppercase tracking-wider mb-0.5">Personality</p>
          <p className="text-sm font-bold text-astral-gold">{data.personality}</p>
        </div>
      </div>

      <div className="mt-auto border-t border-ash-grey/10 pt-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-left text-sm text-starlight-white hover:text-astral-gold transition-colors uppercase tracking-wider">
          <span>Interpretation Matrix</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <div className="mt-4 text-ash-grey text-xs md:text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
            {data.details?.colorMeaning && (
              <div className="p-3 bg-black/40 border border-nebula-purple/20 rounded text-[11px] leading-relaxed mb-3 shadow-inner">
                <span className="text-nebula-purple font-bold uppercase tracking-widest text-[9px] block mb-1 flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Color Resonance
                </span>
                {data.details.colorMeaning}
              </div>
            )}
            {Array.isArray(data.interpretation) ? (
              <ul className="space-y-2">
                {data.interpretation.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-left">
                    <span className="text-astral-gold mt-0.5 text-xs">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="whitespace-pre-wrap text-left">{data.interpretation}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function AscendantData({ angles }: { angles: any }) {
  const [activeAngle, setActiveAngle] = useState<string | null>(null);

  if (!angles) return null;

  const AngleBox = ({ keyName, data }: { keyName: string, data: any }) => {
    const codex = PLACEMENT_CODEX[keyName];
    const zCodex = ZODIAC_CODEX[data?.sign];
    const isExpanded = activeAngle === keyName;

    return (
      <div 
        onClick={() => setActiveAngle(isExpanded ? null : keyName)}
        className="bg-black/30 p-3 md:p-4 rounded-lg border border-astral-gold/20 flex flex-col h-full shadow-inner relative overflow-hidden group hover:border-astral-gold/50 transition-all cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-astral-gold/5 rounded-bl-full -z-10 group-hover:bg-astral-gold/10 transition-colors"></div>

        <div className="mb-2">
          <p className="text-ash-grey text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5">{keyName}</p>
          <p className="text-nebula-purple text-[8px] md:text-[9px] uppercase tracking-widest leading-tight">{codex?.title}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 w-full mt-auto">
          <p className="text-sm md:text-lg font-bold text-starlight-white break-words">
            {data?.sign ?? '---'} 
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-ash-grey/10">
          <p className="text-astral-gold text-[10px] md:text-xs shrink-0 font-mono">{data?.degree ?? '0°'}</p>
          {zCodex && (
            <span className="text-[8px] uppercase tracking-widest text-ash-grey bg-black/50 border border-ash-grey/20 px-1.5 py-0.5 rounded">
              {zCodex.color}
            </span>
          )}
        </div>

        {/* Accordion Expansion Matrix */}
        {isExpanded && codex?.description && (
          <div className="mt-3 pt-3 border-t border-ash-grey/20 text-[10px] md:text-xs text-ash-grey leading-relaxed animate-in slide-in-from-top-1">
            {codex.description}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-t border-ash-grey/10 pt-4 md:pt-6 mt-2">
      <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-3 md:mb-4 flex items-center gap-2">
        <Compass className="w-4 h-4 text-astral-gold" /> Structural Angles & Karmic Coordinates
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <AngleBox keyName="Ascendant" data={angles.ascendant} />
        <AngleBox keyName="Descendant" data={angles.descendant} />
        <AngleBox keyName="Midheaven" data={angles.midheaven} />
        <AngleBox keyName="Imum Coeli" data={angles.imumCoeli} />
        <AngleBox keyName="North Node" data={angles.northNode} />
        <AngleBox keyName="South Node" data={angles.southNode} />
      </div>
      <p className="text-ash-grey text-[10px] mt-4 text-center italic opacity-70">Coordinate framework mathematically secured via Offline Matrix.</p>
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

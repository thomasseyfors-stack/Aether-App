import React, { useState } from 'react';
import { ArrowLeft, Beaker } from 'lucide-react';
import AetherLogo from './AetherLogo';
import { NumerologyCard, IdentityMatrixCard } from './Dashboard'; 
import { PLACEMENT_CODEX, PLANETARY_CODEX } from '../utils/codexLibrary';

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

export default function TheoreticalAxiom({ payload, onBack }: { payload: any, onBack: () => void }) {
  const theoretical = payload?.theoretical;
  
  if (!theoretical) {
    return (
      <div className="min-h-screen bg-obsidian text-starlight-white flex items-center justify-center p-6">
        <p className="text-ash-grey uppercase tracking-widest text-sm">Theoretical Simulation Offline.</p>
        <button onClick={onBack} className="ml-4 text-nebula-purple hover:text-astral-gold uppercase text-xs tracking-widest">Return</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-6 font-sans w-full max-w-full overflow-x-hidden">
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        
        <header className="border-b border-nebula-purple/30 pb-4 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-4">
            <AetherLogo className="w-12 h-12 md:w-16 md:h-16" />
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-nebula-purple tracking-widest uppercase mb-1 md:mb-2 flex items-center gap-3">
                <Beaker className="w-6 h-6 md:w-8 md:h-8" /> Theoretical Axiom
              </h1>
              <p className="text-ash-grey text-sm tracking-widest uppercase">
                Alternative Timeline Simulation Active
              </p>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center justify-center gap-2 bg-obsidian hover:bg-black/50 text-ash-grey border border-ash-grey/20 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest text-xs font-bold w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Core Grid
          </button>
        </header>

        <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
          
          <section className="bg-obsidian border border-nebula-purple/20 rounded-xl p-4 md:p-6 shadow-[0_0_20px_rgba(106,13,173,0.1)]">
            <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-4">Temporal Shift Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-ash-grey/5">
                <p className="text-nebula-purple text-[10px] md:text-xs uppercase tracking-wider mb-1">Cotsworth Date</p>
                <p className="text-lg md:text-xl font-bold text-starlight-white">{theoretical.date}</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-ash-grey/5">
                <p className="text-nebula-purple text-[10px] md:text-xs uppercase tracking-wider mb-1">UTC Time</p>
                <p className="text-lg md:text-xl font-bold text-starlight-white">{theoretical.time}</p>
              </div>
            </div>
          </section>

          <NumerologyCard data={{
            lifePath: theoretical.numerology.lifePath,
            destiny: theoretical.numerology.destiny || payload.numerology.destiny, 
            soulUrge: theoretical.numerology.soulUrge || payload.numerology.soulUrge, 
            personality: theoretical.numerology.personality || payload.numerology.personality,
            interpretation: theoretical.numerology.interpretation
          }} />

          <div className="pt-4 space-y-4">
            <h3 className="text-ash-grey text-xs tracking-widest uppercase mb-4 text-center">Theoretical Geometries</h3>
            
            <IdentityMatrixCard 
              title="Tropical Placidus" 
              subtitle="Theoretical Persona" 
              data={{ 
                placements: theoretical.matrices.tropical,
                angles: theoretical.matrices.angles,
                aspects: theoretical.matrices.aspects,
                patterns: theoretical.matrices.patterns,
                voids: theoretical.matrices.voids
              }} 
              imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-axiom.jpg" 
              isPrimary={true} 
            />

            {theoretical.matrices.vaults && (
              <div className="space-y-4">
                <IdentityMatrixCard 
                  title="Standard Sidereal Lahiri" 
                  subtitle="Theoretical Soul Vessel" 
                  data={theoretical.matrices.vaults.sidereal} 
                  imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-soul.jpg" 
                  isEncrypted 
                />
                <IdentityMatrixCard 
                  title="Draconic" 
                  subtitle="Theoretical Spark" 
                  data={theoretical.matrices.vaults.draconic} 
                  imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-spark.jpg" 
                  isEncrypted 
                />
                <IdentityMatrixCard 
                  title="Heliocentric" 
                  subtitle="Theoretical Source" 
                  data={theoretical.matrices.vaults.heliocentric} 
                  imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-source.jpg" 
                  isEncrypted 
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

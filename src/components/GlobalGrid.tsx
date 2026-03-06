import React from 'react';
import { ArrowLeft, Globe2, Fingerprint, BookOpen, Milestone } from 'lucide-react';
import AetherLogo from './AetherLogo';

export default function GlobalGrid({ payload, onBack }: { payload: any, onBack: () => void }) {
  // Extract the new cultural grid payload
  const gridData = payload?.matrices?.culturalGrid;

  if (!gridData) {
    return (
      <div className="min-h-screen bg-obsidian text-starlight-white flex items-center justify-center p-6">
        <p className="text-ash-grey uppercase tracking-widest text-sm">Cultural Telemetry Offline.</p>
        <button onClick={onBack} className="ml-4 text-nebula-purple hover:text-astral-gold uppercase text-xs tracking-widest">Return</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-6 font-sans w-full max-w-full overflow-x-hidden">
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        
        {/* Header */}
        <header className="border-b border-emerald-900/30 pb-4 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-4">
            <AetherLogo className="w-12 h-12 md:w-16 md:h-16" />
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-emerald-400 tracking-widest uppercase mb-1 md:mb-2 flex items-center gap-3">
                <Globe2 className="w-6 h-6 md:w-8 md:h-8" /> Cultural Matrix
              </h1>
              <p className="text-ash-grey text-sm tracking-widest uppercase">
                Cross-System Esoteric Telemetry
              </p>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center justify-center gap-2 bg-obsidian hover:bg-black/50 text-ash-grey border border-ash-grey/20 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest text-xs font-bold w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Blueprint
          </button>
        </header>

        {/* Introduction */}
        <section className="bg-black/40 border border-emerald-900/30 p-4 md:p-6 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.05)] animate-in fade-in duration-500">
          <p className="text-sm md:text-base text-ash-grey leading-relaxed">
            The Sovereign Structure is a universal constant. It is recognized across all ancient terrestrial operating systems. This matrix translates your core geometric frequency into the specific archetypes used by global esoteric traditions, proving that your structural identity remains intact regardless of the cultural lens applied.
          </p>
        </section>

        {/* Cultural Grid Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {gridData.map((node: any, idx: number) => (
            <div key={idx} className="bg-obsidian border border-emerald-500/20 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-400/50 transition-colors flex flex-col">
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-900/10 rounded-bl-full -z-10 group-hover:bg-emerald-800/20 transition-colors"></div>
              
              <div className="flex items-center justify-between mb-3 border-b border-ash-grey/10 pb-3">
                <h2 className="text-starlight-white font-bold text-sm md:text-base uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" /> {node.system}
                </h2>
              </div>
              
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-ash-grey text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Fingerprint className="w-3 h-3 text-astral-gold" /> System Archetype
                  </p>
                  <p className="text-astral-gold font-bold text-sm md:text-base">{node.archetype}</p>
                </div>

                <div>
                  <p className="text-ash-grey text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Milestone className="w-3 h-3 text-nebula-purple" /> Structural Title
                  </p>
                  <p className="text-nebula-purple font-semibold text-xs uppercase tracking-wider">{node.title}</p>
                </div>

                <div className="pt-2">
                  {/* Bullet Point Rendering for scannability */}
                  {Array.isArray(node.description) ? (
                    <ul className="space-y-2">
                      {node.description.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5 text-xs">◆</span>
                          <span className="text-sm text-ash-grey leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-ash-grey leading-relaxed">{node.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

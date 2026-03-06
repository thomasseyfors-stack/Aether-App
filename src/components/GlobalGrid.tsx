import React from 'react';
import { ArrowLeft, Globe, MapPin, Zap, Mountain } from 'lucide-react';
import AetherLogo from './AetherLogo';

export default function GlobalGrid({ payload, onBack }: { payload: any, onBack: () => void }) {
  const gridData = payload?.matrices?.globalGrid;

  if (!gridData) {
    return (
      <div className="min-h-screen bg-obsidian text-starlight-white flex items-center justify-center p-6">
        <p className="text-ash-grey uppercase tracking-widest text-sm">Geodetic Telemetry Offline.</p>
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
                <Globe className="w-6 h-6 md:w-8 md:h-8" /> The Global Grid
              </h1>
              <p className="text-ash-grey text-sm tracking-widest uppercase">
                Astrocartography & Ley Line Telemetry
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
            The Sovereign Structure does not exist solely in the ether. It anchors into the physical geography of the Earth. These coordinates represent your high-conduction power zones—the physical locations where your internal geometric frequencies intersect with the planet's electromagnetic field.
          </p>
        </section>

        {/* Grid Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {gridData.map((node: any, idx: number) => (
            <div key={idx} className="bg-obsidian border border-emerald-500/20 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-400/50 transition-colors">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-900/10 rounded-bl-full -z-10 group-hover:bg-emerald-800/20 transition-colors"></div>
              
              <div className="flex items-center justify-between mb-3 border-b border-ash-grey/10 pb-3">
                <h2 className="text-starlight-white font-bold text-sm md:text-base uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" /> {node.location}
                </h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-ash-grey text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-astral-gold" /> Planetary Line
                  </p>
                  <p className="text-astral-gold font-mono text-xs">{node.line}</p>
                </div>

                <div>
                  <p className="text-ash-grey text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-nebula-purple" /> Structural Theme
                  </p>
                  <p className="text-nebula-purple font-semibold text-xs uppercase tracking-wider">{node.theme}</p>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-ash-grey leading-relaxed">{node.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

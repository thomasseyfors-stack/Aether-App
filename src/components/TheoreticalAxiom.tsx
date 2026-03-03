import React from 'react';
import { ArrowLeft, Clock, Calendar, Compass, Activity, ShieldAlert } from 'lucide-react';

export default function TheoreticalAxiom({ payload, onBack }: { payload: any, onBack: () => void }) {
  const theoretical = payload?.theoretical;

  if (!theoretical) {
    return (
      <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-6 font-sans flex flex-col items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-400 uppercase tracking-widest">Theoretical Data Missing</h2>
        <button onClick={onBack} className="mt-6 text-ash-grey hover:text-starlight-white uppercase tracking-widest text-xs">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-6 font-sans w-full max-w-full overflow-x-hidden">
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        <header className="border-b border-nebula-purple/30 pb-4 md:pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-nebula-purple tracking-widest uppercase mb-1 md:mb-2">Theoretical Axiom</h1>
            <p className="text-ash-grey text-[10px] md:text-xs tracking-widest uppercase">
              Cotsworth / UTC Temporal Shift
            </p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-ash-grey hover:text-starlight-white transition-colors uppercase tracking-widest text-[10px] md:text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Temporal Shift Card */}
          <section className="bg-black/40 border border-ash-grey/10 rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-xs md:text-sm mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Absolute Temporal Coordinates
            </h2>
            <div className="space-y-4">
              <div className="bg-obsidian p-3 md:p-4 rounded-lg border border-ash-grey/5">
                <p className="text-ash-grey text-[10px] md:text-xs uppercase tracking-wider mb-1">UTC Date</p>
                <p className="text-lg md:text-xl font-bold text-starlight-white">{theoretical.date}</p>
              </div>
              <div className="bg-obsidian p-3 md:p-4 rounded-lg border border-ash-grey/5">
                <p className="text-ash-grey text-[10px] md:text-xs uppercase tracking-wider mb-1">UTC Time</p>
                <p className="text-lg md:text-xl font-bold text-starlight-white">{theoretical.time}</p>
              </div>
            </div>
          </section>

          {/* Theoretical Numerology */}
          <section className="bg-black/40 border border-ash-grey/10 rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-xs md:text-sm mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Theoretical Numerology
            </h2>
            <div className="bg-obsidian p-4 md:p-6 rounded-lg border border-astral-gold/20 text-center h-full flex flex-col justify-center">
              <p className="text-ash-grey text-[10px] md:text-xs uppercase tracking-wider mb-2">Shifted Life Path</p>
              <p className="text-4xl md:text-6xl font-bold text-astral-gold">{theoretical.numerology.lifePath}</p>
            </div>
          </section>
        </div>

        {/* Theoretical Zodiac */}
        <section className="bg-black/40 border border-ash-grey/10 rounded-xl p-4 md:p-6 shadow-lg">
          <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-xs md:text-sm mb-4 md:mb-6 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            Theoretical Zodiac (UTC Placidus)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {theoretical.zodiac?.map((p: any, idx: number) => (
              <div key={idx} className="bg-obsidian p-2 md:p-3 rounded-lg border border-ash-grey/5 flex justify-between items-center">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-starlight-white text-xs md:text-sm">{p.planet}</span>
                  {p.isRetrograde && (
                    <span className="text-nebula-purple text-[8px] md:text-[10px] font-bold" title="Retrograde">Rx</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-astral-gold text-[10px] md:text-xs block uppercase tracking-wider">{p.sign}</span>
                  <span className="text-ash-grey text-[10px]">{p.degree}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

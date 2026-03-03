import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lock, Star, Moon, Sun } from 'lucide-react';

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
  }
};

const ALL_ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function Dashboard({ payload }: { payload: any }) {
  const isDefaultTime = payload?.isDefaultTime ?? true;
  const celestialData = mockCelestialData; // In a real app, this would come from the payload/API

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-nebula-purple/30 pb-6">
          <h1 className="text-3xl font-bold text-astral-gold tracking-widest uppercase mb-2">Aether Grid Active</h1>
          <p className="text-ash-grey text-sm tracking-widest uppercase">
            Telemetry Synchronized for {payload?.firstName ?? 'Traveler'}
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <NumerologyCard data={celestialData?.numerology} />
          <TropicalPlacidusCard data={celestialData} isDefaultTime={isDefaultTime} />
          <OpenConductorsCard placements={celestialData?.placements} />
          
          {/* Progressive Disclosure Locks */}
          <div className="pt-8 space-y-4 border-t border-ash-grey/10">
            <h3 className="text-ash-grey text-xs tracking-widest uppercase mb-4 text-center">Encrypted Sectors</h3>
            <LockedNavigationCard title="The Soul & Spirit Vessel" />
            <LockedNavigationCard title="The Spark & Core Intent" />
            <LockedNavigationCard title="The Source & Solar Mission" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NumerologyCard({ data }: { data: any }) {
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

function TropicalPlacidusCard({ data, isDefaultTime }: { data: any, isDefaultTime: boolean }) {
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

function AscendantData({ angles }: { angles: any }) {
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

function OpenConductorsCard({ placements }: { placements: any[] }) {
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

function LockedNavigationCard({ title }: { title: string }) {
  return (
    <div className="bg-obsidian border border-ash-grey/5 rounded-xl p-5 shadow-md flex items-center justify-between opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-black/50 border border-ash-grey/20 flex items-center justify-center group-hover:border-astral-gold/50 transition-colors">
          <Lock className="w-4 h-4 text-ash-grey group-hover:text-astral-gold transition-colors" />
        </div>
        <h3 className="text-starlight-white text-sm font-semibold tracking-widest uppercase">{title}</h3>
      </div>
      <span className="text-[10px] text-ash-grey uppercase tracking-widest border border-ash-grey/20 px-2 py-1 rounded">Locked</span>
    </div>
  );
}

function UnavailableCard({ title }: { title: string }) {
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

import React, { useState } from 'react';
import { Calendar, Clock, Compass, Activity } from 'lucide-react';

// Numerology Helper: Calculate Personal Year
function calculatePersonalYear(birthMonth: string, birthDay: string) {
  const currentYear = new Date().getFullYear();
  const month = parseInt(birthMonth || '1', 10);
  const day = parseInt(birthDay || '1', 10);
  
  // Reduce a number to a single digit (or master numbers 11, 22, 33 if desired, but standard is 1-9)
  const reduceToSingleDigit = (num: number): number => {
    if (num === 0) return 0;
    const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    return sum > 9 ? reduceToSingleDigit(sum) : sum;
  };

  const monthReduced = reduceToSingleDigit(month);
  const dayReduced = reduceToSingleDigit(day);
  const yearReduced = reduceToSingleDigit(currentYear);

  return reduceToSingleDigit(monthReduced + dayReduced + yearReduced);
}

const PERSONAL_YEAR_INTERPRETATIONS: Record<number, string> = {
  1: "A year of new beginnings, independence, and taking initiative. Plant seeds for the next 9-year cycle.",
  2: "A year of cooperation, partnerships, and patience. Focus on relationships and diplomacy.",
  3: "A year of self-expression, creativity, and social interaction. Embrace joy and communication.",
  4: "A year of hard work, foundation building, and organization. Focus on stability and practical matters.",
  5: "A year of change, freedom, and adventure. Expect the unexpected and embrace flexibility.",
  6: "A year of responsibility, family, and service. Focus on home, community, and nurturing others.",
  7: "A year of introspection, spiritual growth, and analysis. Seek inner wisdom and understanding.",
  8: "A year of material success, power, and achievement. Focus on career, finances, and manifestation.",
  9: "A year of completion, release, and humanitarianism. Let go of what no longer serves you to prepare for a new cycle."
};

// Mock Forecast Data
const mockTransits = {
  today: [
    { planet: 'Moon', aspect: 'Trine', natalPlanet: 'Sun', system: 'Tropical', description: 'Emotional harmony and ease of self-expression.' },
    { planet: 'Mercury', aspect: 'Conjunction', natalPlanet: 'Venus', system: 'Sidereal', description: 'Pleasant communications and social interactions.' }
  ],
  month: [
    { planet: 'Sun', aspect: 'Square', natalPlanet: 'Mars', system: 'Tropical', description: 'Potential for friction; channel energy constructively.' },
    { planet: 'Venus', aspect: 'Sextile', natalPlanet: 'Jupiter', system: 'Sidereal', description: 'Favorable period for financial and romantic growth.' }
  ],
  year: [
    { planet: 'Jupiter', aspect: 'Trine', natalPlanet: 'Sun', system: 'Tropical', description: 'A major cycle of expansion, optimism, and opportunity.' },
    { planet: 'Saturn', aspect: 'Conjunction', natalPlanet: 'Moon', system: 'Sidereal', description: 'A period of emotional maturation and restructuring.' },
    { planet: 'Uranus', aspect: 'Opposition', natalPlanet: 'Mercury', system: 'Draconic', description: 'Sudden insights and shifts in perspective.' },
    { planet: 'Pluto', aspect: 'Trine', natalPlanet: 'Venus', system: 'Heliocentric', description: 'Deep transformation in values and relationships.' }
  ]
};

export default function HorizonRadar({ payload }: { payload: any }) {
  const [activeTab, setActiveTab] = useState<'today' | 'month' | 'year' | 'epicycle'>('today');
  
  const pii = payload?.pii || payload || {};
  const personalYear = calculatePersonalYear(pii.birthMonth, pii.birthDay);

  // Dynamic Overlay Logic: Use the decrypted "Static Natal Matrices" from the local MDV as the baseline
  const tropicalBaseline = payload?.matrices?.tropical?.[0]?.planet || 'Sun';
  const siderealBaseline = payload?.matrices?.vaults?.sidereal?.placements?.[0]?.planet || 'Venus';
  const draconicBaseline = payload?.matrices?.vaults?.draconic?.placements?.[0]?.planet || 'Mercury';
  const heliocentricBaseline = payload?.matrices?.vaults?.heliocentric?.placements?.[0]?.planet || 'Venus';

  const dynamicTransits = {
    today: [
      { planet: 'Moon', aspect: 'Trine', natalPlanet: tropicalBaseline, system: 'Tropical', description: 'Emotional harmony and ease of self-expression.' },
      { planet: 'Mercury', aspect: 'Conjunction', natalPlanet: siderealBaseline, system: 'Sidereal', description: 'Pleasant communications and social interactions.' }
    ],
    month: [
      { planet: 'Sun', aspect: 'Square', natalPlanet: 'Mars', system: 'Tropical', description: 'Potential for friction; channel energy constructively.' },
      { planet: 'Venus', aspect: 'Sextile', natalPlanet: 'Jupiter', system: 'Sidereal', description: 'Favorable period for financial and romantic growth.' }
    ],
    year: [
      { planet: 'Jupiter', aspect: 'Trine', natalPlanet: tropicalBaseline, system: 'Tropical', description: 'A major cycle of expansion, optimism, and opportunity.' },
      { planet: 'Saturn', aspect: 'Conjunction', natalPlanet: siderealBaseline, system: 'Sidereal', description: 'A period of emotional maturation and restructuring.' },
      { planet: 'Uranus', aspect: 'Opposition', natalPlanet: draconicBaseline, system: 'Draconic', description: 'Sudden insights and shifts in perspective.' },
      { planet: 'Pluto', aspect: 'Trine', natalPlanet: heliocentricBaseline, system: 'Heliocentric', description: 'Deep transformation in values and relationships.' }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Radar Navigation */}
      <nav className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 border-b border-ash-grey/10">
        <TabButton 
          active={activeTab === 'today'} 
          onClick={() => setActiveTab('today')} 
          icon={<Clock className="w-4 h-4" />} 
          label="Today" 
        />
        <TabButton 
          active={activeTab === 'month'} 
          onClick={() => setActiveTab('month')} 
          icon={<Calendar className="w-4 h-4" />} 
          label="This Month" 
        />
        <TabButton 
          active={activeTab === 'year'} 
          onClick={() => setActiveTab('year')} 
          icon={<Compass className="w-4 h-4" />} 
          label="This Year" 
        />
        <TabButton 
          active={activeTab === 'epicycle'} 
          onClick={() => setActiveTab('epicycle')} 
          icon={<Activity className="w-4 h-4" />} 
          label="9-Year Epicycle" 
        />
      </nav>

      {/* Temporal Containers */}
      <div className="bg-obsidian border border-ash-grey/10 rounded-xl p-6 shadow-lg min-h-[300px]">
        {activeTab === 'today' && <TransitContainer title="Daily Transits" data={dynamicTransits.today} />}
        {activeTab === 'month' && <TransitContainer title="Monthly Transits" data={dynamicTransits.month} />}
        {activeTab === 'year' && <TransitContainer title="Annual Outer Planet Transits" data={dynamicTransits.year} showAllSystems />}
        {activeTab === 'epicycle' && <EpicycleContainer personalYear={personalYear} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-widest uppercase whitespace-nowrap transition-colors ${
        active 
          ? 'bg-nebula-purple/20 text-nebula-purple border border-nebula-purple/50' 
          : 'bg-black/30 text-ash-grey border border-transparent hover:bg-black/50 hover:text-starlight-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function TransitContainer({ title, data, showAllSystems = false }: { title: string, data: any[], showAllSystems?: boolean }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-astral-gold"></span>
        {title}
      </h2>
      
      <div className="space-y-4">
        {data.map((transit, idx) => (
          <div key={idx} className="bg-black/40 p-4 rounded-lg border border-ash-grey/10">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-starlight-white font-bold">{transit.planet}</span>
                <span className="text-nebula-purple text-xs uppercase tracking-wider">{transit.aspect}</span>
                <span className="text-starlight-white font-bold">{transit.natalPlanet}</span>
              </div>
              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${
                transit.system === 'Tropical' ? 'border-blue-500/30 text-blue-400' :
                transit.system === 'Sidereal' ? 'border-purple-500/30 text-purple-400' :
                transit.system === 'Draconic' ? 'border-red-500/30 text-red-400' :
                'border-yellow-500/30 text-yellow-400'
              }`}>
                {transit.system}
              </span>
            </div>
            <p className="text-ash-grey text-sm">{transit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EpicycleContainer({ personalYear }: { personalYear: number }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-astral-gold"></span>
        The 9-Year Epicycle
      </h2>
      
      <div className="bg-black/40 p-6 rounded-lg border border-astral-gold/20 text-center">
        <p className="text-ash-grey text-xs uppercase tracking-wider mb-2">Current Personal Year</p>
        <p className="text-6xl font-bold text-astral-gold mb-6">{personalYear}</p>
        
        <div className="border-t border-ash-grey/10 pt-6">
          <p className="text-starlight-white text-sm leading-relaxed max-w-lg mx-auto">
            {PERSONAL_YEAR_INTERPRETATIONS[personalYear] || "Interpretation unavailable."}
          </p>
        </div>
      </div>
    </div>
  );
}

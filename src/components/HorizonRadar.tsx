import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Compass, Activity, RefreshCcw, Radio, Palette, Quote, Target, ShieldAlert } from 'lucide-react';
import { generateForecast, getRadarEnhancements } from '../utils/geminiClient';
import { calculateLiveTransits } from '../utils/transitEngine';

const planetSymbols: Record<string, string> = { 'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇' };
const zodiacSymbols: Record<string, string> = { 'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏', 'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓' };

function calculatePersonalYear(birthMonth: string, birthDay: string) {
  const currentYear = new Date().getFullYear();
  const month = parseInt(birthMonth || '1', 10);
  const day = parseInt(birthDay || '1', 10);
  const reduceToSingleDigit = (num: number): number => {
    if (num === 0) return 0;
    const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    return sum > 9 ? reduceToSingleDigit(sum) : sum;
  };
  return reduceToSingleDigit(reduceToSingleDigit(month) + reduceToSingleDigit(day) + reduceToSingleDigit(currentYear));
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

export default function HorizonRadar({ payload }: { payload: any }) {
  const [activeTab, setActiveTab] = useState<'live' | 'today' | 'week' | 'month' | 'year' | 'epicycle'>('live');
  const [forecastData, setForecastData] = useState<any[] | null>(null);
  const [enhancements, setEnhancements] = useState<{colors: string[], affirmation: string}>({ colors: [], affirmation: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [liveTransits, setLiveTransits] = useState<any[]>([]);
  
  const pii = payload?.pii || payload || {};
  const personalYear = calculatePersonalYear(pii.birthMonth, pii.birthDay);

  useEffect(() => {
    setLiveTransits(calculateLiveTransits());
    let isMounted = true;
    setIsLoading(true);
    
    if (payload?.matrices) {
      Promise.all([
        generateForecast(payload.matrices),
        getRadarEnhancements(payload.matrices)
      ]).then(([forecastRes, enhancementRes]) => {
        if (isMounted) { 
          setForecastData(forecastRes); 
          setEnhancements(enhancementRes);
          setIsLoading(false); 
        }
      }).catch(() => {
        if (isMounted) { setForecastData([]); setIsLoading(false); }
      });
    } else {
      setIsLoading(false);
    }
    return () => { isMounted = false; };
  }, [payload]);

  const getFilteredData = (period: string) => {
    if (!forecastData) return [];
    return forecastData.filter((item: any) => item.period?.toLowerCase() === period.toLowerCase());
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">
      
      {/* Structural Enhancements: Affirmation & Colors */}
      {!isLoading && enhancements.affirmation && (
        <div className="bg-obsidian border border-astral-gold/30 rounded-xl p-4 shadow-[0_0_15px_rgba(245,208,97,0.1)] flex flex-col items-center text-center">
          <Quote className="w-6 h-6 text-astral-gold mb-2 opacity-50" />
          <p className="text-starlight-white font-serif italic text-sm md:text-base leading-relaxed max-w-2xl">"{enhancements.affirmation}"</p>
          
          {enhancements.colors.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span className="text-ash-grey text-[10px] uppercase tracking-widest flex items-center gap-1"><Palette className="w-3 h-3" /> Resonant Colors:</span>
              {enhancements.colors.map((color, idx) => (
                <span key={idx} className="text-[10px] font-bold tracking-wider uppercase text-nebula-purple bg-nebula-purple/10 border border-nebula-purple/30 px-2 py-0.5 rounded">
                  {color}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Radar Navigation */}
      <nav className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 border-b border-ash-grey/10">
        <TabButton active={activeTab === 'live'} onClick={() => setActiveTab('live')} icon={<Radio className="w-4 h-4" />} label="Live Sky" />
        <TabButton active={activeTab === 'today'} onClick={() => setActiveTab('today')} icon={<Clock className="w-4 h-4" />} label="Today" />
        <TabButton active={activeTab === 'week'} onClick={() => setActiveTab('week')} icon={<Calendar className="w-4 h-4" />} label="This Week" />
        <TabButton active={activeTab === 'month'} onClick={() => setActiveTab('month')} icon={<Calendar className="w-4 h-4" />} label="This Month" />
        <TabButton active={activeTab === 'year'} onClick={() => setActiveTab('year')} icon={<Compass className="w-4 h-4" />} label="This Year" />
        <TabButton active={activeTab === 'epicycle'} onClick={() => setActiveTab('epicycle')} icon={<Activity className="w-4 h-4" />} label="9-Year Epicycle" />
      </nav>

      {/* Temporal Containers */}
      <div className="bg-obsidian border border-ash-grey/10 rounded-xl p-4 md:p-6 shadow-lg min-h-[300px]">
        {activeTab === 'live' && <LiveSkyContainer data={liveTransits} />}
        
        {activeTab !== 'live' && activeTab !== 'epicycle' && isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] space-y-4">
            <RefreshCcw className="w-8 h-8 text-nebula-purple animate-spin" />
            <p className="text-astral-gold text-xs md:text-sm uppercase tracking-widest font-bold animate-pulse">
              Synthesizing Quantum Forecast...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'today' && <TransitContainer title="Daily Operational Brief" data={getFilteredData('Daily')} />}
            {activeTab === 'week' && <TransitContainer title="Weekly Operational Brief" data={getFilteredData('Weekly')} />}
            {activeTab === 'month' && <TransitContainer title="Monthly Operational Brief" data={getFilteredData('Monthly')} />}
            {activeTab === 'year' && <TransitContainer title="Annual Operational Brief" data={getFilteredData('Yearly')} />}
          </>
        )}
        
        {activeTab === 'epicycle' && <EpicycleContainer personalYear={personalYear} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-semibold tracking-widest uppercase whitespace-nowrap transition-colors ${active ? 'bg-nebula-purple/20 text-nebula-purple border border-nebula-purple/50' : 'bg-black/30 text-ash-grey border border-transparent hover:bg-black/50 hover:text-starlight-white'}`}>
      {icon} {label}
    </button>
  );
}

function LiveSkyContainer({ data }: { data: any[] }) {
  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-ash-grey/10 pb-4">
        <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2 mb-2">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" /> Real-Time Orbital Telemetry
        </h2>
        <p className="text-ash-grey text-xs md:text-sm leading-relaxed">
          This grid displays the exact physical coordinates of the planetary bodies at this very second. Unlike your static natal blueprint, the Live Sky represents the "Cosmic Weather." 
          <br/><br/>
          <strong>How to deploy this data:</strong> If the Live Moon is in Pisces, the collective emotional tide is currently highly sensitive. As a Master Builder, you can use this fluid window to bypass rigid logic and 'feel' the structural integrity of your projects. If Live Mars is in Aries, the environment is primed for kinetic action and prototype launching. Align your daily execution with these active frequencies to eliminate friction.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {data.map((p: any, idx: number) => (
          <div key={idx} className="bg-black/40 p-2 md:p-3 rounded-lg border border-astral-gold/20 flex justify-between items-center shadow-[0_0_10px_rgba(245,208,97,0.05)]">
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-starlight-white text-xs md:text-sm flex items-center gap-1">
                <span className="text-nebula-purple font-serif text-sm md:text-base">{planetSymbols[p.planet] || ''}</span>
                {p.planet}
              </span>
            </div>
            <div className="text-right">
              <span className="text-astral-gold text-[10px] md:text-xs uppercase tracking-wider flex items-center justify-end gap-1">
                {p.sign} <span className="text-astral-gold font-serif text-sm">{zodiacSymbols[p.sign] || ''}</span>
              </span>
              <span className="text-ash-grey text-[10px] block">{p.degree}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransitContainer({ title, data }: { title: string, data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-astral-gold"></span>{title}</h2>
        <div className="bg-black/40 p-3 md:p-4 rounded-lg border border-ash-grey/10 text-center">
          <p className="text-ash-grey text-xs uppercase tracking-widest">Awaiting Grid Telemetry...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-ash-grey/10 pb-4">
        <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-astral-gold"></span>{title}
        </h2>
        <p className="text-ash-grey text-xs md:text-sm leading-relaxed">
          This operational brief analyzes how the current celestial weather interacts with your specific natal architecture. Use the "Tactical Execution" and "Friction Avoidance" parameters to navigate the systemic pressure.
        </p>
      </div>
      <div className="space-y-4">
        {data.map((transit, idx) => (
          <div key={idx} className="bg-black/40 p-4 rounded-lg border border-ash-grey/10 shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2 border-b border-ash-grey/10 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-starlight-white font-bold text-sm">{transit.theme}</span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${transit.intensity === 'High' ? 'bg-red-900/30 text-red-400 border border-red-500/20' : transit.intensity === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20' : 'bg-blue-900/30 text-blue-400 border border-blue-500/20'}`}>{transit.intensity} Intensity</span>
              </div>
              {transit.identityTag && <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-nebula-purple/30 text-nebula-purple self-start">{transit.identityTag}</span>}
            </div>
            <p className="text-ash-grey text-sm mb-4 leading-relaxed">{transit.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-2">
              {transit.attempt && (
                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded p-3">
                  <p className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Tactical Execution</p>
                  <p className="text-starlight-white text-xs">{transit.attempt}</p>
                </div>
              )}
              {transit.avoid && (
                <div className="bg-red-900/10 border border-red-500/20 rounded p-3">
                  <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Friction Avoidance</p>
                  <p className="text-starlight-white text-xs">{transit.avoid}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EpicycleContainer({ personalYear }: { personalYear: number }) {
  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-astral-gold font-semibold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-astral-gold"></span>The 9-Year Epicycle</h2>
      <div className="bg-black/40 p-4 md:p-6 rounded-lg border border-astral-gold/20 text-center shadow-md">
        <p className="text-ash-grey text-[10px] md:text-xs uppercase tracking-wider mb-2">Current Personal Year</p>
        <p className="text-4xl md:text-6xl font-bold text-astral-gold mb-4 md:mb-6">{personalYear}</p>
        <div className="border-t border-ash-grey/10 pt-4 md:pt-6">
          <p className="text-starlight-white text-sm leading-relaxed max-w-lg mx-auto">{PERSONAL_YEAR_INTERPRETATIONS[personalYear] || "Interpretation unavailable."}</p>
        </div>
      </div>
    </div>
  );
}

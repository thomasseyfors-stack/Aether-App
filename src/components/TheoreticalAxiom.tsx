import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Beaker } from 'lucide-react';
import { 
  NumerologyCard, 
  TropicalPlacidusCard, 
  OpenConductorsCard, 
  VaultCard 
} from './Dashboard';

// Mathematical Helper: Convert Gregorian to Cotsworth 13-Month Calendar
function convertToCotsworth(yearStr: string, monthStr: string, dayStr: string, timeStr: string) {
  const year = parseInt(yearStr || '2000', 10);
  const month = parseInt(monthStr || '1', 10);
  const day = parseInt(dayStr || '1', 10);
  
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const date = new Date(year, month - 1, day);
  const start = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000) + 1;

  let isNullTimeAnomaly = false;
  let cotsworthMonthName = "";
  let cotsworthDay = 1;

  const cotsworthMonths = [
    "January", "February", "March", "April", "May", "June",
    "Sol", "July", "August", "September", "October", "November", "December"
  ];

  if (isLeap && dayOfYear === 169) {
    isNullTimeAnomaly = true;
    cotsworthMonthName = "Leap Day";
    cotsworthDay = 29;
  } else if ((!isLeap && dayOfYear === 365) || (isLeap && dayOfYear === 366)) {
    isNullTimeAnomaly = true;
    cotsworthMonthName = "Year Day";
    cotsworthDay = 29;
  } else {
    let adjustedDay = dayOfYear;
    if (isLeap && dayOfYear > 169) {
      adjustedDay -= 1;
    }
    const monthIdx = Math.ceil(adjustedDay / 28) - 1;
    cotsworthMonthName = cotsworthMonths[monthIdx];
    cotsworthDay = adjustedDay % 28;
    if (cotsworthDay === 0) cotsworthDay = 28;
  }

  // Convert time to UTC
  const pad = (n: number) => n.toString().padStart(2, '0');
  const localDateString = `${year}-${pad(month)}-${pad(day)}T${timeStr || '12:00'}:00`;
  const localDate = new Date(localDateString);
  let utcTime = "00:00";
  if (!isNaN(localDate.getTime())) {
    utcTime = localDate.toISOString().substring(11, 16);
  }

  return {
    cotsworthDate: `${cotsworthMonthName} ${cotsworthDay}, ${year}`,
    utcTime,
    isNullTimeAnomaly
  };
}

// Mock Theoretical Data
const mockTheoreticalData = {
  numerology: {
    lifePath: 11,
    expression: 22,
    interpretation: "Master Number 11 in the theoretical matrix indicates a profound channel for intuitive insights. The Expression 22 suggests the capacity to build structures that bridge the ethereal and the material. This anomaly state reveals hidden potential."
  },
  placements: [
    { planet: 'Sun', sign: 'Ophiuchus', degree: '2°' },
    { planet: 'Moon', sign: 'Aries', degree: '15°' },
    { planet: 'Mercury', sign: 'Scorpio', degree: '28°', isRetrograde: true },
    { planet: 'Venus', sign: 'Virgo', degree: '11°' },
    { planet: 'Mars', sign: 'Pisces', degree: '7°' },
    { planet: 'Jupiter', sign: 'Gemini', degree: '22°' },
    { planet: 'Saturn', sign: 'Sagittarius', degree: '19°', isRetrograde: true },
  ],
  angles: {
    ascendant: { sign: 'Aquarius', degree: '15°' },
    midheaven: { sign: 'Sagittarius', degree: '10°' },
    houses: "Theoretical houses shifted based on Cotsworth temporal coordinates."
  },
  vaults: {
    sidereal: {
      title: "Theoretical Sidereal",
      subtitle: "Shifted Resonance",
      placements: [
        { planet: 'Sun', sign: 'Virgo', degree: '8°' },
        { planet: 'Moon', sign: 'Pisces', degree: '21°' },
        { planet: 'Mars', sign: 'Aquarius', degree: '14°' },
      ],
      aspects: [
        { type: 'Opposition', planets: 'Sun - Moon', orb: '1°' }
      ]
    },
    draconic: {
      title: "Theoretical Draconic",
      subtitle: "Shifted Matrix",
      placements: [
        { planet: 'Sun', sign: 'Taurus', degree: '15°' },
        { planet: 'Venus', sign: 'Aries', degree: '2°', isRetrograde: true },
      ],
      aspects: [
        { type: 'Conjunction', planets: 'Sun - Venus', orb: '5°' }
      ]
    },
    heliocentric: {
      title: "Theoretical Heliocentric",
      subtitle: "Shifted Coordinates",
      placements: [
        { planet: 'Earth', sign: 'Scorpio', degree: '2°' },
        { planet: 'Mars', sign: 'Taurus', degree: '28°' },
      ],
      aspects: [
        { type: 'Opposition', planets: 'Earth - Mars', orb: '4°' }
      ]
    }
  }
};

export default function TheoreticalAxiom({ payload, onBack }: { payload: any, onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(true);
  const [theoreticalData, setTheoreticalData] = useState<any>(null);
  const [cotsworthInfo, setCotsworthInfo] = useState<any>(null);

  useEffect(() => {
    // Calculate Temporal Shift
    const info = convertToCotsworth(
      payload?.birthYear,
      payload?.birthMonth,
      payload?.birthDay,
      payload?.birthTime
    );
    setCotsworthInfo(info);

    // Simulate API Routing for Theoretical Data
    const fetchTheoreticalData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second simulated latency
        setTheoreticalData(mockTheoreticalData);
      } catch (error) {
        console.error("Failed to fetch theoretical data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheoreticalData();
  }, [payload]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-4">
        <Beaker className="w-12 h-12 text-nebula-purple mb-6 animate-pulse" />
        <h2 className="text-xl font-bold text-starlight-white tracking-widest uppercase mb-2">Initializing Axiom Sandbox</h2>
        <p className="text-ash-grey text-sm tracking-widest uppercase animate-pulse">Calculating Temporal Shift...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-nebula-purple/50 pb-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-ash-grey hover:text-starlight-white transition-colors text-xs uppercase tracking-widest mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Primary Grid
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Beaker className="w-8 h-8 text-nebula-purple" />
            <h1 className="text-3xl font-bold text-nebula-purple tracking-widest uppercase">Theoretical Axiom</h1>
          </div>
          <p className="text-ash-grey text-sm tracking-widest uppercase">
            Simulation Sandbox Active
          </p>
        </header>

        {/* Theoretical Demographics Component */}
        <section className="bg-nebula-purple/10 border border-nebula-purple/30 rounded-xl p-6 shadow-[0_0_30px_rgba(106,13,173,0.1)]">
          <h2 className="text-starlight-white font-semibold uppercase tracking-widest text-sm mb-4">
            Temporal Shift Parameters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/40 p-4 rounded-lg border border-nebula-purple/20">
              <p className="text-ash-grey text-[10px] uppercase tracking-wider mb-1">Cotsworth Date</p>
              <p className="text-sm font-bold text-starlight-white">{cotsworthInfo?.cotsworthDate}</p>
              {cotsworthInfo?.isNullTimeAnomaly && (
                <p className="text-red-400 text-[10px] uppercase tracking-widest mt-1 font-bold animate-pulse">Null-Time Anomaly</p>
              )}
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-nebula-purple/20">
              <p className="text-ash-grey text-[10px] uppercase tracking-wider mb-1">UTC Time</p>
              <p className="text-sm font-bold text-starlight-white">{cotsworthInfo?.utcTime}</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-nebula-purple/20">
              <p className="text-ash-grey text-[10px] uppercase tracking-wider mb-1">Theoretical Life Path</p>
              <p className="text-sm font-bold text-astral-gold">{theoreticalData?.numerology?.lifePath}</p>
            </div>
          </div>
        </section>

        {/* Matrix Rendering (Reusing Components) */}
        <div className="flex flex-col gap-6">
          <NumerologyCard data={theoreticalData?.numerology} />
          <TropicalPlacidusCard data={theoreticalData} isDefaultTime={payload?.isDefaultTime ?? true} />
          <OpenConductorsCard placements={theoreticalData?.placements} />
          
          <div className="pt-8 space-y-4 border-t border-ash-grey/10">
            <h3 className="text-ash-grey text-xs tracking-widest uppercase mb-4 text-center">Theoretical Sectors</h3>
            <VaultCard data={theoreticalData?.vaults?.sidereal} />
            <VaultCard data={theoreticalData?.vaults?.draconic} />
            <VaultCard data={theoreticalData?.vaults?.heliocentric} />
          </div>
        </div>
      </div>
    </div>
  );
}

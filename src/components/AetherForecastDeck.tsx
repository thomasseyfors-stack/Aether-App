import React, { useState, useEffect } from 'react';
import { generateChronometerForecast } from '../utils/geminiClient';
import { Clock, AlertTriangle, Zap, ShieldAlert, Activity, Crosshair, Calendar, CalendarDays, CalendarRange, CalendarCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type VectorData = {
  active_transit: string;
  energy_status: string;
  recommended_activities: string[];
  system_warning: string;
};

type ForecastData = {
  forecast_target: string;
  chronological_matrix: {
    daily_vector: VectorData;
    weekly_vector: VectorData;
    monthly_vector: VectorData;
    yearly_vector: VectorData;
  };
};

type TemporalVector = 'Today' | 'This Week' | 'This Month' | 'This Year';

const TemporalSelector = ({ 
  selected, 
  onSelect 
}: { 
  selected: TemporalVector; 
  onSelect: (v: TemporalVector) => void;
}) => {
  const vectors: { label: TemporalVector; icon: React.ReactNode }[] = [
    { label: 'Today', icon: <Calendar className="w-4 h-4" /> },
    { label: 'This Week', icon: <CalendarDays className="w-4 h-4" /> },
    { label: 'This Month', icon: <CalendarRange className="w-4 h-4" /> },
    { label: 'This Year', icon: <CalendarCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-wrap bg-black/50 p-1 rounded-lg border border-ash-grey/10 w-full overflow-x-auto gap-1 mb-6">
      {vectors.map((v) => (
        <button
          key={v.label}
          onClick={() => onSelect(v.label)}
          className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
            selected === v.label 
              ? 'bg-obsidian text-astral-gold shadow-md border border-astral-gold/30' 
              : 'text-ash-grey hover:text-starlight-white'
          }`}
        >
          {v.icon} {v.label}
        </button>
      ))}
    </div>
  );
};

const ActiveTransitTicker = ({ vector }: { vector: VectorData }) => {
  const isDrag = vector.energy_status?.includes("Systemic Drag") || vector.energy_status?.includes("Drag") || vector.energy_status?.includes("Friction");
  const isFlow = vector.energy_status?.includes("Optimized Flow") || vector.energy_status?.includes("Flow");

  return (
    <div className={`bg-black/30 p-4 rounded-lg border mb-6 ${isDrag ? 'border-red-500/30' : isFlow ? 'border-emerald-500/30' : 'border-ash-grey/20'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-ash-grey text-[10px] uppercase tracking-widest font-bold mb-1">Active Transit</p>
          <p className="text-astral-gold text-lg font-bold font-mono">{vector.active_transit}</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isDrag ? 'text-red-400' : isFlow ? 'text-emerald-400' : 'text-ash-grey'}`} />
          <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full font-bold ${isDrag ? 'bg-red-900/40 text-red-400' : isFlow ? 'bg-emerald-900/40 text-emerald-400' : 'bg-ash-grey/20 text-ash-grey'}`}>
            {vector.energy_status}
          </span>
        </div>
      </div>
    </div>
  );
};

const ActivityRecommendationGrid = ({ activities }: { activities: string[] }) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-starlight-white font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-ash-grey/20 pb-2">
        <Zap className="w-4 h-4 text-nebula-purple" /> Recommended Activities
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activities.map((activity, idx) => (
          <div key={idx} className="bg-obsidian border border-ash-grey/10 p-4 rounded-lg flex items-start gap-3 hover:border-nebula-purple/30 transition-colors">
            <Crosshair className="w-4 h-4 mt-0.5 shrink-0 text-nebula-purple" />
            <p className="text-ash-grey text-sm leading-relaxed">{activity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FrictionWarningBanner = ({ warning, status }: { warning: string; status: string }) => {
  if (!warning || warning === "None" || warning === "N/A") return null;
  
  // Check if it's a drag/friction state
  const isDrag = status?.includes("Systemic Drag") || status?.includes("Drag") || status?.includes("Friction") || warning.toLowerCase().includes("square") || warning.toLowerCase().includes("opposition");
  
  if (!isDrag) return null;

  return (
    <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-red-400 text-xs uppercase tracking-widest font-bold mb-1">Systemic Drag Alert</p>
        <p className="text-red-200/80 text-sm leading-relaxed">{warning}</p>
      </div>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-12 bg-ash-grey/10 rounded-lg w-full"></div>
    <div className="h-24 bg-ash-grey/10 rounded-lg w-full"></div>
    <div className="space-y-3">
      <div className="h-4 bg-ash-grey/10 rounded w-1/4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="h-20 bg-ash-grey/10 rounded-lg w-full"></div>
        <div className="h-20 bg-ash-grey/10 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
);

export default function AetherForecastDeck({ payload }: { payload: any }) {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemporal, setSelectedTemporal] = useState<TemporalVector>('Today');

  useEffect(() => {
    let isMounted = true;
    
    const fetchForecast = async () => {
      try {
        setLoading(true);
        // We use the current local time as requested
        const currentTime = "2026-03-08T17:16:05-07:00";
        const liveEphemerisData = { 
          current_transits: "Live Ephemeris Data Sync",
          current_time: currentTime
        }; 
        const result = await generateChronometerForecast(payload, liveEphemerisData);
        if (isMounted) {
          setForecast(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to generate Structural Forecast. The chronometer is experiencing temporal interference.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchForecast();

    return () => {
      isMounted = false;
    };
  }, [payload]);

  if (loading) {
    return (
      <div className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Clock className="w-5 h-5 animate-spin text-astral-gold" />
          <h2 className="text-starlight-white font-bold uppercase tracking-widest text-sm">Synchronizing Chronometer...</h2>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-red-400 uppercase tracking-widest text-sm">{error}</p>
      </div>
    );
  }

  if (!forecast || !forecast.chronological_matrix) return null;

  const getActiveVectorData = (): VectorData | null => {
    switch (selectedTemporal) {
      case 'Today': return forecast.chronological_matrix.daily_vector;
      case 'This Week': return forecast.chronological_matrix.weekly_vector;
      case 'This Month': return forecast.chronological_matrix.monthly_vector;
      case 'This Year': return forecast.chronological_matrix.yearly_vector;
      default: return null;
    }
  };

  const activeVector = getActiveVectorData();

  return (
    <div className="bg-obsidian border border-ash-grey/20 rounded-xl p-4 md:p-6 shadow-lg animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-ash-grey/10 pb-4">
        <h2 className="text-astral-gold font-bold uppercase tracking-widest text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" /> Aether Forecast Deck
        </h2>
        {forecast.forecast_target && (
          <p className="text-ash-grey text-[10px] uppercase tracking-widest font-bold">
            Target: <span className="text-starlight-white">{forecast.forecast_target}</span>
          </p>
        )}
      </div>

      <TemporalSelector selected={selectedTemporal} onSelect={setSelectedTemporal} />

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTemporal}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeVector ? (
            <>
              <FrictionWarningBanner warning={activeVector.system_warning} status={activeVector.energy_status} />
              <ActiveTransitTicker vector={activeVector} />
              <ActivityRecommendationGrid activities={activeVector.recommended_activities} />
            </>
          ) : (
            <div className="text-center py-10 text-ash-grey text-sm uppercase tracking-widest">
              No telemetry data available for this vector.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

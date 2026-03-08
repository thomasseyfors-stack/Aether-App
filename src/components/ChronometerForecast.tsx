import React, { useState, useEffect } from 'react';
import { generateChronometerForecast } from '../utils/geminiClient';
import { Clock, AlertTriangle, Zap, ShieldAlert, Activity, Crosshair } from 'lucide-react';
import { motion } from 'motion/react';

export default function ChronometerForecast({ payload }: { payload: any }) {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchForecast = async () => {
      try {
        setLoading(true);
        // For the Chronometer, we need both the quantitative identity (payload) 
        // and live ephemeris data. In this phase, we use the payload as a proxy
        // or mock the live ephemeris data if it's not available in the payload.
        const liveEphemerisData = { 
          current_transits: "Simulated Live Data",
          current_time: "2026-03-08T15:42:45-07:00"
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
      <div className="flex flex-col items-center justify-center py-20 text-ash-grey">
        <Clock className="w-8 h-8 animate-spin text-astral-gold mb-4" />
        <p className="uppercase tracking-widest text-sm animate-pulse">Calculating Structural Forecast...</p>
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

  if (!forecast) return null;

  const renderVector = (vector: any, title: string, icon: React.ReactNode) => {
    if (!vector) return null;
    const isDrag = vector.energy_status?.includes("Systemic Drag") || vector.energy_status?.includes("Drag");
    const isFlow = vector.energy_status?.includes("Optimized Flow") || vector.energy_status?.includes("Flow");
    
    return (
      <div className="mb-6">
        <h3 className="text-starlight-white font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2 border-b border-ash-grey/20 pb-2">
          {icon} {title}
        </h3>
        <div className={`bg-black/30 p-4 rounded border ${isDrag ? 'border-red-500/30' : isFlow ? 'border-emerald-500/30' : 'border-ash-grey/20'}`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-astral-gold text-sm font-bold font-mono">{vector.active_transit}</span>
            <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${isDrag ? 'bg-red-900/40 text-red-400' : isFlow ? 'bg-emerald-900/40 text-emerald-400' : 'bg-ash-grey/20 text-ash-grey'}`}>
              {vector.energy_status}
            </span>
          </div>
          
          <div className="mb-3">
            <p className="text-starlight-white text-[10px] uppercase tracking-widest font-bold mb-2">Recommended Activities:</p>
            <ul className="space-y-1">
              {vector.recommended_activities?.map((activity: string, idx: number) => (
                <li key={idx} className="text-ash-grey text-xs leading-relaxed flex items-start gap-2">
                  <Crosshair className="w-3 h-3 mt-0.5 shrink-0 text-nebula-purple" />
                  {activity}
                </li>
              ))}
            </ul>
          </div>

          {vector.system_warning && (
            <div className="mt-3 pt-3 border-t border-ash-grey/10">
              <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> System Warning
              </p>
              <p className="text-ash-grey text-xs leading-relaxed">{vector.system_warning}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {forecast.forecast_target && (
        <div className="bg-obsidian border border-ash-grey/20 rounded-xl p-4 text-center">
          <p className="text-ash-grey text-xs uppercase tracking-widest font-bold">Forecast Target: <span className="text-astral-gold">{forecast.forecast_target}</span></p>
        </div>
      )}
      <section className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
        <h2 className="text-astral-gold font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Fast-Moving Transits (Tactical)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderVector(forecast.chronological_matrix?.daily_vector, "Daily Vector", <Activity className="w-3 h-3 text-nebula-purple" />)}
          </div>
          <div>
            {renderVector(forecast.chronological_matrix?.weekly_vector, "Weekly Vector", <Activity className="w-3 h-3 text-nebula-purple" />)}
          </div>
        </div>
      </section>

      <section className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
        <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Slow-Moving Macrosystem (Strategic)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderVector(forecast.chronological_matrix?.monthly_vector, "Monthly Architecture", <Activity className="w-3 h-3 text-emerald-400" />)}
          </div>
          <div>
            {renderVector(forecast.chronological_matrix?.yearly_vector, "Yearly Architecture", <Activity className="w-3 h-3 text-emerald-400" />)}
          </div>
        </div>
      </section>
    </div>
  );
}

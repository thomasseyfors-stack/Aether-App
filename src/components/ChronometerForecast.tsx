import React, { useState } from 'react';
import { generateChronometerForecast } from '../utils/geminiClient';
import { Clock, AlertTriangle, Zap, ShieldAlert, Activity, Crosshair, Users } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_TELEMETRY = {
  "command": "GENERATE_TEMPORAL_FORECAST",
  "forecast_target": "Thomas_Seyfors_001",
  "input_telemetry": {
    "quantitative_identity": {
      "primary_hardware": {
        "sun": "Gemini",
        "moon": "Pisces",
        "mercury": "Taurus",
        "mars": "Gemini"
      },
      "systemic_weaknesses": ["Mutable Overload", "Boundary Dissolution"]
    },
    "live_ephemeris_data": {
      "current_date": "2026-03-08",
      "current_time": "2026-03-08T15:08:56-07:00",
      "fast_transits": [
        {"planet": "Moon", "sign": "Sagittarius", "aspect_to_natal": "Square Pisces Moon, Oppose Gemini Sun"},
        {"planet": "Mercury", "sign": "Pisces", "aspect_to_natal": "Sextile Taurus Mercury"}
      ],
      "macro_transits": [
        {"planet": "Pluto", "sign": "Aquarius", "aspect_to_natal": "Trine Gemini Sun"},
        {"planet": "Saturn", "sign": "Aries", "aspect_to_natal": "Sextile Gemini Mars"}
      ]
    }
  }
};

export default function ChronometerForecast({ payload }: { payload: any }) {
  const [telemetryInput, setTelemetryInput] = useState(JSON.stringify(MOCK_TELEMETRY, null, 2));
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedInput = JSON.parse(telemetryInput);
      
      const quantitativeIdentity = parsedInput.input_telemetry?.quantitative_identity || parsedInput.quantitative_identity;
      const liveEphemerisData = parsedInput.input_telemetry?.live_ephemeris_data || parsedInput.live_ephemeris_data;

      if (liveEphemerisData && !liveEphemerisData.current_time) {
        liveEphemerisData.current_time = "2026-03-08T15:08:56-07:00";
      }

      const result = await generateChronometerForecast(quantitativeIdentity, liveEphemerisData);
      setForecast(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate Structural Forecast. Check JSON syntax.");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-astral-gold font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Input Telemetry
            </h2>
            <p className="text-ash-grey text-xs mb-4">Input the quantitative identity and live ephemeris data (JSON format) to initialize the temporal forecast.</p>
            <textarea
              className="w-full h-64 bg-black/50 border border-ash-grey/20 rounded p-3 text-xs font-mono text-starlight-white focus:border-astral-gold focus:ring-1 focus:ring-astral-gold outline-none resize-none"
              value={telemetryInput}
              onChange={(e) => setTelemetryInput(e.target.value)}
              spellCheck={false}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-4 bg-astral-gold/10 hover:bg-astral-gold/20 text-astral-gold border border-astral-gold/30 py-3 rounded uppercase tracking-widest text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Activity className="w-4 h-4 animate-spin" /> Calculating Forecast...</>
              ) : (
                <><Zap className="w-4 h-4" /> Execute Forecast</>
              )}
            </button>
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {!forecast && !loading && (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-ash-grey/20 rounded-xl p-10 text-center">
              <Clock className="w-12 h-12 text-ash-grey/40 mb-4" />
              <p className="text-ash-grey uppercase tracking-widest text-sm">Awaiting Telemetry Data</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center border border-ash-grey/10 rounded-xl p-10 text-center bg-obsidian/50">
              <Clock className="w-12 h-12 text-astral-gold animate-pulse mb-4" />
              <p className="text-astral-gold uppercase tracking-widest text-sm animate-pulse">Calculating Structural Forecast...</p>
            </div>
          )}

          {forecast && !loading && (
            <div className="space-y-6">
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
          )}
        </div>
      </div>
    </div>
  );
}

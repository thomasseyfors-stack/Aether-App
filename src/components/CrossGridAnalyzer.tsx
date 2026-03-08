import React, { useState } from 'react';
import { generateCrossGridAnalysis } from '../utils/geminiClient';
import { Network, AlertTriangle, Zap, ShieldAlert, Activity, Crosshair, Users, CheckCircle2, MessageSquare, ActivitySquare } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_RECEIVING_NODE = {
  "numerology": {
    "life_path": 7,
    "core_archetype": "The Deep Diver",
    "star_ki": "4-4-1"
  },
  "natal_placements": {
    "tropical": { "sun": "Scorpio", "moon": "Cancer", "mercury": "Scorpio", "mars": "Leo", "jupiter": "Pisces", "saturn": "Capricorn", "ascendant": "Taurus" },
    "draconic": { "sun": "Scorpio", "moon": "Cancer", "ascendant": "Taurus", "midheaven": "Aquarius" }
  }
};

export default function CrossGridAnalyzer({ originNode }: { originNode: any }) {
  const [receivingNodeInput, setReceivingNodeInput] = useState(JSON.stringify(MOCK_RECEIVING_NODE, null, 2));
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);
      const receivingNode = JSON.parse(receivingNodeInput);
      const result = await generateCrossGridAnalysis(originNode, receivingNode);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Failed to execute Cross-Grid Analysis. Check JSON syntax.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-astral-gold font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
              <Network className="w-4 h-4" /> Receiving Node Data
            </h2>
            <p className="text-ash-grey text-xs mb-4">Input the target node's structural data (JSON format) to initialize the cross-grid resonance calculation.</p>
            <textarea
              className="w-full h-64 bg-black/50 border border-ash-grey/20 rounded p-3 text-xs font-mono text-starlight-white focus:border-astral-gold focus:ring-1 focus:ring-astral-gold outline-none resize-none"
              value={receivingNodeInput}
              onChange={(e) => setReceivingNodeInput(e.target.value)}
              spellCheck={false}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-4 bg-astral-gold/10 hover:bg-astral-gold/20 text-astral-gold border border-astral-gold/30 py-3 rounded uppercase tracking-widest text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Activity className="w-4 h-4 animate-spin" /> Calculating Resonance...</>
              ) : (
                <><Zap className="w-4 h-4" /> Execute Analysis</>
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
          {!analysis && !loading && (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-ash-grey/20 rounded-xl p-10 text-center">
              <Users className="w-12 h-12 text-ash-grey/40 mb-4" />
              <p className="text-ash-grey uppercase tracking-widest text-sm">Awaiting Target Node Data</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center border border-ash-grey/10 rounded-xl p-10 text-center bg-obsidian/50">
              <Network className="w-12 h-12 text-astral-gold animate-pulse mb-4" />
              <p className="text-astral-gold uppercase tracking-widest text-sm animate-pulse">Establishing Cross-Grid Connection...</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-6">
              {/* Header / Score */}
              <div className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-starlight-white font-bold uppercase tracking-widest text-lg mb-1">
                    {analysis.connection_classification}
                  </h2>
                  <p className="text-ash-grey text-xs uppercase tracking-widest">Connection Classification</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-astral-gold text-3xl font-bold font-mono leading-none">
                      {analysis.cross_grid_analysis?.system_resonance_score}%
                    </p>
                    <p className="text-ash-grey text-[10px] uppercase tracking-widest mt-1">System Resonance</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-astral-gold/20 flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="32" cy="32" r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-astral-gold"
                        strokeDasharray="175.93"
                        strokeDashoffset={175.93 - (175.93 * (analysis.cross_grid_analysis?.system_resonance_score || 0)) / 100}
                      />
                    </svg>
                    <ActivitySquare className="w-6 h-6 text-astral-gold" />
                  </div>
                </div>
              </div>

              {/* Qualities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strong Qualities */}
                <div className="bg-obsidian border border-emerald-500/20 rounded-xl p-6 shadow-lg">
                  <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                    <CheckCircle2 className="w-4 h-4" /> Strong Qualities
                  </h3>
                  <div className="space-y-4">
                    {analysis.cross_grid_analysis?.strong_qualities?.map((q: any, idx: number) => (
                      <div key={idx} className="bg-emerald-900/10 p-3 rounded border border-emerald-500/10">
                        <span className="text-emerald-300 text-[10px] uppercase tracking-widest font-bold block mb-1">{q.aspect}</span>
                        <p className="text-ash-grey text-xs leading-relaxed">{q.translation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toxic Qualities */}
                <div className="bg-obsidian border border-red-500/20 rounded-xl p-6 shadow-lg">
                  <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-red-500/20 pb-2">
                    <ShieldAlert className="w-4 h-4" /> Toxic Qualities
                  </h3>
                  <div className="space-y-4">
                    {analysis.cross_grid_analysis?.toxic_qualities?.map((q: any, idx: number) => (
                      <div key={idx} className="bg-red-900/10 p-3 rounded border border-red-500/10">
                        <span className="text-red-300 text-[10px] uppercase tracking-widest font-bold block mb-1">{q.aspect}</span>
                        <p className="text-ash-grey text-xs leading-relaxed">{q.translation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
                <h3 className="text-astral-gold font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-ash-grey/20 pb-2">
                  <Crosshair className="w-4 h-4" /> Operative Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-starlight-white text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                      <Activity className="w-3 h-3 text-nebula-purple" /> Recommended Activities
                    </p>
                    <ul className="space-y-2">
                      {analysis.cross_grid_analysis?.operative_recommendations?.recommended_activities?.map((act: string, idx: number) => (
                        <li key={idx} className="text-ash-grey text-xs leading-relaxed flex items-start gap-2">
                          <span className="text-astral-gold mt-0.5">•</span> {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-starlight-white text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 text-nebula-purple" /> Discussion Topics
                    </p>
                    <ul className="space-y-2">
                      {analysis.cross_grid_analysis?.operative_recommendations?.discussion_topics?.map((topic: string, idx: number) => (
                        <li key={idx} className="text-ash-grey text-xs leading-relaxed flex items-start gap-2">
                          <span className="text-astral-gold mt-0.5">•</span> {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

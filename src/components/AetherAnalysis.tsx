import React, { useState, useEffect } from 'react';
import { generateAetherAnalysis } from '../utils/geminiClient';
import { Activity, ShieldAlert, Zap, Brain, Heart, Target, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AetherAnalysis({ payload }: { payload: any }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const result = await generateAetherAnalysis(payload);
        if (isMounted) {
          setAnalysis(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to generate Aether Analysis. The grid might be experiencing interference.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalysis();

    return () => {
      isMounted = false;
    };
  }, [payload]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-ash-grey">
        <RefreshCw className="w-8 h-8 animate-spin text-nebula-purple mb-4" />
        <p className="uppercase tracking-widest text-sm animate-pulse">Running Sovereign OS Diagnostics...</p>
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

  if (!analysis) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* System Integrity Score */}
      <section className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-nebula-purple/10 to-transparent pointer-events-none"></div>
        <h2 className="text-ash-grey text-xs font-bold uppercase tracking-widest mb-2">System Integrity Score</h2>
        <div className="text-6xl font-black text-starlight-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          {analysis.systemIntegrityScore}
          <span className="text-2xl text-ash-grey">/100</span>
        </div>
      </section>

      {/* Character Stat Sheet */}
      <section className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
        <h2 className="text-astral-gold font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Character Stat Sheet
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatBox label="Logic" value={analysis.characterStats?.logic} icon={<Brain className="w-4 h-4" />} />
          <StatBox label="Tech" value={analysis.characterStats?.tech} icon={<Zap className="w-4 h-4" />} />
          <StatBox label="Empathy" value={analysis.characterStats?.empathy} icon={<Heart className="w-4 h-4" />} />
          <StatBox label="Drive" value={analysis.characterStats?.drive} icon={<Target className="w-4 h-4" />} />
          <StatBox label="Adaptability" value={analysis.characterStats?.adaptability} icon={<RefreshCw className="w-4 h-4" />} />
        </div>
        
        {analysis.characterStats?.activeFrictionMultipliers?.length > 0 && (
          <div className="bg-red-900/10 border border-red-500/30 p-4 rounded-lg">
            <h3 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Active Friction Multipliers
            </h3>
            <ul className="space-y-1">
              {analysis.characterStats.activeFrictionMultipliers.map((fm: string, idx: number) => (
                <li key={idx} className="text-ash-grey text-sm flex items-start gap-2">
                  <span className="text-red-500 mt-1 text-xs">◆</span> {fm}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <section className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
          <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Consensus Strengths
          </h2>
          <div className="space-y-4">
            {analysis.strengths?.map((strength: any, idx: number) => (
              <div key={idx} className="bg-black/30 p-3 rounded border border-emerald-500/20">
                <h3 className="text-starlight-white text-sm font-bold mb-1">{strength.name}</h3>
                <p className="text-ash-grey text-xs leading-relaxed">{strength.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Weaknesses */}
        <section className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
          <h2 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Systemic Weaknesses
          </h2>
          <div className="space-y-4">
            {analysis.weaknesses?.map((weakness: any, idx: number) => (
              <div key={idx} className="bg-black/30 p-3 rounded border border-red-500/20">
                <h3 className="text-starlight-white text-sm font-bold mb-1">{weakness.name}</h3>
                <p className="text-ash-grey text-xs leading-relaxed">{weakness.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Grounding Architecture */}
      <section className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg">
        <h2 className="text-nebula-purple font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4" /> Grounding Architecture & Sub-Routines
        </h2>
        <div className="bg-black/30 p-4 rounded border border-nebula-purple/20">
          <p className="text-ash-grey text-sm leading-relaxed whitespace-pre-wrap">
            {analysis.groundingArchitecture}
          </p>
        </div>
      </section>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-black/40 border border-ash-grey/10 p-3 rounded-lg text-center flex flex-col items-center justify-center">
      <div className="text-astral-gold mb-1">{icon}</div>
      <div className="text-2xl font-bold text-starlight-white mb-1">{value || 0}</div>
      <div className="text-[10px] uppercase tracking-widest text-ash-grey">{label}</div>
    </div>
  );
}

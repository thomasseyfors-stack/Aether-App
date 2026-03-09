import React from 'react';
import { motion } from 'motion/react';
import { X, ActivitySquare, CheckCircle2, ShieldAlert, Crosshair, Activity, MessageSquare } from 'lucide-react';
import { AetherSocialNode } from './SocialIdentityGrid';

interface CrossGridAnalyticsProps {
  connection: AetherSocialNode;
  onClose: () => void;
}

export default function CrossGridAnalytics({ connection, onClose }: CrossGridAnalyticsProps) {
  // Helper to render qualities whether they are strings or objects
  const renderQuality = (q: any) => {
    if (typeof q === 'string') {
      return <p className="text-ash-grey text-xs leading-relaxed">{q}</p>;
    }
    return (
      <div className="bg-black/20 p-3 rounded border border-white/5">
        <span className="text-[10px] uppercase tracking-widest font-bold block mb-1 opacity-80">{q.aspect || 'Aspect'}</span>
        <p className="text-ash-grey text-xs leading-relaxed">{q.translation || q.description || JSON.stringify(q)}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl h-full bg-obsidian border-l border-astral-gold/20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ash-grey/10 bg-black/40">
          <div>
            <h2 className="text-starlight-white font-bold uppercase tracking-widest text-xl mb-1">
              {connection.peer_name}
            </h2>
            <p className="text-astral-gold text-[10px] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-astral-gold animate-pulse"></span>
              {connection.connection_type} Connection Active
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ash-grey hover:text-starlight-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* System Resonance Score */}
          <div className="bg-black/30 border border-ash-grey/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-starlight-white font-bold uppercase tracking-widest text-sm mb-1">
                Synastry Telemetry
              </h3>
              <p className="text-ash-grey text-xs uppercase tracking-widest">Overall System Resonance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-astral-gold text-4xl font-bold font-mono leading-none">
                  {connection.system_resonance_score}%
                </p>
                <p className="text-ash-grey text-[10px] uppercase tracking-widest mt-1">Resonance Index</p>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-astral-gold/20 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="40" cy="40" r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-astral-gold transition-all duration-1000 ease-out"
                    strokeDasharray="226.19"
                    strokeDashoffset={226.19 - (226.19 * connection.system_resonance_score) / 100}
                  />
                </svg>
                <ActivitySquare className="w-8 h-8 text-astral-gold" />
              </div>
            </div>
          </div>

          {/* Dual-Column Qualities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong Qualities */}
            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                <CheckCircle2 className="w-4 h-4" /> Structural Resonance
              </h3>
              <div className="space-y-3">
                {connection.strong_qualities?.length > 0 ? (
                  connection.strong_qualities.map((q, idx) => (
                    <div key={idx} className="text-emerald-300">
                      {renderQuality(q)}
                    </div>
                  ))
                ) : (
                  <p className="text-ash-grey text-xs italic">No structural resonance data available.</p>
                )}
              </div>
            </div>

            {/* Toxic Qualities */}
            <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6">
              <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-red-500/20 pb-2">
                <ShieldAlert className="w-4 h-4" /> Systemic Friction
              </h3>
              <div className="space-y-3">
                {connection.toxic_qualities?.length > 0 ? (
                  connection.toxic_qualities.map((q, idx) => (
                    <div key={idx} className="text-red-300">
                      {renderQuality(q)}
                    </div>
                  ))
                ) : (
                  <p className="text-ash-grey text-xs italic">No systemic friction data available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-black/30 border border-ash-grey/10 rounded-xl p-6">
            <h3 className="text-astral-gold font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-ash-grey/20 pb-2">
              <Crosshair className="w-4 h-4" /> Operative Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-starlight-white text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-nebula-purple" /> Recommended Activities
                </p>
                <ul className="space-y-2">
                  {connection.recommended_activities?.length > 0 ? (
                    connection.recommended_activities.map((act, idx) => (
                      <li key={idx} className="text-ash-grey text-xs leading-relaxed flex items-start gap-2">
                        <span className="text-astral-gold mt-0.5">•</span> {act}
                      </li>
                    ))
                  ) : (
                    <li className="text-ash-grey text-xs italic">No activities recommended.</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="text-starlight-white text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3 text-nebula-purple" /> Discussion Topics
                </p>
                <ul className="space-y-2">
                  {connection.discussion_topics?.length > 0 ? (
                    connection.discussion_topics.map((topic, idx) => (
                      <li key={idx} className="text-ash-grey text-xs leading-relaxed flex items-start gap-2">
                        <span className="text-astral-gold mt-0.5">•</span> {topic}
                      </li>
                    ))
                  ) : (
                    <li className="text-ash-grey text-xs italic">No topics recommended.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

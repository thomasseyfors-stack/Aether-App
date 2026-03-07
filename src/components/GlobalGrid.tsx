import React, { useState } from 'react';
import { ArrowLeft, Globe, ChevronDown, ChevronUp } from 'lucide-react';

// Sub-component to handle the individual open/close state of each cultural node
const CulturalNode = ({ node }: { node: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="bg-black/30 border border-ash-grey/10 rounded-xl p-4 md:p-6 hover:border-astral-gold/40 transition-all cursor-pointer group"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-astral-gold font-bold text-sm md:text-lg flex items-center gap-2 group-hover:text-starlight-white transition-colors">
            {node.system} <span className="text-ash-grey font-normal text-[10px] md:text-xs">({node.region})</span>
          </h3>
          <p className="text-starlight-white font-medium text-sm md:text-base mt-1">{node.archetype}</p>
          <p className="text-nebula-purple text-[10px] md:text-xs uppercase tracking-widest mt-1.5">{node.title}</p>
        </div>
        <div className="bg-black/50 p-1.5 rounded-full">
          {isOpen ? <ChevronUp className="w-5 h-5 text-ash-grey" /> : <ChevronDown className="w-5 h-5 text-ash-grey group-hover:text-astral-gold" />}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-ash-grey/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <ul className="space-y-2.5">
            {node.description?.map((desc: string, i: number) => (
              <li key={i} className="text-ash-grey text-xs md:text-sm leading-relaxed flex items-start gap-2">
                <span className="text-astral-gold mt-0.5 text-[10px]">◆</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function GlobalGrid({ payload, onBack }: { payload: any, onBack: () => void }) {
  const culturalData = payload?.matrices?.culturalGrid;

  return (
    <div className="min-h-screen bg-obsidian p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-ash-grey hover:text-astral-gold transition-colors mb-6 text-xs uppercase tracking-widest font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Main Grid
        </button>

        <header className="mb-8 border-b border-ash-grey/20 pb-6 flex items-center gap-4">
          <div className="p-3 bg-nebula-purple/20 rounded-lg border border-nebula-purple/30">
            <Globe className="w-8 h-8 text-nebula-purple" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-starlight-white uppercase tracking-widest mb-1">Cultural Matrix</h1>
            <p className="text-ash-grey text-xs md:text-sm">Cross-referencing terrestrial navigational systems.</p>
          </div>
        </header>

        {culturalData && culturalData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {culturalData.map((node: any, idx: number) => (
              <CulturalNode key={idx} node={node} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-black/30 border border-ash-grey/10 rounded-xl">
            <p className="text-ash-grey uppercase tracking-widest">Global Telemetry Unavailable</p>
          </div>
        )}
      </div>
    </div>
  );
}

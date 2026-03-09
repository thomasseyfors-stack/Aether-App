import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, Activity, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CrossGridAnalytics from './CrossGridAnalytics';

export interface AetherSocialNode {
  id: string;
  peer_name: string;
  connection_type: 'Social' | 'Family' | 'Work' | 'Romantic';
  system_resonance_score: number;
  strong_qualities: any[];
  toxic_qualities: any[];
  recommended_activities: string[];
  discussion_topics: string[];
}

export default function SocialIdentityGrid() {
  const [connections, setConnections] = useState<AetherSocialNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Social' | 'Family' | 'Work' | 'Romantic'>('All');
  const [syncCode, setSyncCode] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<AetherSocialNode | null>(null);

  useEffect(() => {
    // Simulate async fetching of connections
    const fetchConnections = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setConnections([]); // Start empty as per strict constraints
      } catch (error) {
        console.error("Failed to fetch connections", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleEstablishLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncCode.trim()) return;

    setIsLinking(true);
    try {
      // Simulate backend ping to establish link
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, we would add the returned node to the connections array
      setSyncCode('');
    } catch (error) {
      console.error("Failed to establish link", error);
    } finally {
      setIsLinking(false);
    }
  };

  const filteredConnections = connections.filter(conn => 
    filter === 'All' ? true : conn.connection_type === filter
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Manual Link Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg flex flex-col justify-center">
          <h2 className="text-starlight-white font-bold uppercase tracking-widest text-lg mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-astral-gold" /> Aether Energy Network
          </h2>
          <p className="text-ash-grey text-xs uppercase tracking-widest">
            Manage your load-bearing links and analyze cross-grid synastry telemetry.
          </p>
        </div>

        <div className="lg:col-span-1 bg-obsidian border border-astral-gold/20 rounded-xl p-6 shadow-lg">
          <h3 className="text-astral-gold font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Establish Link
          </h3>
          <form onSubmit={handleEstablishLink} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Enter Origin Sync-Code..."
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value)}
                className="w-full bg-black/50 border border-ash-grey/20 rounded p-3 text-xs font-mono text-starlight-white focus:border-astral-gold focus:ring-1 focus:ring-astral-gold outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLinking || !syncCode.trim()}
              className="w-full bg-astral-gold/10 hover:bg-astral-gold/20 text-astral-gold border border-astral-gold/30 py-2.5 rounded uppercase tracking-widest text-[10px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLinking ? (
                <><Activity className="w-3 h-3 animate-spin" /> Pinging Backend...</>
              ) : (
                'Initialize Connection'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Classification Filtering */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ash-grey/10 pb-4">
        <Filter className="w-4 h-4 text-ash-grey mr-2" />
        {['All', 'Social', 'Family', 'Work', 'Romantic'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
              filter === type
                ? 'bg-astral-gold text-obsidian shadow-[0_0_10px_rgba(242,166,90,0.3)]'
                : 'bg-obsidian border border-ash-grey/20 text-ash-grey hover:border-astral-gold/50 hover:text-starlight-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Network Node Roster */}
      <div className="bg-obsidian border border-ash-grey/20 rounded-xl p-6 shadow-lg min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-ash-grey/5 rounded-lg border border-ash-grey/10 animate-pulse"></div>
            ))}
          </div>
        ) : filteredConnections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredConnections.map((conn) => (
              <motion.div
                key={conn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedConnection(conn)}
                className="group cursor-pointer bg-black/40 border border-ash-grey/10 hover:border-astral-gold/50 rounded-lg p-4 transition-all hover:shadow-[0_0_15px_rgba(242,166,90,0.1)]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-starlight-white font-bold text-sm">{conn.peer_name}</h4>
                    <span className="text-[9px] uppercase tracking-widest text-ash-grey">{conn.connection_type}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-astral-gold/20 flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="18" cy="18" r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-astral-gold"
                        strokeDasharray="100.53"
                        strokeDashoffset={100.53 - (100.53 * conn.system_resonance_score) / 100}
                      />
                    </svg>
                    <span className="text-[10px] font-mono font-bold text-astral-gold">{conn.system_resonance_score}</span>
                  </div>
                </div>
                <div className="flex items-center text-[10px] text-ash-grey uppercase tracking-widest group-hover:text-astral-gold transition-colors">
                  <Activity className="w-3 h-3 mr-1" /> View Synastry Telemetry
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center">
            <Search className="w-12 h-12 text-ash-grey/20 mb-4" />
            <p className="text-ash-grey uppercase tracking-widest text-sm mb-2">No Active Connections</p>
            <p className="text-ash-grey/60 text-xs max-w-md">
              Your Aether Energy Network is currently empty. Use the manual link interface above to establish a new load-bearing link using a peer's Origin Sync-Code.
            </p>
          </div>
        )}
      </div>

      {/* Cross-Grid Analytics Modal */}
      <AnimatePresence>
        {selectedConnection && (
          <CrossGridAnalytics 
            connection={selectedConnection} 
            onClose={() => setSelectedConnection(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

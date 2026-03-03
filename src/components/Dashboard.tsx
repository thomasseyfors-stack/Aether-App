import React from 'react';

export default function Dashboard({ payload }: { payload: any }) {
  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b border-nebula-purple/30 pb-6">
          <h1 className="text-3xl font-bold text-astral-gold tracking-widest uppercase mb-2">Aether Grid Active</h1>
          <p className="text-ash-grey text-sm tracking-widest uppercase">Primary Dashboard</p>
        </header>
        
        <div className="bg-obsidian border border-ash-grey/10 rounded-xl p-6 shadow-lg">
          <h2 className="text-nebula-purple font-semibold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nebula-purple"></span>
            Telemetry Data Synchronized
          </h2>
          <p className="text-ash-grey mb-4">Welcome, {payload?.firstName}. Your energetic coordinates have been successfully mapped.</p>
          <pre className="text-ash-grey text-xs overflow-x-auto p-4 bg-black/50 rounded-lg border border-ash-grey/10 font-mono">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ArrowLeft, Beaker } from 'lucide-react';
import AetherLogo from './AetherLogo';
import { NumerologyCard, IdentityMatrixCard } from './Dashboard'; 

export default function AxiomDashboard({ payload, onReturn }: { payload: any, onReturn: () => void }) {
  const theoretical = payload?.theoretical;
  
  if (!theoretical) {
    return (
      <div className="min-h-screen bg-obsidian text-starlight-white flex items-center justify-center p-6">
        <p className="text-ash-grey uppercase tracking-widest text-sm">Theoretical Simulation Offline.</p>
        <button onClick={onReturn} className="ml-4 text-nebula-purple hover:text-astral-gold uppercase text-xs tracking-widest">Return</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white p-4 md:p-6 font-sans w-full max-w-full overflow-x-hidden">
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        
        <header className="border-b border-nebula-purple/30 pb-4 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-4">
            <AetherLogo className="w-12 h-12 md:w-16 md:h-16" />
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-nebula-purple tracking-widest uppercase mb-1 md:mb-2 flex items-center gap-3">
                <Beaker className="w-6 h-6 md:w-8 md:h-8" /> Theoretical Axiom
              </h1>
              <p className="text-ash-grey text-sm tracking-widest uppercase">
                Alternative Timeline Simulation Active
              </p>
            </div>
          </div>
          <button 
            onClick={onReturn}
            className="flex items-center justify-center gap-2 bg-obsidian hover:bg-black/50 text-ash-grey border border-ash-grey/20 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest text-xs font-bold w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Core Grid
          </button>
        </header>

        <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
          
          <section className="bg-obsidian border border-nebula-purple/20 rounded-xl p-4 md:p-6 shadow-[0_0_20px_rgba(106,13,173,0.1)]">
            <h3 className="text-ash-grey text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-4">Temporal Shift Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-ash-grey/5">
                <p className="text-nebula-purple text-[10px] md:text-xs uppercase tracking-wider mb-1">Cotsworth Date</p>
                <p className="text-lg md:text-xl font-bold text-starlight-white">{theoretical.date}</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-ash-grey/5">
                <p className="text-nebula-purple text-[10px] md:text-xs uppercase tracking-wider mb-1">UTC Time</p>
                <p className="text-lg md:text-xl font-bold text-starlight-white">{theoretical.time}</p>
              </div>
            </div>
          </section>

          <NumerologyCard data={{
            lifePath: theoretical.numerology.lifePath,
            destiny: "N/A", soulUrge: "N/A", personality: "N/A",
            interpretation: theoretical.numerology.interpretation
          }} />

          <div className="pt-4 space-y-4">
            <h3 className="text-ash-grey text-xs tracking-widest uppercase mb-4 text-center">Theoretical Geometries</h3>
            
            <IdentityMatrixCard 
              title="Tropical Placidus" 
              subtitle="Theoretical Persona" 
              data={{ 
                placements: theoretical.matrices.tropical,
                angles: theoretical.matrices.angles,
                aspects: theoretical.matrices.aspects,
                patterns: theoretical.matrices.patterns,
                voids: theoretical.matrices.voids
              }} 
              imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-axiom.jpg" 
              isPrimary={true} 
            />

            {theoretical.matrices.vaults && (
              <div className="space-y-4">
                <IdentityMatrixCard 
                  title="Standard Sidereal Lahiri" 
                  subtitle="Theoretical Soul Vessel" 
                  data={theoretical.matrices.vaults.sidereal} 
                  imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-soul.jpg" 
                  isEncrypted 
                />
                <IdentityMatrixCard 
                  title="Draconic" 
                  subtitle="Theoretical Spark" 
                  data={theoretical.matrices.vaults.draconic} 
                  imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-spark.jpg" 
                  isEncrypted 
                />
                <IdentityMatrixCard 
                  title="Heliocentric" 
                  subtitle="Theoretical Source" 
                  data={theoretical.matrices.vaults.heliocentric} 
                  imageSrc="https://b1zcpgvhvegysslg.public.blob.vercel-storage.com/img-source.jpg" 
                  isEncrypted 
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, AlertTriangle, RefreshCcw, Hourglass } from 'lucide-react';

const STAGES = [
  { id: 0, text: "Initiating Numerology" },
  { id: 1, text: "Initiating Tropical/Sidereal" },
  { id: 2, text: "Initiating Draconic/Heliocentric" },
  { id: 3, text: "Mapping Ley Lines" },
  { id: 4, text: "Isolating Energetic Grid" }
];

// No mock data needed here anymore

interface TransitionMatrixProps {
  payload: any;
  onSuccess: (fullData: any) => void;
  onCancel: () => void;
}

export default function TransitionMatrix({ payload, onSuccess, onCancel }: TransitionMatrixProps) {
  const [stage, setStage] = useState(0);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let sequenceInterval: NodeJS.Timeout;

    const runSequence = async () => {
      // Advance visual stages every 2.5 seconds to ensure the user sees the sequence
      sequenceInterval = setInterval(() => {
        setStage(prev => {
          if (prev < 4) return prev + 1;
          return prev;
        });
      }, 2500);

      const attemptFetch = async (attempt = 1): Promise<any> => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

          const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) throw new Error('API Error');
          return await response.json();
        } catch (err) {
          if (attempt < 3 && isMounted) {
            setRetryCount(attempt);
            // Wait 1.5 seconds before retrying
            await new Promise(r => setTimeout(r, 1500));
            return attemptFetch(attempt + 1);
          } else {
            throw err;
          }
        }
      };

      try {
        const apiData = await attemptFetch();
        
        // Ensure the visual sequence completes even if the API is fast
        const checkStage = setInterval(() => {
          setStage(current => {
            if (current === 4) {
              clearInterval(checkStage);
              clearInterval(sequenceInterval);
              if (isMounted) {
                setTimeout(() => {
                  const fullPayload = {
                    pii: payload,
                    numerology: apiData.numerology,
                    matrices: apiData.matrices,
                    theoretical: apiData.theoretical
                  };
                  onSuccess(fullPayload);
                }, 1500); // Brief pause at the final stage
              }
            }
            return current;
          });
        }, 500);
      } catch (err) {
        if (isMounted) {
          setError(true);
          clearInterval(sequenceInterval);
        }
      }
    };

    runSequence();

    return () => {
      isMounted = false;
      clearInterval(sequenceInterval);
    };
  }, [payload, onSuccess]);

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
        <h2 className="text-2xl font-bold text-starlight-white tracking-widest uppercase mb-4">Telemetry Failure</h2>
        <p className="text-ash-grey mb-8 max-w-md">
          Unable to establish connection with the Aether grid. Maximum retry attempts (3) exceeded.
        </p>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-astral-gold text-obsidian font-bold py-3 px-6 rounded-lg uppercase tracking-widest hover:bg-astral-gold/90 transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Re-Initialize
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian relative overflow-hidden flex flex-col items-center justify-center">
      <BackgroundVisuals stage={stage} />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Astrolabe / Hourglass */}
        <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-nebula-purple/40 rounded-full border-t-nebula-purple"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-2 border-astral-gold/20 rounded-full border-b-astral-gold"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 border border-starlight-white/10 rounded-full border-l-starlight-white/50"
          />
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
            className="text-nebula-purple"
          >
            <Hourglass className="w-10 h-10" />
          </motion.div>
        </div>

        {/* State-Driven Text Rendering */}
        <div className="h-16 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h3
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-astral-gold font-semibold tracking-widest uppercase text-lg text-center"
            >
              {STAGES[stage]?.text}
            </motion.h3>
          </AnimatePresence>
          
          {retryCount > 0 && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-400 text-xs mt-4 tracking-widest uppercase"
            >
              Connection unstable. Retry attempt {retryCount}/3...
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

function BackgroundVisuals({ stage }: { stage: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <AnimatePresence>
        {stage === 0 && (
          <motion.div
            key="milky-way"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-nebula-purple/20 via-obsidian to-obsidian"
          >
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </motion.div>
        )}
        
        {stage === 1 && (
          <motion.div
            key="solar-system"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute w-[40vw] h-[40vw] rounded-full border border-astral-gold/10" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute w-[60vw] h-[60vw] rounded-full border border-nebula-purple/10" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} className="absolute w-[80vw] h-[80vw] rounded-full border border-ash-grey/10" />
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div
            key="earth-orbit"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
            className="absolute w-72 h-72 rounded-full bg-blue-900/20 border border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.15)]"
          />
        )}
        
        {stage === 3 && (
          <motion.div
            key="earth-ley-lines"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
            className="absolute w-72 h-72 rounded-full bg-blue-900/20 border border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.15)] flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-astral-gold opacity-60 animate-pulse">
              <path d="M50 0 L50 100 M0 50 L100 50 M15 15 L85 85 M15 85 L85 15" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </svg>
          </motion.div>
        )}
        
        {stage === 4 && (
          <motion.div
            key="ley-lines-only"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
            className="absolute w-72 h-72 flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-astral-gold drop-shadow-[0_0_15px_rgba(245,208,97,0.8)]">
              <path d="M50 0 L50 100 M0 50 L100 50 M15 15 L85 85 M15 85 L85 15" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RadarLoading from './RadarLoading';

interface LoadingScreenProps {
  onComplete: () => void;
  isGirls?: boolean;
}

export default function LoadingScreen({ onComplete, isGirls }: LoadingScreenProps) {
  useEffect(() => {
    // Total duration: 0.1 seconds (as requested for minimal delay)
    const timer = setTimeout(() => {
      onComplete();
    }, 100);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 dir-rtl font-sans select-none overflow-hidden touch-none ${
          isGirls ? 'bg-[#0a0212] text-fuchsia-100' : 'bg-[#020804] text-emerald-100'
        }`}
      >
        {/* Atmosphere Background Glow */}
        {isGirls ? (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-600/20 blur-[140px] rounded-full" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/20 blur-[140px] rounded-full" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50" />
          </div>
        )}

        {/* Minimal Pure Tactical Radar Display (No extra text, no labels) */}
        <div className="relative z-10 flex items-center justify-center">
          <RadarLoading size="md" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}




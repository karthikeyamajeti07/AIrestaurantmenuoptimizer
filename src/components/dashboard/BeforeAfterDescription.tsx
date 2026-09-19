import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Check, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const BeforeAfterDescription: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'split'>('both');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isReplaying, setIsReplaying] = useState<boolean>(false);

  const originalCopy = {
    title: 'Margherita Pizza',
    text: 'Tomato sauce, mozzarella and basil.',
    archetype: 'Original flat grocery text (3 words of ingredients)',
  };

  const optimizedCopy = {
    title: 'Margherita D.O.P.',
    text: 'Wood-fired tomato, creamy mozzarella and fragrant basil, finished with a delicate olive oil drizzle.',
    archetype: 'Sensory storytelling with tactile adjectives & culinary technique',
  };

  const handleReplay = () => {
    setIsReplaying(true);
    setTimeout(() => setIsReplaying(false), 800);
  };

  return (
    <div className="rounded-xl border border-[#E3DC CE] bg-[#FAF8F5] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE4D8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
              Sensory Language Engine
            </span>
            <span className="w-1 h-1 rounded-full bg-[#B0A795]" />
            <span className="text-xs text-[#736E64]">Interactive Comparison</span>
          </div>
          <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1C1D1F] tracking-tight">
            Before & After Description Transformation
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#524E45] hover:text-[#1C1D1F] bg-[#EFEAE0] hover:bg-[#E5DFD2] rounded border border-[#DDD5C5] transition-colors cursor-pointer"
            title="Replay reveal animation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReplaying ? 'animate-spin text-[#874A2B]' : ''}`} />
            <span>Replay Reveal</span>
          </button>
        </div>
      </div>

      {/* Side-by-side comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Original */}
        <div className="rounded-lg border border-[#DDD5C5] bg-[#F4F0E8] p-5 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#736E64]">
              Original Menu Copy
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8E2D5] text-[#555047]">
              Flat Baseline
            </span>
          </div>

          <div className="space-y-1 pt-1">
            <div className="font-serif-display text-lg font-bold text-[#1E2022]">
              {originalCopy.title}
            </div>
            <p className="font-serif italic text-sm sm:text-base text-[#524E44] leading-relaxed pt-1">
              "{originalCopy.text}"
            </p>
          </div>

          <div className="pt-3 border-t border-[#E3DCCF] text-[11px] text-[#7A7468]">
            <span className="font-mono text-[#8C8477]">Diner perception:</span> Typical cafeteria pizza item with minimal appetite appeal.
          </div>
        </div>

        {/* Right: Optimized with Progressive Character/Word Reveal */}
        <div className="rounded-lg border border-[#874A2B]/40 bg-[#FFFDF9] p-5 space-y-3 relative shadow-xs">
          {/* Status Label badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#874A2B]">
                Optimized Culinary Copy
              </span>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EBF3EC] text-[#205A37] border border-[#CFE4D5] flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-[#205A37]" />
                Description improved
              </motion.span>
            </div>
            <span className="text-[10px] font-mono text-[#874A2B] font-semibold">
              +42% Value Perception
            </span>
          </div>

          <div className="space-y-1 pt-1">
            <div className="font-serif-display text-lg font-bold text-[#1E2022] flex items-center gap-2">
              <span>{optimizedCopy.title}</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-[#F4EDE1] text-[#7B5B24]">
                D.O.P. Certified
              </span>
            </div>

            {/* Progressive text reveal */}
            <AnimatePresence mode="wait">
              {!isReplaying && (
                <motion.p
                  key="optimized-text"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="font-serif text-sm sm:text-base text-[#1E2022] leading-relaxed pt-1"
                >
                  <span className="text-[#874A2B] font-medium">"Wood-fired tomato</span>, creamy mozzarella and fragrant basil, finished with a <span className="underline decoration-[#874A2B]/40 underline-offset-2">delicate olive oil drizzle</span>."
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-3 border-t border-[#EAE3D6] flex items-center justify-between text-[11px]">
            <span className="text-[#205A37] font-mono font-medium">
              Sensory cues: Wood-fired, creamy, fragrant, delicate
            </span>
            <span className="text-[#8C8477] font-mono">14 words</span>
          </div>
        </div>
      </div>
    </div>
  );
};

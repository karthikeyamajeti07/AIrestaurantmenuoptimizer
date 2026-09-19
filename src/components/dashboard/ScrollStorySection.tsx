import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  FileSearch,
  Sparkles,
  TrendingUp,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface ScrollStorySectionProps {
  onGoToStudio?: () => void;
}

type StageKey = 'upload' | 'analyze' | 'improve' | 'optimize' | 'publish';

interface StageConfig {
  key: StageKey;
  stepNumber: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  narrative: string;
}

const STAGES: StageConfig[] = [
  {
    key: 'upload',
    stepNumber: '01',
    title: 'UPLOAD',
    subtitle: 'Raw Menu Ingestion',
    icon: UploadCloud,
    narrative: 'Your existing PDF, scan or photograph is received. The parser converts unstructured text into raw dish records.',
  },
  {
    key: 'analyze',
    stepNumber: '02',
    title: 'ANALYZE',
    subtitle: 'Item & Margin Detection',
    icon: FileSearch,
    narrative: 'AI extracts dish entities, categories, baseline selling prices, and calculates item gross contribution margins.',
  },
  {
    key: 'improve',
    stepNumber: '03',
    title: 'IMPROVE',
    subtitle: 'Sensory Copy Transformation',
    icon: Sparkles,
    narrative: 'Flat grocery phrases are transformed into evocative storytelling copy that activates diner anticipation.',
  },
  {
    key: 'optimize',
    stepNumber: '04',
    title: 'OPTIMIZE',
    subtitle: 'Price Anchoring & Elasticity',
    icon: TrendingUp,
    narrative: 'Algorithmic price adjustments and combo bundles are applied to lift the average guest check size without volume loss.',
  },
  {
    key: 'publish',
    stepNumber: '05',
    title: 'PUBLISH',
    subtitle: 'Editorial Print-Ready Menu',
    icon: BookOpen,
    narrative: 'The engineered menu is ready for dining room presentation, digital QR, or high-definition editorial printing.',
  },
];

export const ScrollStorySection: React.FC<ScrollStorySectionProps> = ({ onGoToStudio }) => {
  const [activeStage, setActiveStage] = useState<StageKey>('upload');

  const currentIndex = STAGES.findIndex((s) => s.key === activeStage);

  const handleNext = () => {
    if (currentIndex < STAGES.length - 1) {
      setActiveStage(STAGES[currentIndex + 1].key);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveStage(STAGES[currentIndex - 1].key);
    }
  };

  return (
    <section
      id="scroll-story-section"
      className="rounded-xl border border-[#E3DC CE] bg-[#FAF8F5] p-6 sm:p-8 lg:p-10 shadow-xs space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE4D8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
              Transformation Architecture
            </span>
            <span className="w-1 h-1 rounded-full bg-[#B0A795]" />
            <span className="text-xs text-[#736E64]">Dynamic Menu Morphing</span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1C1D1F] tracking-tight">
            How One Menu Becomes a Profit Engine
          </h2>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-1 max-w-xl">
            Step through the lifecycle to watch the identical menu entity transform in real-time from an unformatted raw scan into a high-margin masterpiece.
          </p>
        </div>

        {/* Step Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFEAE0] rounded-lg border border-[#DDD5C5] overflow-x-auto">
          {STAGES.map((s) => {
            const isActive = activeStage === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setActiveStage(s.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1C1D1F] text-white shadow-xs font-semibold'
                    : 'text-[#615C52] hover:text-[#1C1D1F] hover:bg-[#E4DDCF]'
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Stage Explanation & Stepper Controls */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl font-serif-display font-bold text-[#874A2B]">
                  {STAGES[currentIndex].stepNumber}
                </span>
                <div className="h-6 w-[1px] bg-[#DDD5C5]" />
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-[#1C1D1F]">
                    {STAGES[currentIndex].subtitle}
                  </h3>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#7A7468]">
                    Stage {currentIndex + 1} of 5
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#544F46] leading-relaxed">
                {STAGES[currentIndex].narrative}
              </p>

              {/* Stage Specific Highlights */}
              <div className="p-3.5 rounded-lg bg-[#F2EDE2] border border-[#E1D9CB] text-xs space-y-2">
                {activeStage === 'upload' && (
                  <div className="text-[#595347]">
                    <strong>Input detected:</strong> 3-page seasonal menu sheet in PDF format (2.1 MB).
                  </div>
                )}
                {activeStage === 'analyze' && (
                  <div className="text-[#595347]">
                    <strong>Detected:</strong> 7 items across 3 sections. Food costs calculated with 35%–55% margins.
                  </div>
                )}
                {activeStage === 'improve' && (
                  <div className="text-[#595347]">
                    <strong>Sensory lift:</strong> Replaced flat supermarket wording with Italian heritage & artisan technique.
                  </div>
                )}
                {activeStage === 'optimize' && (
                  <div className="text-[#595347]">
                    <strong>Price shift:</strong> Salmon repositioned to ₹799 price anchor; Margherita + Spritz combo established.
                  </div>
                )}
                {activeStage === 'publish' && (
                  <div className="text-[#595347]">
                    <strong>Output:</strong> Custom typography, Golden Triangle visual hierarchy, print and digital export ready.
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Forward / Backward Stepper Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="text-xs text-[#706B60] hover:text-[#1C1D1F] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              ← Previous Phase
            </button>

            {currentIndex < STAGES.length - 1 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1C1D1F] text-white text-xs font-semibold hover:bg-[#34353A] transition-colors shadow-xs cursor-pointer"
              >
                <span>Advance to {STAGES[currentIndex + 1].title}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onGoToStudio}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#874A2B] text-white text-xs font-semibold hover:bg-[#713C22] transition-colors shadow-xs cursor-pointer"
              >
                <span>Open in Live Menu Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: THE TRANSFORMING MENU PREVIEW CONTAINER */}
        <div className="lg:col-span-7">
          <div className="relative rounded-xl border border-[#DDD5C5] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden min-h-[460px] flex flex-col justify-between">
            {/* Top Stage Indicator Strip */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6] text-xs">
              <span className="font-mono text-[11px] text-[#8A7862] font-semibold uppercase tracking-wider">
                Live Entity Morph: {activeStage.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2EDE2] text-[#696255]">
                Bella_Italia_Dinner.pdf
              </span>
            </div>

            {/* Transforming Menu Content based on activeStage */}
            <div className="py-4 flex-1">
              <AnimatePresence mode="wait">
                {/* 1. UPLOAD: Raw unformatted OCR text */}
                {activeStage === 'upload' && (
                  <motion.div
                    key="stage-upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-mono text-xs text-[#524E45] space-y-4 bg-[#F8F5EE] p-4 rounded border border-dashed border-[#D5CDBD]"
                  >
                    <div className="text-[#8C8477] text-[10px]">// RAW EXTRACTED TEXT STREAM (OCR)</div>
                    <p className="leading-relaxed">
                      TRATTORIA BELLA ITALIA --- FALL MENU<br />
                      Margherita Pizza .............. Rs 350 (sauce, cheese, basil)<br />
                      Spaghetti Carbonara ........... Rs 420 (pasta, bacon, cream, egg)<br />
                      Grilled Salmon ................ Rs 750 (fish with vegetables)<br />
                      Tiramisu ...................... Rs 280 (coffee dessert)
                    </p>
                    <div className="text-[11px] text-[#874A2B] animate-pulse">
                      &gt; Isolating token boundaries and currency symbols...
                    </div>
                  </motion.div>
                )}

                {/* 2. ANALYZE: Highlight detected items, categories & margins */}
                {activeStage === 'analyze' && (
                  <motion.div
                    key="stage-analyze"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 font-sans text-xs"
                  >
                    <div className="p-3 rounded bg-[#FAF7F0] border border-[#C5BBAA] relative">
                      <div className="absolute -top-2 right-3 text-[9px] font-mono px-1.5 py-0.2 bg-[#874A2B] text-white rounded">
                        ENTITY DETECTED: WOOD-FIRED PIZZA
                      </div>
                      <div className="flex justify-between items-center font-bold text-[#1C1D1F]">
                        <span>Margherita Pizza</span>
                        <span className="font-mono text-[#205A37]">₹350 (Cost: ₹140 • Margin: 40%)</span>
                      </div>
                      <div className="text-[11px] text-[#6E685C] mt-1">
                        Tomato sauce, mozzarella and basil.
                      </div>
                    </div>

                    <div className="p-3 rounded bg-[#FAF7F0] border border-[#C5BBAA] relative">
                      <div className="absolute -top-2 right-3 text-[9px] font-mono px-1.5 py-0.2 bg-[#205A37] text-white rounded">
                        ENTITY DETECTED: SECONDI (HIGH MARGIN)
                      </div>
                      <div className="flex justify-between items-center font-bold text-[#1C1D1F]">
                        <span>Grilled Salmon</span>
                        <span className="font-mono text-[#205A37]">₹750 (Cost: ₹375 • Margin: 50%)</span>
                      </div>
                      <div className="text-[11px] text-[#6E685C] mt-1">
                        Grilled salmon fillet with lemon and greens.
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-[#EBF3ED] text-[#205A37] font-mono text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Extracted 7 dishes • Matrix classification ready
                    </div>
                  </motion.div>
                )}

                {/* 3. IMPROVE: Ordinary copy morphs into polished culinary descriptions */}
                {activeStage === 'improve' && (
                  <motion.div
                    key="stage-improve"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E0D5C5]">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-serif-display text-base font-bold text-[#1C1D1F]">
                          Margherita D.O.P.
                        </span>
                        <span className="font-mono font-bold text-xs text-[#1C1D1F]">₹350</span>
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-xs text-[#4A453C] leading-relaxed"
                      >
                        <span className="text-[#874A2B] font-semibold">Wood-fired San Marzano tomato</span>, creamy Fior di Latte mozzarella, fragrant sweet basil, finished with cold-pressed olive oil.
                      </motion.p>
                      <div className="mt-2 text-[10px] font-mono text-[#205A37] bg-[#E8F3EA] px-2 py-0.5 rounded inline-block">
                        ✓ Sensory adjectives added (+32% taste perception)
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E0D5C5]">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-serif-display text-base font-bold text-[#1C1D1F]">
                          Pan-Seared Atlantic Salmon
                        </span>
                        <span className="font-mono font-bold text-xs text-[#1C1D1F]">₹750</span>
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="text-xs text-[#4A453C] leading-relaxed"
                      >
                        Crisp skin Atlantic salmon resting on a velvet Meyer lemon emulsion, braised leeks, and roasted fingerling potatoes.
                      </motion.p>
                      <div className="mt-2 text-[10px] font-mono text-[#205A37] bg-[#E8F3EA] px-2 py-0.5 rounded inline-block">
                        ✓ Culinary technique highlighted
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. OPTIMIZE: Price changes & pricing recommendations appear */}
                {activeStage === 'optimize' && (
                  <motion.div
                    key="stage-optimize"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3.5"
                  >
                    <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E0D6C7]">
                      <div className="flex justify-between items-baseline">
                        <span className="font-serif-display text-base font-bold text-[#1C1D1F]">
                          Pan-Seared Atlantic Salmon
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-xs text-[#8A8477] line-through">₹750</span>
                          <motion.span
                            initial={{ scale: 0.8, color: '#874A2B' }}
                            animate={{ scale: 1, color: '#205A37' }}
                            className="text-sm font-bold bg-[#EBF3EC] px-2 py-0.5 rounded"
                          >
                            ₹799
                          </motion.span>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <span className="text-[#874A2B] font-medium">
                          ★ Premium Anchor Strategy (+₹49 pure margin lift)
                        </span>
                        <span className="text-[#6B655B] font-mono">Elasticity score: 94/100</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E0D6C7]">
                      <div className="flex justify-between items-baseline">
                        <span className="font-serif-display text-base font-bold text-[#1C1D1F]">
                          Pranzo Pizza & Spritz Combo
                        </span>
                        <span className="font-mono font-bold text-sm text-[#205A37]">
                          ₹479 (Save ₹51)
                        </span>
                      </div>
                      <p className="text-xs text-[#555047] mt-1">
                        Pairs Margherita D.O.P. (₹350) with Italian Citrus Spritz (₹180). High beverage margin subsidizes perceived diner savings.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 5. PUBLISH: Final polished editorial restaurant menu */}
                {activeStage === 'publish' && (
                  <motion.div
                    key="stage-publish"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="p-4 rounded-lg bg-[#FFFDFB] border border-[#D5CDBD] text-center space-y-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#8A7862]">
                        Trattoria Bella Italia
                      </div>
                      <h4 className="font-serif-display text-2xl font-bold text-[#1C1D1F]">
                        Cucina d’Autunno
                      </h4>
                      <div className="h-[1px] w-24 bg-[#D8CFBF] mx-auto" />
                    </div>

                    <div className="text-left space-y-3 pt-2">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-serif-display text-sm font-bold text-[#1C1D1F]">
                            Margherita D.O.P.
                          </span>
                          <p className="text-[11px] text-[#5A554C] leading-snug">
                            Wood-fired San Marzano tomatoes, Fior di Latte, hand-torn basil.
                          </p>
                        </div>
                        <span className="font-serif-display text-sm font-bold text-[#1C1D1F] shrink-0 pl-3">
                          ₹350
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-serif-display text-sm font-bold text-[#1C1D1F]">
                            Pan-Seared Atlantic Salmon
                          </span>
                          <p className="text-[11px] text-[#5A554C] leading-snug">
                            Meyer lemon emulsion, butter-braised baby leeks.
                          </p>
                        </div>
                        <span className="font-serif-display text-sm font-bold text-[#1C1D1F] shrink-0 pl-3">
                          ₹799
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] font-mono text-[#265E3C] flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Production Menu Optimized & Export Ready
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Card Summary */}
            <div className="pt-3 border-t border-[#EAE3D6] flex items-center justify-between text-xs text-[#7A7468]">
              <span className="font-mono text-[11px]">Bella Italia Demo Menu</span>
              <span className="font-semibold text-[#1C1D1F]">Stage {currentIndex + 1} of 5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

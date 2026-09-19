import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, Sparkles, FileText, TrendingUp, Target, ArrowRight } from 'lucide-react';

interface ProcessingScreenProps {
  fileName: string;
  onComplete: () => Promise<void> | void;
}

interface StepItem {
  id: string;
  label: string;
  detail: string;
}

const STEPS: StepItem[] = [
  {
    id: 'parse',
    label: 'Parsing dishes',
    detail: 'Converting unstructured PDF glyphs and sections into normalized culinary dish objects.',
  },
  {
    id: 'descriptions',
    label: 'Checking descriptions',
    detail: 'Analyzing vocabulary sentiment, adjective density, and D.O.P. provenance markers.',
  },
  {
    id: 'pricing',
    label: 'Analyzing pricing',
    detail: 'Mapping food costs against current price points and determining price anchor opportunities.',
  },
  {
    id: 'opportunities',
    label: 'Finding opportunities',
    detail: 'Isolating high-elasticity dishes and calculating beverage combo attachments.',
  },
  {
    id: 'strategy',
    label: 'Building strategy',
    detail: 'Classifying dishes into Kasavana & Smith matrix (Stars, Puzzles, Plowhorses, Dogs).',
  },
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  fileName,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  useEffect(() => {
    const stepDuration = 700;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          const next = prev + 1;
          setProgressPercent(Math.round(((next + 1) / STEPS.length) * 100));
          return next;
        } else {
          clearInterval(interval);
          setProgressPercent(100);
          setTimeout(() => {
            void onComplete();
          }, 500);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      {/* Central Processing Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EFE9DD] border border-[#DDD5C5] text-[#874A2B] mb-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#874A2B]" />
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A7862] font-semibold">
          ANALYZING MENU
        </div>
        <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1C1D1F]">
          Evaluating "{fileName}"
        </h2>
        <p className="text-xs sm:text-sm text-[#6B655B] max-w-md mx-auto">
          Executing deep culinary parsing, margin computation, and behavioral pricing heuristics.
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl p-6 sm:p-7 space-y-6 shadow-xs">
        {/* Progress Metric */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#48443C] font-semibold">ANALYSIS IN PROGRESS</span>
            <span className="font-mono font-bold text-[#1C1D1F]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#E9E3D6] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#874A2B] rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step-by-Step Activity Log */}
        <div className="space-y-3 pt-2">
          {STEPS.map((step, idx) => {
            const isFinished = idx < currentStepIndex || progressPercent === 100;
            const isCurrent = idx === currentStepIndex && progressPercent < 100;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: isCurrent ? 1 : isFinished ? 0.9 : 0.35,
                }}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-[#FFFDF9] border border-[#DED5C3] shadow-2xs'
                    : isFinished
                    ? 'bg-[#F5F2EA] border border-transparent'
                    : 'border border-transparent'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isFinished ? (
                    <span className="text-[#205A37] font-bold text-sm">✓</span>
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#874A2B] inline-block animate-pulse mt-1" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full border border-[#B3ABA0] inline-block mt-1" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-[#1C1D1F] font-bold'
                          : isFinished
                          ? 'text-[#3E3B34]'
                          : 'text-[#857F74]'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isFinished && (
                      <span className="text-[10px] font-mono text-[#205A37] font-semibold">
                        Ready
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-[#874A2B] animate-pulse">
                        Calculating...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6E685C] mt-0.5 leading-snug">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Detected Highlights */}
        <div className="p-3 bg-[#F0EBE0] border border-[#DDD4C3] rounded-lg text-xs text-[#5C564A] flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#874A2B]" />
            7 dish records detected • 3 pricing anchors mapped
          </span>
          <span className="text-[#205A37] font-semibold">Optimal Model</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScreenId } from '../../types';
import {
  FileText,
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
  ArrowRight,
  Check,
} from 'lucide-react';

interface HorizontalStorySectionProps {
  onNavigate: (screen: ScreenId) => void;
}

export const HorizontalStorySection: React.FC<HorizontalStorySectionProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'MENU',
      label: 'Structured Extraction',
      screen: 'overview' as ScreenId,
      icon: FileText,
      desc: 'Transforms PDFs and physical scans into normalized categories, recipes, and margin baselines.',
      benefit: '100% item parity & margin mapping',
    },
    {
      step: '02',
      title: 'DESCRIPTION',
      label: 'Sensory Copywriting',
      screen: 'descriptions' as ScreenId,
      icon: Sparkles,
      desc: 'Crafts Italian heritage and culinary craftsmanship narratives that elevate perceived value.',
      benefit: '+32% average appetite lift',
    },
    {
      step: '03',
      title: 'PRICING',
      label: 'Decoy & Elasticity',
      screen: 'pricing' as ScreenId,
      icon: TrendingUp,
      desc: 'Applies price anchoring, charm pricing, and margin defense across low-sensitivity signature items.',
      benefit: '+₹49 anchor margin delta',
    },
    {
      step: '04',
      title: 'STRATEGY',
      label: 'Kasavana-Smith Matrix',
      screen: 'strategy' as ScreenId,
      icon: Target,
      desc: 'Organizes dishes into Stars, Puzzles, Plowhorses and Dogs to optimize menu real estate.',
      benefit: 'Golden Triangle layout mapping',
    },
    {
      step: '05',
      title: 'OPTIMIZED MENU',
      label: 'Editorial Studio',
      screen: 'studio' as ScreenId,
      icon: BookOpen,
      desc: 'Interactive 3-column workspace with live linen preview, font curation, and print export.',
      benefit: 'Publication & digital ready',
    },
  ];

  return (
    <div className="rounded-xl border border-[#E3DC CE] bg-[#FAF8F5] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE4D8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
              End-to-End Pipeline
            </span>
            <span className="w-1 h-1 rounded-full bg-[#B0A795]" />
            <span className="text-xs text-[#736E64]">5 Integrated Disciplines</span>
          </div>
          <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1C1D1F] tracking-tight">
            The Menu Optimization Journey
          </h3>
        </div>

        <div className="text-xs font-mono text-[#787163]">
          Click any phase to navigate directly
        </div>
      </div>

      {/* Horizontal Cards Track with responsive horizontal scroll on smaller screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          const isCurrent = activeStep === idx;

          return (
            <motion.div
              key={item.title}
              whileHover={{ y: -3, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}
              transition={{ duration: 0.18 }}
              onClick={() => {
                setActiveStep(idx);
                onNavigate(item.screen);
              }}
              className="p-4 rounded-lg border border-[#DDD5C5] bg-[#FFFDF9] hover:border-[#874A2B]/50 transition-all flex flex-col justify-between cursor-pointer space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#8A7862]">
                    {item.step}
                  </span>
                  <div className="p-1.5 rounded bg-[#F2EDE2] text-[#874A2B] group-hover:bg-[#874A2B] group-hover:text-white transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-serif-display text-base font-bold text-[#1C1D1F] tracking-tight group-hover:text-[#874A2B] transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-[11px] font-medium text-[#7A7468]">
                    {item.label}
                  </div>
                </div>

                <p className="text-[11px] text-[#544F46] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F0EBE0] flex items-center justify-between text-[10px] font-mono text-[#205A37]">
                <span>{item.benefit}</span>
                <ArrowRight className="w-3 h-3 text-[#874A2B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

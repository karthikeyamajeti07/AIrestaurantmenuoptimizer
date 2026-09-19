import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../../types';
import {
  Award,
  DollarSign,
  Package,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface InsightRowData {
  id: string;
  type: string;
  title: string;
  dishName: string;
  metric: string;
  recommendation: string;
  actionText: string;
  targetScreen: ScreenId;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}

interface InsightRowsProps {
  onNavigate: (screen: ScreenId) => void;
}

export const InsightRows: React.FC<InsightRowsProps> = ({ onNavigate }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const insights: InsightRowData[] = [
    {
      id: 'insight-1',
      type: 'HIGH-MARGIN BESTSELLER',
      title: 'Flagship Revenue Driver',
      dishName: 'Margherita Pizza',
      metric: '40% Margin • 420 orders/mo',
      recommendation: 'Feature prominently in top-center Golden Triangle and add Chef Special badge.',
      actionText: 'Position in Studio',
      targetScreen: 'studio',
      color: '#B07B24',
      bgColor: '#FAF2DF',
      borderColor: '#EED9AD',
      icon: Award,
    },
    {
      id: 'insight-2',
      type: 'PRICE ANCHOR',
      title: 'Elasticity Decoy Ceiling',
      dishName: 'Grilled Salmon',
      metric: '₹750 → ₹799 (+₹49 pure margin)',
      recommendation: 'Use as premium anchor to create favorable contrast against ₹350–₹420 pasta entries.',
      actionText: 'Review Elasticity',
      targetScreen: 'pricing',
      color: '#874A2B',
      bgColor: '#F7EFE9',
      borderColor: '#ECCEC0',
      icon: TrendingUp,
    },
    {
      id: 'insight-3',
      type: 'BUNDLE OPPORTUNITY',
      title: 'Beverage Attachment Lift',
      dishName: 'Margherita + Italian Spritz',
      metric: '+₹129 average check lift',
      recommendation: 'Create "Pranzo Express" lunch bundle coupling wood-fired pizza with citrus spritz.',
      actionText: 'Configure Bundle',
      targetScreen: 'strategy',
      color: '#205A37',
      bgColor: '#EAF3ED',
      borderColor: '#CCE3D3',
      icon: Package,
    },
  ];

  return (
    <div className="rounded-xl border border-[#E3DC CE] bg-[#FAF8F5] p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE4D8]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold block">
            Executive Synthesis
          </span>
          <h3 className="font-serif-display text-lg font-bold text-[#1C1D1F]">
            Priority Growth Opportunities
          </h3>
        </div>
        <span className="text-xs text-[#736E64] font-mono">
          Interactive Directives (Hover to expand)
        </span>
      </div>

      <div className="space-y-3">
        {insights.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredId === item.id;

          return (
            <motion.div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              animate={{
                y: isHovered ? -2 : 0,
                boxShadow: isHovered ? '0 4px 16px rgba(0,0,0,0.06)' : '0 1px 2px rgba(0,0,0,0.02)',
              }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`p-4 sm:p-5 rounded-lg border transition-colors cursor-pointer ${
                isHovered
                  ? 'bg-[#FFFDFB] border-[#874A2B]/40'
                  : 'bg-[#FAF8F5] border-[#DDD5C5]'
              }`}
              onClick={() => onNavigate(item.targetScreen)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className="p-2.5 rounded-md border shrink-0 mt-0.5 sm:mt-0"
                    style={{
                      backgroundColor: item.bgColor,
                      borderColor: item.borderColor,
                      color: item.color,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] font-mono uppercase tracking-wider font-bold"
                        style={{ color: item.color }}
                      >
                        {item.type}
                      </span>
                      <span className="text-xs text-[#8C8477]">•</span>
                      <span className="font-serif-display text-base font-bold text-[#1C1D1F]">
                        {item.dishName}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#544F46] font-medium">
                      {item.metric}
                    </div>

                    <p className="text-xs text-[#635E53] leading-relaxed pt-0.5">
                      Recommendation →{' '}
                      <span className="text-[#1C1D1F] font-medium">
                        {item.recommendation}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(item.targetScreen);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      isHovered
                        ? 'bg-[#1C1D1F] text-white'
                        : 'bg-[#EFEAE0] text-[#4A453C] hover:bg-[#E2DBCF]'
                    }`}
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

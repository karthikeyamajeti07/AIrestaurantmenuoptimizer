import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, ScreenId } from '../../types';
import { MotionButton } from '../common/MotionButton';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Award,
  DollarSign,
  Scan,
} from 'lucide-react';

interface HeroSectionProps {
  menu: Menu;
  onNavigate: (screen: ScreenId) => void;
  onScrollToStory?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  menu,
  onNavigate,
  onScrollToStory,
}) => {
  const [scanActive, setScanActive] = useState(true);

  // Dishes to feature in the realistic preview
  const featuredDishes = [
    {
      id: 'dish-1',
      name: 'Margherita D.O.P.',
      desc: 'San Marzano tomatoes, Fior di Latte mozzarella, hand-torn sweet basil, cold-pressed olive oil.',
      price: 350,
      cost: 140,
      margin: 40,
      bestseller: true,
      tag: 'Stars Quadrant',
      opportunity: 'Featured Hero Plate',
    },
    {
      id: 'dish-3',
      name: 'Pan-Seared Salmon',
      desc: 'Atlantic fillet with crispy skin, Meyer lemon emulsion, butter-braised baby leeks.',
      price: 750,
      suggestedPrice: 799,
      cost: 375,
      margin: 50,
      bestseller: false,
      tag: 'Anchor Item',
      opportunity: 'Suggested: ₹799 (+₹49 anchor)',
    },
    {
      id: 'dish-2',
      name: 'Spaghetti alla Carbonara',
      desc: 'Hand-extruded pasta, crispy Roman guanciale, pecorino romano, farm egg emulsion.',
      price: 420,
      cost: 168,
      margin: 35,
      bestseller: false,
      tag: 'Plowhorse',
      opportunity: 'Sensory copy rewrite ready',
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-xl border border-[#E3DC CE] bg-[#FAF8F5] p-6 sm:p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Subtle paper grain background element */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#DDD5C5_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Hero Copy & Actions */}
        <div className="lg:col-span-6 space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#1C1D1F] leading-[1.12]"
          >
            Turn Your Menu Into Your Best Sales Tool.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#555047] leading-relaxed max-w-xl"
          >
            Analyze pricing, descriptions and menu structure — then turn your findings into a menu built to sell.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <MotionButton
              size="lg"
              variant="primary"
              onClick={() => onNavigate('upload')}
              className="px-6 shadow-sm"
            >
              <span>Optimize My Menu</span>
              <ArrowRight className="w-4 h-4" />
            </MotionButton>

            <MotionButton
              size="lg"
              variant="secondary"
              onClick={() => {
                if (onScrollToStory) {
                  onScrollToStory();
                } else {
                  onNavigate('overview');
                }
              }}
            >
              <span>See How It Works</span>
            </MotionButton>
          </motion.div>

        </div>

        {/* Right Column: Realistic Animated Restaurant Menu Preview */}
        <div className="lg:col-span-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-lg border border-[#DDD5C5] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            {/* Animated Laser Analysis Scan Line sweeping across the menu */}
            <motion.div
              animate={
                scanActive
                  ? {
                      top: ['-10%', '110%'],
                      opacity: [0, 0.85, 0.85, 0],
                    }
                  : {}
              }
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: 'easeInOut',
              }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#874A2B] to-transparent z-30 pointer-events-none shadow-[0_0_8px_rgba(135,74,43,0.6)]"
            >
              <div className="absolute right-4 -top-3 text-[9px] font-mono uppercase bg-[#1C1D1F] text-[#F9F8F6] px-1.5 py-0.5 rounded shadow-xs">
                Scanning Heuristics
              </div>
            </motion.div>

            {/* Menu Header */}
            <div className="text-center pb-4 border-b border-[#EAE3D6] space-y-1">
              <div className="text-[10px] tracking-[0.25em] font-mono uppercase text-[#8A7862] font-semibold">
                Trattoria Bella Italia
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-[#1C1D1F] tracking-tight">
                Dinner & Specialties
              </h2>
              <p className="text-[11px] text-[#787163] italic">
                Autumn Harvest • Handmade Daily
              </p>
            </div>

            {/* Dishes List with Staggered Framer Motion reveals */}
            <div className="divide-y divide-[#F0EBE0] py-1">
              {featuredDishes.map((dish, i) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.25 + i * 0.18 }}
                  className="py-3.5 space-y-1 group relative"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif-display text-base font-bold text-[#1E2022]">
                        {dish.name}
                      </span>

                      {dish.bestseller && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 }}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF1DF] text-[#7A5210] border border-[#EEDBBA]"
                        >
                          <Award className="w-3 h-3 text-[#B07B24]" />
                          Bestseller
                        </motion.span>
                      )}

                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F2EDE2] text-[#696255]">
                        {dish.tag}
                      </span>
                    </div>

                    {/* Animated Price Fade-in */}
                    <div className="text-right shrink-0">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                        className="font-mono font-bold text-sm text-[#1C1D1F]"
                      >
                        ₹{dish.price}
                      </motion.span>
                    </div>
                  </div>

                  <p className="text-xs text-[#555047] leading-relaxed">
                    {dish.desc}
                  </p>

                  {/* Margin Indicators & Real-time Opportunities */}
                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className="text-[#205A37] font-semibold flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#205A37]" />
                      Margin: {dish.margin}% (Cost ₹{dish.cost})
                    </motion.span>

                    <motion.span
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.15 }}
                      className="text-[#874A2B] font-medium bg-[#F7EFE9] px-2 py-0.5 rounded border border-[#ECD9CE]"
                    >
                      {dish.opportunity}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Status Ribbon */}
            <div className="mt-3 pt-3 border-t border-[#EAE3D6] flex items-center justify-between text-xs text-[#787265] font-mono">
              <span className="flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5 text-[#874A2B]" />
                Live Heuristic Validation Active
              </span>
              <span className="text-[#205A37] font-semibold">+18.4% Revenue Potential</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

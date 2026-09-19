import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, TrendingUp, HelpCircle, Check } from 'lucide-react';

export const PriceSpectrum: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('salmon');

  const pricePoints = [
    { label: 'Tiramisu', price: 280, category: 'Dolci', isAnchor: false },
    { label: 'Margherita', price: 350, category: 'Pizza', isAnchor: false },
    { label: 'Carbonara', price: 420, category: 'Pasta', isAnchor: false },
    { label: 'Alfredo', price: 480, category: 'Pasta', isAnchor: false },
    { label: 'Salmon (Current)', price: 750, category: 'Secondi', isAnchor: true, isCurrent: true },
    { label: 'Salmon (Anchor)', price: 799, category: 'Secondi', isAnchor: true, isSuggested: true },
  ];

  return (
    <div className="rounded-xl border border-[#E3DC CE] bg-[#FAF8F5] p-6 sm:p-8 shadow-xs space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE4D8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
              Psychological Architecture
            </span>
            <span className="w-1 h-1 rounded-full bg-[#B0A795]" />
            <span className="text-xs text-[#736E64]">Price Spectrum & Decoy Anchoring</span>
          </div>
          <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1C1D1F] tracking-tight">
            Menu Price Elasticity & Anchor Spectrum
          </h3>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#EFEAE0] border border-[#DDD5C5] text-xs font-mono text-[#555047]">
          <span>Span: ₹280 – ₹799</span>
        </div>
      </div>

      {/* Horizontal Spectrum Graphic */}
      <div className="relative py-8 px-4 sm:px-8 bg-[#FFFDF9] rounded-lg border border-[#DDD5C5]">
        {/* Base Track Line */}
        <div className="relative h-[2px] w-full bg-[#E3DCCF] my-8">
          {/* Active price fill segment between ₹750 and ₹799 */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute right-0 h-[3px] -top-[0.5px] bg-[#874A2B] rounded origin-left"
            style={{ width: '12%' }}
          />
        </div>

        {/* Spectrum Nodes */}
        <div className="absolute inset-x-4 sm:inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
          {pricePoints.map((item, index) => {
            const isAnchorCurrent = item.isCurrent;
            const isAnchorSuggested = item.isSuggested;

            return (
              <div
                key={item.label}
                className="relative flex flex-col items-center pointer-events-auto cursor-pointer"
                onClick={() => setActiveItem(item.label)}
              >
                {/* Node Label Above */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="absolute -top-12 text-center whitespace-nowrap"
                >
                  <div className="text-[11px] font-sans font-medium text-[#4A463E]">
                    {item.label.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-mono text-[#8C8477]">
                    {item.category}
                  </div>
                </motion.div>

                {/* The Dot / Marker */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                    delay: 0.15 + index * 0.1,
                  }}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-transform duration-200 hover:scale-125 ${
                    isAnchorSuggested
                      ? 'bg-[#874A2B] border-[#874A2B] shadow-[0_0_6px_rgba(135,74,43,0.5)]'
                      : isAnchorCurrent
                      ? 'bg-[#E5DFD3] border-[#706B60]'
                      : 'bg-white border-[#706B60]'
                  }`}
                />

                {/* Price Label Below */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="absolute -bottom-10 text-center whitespace-nowrap"
                >
                  <span
                    className={`font-mono text-xs font-bold ${
                      isAnchorSuggested
                        ? 'text-[#874A2B] bg-[#F7EEE8] px-1.5 py-0.5 rounded border border-[#E9D8CD]'
                        : isAnchorCurrent
                        ? 'text-[#706B60] line-through'
                        : 'text-[#1C1D1F]'
                    }`}
                  >
                    ₹{item.price}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Animated Connector & Floating Anchor Badge */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute right-4 sm:right-6 -bottom-5"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#874A2B] text-white shadow-xs">
            Price Anchor Delta: +₹49
          </span>
        </motion.div>
      </div>

      {/* Strategy Breakdown Card as requested */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="rounded-lg bg-[#FAF6EE] border border-[#E0D7C6] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="grid grid-cols-3 gap-4 sm:gap-8 divide-x divide-[#E5DDCF]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#736E63] block">
              CURRENT
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-[#1C1D1F]">
              ₹750
            </span>
            <span className="text-[10px] text-[#8A8477] block font-mono">Cost: ₹375 (50%)</span>
          </div>

          <div className="pl-4 sm:pl-8">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#874A2B] font-semibold block">
              SUGGESTED
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-[#874A2B]">
              ₹799
            </span>
            <span className="text-[10px] text-[#205A37] block font-mono font-medium">+₹49 pure margin</span>
          </div>

          <div className="pl-4 sm:pl-8">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#736E63] block">
              STRATEGY
            </span>
            <span className="text-xs sm:text-sm font-serif-display font-bold text-[#1C1D1F]">
              Price Anchoring
            </span>
            <span className="text-[10px] text-[#6B655B] block">Makes ₹420 pasta seem high-value</span>
          </div>
        </div>

        <div className="md:border-l md:border-[#E5DDCF] md:pl-6 text-xs text-[#524E45] max-w-sm">
          <p className="leading-relaxed">
            By positioning Pan-Seared Salmon at ₹799, diners anchor their expectation of high-end dining, causing core pasta items at ₹350–₹420 to feel notably affordable.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

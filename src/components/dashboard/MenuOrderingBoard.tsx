import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  ArrowUpDown,
  Sparkles,
  Award,
  AlertCircle,
  Package,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface MenuRowItem {
  id: string;
  name: string;
  category: string;
  price: number;
  margin: number;
  orders: number;
  status: 'star' | 'puzzle' | 'plowhorse' | 'dog' | 'bundle';
  note?: string;
}

export const MenuOrderingBoard: React.FC = () => {
  const [isOptimized, setIsOptimized] = useState(true);

  // Default unoptimized order (arbitrary chronologic entry)
  const unoptimizedList: MenuRowItem[] = [
    {
      id: 'item-carbonara',
      name: 'Spaghetti Carbonara',
      category: 'Handmade Pasta',
      price: 420,
      margin: 35,
      orders: 140,
      status: 'dog',
      note: 'Placed at top; low margin and slow volume.',
    },
    {
      id: 'item-alfredo',
      name: 'Fettuccine Alfredo',
      category: 'Handmade Pasta',
      price: 480,
      margin: 38,
      orders: 390,
      status: 'plowhorse',
      note: 'Plowhorse volume buried halfway down.',
    },
    {
      id: 'item-salmon',
      name: 'Pan-Seared Salmon',
      category: 'Secondi',
      price: 750,
      margin: 50,
      orders: 110,
      status: 'puzzle',
      note: 'High margin anchor placed at page bottom.',
    },
    {
      id: 'item-margherita',
      name: 'Margherita D.O.P.',
      category: 'Wood-Fired Pizza',
      price: 350,
      margin: 40,
      orders: 420,
      status: 'star',
      note: 'High-margin Star hidden behind pasta.',
    },
    {
      id: 'item-spritz',
      name: 'Italian Citrus Spritz',
      category: 'Beverages',
      price: 180,
      margin: 70,
      orders: 85,
      status: 'bundle',
      note: 'Separated on drinks page with zero combo attachment.',
    },
  ];

  // Optimized layout: Golden Triangle hierarchy (bestseller top, combo adjacent, anchor positioned)
  const optimizedList: MenuRowItem[] = [
    {
      id: 'item-margherita',
      name: 'Margherita D.O.P.',
      category: 'Wood-Fired Pizza',
      price: 350,
      margin: 40,
      orders: 420,
      status: 'star',
      note: 'Moved to Golden Triangle: Primary focal spot #1.',
    },
    {
      id: 'item-spritz',
      name: 'Italian Citrus Spritz (Bundle Partner)',
      category: 'Beverages & Pairing',
      price: 180,
      margin: 70,
      orders: 85,
      status: 'bundle',
      note: 'Coupled with Margherita for +₹129 lunch check lift.',
    },
    {
      id: 'item-salmon',
      name: 'Pan-Seared Salmon (Decoy Anchor)',
      category: 'Secondi Speciali',
      price: 799,
      margin: 50,
      orders: 110,
      status: 'puzzle',
      note: 'Positioned as premium ceiling anchor item.',
    },
    {
      id: 'item-alfredo',
      name: 'Fettuccine Alfredo',
      category: 'Handmade Pasta',
      price: 480,
      margin: 38,
      orders: 390,
      status: 'plowhorse',
      note: 'Volume workhorse with modest price test (+₹15).',
    },
    {
      id: 'item-carbonara',
      name: 'Spaghetti Carbonara',
      category: 'Handmade Pasta',
      price: 420,
      margin: 35,
      orders: 140,
      status: 'dog',
      note: 'Promote or rework: ingredient cost rebalanced.',
    },
  ];

  const currentItems = isOptimized ? optimizedList : unoptimizedList;

  return (
    <div className="rounded-xl border border-[#E3DC CE] bg-[#FAF8F5] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE4D8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
              Spatial Psychology
            </span>
            <span className="w-1 h-1 rounded-full bg-[#B0A795]" />
            <span className="text-xs text-[#736E64]">Golden Triangle Eye-Pathing</span>
          </div>
          <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1C1D1F] tracking-tight">
            Menu Hierarchy & Structural Board
          </h3>
          <p className="text-xs text-[#5E5950] mt-0.5">
            Your menu structure can influence what customers notice.
          </p>
        </div>

        {/* Toggle between arbitrary order and engineered hierarchy */}
        <div className="flex items-center gap-2 bg-[#EFEAE0] p-1 rounded-lg border border-[#DDD5C5]">
          <button
            onClick={() => setIsOptimized(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              !isOptimized
                ? 'bg-[#1C1D1F] text-white shadow-xs font-semibold'
                : 'text-[#615C52] hover:text-[#1C1D1F]'
            }`}
          >
            Raw Sequence
          </button>
          <button
            onClick={() => setIsOptimized(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              isOptimized
                ? 'bg-[#1C1D1F] text-white shadow-xs font-semibold'
                : 'text-[#615C52] hover:text-[#1C1D1F]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#E8C59A]" />
            <span>Engineered Layout</span>
          </button>
        </div>
      </div>

      {/* The Animated Board */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {currentItems.map((item, index) => {
            const isTopSpot = isOptimized && index === 0;
            const isBundle = item.status === 'bundle';
            const isAnchor = item.status === 'puzzle';
            const isRework = item.status === 'dog';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className={`p-4 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isTopSpot
                    ? 'bg-[#FFFDF8] border-[#874A2B]/40 ring-1 ring-[#874A2B]/20 shadow-xs'
                    : isBundle
                    ? 'bg-[#FAF6F0] border-[#E2D8C6]'
                    : 'bg-[#FFFDF9] border-[#DDD5C5]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <span className="font-mono text-xs font-bold text-[#8A7862] w-5">
                    0{index + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif-display text-base font-bold text-[#1C1D1F]">
                        {item.name}
                      </span>

                      {isTopSpot && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FAF0DC] text-[#78521A] border border-[#ECD9B6] flex items-center gap-1">
                          <Eye className="w-3 h-3 text-[#B07B24]" />
                          Golden Triangle #1 Spot
                        </span>
                      )}

                      {isBundle && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EBF3ED] text-[#205A37] border border-[#CCE2D2]">
                          Bundle Pair
                        </span>
                      )}

                      {isRework && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#F8ECE8] text-[#8C3A24] border border-[#ECCDC6]">
                          Promote or rework
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#635E54] mt-0.5 font-sans">
                      {item.note}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 text-xs font-mono pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EBE0]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#8C8477] block">MARGIN</span>
                    <span className="font-bold text-[#205A37]">{item.margin}%</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#8C8477] block">PRICE</span>
                    <span className="font-bold text-[#1C1D1F]">₹{item.price}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="pt-2 text-xs text-[#736E64] flex items-center justify-between">
        <span className="font-mono text-[11px]">
          Eye tracking studies confirm diners scan top-center first, followed by upper right.
        </span>
        <span className="text-[#205A37] font-medium font-mono">
          {isOptimized ? 'Hierarchy active' : 'Default list'}
        </span>
      </div>
    </div>
  );
};

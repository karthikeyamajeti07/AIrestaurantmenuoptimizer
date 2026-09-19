import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { Menu, Dish, ScreenId, MenuCategoryType } from '../../types';
import { Badge, DietaryBadge } from '../common/Badge';
import {
  FileText,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface MenuOverviewScreenProps {
  menu: Menu;
  onNavigate: (screen: ScreenId) => void;
  onSelectDishForDescription?: (dishId: string) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const tableRowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export const MenuOverviewScreen: React.FC<MenuOverviewScreenProps> = ({
  menu,
  onNavigate,
  onSelectDishForDescription,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...menu.categories.map((c) => c.name)];

  const filteredDishes = menu.dishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.originalDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGoToDescription = (dishId: string) => {
    if (onSelectDishForDescription) {
      onSelectDishForDescription(dishId);
    }
    onNavigate('descriptions');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12"
    >
      {/* Header Info */}
      <motion.div variants={itemVariants} className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
                Stage 02 • Structured Extraction
              </span>
              <span className="w-1 h-1 rounded-full bg-[#B0A795]" />
              <span className="text-xs text-[#736E64]">
                Source: {menu.metadata.extractedFrom}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1F22] font-bold tracking-tight">
              Extracted Menu Architecture
            </h1>
            <p className="text-sm text-[#615B50] mt-1 max-w-2xl">
              All dishes, portions, costs, and selling prices extracted from your original menu file.
              Review baseline margins and identified customer favorites before proceeding to copy optimization.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('descriptions')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1F2023] hover:bg-[#35363B] rounded transition-colors shadow-xs cursor-pointer"
            >
              <span>Next: AI Descriptions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Insights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#ECE7DC]">
          <div className="p-3 bg-[#F4F0E8] rounded border border-[#E3DCCF]">
            <span className="text-[11px] text-[#787265] uppercase font-mono block">Extracted Items</span>
            <span className="text-xl font-bold text-[#1E2022] mt-0.5 font-serif block">
              {menu.dishes.length} Dishes
            </span>
            <span className="text-[11px] text-[#555045]">In 6 categories</span>
          </div>

          <div className="p-3 bg-[#F4F0E8] rounded border border-[#E3DCCF]">
            <span className="text-[11px] text-[#787265] uppercase font-mono block">Average Margin</span>
            <span className="text-xl font-bold text-[#235839] mt-0.5 font-serif block">
              {menu.metadata.averageMargin}%
            </span>
            <span className="text-[11px] text-[#2C6342]">Range: 35% – 68%</span>
          </div>

          <div className="p-3 bg-[#F4F0E8] rounded border border-[#E3DCCF]">
            <span className="text-[11px] text-[#787265] uppercase font-mono block">Bestsellers Identified</span>
            <span className="text-xl font-bold text-[#1E2022] mt-0.5 font-serif block">
              {menu.metadata.bestsellerCount} Items
            </span>
            <span className="text-[11px] text-[#555045]">Pizza & Alfredo</span>
          </div>

          <div className="p-3 bg-[#F4F0E8] rounded border border-[#E3DCCF]">
            <span className="text-[11px] text-[#787265] uppercase font-mono block">Highest Margin Item</span>
            <span className="text-xl font-bold text-[#235839] mt-0.5 font-serif block">
              Tiramisu (55%)
            </span>
            <span className="text-[11px] text-[#2C6342]">Cost: ₹126 • Price: ₹280</span>
          </div>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div variants={itemVariants} className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-md p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1E1F22] text-[#F9F8F6] shadow-xs'
                  : 'bg-[#EFEAE0] text-[#5C564B] hover:bg-[#E5DFD2] hover:text-[#1E1F22]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-[#8A8477] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dish or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F4F0E7] border border-[#DCD5C6] rounded text-[#1E2022] placeholder-[#8A8477] focus:outline-none focus:border-[#1E1F22]"
          />
        </div>
      </motion.div>

      {/* Structured Extraction Table */}
      <motion.div variants={itemVariants} className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0EBE0] border-b border-[#E2DAD0] text-[#555047] uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Dish & Dietary</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Original Description</th>
                <th className="py-3 px-3 font-semibold text-right">Price</th>
                <th className="py-3 px-3 font-semibold text-right">Food Cost</th>
                <th className="py-3 px-3 font-semibold text-right">Gross Margin</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DF]">
              {filteredDishes.map((dish, idx) => {
                const isHighMargin = dish.margin >= 45;
                const isLowMargin = dish.margin <= 36;

                return (
                  <motion.tr
                    key={dish.id}
                    custom={idx}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    className="hover:bg-[#F5F1E8] transition-colors group"
                  >
                    {/* Dish Name & Dietary Tags */}
                    <td className="py-3 px-4 align-top">
                      <div className="font-serif text-sm font-bold text-[#1E2022] flex items-center gap-1.5">
                        {dish.name}
                        {dish.isBestseller && (
                          <Badge variant="bestseller" size="sm">
                            ★ Bestseller
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dish.dietary.map((tag) => (
                          <DietaryBadge key={tag} tag={tag} />
                        ))}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 align-top text-[#635E54] font-medium whitespace-nowrap">
                      {dish.category}
                    </td>

                    {/* Original Description */}
                    <td className="py-3 px-4 align-top text-[#5A554A] max-w-xs leading-relaxed">
                      <p className="line-clamp-2 italic text-[#6B655A]">
                        "{dish.originalDescription}"
                      </p>
                      {dish.optimizedDescription && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#245D3B] font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Optimized copy ready</span>
                        </div>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 align-top text-right font-serif font-bold text-sm text-[#1E2022] whitespace-nowrap">
                      ₹{dish.price}
                    </td>

                    {/* Cost */}
                    <td className="py-3 px-3 align-top text-right font-mono text-[#6E685C] whitespace-nowrap">
                      ₹{dish.cost}
                    </td>

                    {/* Margin */}
                    <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                          isHighMargin
                            ? 'bg-[#EBF3ED] text-[#205A37] border border-[#CFE4D5]'
                            : isLowMargin
                            ? 'bg-[#FBEBE8] text-[#8E3220] border border-[#F0CEC7]'
                            : 'bg-[#F2ECE1] text-[#635C4E] border border-[#DFD6C5]'
                        }`}
                      >
                        {dish.margin}%
                      </span>
                    </td>

                    {/* Matrix / Status */}
                    <td className="py-3 px-4 align-top text-center whitespace-nowrap">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EAE3D5] text-[#544F44]">
                        {dish.matrixQuadrant}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                      <button
                        onClick={() => handleGoToDescription(dish.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1E1F22] bg-[#ECE7DC] hover:bg-[#E0D8C9] rounded border border-[#D8CFBF] transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#874A2B]" />
                        <span>Rewrite</span>
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-[#F0EBE0] border-t border-[#E2DAD0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B655B] gap-2">
          <span>
            Showing <strong>{filteredDishes.length}</strong> of <strong>{menu.dishes.length}</strong> extracted dishes
          </span>
          <span className="text-[11px] font-mono">
            Data validated against Bella Italia Fall 2026 specs
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

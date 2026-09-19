import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Dish, DietaryTag, MenuCategoryType } from '../../types';
import { Badge, DietaryBadge } from '../common/Badge';
import { MotionButton } from '../common/MotionButton';
import { menuService } from '../../services/mockMenuService';
import {
  BookOpen,
  Printer,
  Sparkles,
  Check,
  Search,
  Sliders,
  Eye,
  CheckCircle2,
  UtensilsCrossed,
  Tag,
  DollarSign,
  Palette,
  Type,
  LayoutGrid,
  Filter,
  Layers,
  Award,
} from 'lucide-react';

interface MenuStudioScreenProps {
  menu: Menu;
  onUpdateDish: (dish: Dish) => void;
  onResetMenu: () => void;
}

type MenuTheme = 'classic' | 'modern' | 'dark';
type TypographyStyle = 'playfair' | 'cormorant' | 'modern';
type SpacingDensity = 'compact' | 'comfortable' | 'grand';
type PriceFormat = 'symbol' | 'plain' | 'dotted';

export const MenuStudioScreen: React.FC<MenuStudioScreenProps> = ({
  menu,
  onUpdateDish,
  onResetMenu,
}) => {
  // Mode toggle: Original vs Optimized
  const [viewMode, setViewMode] = useState<'original' | 'optimized'>('optimized');
  const [menuTheme, setMenuTheme] = useState<MenuTheme>('classic');
  const [typography, setTypography] = useState<TypographyStyle>('playfair');
  const [spacing, setSpacing] = useState<SpacingDensity>('comfortable');
  const [priceFormat, setPriceFormat] = useState<PriceFormat>('dotted');
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [highlightBestsellers, setHighlightBestsellers] = useState(true);

  const [selectedDishId, setSelectedDishId] = useState<string>(menu.dishes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Inspector form state
  const activeDish = menu.dishes.find((d) => d.id === selectedDishId) || menu.dishes[0];
  const [formDish, setFormDish] = useState<Dish>(activeDish ? { ...activeDish } : ({} as Dish));

  // Sync form whenever active dish changes
  React.useEffect(() => {
    if (!menu.dishes.some((dish) => dish.id === selectedDishId)) {
      setSelectedDishId(menu.dishes[0]?.id || '');
    }
  }, [menu.dishes, selectedDishId]);

  React.useEffect(() => {
    if (activeDish) {
      setFormDish({ ...activeDish });
    }
  }, [selectedDishId, activeDish]);

  const handleSelectDish = (id: string) => {
    setSelectedDishId(id);
    const elem = document.getElementById(`preview-dish-${id}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSaveDish = async () => {
    const updated = { ...formDish };
    if (updated.price > 0) {
      updated.margin = Math.round(((updated.price - updated.cost) / updated.price) * 100);
    }
    updated.optimizedDescription = formDish.optimizedDescription;

    await menuService.updateDish(updated);
    onUpdateDish(updated);

    setSavedNotice(`Saved "${updated.name}"`);
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const handleToggleDietaryTag = (tag: DietaryTag) => {
    const current = [...formDish.dietary];
    const index = current.indexOf(tag);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(tag);
    }
    setFormDish({ ...formDish, dietary: current });
  };

  const handleQuickApplyVariant = (type: 'original' | 'concise' | 'storytelling' | 'ingredient-focused') => {
    let text = formDish.originalDescription;
    if (type === 'concise') text = formDish.descriptions.concise.description;
    if (type === 'storytelling') text = formDish.descriptions.storytelling.description;
    if (type === 'ingredient-focused') text = formDish.descriptions.ingredientFocused.description;

    setFormDish({
      ...formDish,
      optimizedDescription: text,
      selectedDescriptionType: type,
    });
  };

  const handlePrint = async () => {
    try {
      const fileUrl = await menuService.exportMenu(menu.id);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${menu.restaurantName.replace(/\s+/g, '-').toLowerCase()}-menu.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSavedNotice('PDF export generated');
    } catch (error) {
      console.warn('PDF export unavailable; opening browser print dialog.', error);
      window.print();
      setSavedNotice('Print dialog opened');
    }
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const defaultCategories: MenuCategoryType[] = [
    'Antipasti',
    'Wood-Fired Pizza',
    'Handmade Pasta',
    'Secondi',
    'Dolci',
    'Beverages',
  ];

  const categoriesList = Array.from(
    new Set([
      ...defaultCategories,
      ...menu.dishes.map((dish) => dish.category),
    ]),
  );

  const filteredDishes = menu.dishes.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Typography class lookup
  const getHeadingFont = () => {
    if (typography === 'playfair') return 'font-serif-display';
    if (typography === 'cormorant') return 'font-editorial italic';
    return 'font-ui font-bold uppercase tracking-wider';
  };

  // Spacing density lookup
  const getSpacingClasses = () => {
    if (spacing === 'compact') return 'space-y-3 py-3';
    if (spacing === 'grand') return 'space-y-7 py-7';
    return 'space-y-5 py-5';
  };

  // Theme styling for Center Menu Preview
  const themeStyles = {
    classic: {
      container: 'bg-[#FAF8F5] text-[#1E1F22] border-[#DDD5C5]',
      cardBg: 'bg-[#FFFDFB] paper-texture',
      accentColor: 'text-[#874A2B]',
      divider: 'border-[#E8E1D5]',
      priceColor: 'text-[#1C1D1F]',
      descColor: 'text-[#524E44]',
    },
    modern: {
      container: 'bg-[#FFFFFF] text-[#18191B] border-[#E1E4EA]',
      cardBg: 'bg-[#FAFAFB]',
      accentColor: 'text-[#2C4875]',
      divider: 'border-[#ECEEF2]',
      priceColor: 'text-[#18191B]',
      descColor: 'text-[#5F6368]',
    },
    dark: {
      container: 'bg-[#18181A] text-[#F3EFE6] border-[#313235]',
      cardBg: 'bg-[#1F1F22]',
      accentColor: 'text-[#E8C59A]',
      divider: 'border-[#2E2F33]',
      priceColor: 'text-[#E8C59A]',
      descColor: 'text-[#A8A49A]',
    },
  };

  const activeTheme = themeStyles[menuTheme];

  const renderPrice = (price: number) => {
    if (priceFormat === 'plain') return `${price}`;
    return `₹${price}`;
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Studio Control Bar */}
      <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
              Master Composition Workspace
            </span>
            <span className="w-1 h-1 rounded-full bg-[#B0A795]" />
            <span className="text-xs text-[#736E64]">Three-Column Studio</span>
          </div>
          <h1 className="font-serif-display text-2xl font-bold text-[#1E1F22] tracking-tight">
            Menu Studio
          </h1>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Before/After Original vs Optimized Toggle with smooth cross-fade */}
          <div className="flex items-center p-1 bg-[#EBE5DA] rounded-lg border border-[#DDD5C5]">
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'original'
                  ? 'bg-[#1E1F22] text-white shadow-xs font-semibold'
                  : 'text-[#635E54] hover:text-[#1E1F22]'
              }`}
            >
              Original Menu
            </button>
            <button
              onClick={() => setViewMode('optimized')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'optimized'
                  ? 'bg-[#1E1F22] text-white shadow-xs'
                  : 'text-[#635E54] hover:text-[#1E1F22]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#E6D4B8]" />
              <span>Optimized Menu</span>
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F0EBE0] rounded-lg border border-[#E0D7C6] text-xs">
            <Palette className="w-3.5 h-3.5 text-[#736B5E]" />
            <select
              value={menuTheme}
              onChange={(e) => setMenuTheme(e.target.value as MenuTheme)}
              className="bg-transparent border-none text-xs text-[#2A2722] font-medium focus:outline-none cursor-pointer"
            >
              <option value="classic">Trattoria Linen</option>
              <option value="modern">Modern Bistro</option>
              <option value="dark">Luxe Reserve</option>
            </select>
          </div>

          {/* Print / Export Button */}
          <MotionButton
            size="sm"
            variant="primary"
            onClick={handlePrint}
            title="Print or Export as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Menu</span>
          </MotionButton>
        </div>
      </div>

      {/* Main Three-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Categories & Dishes List (3 spans) */}
        <div className="lg:col-span-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl p-4 space-y-4 max-h-[860px] overflow-y-auto no-print shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#1E2022]">
                Menu Structure
              </h2>
              <span className="text-[11px] font-mono text-[#8C8477]">
                {menu.dishes.length} items
              </span>
            </div>

            <div className="relative mb-2.5">
              <Search className="w-3.5 h-3.5 text-[#8C8477] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-[#F4F0E7] border border-[#DCD5C6] rounded-md text-[#1E2022] focus:outline-none focus:border-[#1E1F22]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  categoryFilter === 'all'
                    ? 'bg-[#1C1D1F] text-white font-semibold'
                    : 'bg-[#EAE4D7] text-[#555046] hover:bg-[#DDD5C5]'
                }`}
              >
                All
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-[#1C1D1F] text-white font-semibold'
                      : 'bg-[#EAE4D7] text-[#555046] hover:bg-[#DDD5C5]'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {categoriesList.map((categoryName) => {
              const catDishes = filteredDishes.filter((d) => d.category === categoryName);
              if (catDishes.length === 0) return null;

              return (
                <div key={categoryName} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#7B7365] uppercase font-mono px-1 py-0.5 border-b border-[#EAE3D6] flex items-center justify-between">
                    <span>{categoryName}</span>
                    <span className="text-[10px] font-normal">{catDishes.length}</span>
                  </div>

                  <div className="space-y-1">
                    {catDishes.map((dish) => {
                      const isSelected = dish.id === selectedDishId;
                      const displayPrice =
                        viewMode === 'optimized' && dish.id === 'dish-3'
                          ? 799
                          : dish.price;

                      return (
                        <button
                          key={dish.id}
                          onClick={() => handleSelectDish(dish.id)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between group cursor-pointer ${
                            isSelected
                              ? 'bg-[#1E1F22] text-[#FAF8F5] shadow-xs font-semibold'
                              : 'hover:bg-[#F2ECE1] text-[#3D3A33]'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <span className="truncate block font-medium">{dish.name}</span>
                            <span
                              className={`text-[10px] font-mono ${
                                isSelected ? 'text-[#CCC7BC]' : 'text-[#8A8477]'
                              }`}
                            >
                              {dish.margin}% margin • ₹{dish.cost} cost
                            </span>
                          </div>

                          <div className="text-right shrink-0 font-mono text-xs">
                            <span
                              className={
                                isSelected ? 'text-white font-bold' : 'text-[#1E2022]'
                              }
                            >
                              ₹{displayPrice}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Large Realistic Restaurant Menu Preview (5 spans) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode + menuTheme + typography + spacing}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              id="restaurant-menu-sheet"
              className={`w-full rounded-xl border shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8 transition-colors duration-200 min-h-[860px] relative overflow-hidden ${activeTheme.container} ${activeTheme.cardBg}`}
            >
              {/* Subtle top crest watermark */}
              <div className="text-center pb-6 border-b border-double border-[#DCD5C6] space-y-2 relative">
                <div className="text-[10px] tracking-[0.28em] uppercase font-mono text-[#8C8477] font-semibold">
                  Trattoria • Cucina Tradizionale
                </div>
                <h1
                  className={`${getHeadingFont()} text-3xl sm:text-4xl font-bold tracking-tight ${
                    menuTheme === 'dark' ? 'text-[#F5F2EA]' : 'text-[#1E1F22]'
                  }`}
                >
                  {menu.restaurantName}
                </h1>
                <p className="menu-tagline text-xs italic text-[#787265] max-w-sm mx-auto font-serif no-print">
                  {menu.tagline}
                </p>

                {/* View Mode Watermark Tag */}
                <div className="pt-2 no-print">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      viewMode === 'optimized'
                        ? 'bg-[#EBF3ED] text-[#205A37] border-[#CFE4D5] font-semibold'
                        : 'bg-[#F2ECE1] text-[#696357] border-[#DDD5C5]'
                    }`}
                  >
                    {viewMode === 'optimized' ? (
                      <>
                        <Sparkles className="w-3 h-3 text-[#205A37]" />
                        <span>Optimized Production Menu</span>
                      </>
                    ) : (
                      <span>Un-Optimized Raw Baseline</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Menu Sections & Dishes */}
              <div className={getSpacingClasses()}>
                {categoriesList.map((categoryName) => {
                  const catDishes = menu.dishes.filter((d) => d.category === categoryName);
                  if (catDishes.length === 0) return null;

                  return (
                    <div key={categoryName} className="space-y-3.5">
                      {/* Category Title with Divider Rule */}
                      <div className="flex items-center justify-center gap-3">
                        <div className={`h-[1px] flex-1 ${activeTheme.divider} border-t`} />
                        <h2
                          className={`text-xs tracking-[0.2em] uppercase font-serif-display font-bold text-center ${activeTheme.accentColor}`}
                        >
                          {categoryName}
                        </h2>
                        <div className={`h-[1px] flex-1 ${activeTheme.divider} border-t`} />
                      </div>

                      {/* Dishes in this Category */}
                      <div className="space-y-3">
                        {catDishes.map((dish) => {
                          const isSelected = dish.id === selectedDishId;
                          const displayPrice =
                            viewMode === 'optimized' && dish.id === 'dish-3'
                              ? 799
                              : dish.price;
                          const displayDesc =
                            viewMode === 'optimized'
                              ? dish.optimizedDescription || dish.descriptions.storytelling.description
                              : dish.originalDescription;

                          return (
                            <motion.div
                              key={dish.id}
                              id={`preview-dish-${dish.id}`}
                              onClick={() => handleSelectDish(dish.id)}
                              whileHover={{ x: 2 }}
                              transition={{ duration: 0.15 }}
                              className={`p-3 rounded-lg transition-all cursor-pointer group relative ${
                                isSelected
                                  ? 'bg-[#EFEAE0]/90 ring-1 ring-[#874A2B] shadow-2xs'
                                  : 'hover:bg-[#F3EFE6]/60'
                              }`}
                            >
                              {/* Dish Title & Price with Dotted Leader */}
                              <div className="flex items-baseline justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`${getHeadingFont()} text-base font-bold tracking-tight ${
                                      isSelected ? 'text-[#874A2B]' : 'text-current'
                                    }`}
                                  >
                                    {dish.name}
                                  </span>

                                  {/* Badges in Optimized mode */}
                                  {viewMode === 'optimized' && highlightBestsellers && (
                                    <div className="flex items-center gap-1">
                                      {dish.isBestseller && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#FAF1DF] text-[#78521A] border border-[#EEDBBA]">
                                          Bestseller
                                        </span>
                                      )}
                                      {dish.dietary.includes('Chef Special') && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#F5EBE6] text-[#8E3B24] border border-[#EACEC5]">
                                          Chef Pick
                                        </span>
                                      )}
                                      {dish.dietary.map((tag) => (
                                        <DietaryBadge key={tag} tag={tag} />
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Dotted Leader between name and price */}
                                {priceFormat === 'dotted' && (
                                  <div className="flex-1 border-b border-dotted border-[#CCC4B5] mx-2 mb-1 opacity-60" />
                                )}

                                <div className="shrink-0">
                                  <span
                                    className={`font-mono text-sm font-bold ${activeTheme.priceColor}`}
                                  >
                                    {renderPrice(displayPrice)}
                                  </span>
                                </div>
                              </div>

                              {/* Description Copy */}
                              <p
                                className={`text-xs leading-relaxed mt-1 ${activeTheme.descColor} ${
                                  viewMode === 'original' ? 'italic font-serif text-[#706A5E]' : 'font-sans'
                                }`}
                              >
                                {displayDesc}
                              </p>

                              {/* Bundle callout if Margherita Pizza in Optimized mode */}
                              {viewMode === 'optimized' && showRecommendations && dish.id === 'dish-1' && (
                                <div className="mt-2 p-2 rounded bg-[#F2EDE2] border border-[#E0D7C6] text-[11px] text-[#555046] flex items-center justify-between">
                                  <span>
                                    <strong>Pranzo Combo:</strong> Pair with Italian Citrus Spritz
                                  </span>
                                  <span className="font-mono font-bold text-[#205A37]">
                                    Combo ₹479 (Save ₹51)
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Menu Footer */}
              <div className="text-center pt-8 border-t border-[#E5DFD5] text-[11px] text-[#8A8477] space-y-1">
                <p>All items freshly prepared to order. Taxes applicable as per local regulations.</p>
                <p className="font-serif italic text-xs">Buon Appetito & Grazie</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Studio Controls & Dish Inspector (4 spans) */}
        <div className="lg:col-span-4 space-y-5 no-print">
          {/* Section 1: Studio Layout & Typography Settings */}
          <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#8A7862] font-semibold pb-2 border-b border-[#EAE4D8]">
              <Sliders className="w-3.5 h-3.5" />
              <span>Studio Design Controls</span>
            </div>

            {/* Typography Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#3D3A33] flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-[#874A2B]" />
                <span>Editorial Typography</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => setTypography('playfair')}
                  className={`px-2 py-1.5 rounded-md border font-serif-display text-center transition-all cursor-pointer ${
                    typography === 'playfair'
                      ? 'bg-[#1C1D1F] text-white border-[#1C1D1F]'
                      : 'bg-white text-[#4A453C] border-[#DDD5C5] hover:bg-[#F2ECE1]'
                  }`}
                >
                  Playfair
                </button>
                <button
                  onClick={() => setTypography('cormorant')}
                  className={`px-2 py-1.5 rounded-md border font-editorial italic text-center transition-all cursor-pointer ${
                    typography === 'cormorant'
                      ? 'bg-[#1C1D1F] text-white border-[#1C1D1F]'
                      : 'bg-white text-[#4A453C] border-[#DDD5C5] hover:bg-[#F2ECE1]'
                  }`}
                >
                  Cormorant
                </button>
                <button
                  onClick={() => setTypography('modern')}
                  className={`px-2 py-1.5 rounded-md border text-center transition-all cursor-pointer ${
                    typography === 'modern'
                      ? 'bg-[#1C1D1F] text-white border-[#1C1D1F]'
                      : 'bg-white text-[#4A453C] border-[#DDD5C5] hover:bg-[#F2ECE1]'
                  }`}
                >
                  Modern
                </button>
              </div>
            </div>

            {/* Spacing Density */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#3D3A33] flex items-center gap-1">
                <LayoutGrid className="w-3.5 h-3.5 text-[#874A2B]" />
                <span>Reading Spacing Density</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['compact', 'comfortable', 'grand'] as SpacingDensity[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpacing(s)}
                    className={`px-2 py-1.5 rounded-md border capitalize text-center transition-all cursor-pointer ${
                      spacing === s
                        ? 'bg-[#1C1D1F] text-white border-[#1C1D1F]'
                        : 'bg-white text-[#4A453C] border-[#DDD5C5] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Format & Toggles */}
            <div className="space-y-2 pt-2 border-t border-[#EAE4D8] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#3D3A33] font-medium">Leader Lines</span>
                <button
                  onClick={() => setPriceFormat(priceFormat === 'dotted' ? 'plain' : 'dotted')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer ${
                    priceFormat === 'dotted'
                      ? 'bg-[#EAF3ED] text-[#205A37] border-[#CFE4D5] font-semibold'
                      : 'bg-white text-[#635E53] border-[#DDD5C5]'
                  }`}
                >
                  {priceFormat === 'dotted' ? 'Dotted Leader' : 'Compact Leader'}
                </button>
              </div>

              <label className="flex items-center justify-between cursor-pointer pt-1">
                <span className="text-[#3D3A33] font-medium">Bestseller Badges</span>
                <input
                  type="checkbox"
                  checked={highlightBestsellers}
                  onChange={(e) => setHighlightBestsellers(e.target.checked)}
                  className="rounded text-[#1C1D1F] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-1">
                <span className="text-[#3D3A33] font-medium">Bundle Recommendations</span>
                <input
                  type="checkbox"
                  checked={showRecommendations}
                  onChange={(e) => setShowRecommendations(e.target.checked)}
                  className="rounded text-[#1C1D1F] focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Active Dish Inspector Form */}
          <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D8]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold block">
                  Interactive Dish Inspector
                </span>
                <h3 className="font-serif-display text-base font-bold text-[#1E2022]">
                  {formDish.name || 'Select Dish'}
                </h3>
              </div>

              <MotionButton
                size="sm"
                variant="primary"
                onClick={handleSaveDish}
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </MotionButton>
            </div>

            {/* Saved Toast */}
            {savedNotice && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 bg-[#EBF3ED] border border-[#CFE4D5] rounded text-xs text-[#205A37] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{savedNotice}</span>
              </motion.div>
            )}

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#3D3A33] mb-1">Dish Name</label>
                <input
                  type="text"
                  value={formDish.name || ''}
                  onChange={(e) => setFormDish({ ...formDish, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded bg-white border border-[#D5CDBD] text-[#1E2022] focus:outline-none focus:border-[#1E1F22]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-[#3D3A33] mb-1">Category</label>
                  <select
                    value={formDish.category || 'Wood-Fired Pizza'}
                    onChange={(e) =>
                      setFormDish({ ...formDish, category: e.target.value as MenuCategoryType })
                    }
                    className="w-full px-2.5 py-1.5 rounded bg-white border border-[#D5CDBD] text-[#1E2022] focus:outline-none focus:border-[#1E1F22]"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D3A33] mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={formDish.price || 0}
                    onChange={(e) => setFormDish({ ...formDish, price: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded bg-white border border-[#D5CDBD] text-[#1E2022] font-mono focus:outline-none focus:border-[#1E1F22]"
                  />
                </div>
              </div>

              {/* Food Cost & Calculated Margin Bar */}
              <div className="p-2.5 bg-[#F2EDE2] rounded border border-[#E1D8C8] flex items-center justify-between text-[11px] font-mono">
                <span>Food Cost: ₹{formDish.cost}</span>
                <span>
                  Gross Margin:{' '}
                  <strong className="text-[#205A37]">
                    {formDish.price > 0
                      ? Math.round(((formDish.price - formDish.cost) / formDish.price) * 100)
                      : 0}
                    %
                  </strong>
                </span>
              </div>

              {/* 1-Click Copy Profile Switcher */}
              <div>
                <label className="block font-semibold text-[#3D3A33] mb-1">
                  1-Click Tone Variant
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['storytelling', 'concise', 'ingredient-focused', 'original'] as const).map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => handleQuickApplyVariant(variant)}
                      className={`px-2 py-1 rounded text-[11px] font-medium border text-left truncate transition-colors cursor-pointer ${
                        formDish.selectedDescriptionType === variant
                          ? 'bg-[#1E1F22] text-white border-[#1E1F22]'
                          : 'bg-white text-[#4A453C] border-[#D8D0C0] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {variant.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Editable Textarea */}
              <div>
                <label className="block font-semibold text-[#3D3A33] mb-1">
                  Live Description Copy
                </label>
                <textarea
                  rows={4}
                  value={formDish.optimizedDescription || ''}
                  onChange={(e) =>
                    setFormDish({ ...formDish, optimizedDescription: e.target.value })
                  }
                  className="w-full p-2.5 rounded bg-white border border-[#D5CDBD] text-[#1E2022] leading-relaxed resize-none focus:outline-none focus:border-[#1E1F22]"
                />
              </div>

              {/* Dietary Tags Toggle */}
              <div>
                <label className="block font-semibold text-[#3D3A33] mb-1.5">
                  Dietary Markers
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['Vegetarian', 'Vegan', 'Gluten-Free', 'Spicy', 'Chef Special'] as DietaryTag[]).map(
                    (tag) => {
                      const active = formDish.dietary?.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleDietaryTag(tag)}
                          className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#1E1F22] text-white border-[#1E1F22]'
                              : 'bg-white text-[#555046] border-[#D8D0C0] hover:bg-[#F3EFE7]'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Bestseller Checkbox */}
              <div className="pt-2 border-t border-[#EAE4D8]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formDish.isBestseller}
                    onChange={(e) => setFormDish({ ...formDish, isBestseller: e.target.checked })}
                    className="rounded border-[#D5CDBD] text-[#1E1F22] focus:ring-0"
                  />
                  <span className="font-semibold text-[#2C2924]">Mark as Bestseller Star</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

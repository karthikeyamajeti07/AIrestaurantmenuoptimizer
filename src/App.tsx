import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, Menu, Dish, PricingOpportunity, MenuStrategyInsight } from './types';
import { menuService } from './services/mockMenuService';
import { Header } from './components/layout/Header';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { UploadScreen } from './components/screens/UploadScreen';
import { ProcessingScreen } from './components/screens/ProcessingScreen';
import { MenuOverviewScreen } from './components/screens/MenuOverviewScreen';
import { AIDescriptionsScreen } from './components/screens/AIDescriptionsScreen';
import { PricingIntelligenceScreen } from './components/screens/PricingIntelligenceScreen';
import { MenuStrategyScreen } from './components/screens/MenuStrategyScreen';
import { MenuStudioScreen } from './components/screens/MenuStudioScreen';
import { INITIAL_MENU } from './data/mockMenuData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [menu, setMenu] = useState<Menu>(INITIAL_MENU);
  const [pricingRecs, setPricingRecs] = useState<PricingOpportunity[]>([]);
  const [strategyInsights, setStrategyInsights] = useState<MenuStrategyInsight[]>([]);
  const [activeDishForDescription, setActiveDishForDescription] = useState<string | undefined>(undefined);
  const [uploadFileName, setUploadFileName] = useState<string>('Bella_Italia_Dinner_Menu_Fall.pdf');
  const [pendingAnalysis, setPendingAnalysis] = useState<Promise<Menu> | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      const initialMenu = await menuService.getMenu();
      const recs = await menuService.getPricingOpportunities();
      const insights = await menuService.getStrategyInsights();
      setMenu(initialMenu);
      setPricingRecs(recs);
      setStrategyInsights(insights);
    }
    loadInitialData();
  }, []);

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartProcessing = (file: File, restaurantName: string) => {
    setUploadError(null);
    setUploadFileName(file.name);
    setPendingAnalysis(menuService.analyzeUploadedMenu(file, restaurantName));
    setCurrentScreen('processing');
  };

  const handleStartTextProcessing = (text: string, restaurantName: string) => {
    setUploadError(null);
    setUploadFileName('Pasted menu text');
    setPendingAnalysis(menuService.analyzeUploadedMenu(null, restaurantName, text));
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = async () => {
    try {
      if (pendingAnalysis) {
        const analyzedMenu = await pendingAnalysis;
        setMenu(analyzedMenu);
        setPricingRecs(await menuService.getPricingOpportunities());
        setStrategyInsights(await menuService.getStrategyInsights());
        setPendingAnalysis(null);
      }
      setCurrentScreen('overview');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to scan this menu file.');
      setPendingAnalysis(null);
      setCurrentScreen('upload');
    }
  };

  const handleUpdateDish = (updatedDish: Dish) => {
    setMenu((prev) => {
      const copy = { ...prev };
      const index = copy.dishes.findIndex((d) => d.id === updatedDish.id);
      if (index !== -1) {
        copy.dishes[index] = updatedDish;
      }
      return copy;
    });
  };

  const handleApplyPricing = (dishId: string, suggestedPrice: number) => {
    setMenu((prev) => {
      const copy = { ...prev };
      const target = copy.dishes.find((d) => d.id === dishId);
      if (target) {
        target.price = suggestedPrice;
        target.margin = Math.round(((suggestedPrice - target.cost) / suggestedPrice) * 100);
      }
      return copy;
    });
  };

  const handleApplyInsight = (insightId: string) => {
    setStrategyInsights((prev) =>
      prev.map((ins) => (ins.id === insightId ? { ...ins, status: 'applied' } : ins))
    );
  };

  const handleResetDemo = async () => {
    const reset = await menuService.resetMenu();
    const recs = await menuService.getPricingOpportunities();
    const insights = await menuService.getStrategyInsights();
    setMenu(reset);
    setPricingRecs(recs);
    setStrategyInsights(insights);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1E2022] flex flex-col font-ui antialiased">
      {/* Top Fixed Header with Stepper */}
      <Header
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onResetDemo={handleResetDemo}
          restaurantName={menu.restaurantName}
        />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {currentScreen === 'dashboard' && (
              <DashboardScreen menu={menu} onNavigate={handleNavigate} />
            )}

            {currentScreen === 'upload' && (
              <UploadScreen
                onStartProcessing={handleStartProcessing}
                onStartTextProcessing={handleStartTextProcessing}
                onNavigate={handleNavigate}
                errorMessage={uploadError}
              />
            )}

            {currentScreen === 'processing' && (
              <ProcessingScreen
                fileName={uploadFileName}
                onComplete={handleProcessingComplete}
              />
            )}

            {currentScreen === 'overview' && (
              <MenuOverviewScreen
                menu={menu}
                onNavigate={handleNavigate}
                onSelectDishForDescription={(dishId) => {
                  setActiveDishForDescription(dishId);
                }}
              />
            )}

            {currentScreen === 'descriptions' && (
              <AIDescriptionsScreen
                menu={menu}
                onUpdateDish={handleUpdateDish}
                onNavigate={handleNavigate}
                initialSelectedDishId={activeDishForDescription}
              />
            )}

            {currentScreen === 'pricing' && (
              <PricingIntelligenceScreen
                menu={menu}
                recommendations={pricingRecs}
                onApplyPricing={handleApplyPricing}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'strategy' && (
              <MenuStrategyScreen
                menu={menu}
                insights={strategyInsights}
                onApplyInsight={handleApplyInsight}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'studio' && (
              <MenuStudioScreen
                menu={menu}
                onUpdateDish={handleUpdateDish}
                onResetMenu={handleResetDemo}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Subtle Professional Operator Footer */}
      <footer className="border-t border-[#EAE4D8] bg-[#F4F0E8] py-4 text-xs text-[#7A7468] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#1E2022]">MenuOptimizer</span>
            <span>—</span>
            <span>AI Restaurant Menu Engineering & Description Writer</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Client: {menu.restaurantName}</span>
            <span>Currency: INR (₹)</span>
            <span>Status: Optimization Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ScreenId } from '../../types';
import { MotionButton } from '../common/MotionButton';
import { menuService } from '../../services/mockMenuService';
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
  RotateCcw,
  ChevronRight,
  UtensilsCrossed,
} from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onResetDemo: () => void;
  restaurantName: string;
  onAuthChange?: (authenticated: boolean) => void;
  initialAuthOpen?: boolean;
}

const FLOW_STEPS: { id: ScreenId; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Menu', shortLabel: 'Upload', icon: UploadCloud },
  { id: 'overview', label: 'Structured Extraction', shortLabel: 'Overview', icon: FileText },
  { id: 'descriptions', label: 'AI Descriptions', shortLabel: 'Descriptions', icon: Sparkles },
  { id: 'pricing', label: 'Pricing Intelligence', shortLabel: 'Pricing', icon: TrendingUp },
  { id: 'strategy', label: 'Menu Strategy', shortLabel: 'Strategy', icon: Target },
  { id: 'studio', label: 'Menu Studio', shortLabel: 'Studio', icon: BookOpen },
];

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onResetDemo,
  restaurantName,
  onAuthChange,
  initialAuthOpen = false,
}) => {
  const [authOpen, setAuthOpen] = useState(initialAuthOpen);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<{ name?: string; email: string } | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const currentIndex = FLOW_STEPS.findIndex((s) => s.id === currentScreen);
  const nextStep = currentIndex >= 0 && currentIndex < FLOW_STEPS.length - 1 ? FLOW_STEPS[currentIndex + 1] : null;

  useEffect(() => {
    const storedUser = localStorage.getItem('menuoptimizer_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthUser(user);
        onAuthChange?.(true);
      } catch {
        localStorage.removeItem('menuoptimizer_user');
      }
    }
  }, []);

  useEffect(() => {
    if (initialAuthOpen) setAuthOpen(true);
  }, [initialAuthOpen]);

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    setAuthBusy(true);
    try {
      const user = await menuService.authenticate(authMode, {
        name: authMode === 'register' ? authName : undefined,
        email: authEmail,
        password: authPassword,
      });
      setAuthUser(user);
      localStorage.setItem('menuoptimizer_user', JSON.stringify(user));
      onAuthChange?.(true);
      setAuthOpen(false);
      setAuthPassword('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setAuthBusy(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-[#E7E2D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] no-print">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Logo & Workspace */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            title="MenuOptimizer Home"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="w-8 h-8 rounded-md bg-[#1C1D1F] text-[#F9F8F6] flex items-center justify-center font-serif-display text-lg font-bold shadow-xs transition-colors group-hover:bg-[#874A2B]"
            >
              M
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-display font-bold text-base tracking-tight text-[#1A1A1A]">
                  MenuOptimizer
                </span>
                <span className="text-[10px] tracking-wider uppercase font-mono px-1.5 py-0.5 rounded bg-[#ECE7DC] text-[#635E54] font-semibold">
                  Editorial SaaS
                </span>
              </div>
              <p className="text-[11px] text-[#7A756B] leading-none font-sans">
                Hospitality Revenue Engineering
              </p>
            </div>
          </button>

          <div className="h-5 w-[1px] bg-[#DDD6C8] hidden sm:block mx-1" />

          {/* Active Restaurant Selector / Status */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F1ECE3] border border-[#E0D9CB] text-xs">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#874A2B]" />
            <span className="font-medium text-[#2C2924]">{restaurantName}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#205A37]" title="Active Blueprint" />
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#6B655B] hover:text-[#1E1D1A] hover:bg-[#EFEAE0] rounded-md transition-colors border border-transparent hover:border-[#DDD6C8] cursor-pointer"
            title="Reset menu changes to demo baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Demo</span>
          </motion.button>

          {currentScreen !== 'studio' && (
            <motion.button
              whileHover={{ y: -1, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('studio')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E1D1A] bg-[#EFEAE0] hover:bg-[#E5DFD3] rounded-md border border-[#DCD5C6] transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#874A2B]" />
              <span>Menu Studio</span>
            </motion.button>
          )}

          {nextStep && currentScreen !== 'processing' && (
            <motion.button
              whileHover={{ y: -1, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(nextStep.id)}
              className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1C1D1F] hover:bg-[#34353A] rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <span>{nextStep.shortLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </div>

      {authOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4" onClick={() => setAuthOpen(false)}>
          <form
            onSubmit={handleAuthSubmit}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl p-6 shadow-xl space-y-4"
          >
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862]">Workspace access</p>
              <h2 className="font-serif-display text-2xl font-bold text-[#1E2022]">
                {authMode === 'login' ? 'Sign in to MenuOptimizer' : 'Create your workspace'}
              </h2>
            </div>
            {authMode === 'register' && (
              <input required minLength={2} value={authName} onChange={(event) => setAuthName(event.target.value)} placeholder="Your name" className="w-full px-3 py-2 text-sm border border-[#DCD5C6] rounded-md bg-white" />
            )}
            <input required type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="Email address" className="w-full px-3 py-2 text-sm border border-[#DCD5C6] rounded-md bg-white" />
            <input required minLength={6} type="password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} placeholder="Password (6+ characters)" className="w-full px-3 py-2 text-sm border border-[#DCD5C6] rounded-md bg-white" />
            {authError && <p className="text-xs text-[#9A3827]">{authError}</p>}
            <button disabled={authBusy} type="submit" className="w-full px-3 py-2 text-sm font-semibold text-white bg-[#1C1D1F] disabled:opacity-60 rounded-md cursor-pointer">
              {authBusy ? 'Connecting...' : authMode === 'login' ? 'Sign in' : 'Create account'}
            </button>
            <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full text-xs text-[#874A2B] cursor-pointer">
              {authMode === 'login' ? 'New here? Create an account' : 'Already registered? Sign in'}
            </button>
          </form>
        </div>
      )}

      {/* Demo Flow Stepper Ribbon with Micro-Interactions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto border-t border-[#EAE5DC] scrollbar-none">
        <nav className="flex items-center space-x-1 py-1 min-w-max">
          {FLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentScreen === step.id;
            const isPassed = currentIndex > idx;

            return (
              <button
                key={step.id}
                onClick={() => onNavigate(step.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#ECE5D8] text-[#1E2022] font-semibold shadow-2xs'
                    : isPassed
                    ? 'text-[#555047] hover:bg-[#F2EDE2] hover:text-[#1A1917]'
                    : 'text-[#878175] hover:bg-[#F3EFE7]'
                }`}
              >
                {/* Active Indicator Pip (small terracotta line/pip) */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavPip"
                    className="absolute -bottom-1 left-3 right-3 h-[2px] bg-[#874A2B] rounded-full"
                  />
                )}

                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono transition-colors ${
                    isActive
                      ? 'bg-[#874A2B] text-white font-bold'
                      : isPassed
                      ? 'bg-[#DDD5C5] text-[#4A453C]'
                      : 'bg-[#ECE7DC] text-[#8C867B]'
                  }`}
                >
                  {idx + 1}
                </span>

                <Icon
                  className={`w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-[1px] ${
                    isActive ? 'text-[#874A2B]' : 'text-current'
                  }`}
                />
                <span className="transition-colors group-hover:text-[#1C1D1F] whitespace-nowrap">
                  {step.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, X, Sparkles, TrendingUp, Package } from 'lucide-react';
import { MotionButton } from './MotionButton';

interface OptimizationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewStudio: () => void;
}

export const OptimizationSuccessModal: React.FC<OptimizationSuccessModalProps> = ({
  isOpen,
  onClose,
  onViewStudio,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1C1D1F]/50 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md rounded-xl bg-[#FAF8F5] border border-[#DDD5C5] p-6 sm:p-7 shadow-2xl z-10 space-y-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#8C8477] hover:text-[#1C1D1F] p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#EAF3ED] border border-[#CDE3D3] text-[#205A37] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
                Optimization Cycle Complete
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-[#1C1D1F]">
                Your Menu Has Been Optimized.
              </h3>
              <p className="text-xs text-[#635E53] max-w-sm mx-auto">
                All structural, sensory, and pricing recommendations have been applied to your master menu blueprint.
              </p>
            </div>

            {/* Metric Accomplishments */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-lg bg-[#FFFDF9] border border-[#E0D8C8]">
                <span className="font-mono text-xl font-bold text-[#874A2B] block">
                  +3
                </span>
                <span className="text-[10px] text-[#635E53] font-medium block mt-0.5">
                  Pricing Opportunities
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#FFFDF9] border border-[#E0D8C8]">
                <span className="font-mono text-xl font-bold text-[#205A37] block">
                  +5
                </span>
                <span className="text-[10px] text-[#635E53] font-medium block mt-0.5">
                  Description Upgrades
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#FFFDF9] border border-[#E0D8C8]">
                <span className="font-mono text-xl font-bold text-[#1C1D1F] block">
                  +2
                </span>
                <span className="text-[10px] text-[#635E53] font-medium block mt-0.5">
                  Bundle Pairs
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <MotionButton
                variant="outline"
                size="md"
                onClick={onClose}
                className="flex-1"
              >
                Dismiss
              </MotionButton>

              <MotionButton
                variant="primary"
                size="md"
                onClick={() => {
                  onClose();
                  onViewStudio();
                }}
                className="flex-1"
              >
                <span>View in Studio</span>
                <ArrowRight className="w-4 h-4" />
              </MotionButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

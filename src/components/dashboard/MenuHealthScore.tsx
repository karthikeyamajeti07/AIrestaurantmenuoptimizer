import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, TrendingUp, AlertTriangle } from 'lucide-react';

interface MetricBarProps {
  label: string;
  score: number;
  delay: number;
  benchmark: string;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, score, delay, benchmark }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-sans font-medium text-[#2C2925]">{label}</span>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[10px] text-[#7A7468]">{benchmark}</span>
          <span className="font-bold text-[#1C1D1F]">{score}/100</span>
        </div>
      </div>
      <div className="h-2 w-full bg-[#EAE4D7] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-[#874A2B] rounded-full"
        />
      </div>
    </div>
  );
};

export const MenuHealthScore: React.FC = () => {
  const [displayScore, setDisplayScore] = useState<number>(0);
  const targetScore = 78;

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20; // ms
    const totalSteps = duration / stepTime;
    const increment = targetScore / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetScore]);

  // SVG circular arc calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (targetScore / 100) * circumference;

  return (
    <div className="rounded-xl border border-[#E3DC CE] bg-[#FAF8F5] p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D8]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7862] font-semibold block">
            Executive Audit
          </span>
          <h3 className="font-serif-display text-lg font-bold text-[#1C1D1F]">
            Overall Menu Health Score
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFEAE0] text-[#555047] border border-[#DDD5C5]">
          Grade: B+ (Solid)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Radial Circle Meter */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
              {/* Background Track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-[#E7E1D4]"
                strokeWidth="9"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Arc */}
              <motion.circle
                cx="65"
                cy="65"
                r={radius}
                stroke="#874A2B"
                strokeWidth="9"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Centered Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-3xl font-bold text-[#1C1D1F] tracking-tight">
                {displayScore}
              </span>
              <span className="text-[10px] font-mono uppercase text-[#7D766A]">
                out of 100
              </span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs font-serif italic text-[#635E54]">
              +14 pts potential lift
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Bars */}
        <div className="sm:col-span-7 space-y-4">
          <MetricBar
            label="Description Quality"
            score={82}
            delay={0.3}
            benchmark="High Appetite Appeal"
          />

          <MetricBar
            label="Pricing Structure"
            score={74}
            delay={0.5}
            benchmark="Modest Decoy Anchoring"
          />

          <MetricBar
            label="Menu Strategy & Layout"
            score={79}
            delay={0.7}
            benchmark="Golden Triangle Ready"
          />

          <div className="pt-2 text-[11px] text-[#736E64] font-mono leading-tight">
            *Audited against 1,200 fine-dining & casual bistro menus.
          </div>
        </div>
      </div>
    </div>
  );
};

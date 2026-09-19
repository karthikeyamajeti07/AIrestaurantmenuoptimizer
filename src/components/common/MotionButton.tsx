import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface MotionButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const MotionButton: React.FC<MotionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-md select-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#874A2B] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs font-semibold',
    lg: 'px-5 py-2.5 text-sm font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-[#1C1D1F] text-[#F9F8F6] hover:bg-[#323337] border border-[#1C1D1F] shadow-[0_1px_2px_rgba(0,0,0,0.08)]',
    secondary:
      'bg-[#EFEAE0] text-[#1E1F22] hover:bg-[#E5DFD2] border border-[#DDD5C5] shadow-[0_1px_2px_rgba(0,0,0,0.03)]',
    accent:
      'bg-[#874A2B] text-white hover:bg-[#733E23] border border-[#874A2B] shadow-[0_1px_2px_rgba(135,74,43,0.2)]',
    ghost:
      'bg-transparent text-[#4A453C] hover:text-[#1E1F22] hover:bg-[#ECE6DA] border border-transparent',
    outline:
      'bg-transparent text-[#2B2925] hover:bg-[#F2ECE1] border border-[#D5CDBD]',
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -1, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

import React from 'react';
import { DietaryTag } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'accent' | 'outline' | 'bestseller';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    default: 'bg-[#ECE8DF] text-[#3D3A34] border border-[#DDD7CC]',
    neutral: 'bg-[#F2EFE9] text-[#555047] border border-[#E2DDD3]',
    success: 'bg-[#EBF3ED] text-[#225739] border border-[#CDE3D3]',
    warning: 'bg-[#FAF1E4] text-[#8C5D1F] border border-[#F2E0C4]',
    accent: 'bg-[#F5EBE6] text-[#8E3B24] border border-[#EACEC5]',
    outline: 'bg-transparent text-[#555047] border border-[#D5CFC3]',
    bestseller: 'bg-[#FAF3E0] text-[#7A5210] border border-[#EEDDB2] font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm tracking-tight ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const DietaryBadge: React.FC<{ tag: DietaryTag }> = ({ tag }) => {
  switch (tag) {
    case 'Vegetarian':
      return <Badge variant="success">Veg</Badge>;
    case 'Vegan':
      return <Badge variant="success">Vegan</Badge>;
    case 'Gluten-Free':
      return <Badge variant="neutral">GF</Badge>;
    case 'Spicy':
      return <Badge variant="accent">Spicy</Badge>;
    case 'Chef Special':
      return <Badge variant="bestseller">Chef Pick</Badge>;
    default:
      return <Badge variant="default">{tag}</Badge>;
  }
};

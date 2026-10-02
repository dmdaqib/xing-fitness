import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon = true,
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-display font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-[11px] px-4 py-2 gap-1.5',
    md: 'text-xs sm:text-sm px-6 py-3.5 gap-2',
    lg: 'text-sm sm:text-base px-8 py-4 gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-[#D4AF37] text-black hover:bg-[#C5A028] shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 active:scale-[0.98]',
    secondary: 'bg-white text-black hover:bg-gray-100 shadow-md active:scale-[0.98]',
    outline: 'bg-transparent text-white border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-white/[0.03]',
    ghost: 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span>{children}</span>
      {icon && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
    </button>
  );
};

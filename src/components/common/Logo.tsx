import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  portalSubtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'navy',
  size = 'md',
  showTagline = true,
  portalSubtitle,
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Custom Bank + Coin Icon Motif */}
      <div
        className={`${iconSizes[size]} rounded-lg flex items-center justify-center shrink-0 shadow-xs transition-transform hover:scale-105 ${
          isLight
            ? 'bg-white/10 text-white border border-white/20'
            : 'bg-[#12365A] text-white'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          {/* Bank Pediment (Roof) */}
          <path d="M3 10L12 3L21 10" />
          {/* Columns */}
          <line x1="5" y1="10" x2="5" y2="18" />
          <line x1="9" y1="10" x2="9" y2="18" />
          <line x1="15" y1="10" x2="15" y2="18" />
          <line x1="19" y1="10" x2="19" y2="18" />
          {/* Base */}
          <line x1="3" y1="18" x2="21" y2="18" />
          <line x1="2" y1="21" x2="22" y2="21" />
          {/* Small Coin Motif in Center */}
          <circle cx="12" cy="14" r="1.75" fill="#E7A23B" stroke="none" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-bold tracking-tight ${titleSizes[size]} ${
              isLight ? 'text-white' : 'text-[#12365A]'
            }`}
          >
            LoanEase
          </span>
          {portalSubtitle && (
            <span
              className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${
                isLight
                  ? 'bg-white/15 text-white/90'
                  : 'bg-[#5145CD]/10 text-[#5145CD]'
              }`}
            >
              {portalSubtitle}
            </span>
          )}
        </div>
        {showTagline && (
          <span
            className={`text-[11px] font-medium ${
              isLight ? 'text-white/70' : 'text-[#687B94]'
            }`}
          >
            Your Dreams, Our Support.
          </span>
        )}
      </div>
    </div>
  );
};

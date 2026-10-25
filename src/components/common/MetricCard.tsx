import React, { ReactNode } from 'react';

export type MetricCardVariant = 'teal' | 'olive' | 'coral' | 'yellow' | 'default';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trendText?: string;
  trendPositive?: boolean;
  icon: ReactNode;
  variant?: MetricCardVariant;
  iconBgColor?: string;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trendText,
  trendPositive = true,
  icon,
  variant = 'default',
  iconBgColor = 'bg-[#153755]/10',
  iconColor = 'text-[#153755]',
}) => {
  let containerClasses = 'bg-white text-[#172B3A] border border-[#DFE5E9]';
  let titleClasses = 'text-[#7B8994]';
  let valueClasses = 'text-[#172B3A]';
  let subtitleClasses = 'text-[#536473]';
  let trendClasses = trendPositive ? 'text-[#218568]' : 'text-[#C9414D]';
  let iconContainerClasses = `${iconBgColor} ${iconColor}`;

  if (variant === 'teal') {
    containerClasses = 'bg-[#0D343B] text-white border border-[#0D343B] shadow-xs';
    titleClasses = 'text-white/80';
    valueClasses = 'text-white';
    subtitleClasses = 'text-white/85';
    trendClasses = 'text-[#E8EA68]';
    iconContainerClasses = 'bg-white/15 text-white';
  } else if (variant === 'olive') {
    containerClasses = 'bg-[#6B751B] text-white border border-[#6B751B] shadow-xs';
    titleClasses = 'text-white/80';
    valueClasses = 'text-white';
    subtitleClasses = 'text-white/85';
    trendClasses = 'text-[#E8EA68]';
    iconContainerClasses = 'bg-white/15 text-white';
  } else if (variant === 'coral') {
    containerClasses = 'bg-[#E65327] text-white border border-[#E65327] shadow-xs';
    titleClasses = 'text-white/80';
    valueClasses = 'text-white';
    subtitleClasses = 'text-white/85';
    trendClasses = 'text-white font-semibold';
    iconContainerClasses = 'bg-white/15 text-white';
  } else if (variant === 'yellow') {
    // Pale yellow MUST use dark text for high contrast and accessibility
    containerClasses = 'bg-[#E8EA68] text-[#0D2740] border border-[#E8EA68] shadow-xs';
    titleClasses = 'text-[#172B3A]/80 font-bold';
    valueClasses = 'text-[#0D2740]';
    subtitleClasses = 'text-[#172B3A]/85 font-medium';
    trendClasses = 'text-[#0D2740] font-bold';
    iconContainerClasses = 'bg-[#0D2740]/10 text-[#0D2740]';
  }

  return (
    <div
      className={`rounded-xl p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-sm ${containerClasses}`}
    >
      <div className="flex-1 min-w-0 pr-3">
        <p className={`text-xs font-semibold tracking-wide uppercase mb-1 ${titleClasses}`}>
          {title}
        </p>
        <p className={`text-2xl sm:text-[28px] font-bold tabular-nums tracking-tight leading-tight ${valueClasses}`}>
          {value}
        </p>
        {subtitle && (
          <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${subtitleClasses}`}>
            {subtitle}
          </p>
        )}
        {trendText && (
          <p className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${trendClasses}`}>
            {trendText}
          </p>
        )}
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconContainerClasses}`}
      >
        {icon}
      </div>
    </div>
  );
};

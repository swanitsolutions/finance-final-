import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trendText?: string;
  trendPositive?: boolean;
  icon: ReactNode;
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
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#DFE7F0] p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-sm">
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-xs font-semibold text-[#687B94] tracking-wide uppercase mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-[#172B4D] tabular-nums tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-[#687B94] mt-1 font-medium flex items-center gap-1">
            {subtitle}
          </p>
        )}
        {trendText && (
          <p
            className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${
              trendPositive ? 'text-[#159A78]' : 'text-[#DC5263]'
            }`}
          >
            {trendText}
          </p>
        )}
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}
      >
        {icon}
      </div>
    </div>
  );
};

import React from 'react';
import { LucideIcon, HelpCircle } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  tooltip?: string;
  ecoVariant?: 'emerald' | 'leaf' | 'earth' | 'sky';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  change,
  isPositive = true,
  icon: Icon,
  tooltip,
  ecoVariant = 'emerald',
}) => {
  const getTheme = () => {
    switch (ecoVariant) {
      case 'emerald':
        return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400';
      case 'leaf':
        return 'text-teal-700 bg-teal-50 dark:bg-teal-950/50 dark:text-teal-400';
      case 'earth':
        return 'text-amber-800 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400';
      case 'sky':
        return 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/50 dark:text-cyan-400';
      default:
        return 'text-emerald-700 bg-emerald-50';
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs transition hover:border-emerald-500/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          <span>{title}</span>
          {tooltip && (
            <span className="relative group cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-stone-400 hover:text-stone-600" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-stone-900 text-white text-xs rounded shadow-lg z-30 font-normal leading-snug">
                {tooltip}
              </div>
            </span>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${getTheme()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">{unit}</span>}
      </div>

      {change && (
        <div className="mt-2 flex items-center text-xs">
          <span className={`font-semibold ${isPositive ? 'text-emerald-600' : 'text-stone-500'}`}>
            {change}
          </span>
          <span className="ml-1.5 text-stone-400">vs last cycle</span>
        </div>
      )}
    </div>
  );
};

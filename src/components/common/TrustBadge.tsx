import React from 'react';
import { ShieldCheck, Award, Recycle, Zap, Star } from 'lucide-react';

interface TrustBadgeProps {
  type: 'PCB Verified' | 'ISO 14001' | 'Zero Landfill Partner' | 'Top Recycler' | 'Fast Shipper' | string;
  size?: 'sm' | 'md';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ type, size = 'md' }) => {
  const getIcon = () => {
    switch (type) {
      case 'PCB Verified':
        return <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />;
      case 'ISO 14001':
        return <Award className={size === 'sm' ? 'w-3 h-3 text-sky-600' : 'w-4 h-4 text-sky-600'} />;
      case 'Zero Landfill Partner':
        return <Recycle className={size === 'sm' ? 'w-3 h-3 text-emerald-700' : 'w-4 h-4 text-emerald-700'} />;
      case 'Top Recycler':
        return <Star className={size === 'sm' ? 'w-3 h-3 text-amber-600' : 'w-4 h-4 text-amber-600'} />;
      case 'Fast Shipper':
        return <Zap className={size === 'sm' ? 'w-3 h-3 text-teal-600' : 'w-4 h-4 text-teal-600'} />;
      default:
        return <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-stone-600' : 'w-4 h-4 text-stone-600'} />;
    }
  };

  const getStyle = () => {
    switch (type) {
      case 'PCB Verified':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 'ISO 14001':
        return 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300';
      case 'Zero Landfill Partner':
        return 'bg-emerald-100/60 text-emerald-900 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200';
      default:
        return 'bg-stone-50 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${getStyle()}`}
    >
      {getIcon()}
      {type}
    </span>
  );
};

export const TrustScoreCard: React.FC<{ score: number; reviewCount: number; rating: number }> = ({
  score,
  reviewCount,
  rating,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 transition shadow-2xs">
      <div className="relative w-14 h-14 shrink-0 flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 font-black text-lg border-2 border-emerald-500 shadow-xs">
        <span>{score}</span>
        <span className="text-[8px] uppercase tracking-tighter text-emerald-600 dark:text-emerald-400 font-extrabold -mt-1">INDEX</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
            Trust & Compliance Score
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-stone-300 mt-1 font-medium">
          <span className="flex items-center text-amber-500 font-bold gap-1">
            <span>★</span>
            <span>{rating.toFixed(1)}</span>
          </span>
          <span className="text-slate-300 dark:text-stone-600">·</span>
          <span>{reviewCount} verified reviews</span>
        </div>
      </div>
    </div>
  );
};


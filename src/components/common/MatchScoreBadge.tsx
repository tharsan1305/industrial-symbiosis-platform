import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface MatchScoreBadgeProps {
  score: number; // 0-100
  showDetails?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({ score, showDetails = false }) => {
  const getColor = () => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400';
    if (score >= 75) return 'text-teal-700 bg-teal-50 border-teal-300 dark:bg-teal-950/60 dark:text-teal-400';
    return 'text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400';
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getColor()}`}
        title="Industrial Symbiosis Compatibility Index based on chemical assay, distance, and historical deal conversion"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {score}% Match
      </span>

      {showDetails && (
        <span className="relative group cursor-pointer text-xs text-stone-400 hover:text-stone-600">
          <HelpCircle className="w-3.5 h-3.5" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-56 p-2.5 bg-stone-900 text-white text-xs rounded-lg shadow-xl z-30 font-normal">
            Calculated from: Feedstock chemistry (40%), Logistical proximity (30%), Regulatory compliance (20%), Seller trust score (10%).
          </div>
        </span>
      )}
    </div>
  );
};

import React from 'react';
import { QuoteNegotiation } from '../../types';
import { Check, X, ArrowLeftRight, TrendingUp } from 'lucide-react';
import { useTranslation } from '../../i18n/translations';

interface QuoteCardProps {
  quote: QuoteNegotiation;
  isCurrentUserSender: boolean;
  onAccept?: () => void;
  onCounter?: () => void;
  onDecline?: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isCurrentUserSender,
  onAccept,
  onCounter,
  onDecline,
}) => {
  const { formatCurrency, formatNumber } = useTranslation();

  return (
    <div className="bg-white dark:bg-stone-800 border-2 border-emerald-500/40 rounded-xl p-4 shadow-sm my-2 max-w-sm">
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Commercial Quote Offer</span>
        </div>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            quote.status === 'accepted'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
              : quote.status === 'declined'
              ? 'bg-rose-100 text-rose-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {quote.status.toUpperCase()}
        </span>
      </div>

      <div className="py-3 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-stone-500">Proposed Rate:</span>
          <span className="font-extrabold text-stone-900 dark:text-white text-sm">
            {formatCurrency(quote.proposedPricePerTon)} <span className="font-normal text-xs text-stone-500">/ MT</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Batch Quantity:</span>
          <span className="font-bold text-stone-900 dark:text-white">
            {formatNumber(quote.quantityTons)} MT
          </span>
        </div>
        <div className="flex justify-between pt-1 border-t border-stone-100 dark:border-stone-700">
          <span className="text-stone-500 font-medium">Total Lot Value:</span>
          <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(quote.proposedPricePerTon * quote.quantityTons)}
          </span>
        </div>
        {quote.notes && (
          <p className="text-[11px] text-stone-500 italic mt-1 bg-stone-50 dark:bg-stone-900 p-2 rounded">
            "{quote.notes}"
          </p>
        )}
      </div>

      {quote.status === 'pending' && !isCurrentUserSender && (
        <div className="pt-2 flex items-center gap-2 border-t border-stone-200 dark:border-stone-700">
          {onAccept && (
            <button
              onClick={onAccept}
              className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Accept Quote
            </button>
          )}
          {onCounter && (
            <button
              onClick={onCounter}
              className="py-1.5 px-3 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Counter
            </button>
          )}
          {onDecline && (
            <button
              onClick={onDecline}
              className="p-1.5 text-stone-400 hover:text-rose-600 transition"
              title="Decline"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

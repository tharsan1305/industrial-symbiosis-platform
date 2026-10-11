import React from 'react';
import { ListingStatus, DealStage, OnboardingStatus } from '../../types';

interface StatusChipProps {
  status: ListingStatus | DealStage | OnboardingStatus | string;
  type?: 'listing' | 'deal' | 'onboarding' | 'generic';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, type = 'generic' }) => {
  const getStyles = () => {
    switch (status) {
      // Listing statuses
      case 'available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
      case 'reserved':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
      case 'sold':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
      case 'expired':
        return 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700';

      // Deal stages
      case 'negotiation':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400';
      case 'agreed':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400';
      case 'payment_confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400';
      case 'pickup_scheduled':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400';
      case 'delivered':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-300 font-semibold';

      // Onboarding
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rejected':
      case 'suspended':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'payment_confirmed':
        return 'Escrow Funded';
      case 'pickup_scheduled':
        return 'Pickup Scheduled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {getLabel()}
    </span>
  );
};

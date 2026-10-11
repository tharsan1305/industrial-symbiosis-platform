import React from 'react';
import { DealStage } from '../../types';
import { Check, Clock, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

interface StageStepperProps {
  currentStage: DealStage;
  isHazardous?: boolean;
  hazardousVerified?: boolean;
  onAdvanceStage?: (nextStage: DealStage) => void;
  canAdvance?: boolean;
}

const STAGES: { key: DealStage; label: string; desc: string }[] = [
  { key: 'negotiation', label: '1. Negotiation', desc: 'Commercial terms & lab assay' },
  { key: 'agreed', label: '2. Terms Agreed', desc: 'Price & quantity locked' },
  { key: 'payment_confirmed', label: '3. Escrow Funded', desc: 'Secure deposit placed' },
  { key: 'pickup_scheduled', label: '4. Pickup Scheduled', desc: 'Vehicle & driver allocated' },
  { key: 'delivered', label: '5. In Transit / Delivered', desc: 'Weighbridge confirmation' },
  { key: 'completed', label: '6. Completed', desc: 'Manifest signed & funds released' },
];

export const StageStepper: React.FC<StageStepperProps> = ({
  currentStage,
  isHazardous = false,
  hazardousVerified = false,
  onAdvanceStage,
  canAdvance = true,
}) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  const getNextStage = (): DealStage | null => {
    if (currentIndex < STAGES.length - 1) {
      return STAGES[currentIndex + 1].key;
    }
    return null;
  };

  const nextStage = getNextStage();

  return (
    <div className="space-y-4">
      {/* Visual Stepper */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isFuture = idx > currentIndex;

            return (
              <div
                key={stage.key}
                className={`relative p-3 rounded-lg border text-left transition ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : isCurrent
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Step {idx + 1}
                  </span>
                  {isCompleted && <Check className="w-4 h-4 text-emerald-600" />}
                  {isCurrent && <Clock className="w-4 h-4 text-emerald-200 animate-spin" />}
                </div>

                <div
                  className={`text-xs font-bold leading-tight ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-stone-900 dark:text-white' : 'text-stone-400'
                  }`}
                >
                  {stage.label.split('. ')[1]}
                </div>

                <div
                  className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${
                    isCurrent ? 'text-emerald-100' : 'text-stone-500'
                  }`}
                >
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hazardous manifest regulatory gate notice */}
        {isHazardous && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-stone-800 dark:text-stone-200 font-medium">
                TNPCB Hazardous Schedule Waste Gate: Form 10 Transporter Consignment Note required prior to pickup.
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded font-bold ${
                hazardousVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900'
              }`}
            >
              {hazardousVerified ? 'Form 10 Cleared' : 'Manifest Pending'}
            </span>
          </div>
        )}
      </div>

      {/* Allowed next stage action button */}
      {nextStage && onAdvanceStage && (
        <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/60 p-3 rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="text-xs text-stone-600 dark:text-stone-300">
            Current: <span className="font-bold text-stone-900 dark:text-white">{STAGES[currentIndex].label}</span> · Next step:{' '}
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {STAGES[currentIndex + 1].label}
            </span>
          </div>
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => onAdvanceStage(nextStage)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <span>Proceed to {STAGES[currentIndex + 1].label.split('. ')[1]}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

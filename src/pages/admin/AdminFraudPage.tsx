import React, { useState } from 'react';
import { RoleGuard } from '../../components/common/Guards';
import { AlertOctagon, ShieldAlert, CheckCircle2, Search, ArrowRight } from 'lucide-react';

export const AdminFraudPage: React.FC = () => {
  const [flags, setFlags] = useState([
    {
      id: 'flag-01',
      facility: 'Ranipet Chemical Solvents Unit',
      anomaly: 'Discrepancy in Weighbridge Gross vs Tare Weight (>12% variance)',
      riskLevel: 'HIGH',
      detectedAt: '2025-02-12 11:20 IST',
      status: 'UNDER_INVESTIGATION',
    },
    {
      id: 'flag-02',
      facility: 'Cauvery Bio-Fuels Post #8',
      anomaly: 'Rapid duplicate batch code creation with divergent lab moisture assay',
      riskLevel: 'MEDIUM',
      detectedAt: '2025-02-11 16:40 IST',
      status: 'FLAGGED',
    },
    {
      id: 'flag-03',
      facility: 'Tirunelveli Agro Works',
      anomaly: 'Suspected duplicate GSTIN submission across two distinct corporate accounts',
      riskLevel: 'CRITICAL',
      detectedAt: '2025-02-09 09:15 IST',
      status: 'ACCOUNT_FROZEN',
    },
  ]);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 py-2">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Fraud & Regulatory Anomaly Detection
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Automated compliance tripwires: weighbridge slip falsifications, duplicate GSTIN identities, and lab assay tampering
          </p>
        </div>

        <div className="space-y-4">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1.5 flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-400">#{flag.id}</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      flag.riskLevel === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : flag.riskLevel === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {flag.riskLevel} RISK
                  </span>
                  <span className="font-mono text-stone-400">{flag.detectedAt}</span>
                </div>

                <h3 className="font-bold text-base text-stone-900 dark:text-white">
                  {flag.facility}
                </h3>

                <p className="text-stone-600 dark:text-stone-300 font-medium">
                  {flag.anomaly}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setFlags((prev) => prev.filter((f) => f.id !== flag.id));
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Clear Anomaly
                </button>
                <button
                  onClick={() => alert(`Issued regulatory audit notice to ${flag.facility}`)}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition"
                >
                  Issue Show-Cause Notice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
};

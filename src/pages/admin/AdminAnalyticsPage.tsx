import React from 'react';
import { RoleGuard } from '../../components/common/Guards';
import { KpiCard } from '../../components/common/KpiCard';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  FileCheck2,
  Package,
  Layers,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const topCategories = [
    { name: 'Combustion By-products (Fly Ash & Bottom Ash)', share: '46%', volume: '142,000 MT' },
    { name: 'Agro-Industrial (Bagasse, Press mud, Husk)', share: '32%', volume: '98,500 MT' },
    { name: 'Mineral & Construction (Phospho-Gypsum, Slag)', share: '14%', volume: '43,000 MT' },
    { name: 'Chemical Sludge & Spent Carbon', share: '8%', volume: '24,500 MT' },
  ];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 py-2">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Tamil Nadu Platform Analytics Desk
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Macro circular metrics, trade velocity, complaint ratios, and regional industrial density
          </p>
        </div>

        {/* 4 KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Avg Deal Cycle Time"
            value="3.8"
            unit="Days"
            change="-18%"
            icon={Clock}
            tooltip="Average duration from purchase request to completed manifest dispatch"
            ecoVariant="emerald"
          />
          <KpiCard
            title="Dispute / Complaint Ratio"
            value="0.6%"
            change="Within threshold"
            icon={AlertTriangle}
            tooltip="Grievance filings per 100 successfully completed industrial transactions"
            ecoVariant="sky"
          />
          <KpiCard
            title="Pending Regulatory Queue"
            value="3"
            unit="Plants"
            change="Low backlog"
            icon={FileCheck2}
            tooltip="Facilities awaiting initial GSTIN and CTO consent order review"
            ecoVariant="earth"
          />
          <KpiCard
            title="Active Material Velocity"
            value="38,400"
            unit="MT / mo"
            change="+24%"
            icon={TrendingUp}
            tooltip="Monthly traded secondary feedstock run-rate across Tamil Nadu"
            ecoVariant="leaf"
          />
        </div>

        {/* Breakdown by Category */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            Regional Material Volume by Industrial Sector
          </h3>

          <div className="space-y-3">
            {topCategories.map((c) => (
              <div key={c.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-800 dark:text-stone-200">{c.name}</span>
                  <span className="text-stone-500">{c.volume} ({c.share})</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: c.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

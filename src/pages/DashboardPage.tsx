import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/translations';
import { dashboardApi } from '../api';
import { KpiCard } from '../components/common/KpiCard';
import { StatusChip } from '../components/common/StatusChip';
import { TrustBadge, TrustScoreCard } from '../components/common/TrustBadge';
import {
  Recycle,
  Leaf,
  DollarSign,
  Landmark,
  ArrowRight,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
  FileQuestion,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const { t, formatCurrency, formatNumber } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getDashboardData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const kpis = data?.kpis || {
    wasteReducedTons: 18400,
    co2SavedTons: 14720,
    moneySavedInr: 12500000,
    landfillDivertedPercentage: 99.4,
  };

  const monthlyTrends = data?.monthlyTrends || [
    { month: 'Sep', divertedTons: 1200, co2AbatedTons: 960, valueInr: 850000 },
    { month: 'Oct', divertedTons: 1850, co2AbatedTons: 1480, valueInr: 1250000 },
    { month: 'Nov', divertedTons: 2400, co2AbatedTons: 1920, valueInr: 1680000 },
    { month: 'Dec', divertedTons: 2900, co2AbatedTons: 2320, valueInr: 2100000 },
    { month: 'Jan', divertedTons: 3600, co2AbatedTons: 2880, valueInr: 2650000 },
    { month: 'Feb', divertedTons: 4100, co2AbatedTons: 3280, valueInr: 3050000 },
  ];

  const maxDiverted = Math.max(...monthlyTrends.map((m: any) => m.divertedTons));

  return (
    <div className="space-y-7 py-2">
      {/* Welcome header with White & Emerald quick actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 p-6 rounded-3xl shadow-xs shadow-emerald-950/5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Operations & ESG Dashboard
            </h1>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Live Facility
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Circular material monitoring for <span className="font-bold text-slate-800 dark:text-stone-200">{profile?.name || user?.industryName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/listings/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-emerald-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            List By-Product
          </Link>
          <Link
            to="/rfq"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-emerald-50 dark:bg-stone-800 hover:text-emerald-800 text-slate-700 dark:text-stone-300 rounded-xl text-xs font-semibold border border-slate-200 dark:border-stone-700 transition"
          >
            <FileQuestion className="w-4 h-4 text-emerald-600" />
            Post RFQ
          </Link>
        </div>
      </div>

      {/* KPI Cards in clean White & Green */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Circular Waste Diverted"
          value={formatNumber(kpis.wasteReducedTons)}
          unit="MT"
          change="+14.2%"
          icon={Recycle}
          tooltip="Cumulative tonnage of industrial by-product repurposed instead of sent to dumpsites"
          ecoVariant="emerald"
        />
        <KpiCard
          title="CO2e Abatement (Scope 3)"
          value={formatNumber(kpis.co2SavedTons)}
          unit="tCO2e"
          change="+18.5%"
          icon={Leaf}
          tooltip="Calculated against Central Pollution Control Board (CPCB) primary disposal baseline emission factors"
          ecoVariant="leaf"
        />
        <KpiCard
          title="Economic Value Realized"
          value={formatCurrency(kpis.moneySavedInr)}
          change="+22.1%"
          icon={DollarSign}
          tooltip="Net economic gain from selling by-products vs disposal handling fees"
          ecoVariant="earth"
        />
        <KpiCard
          title="Zero Landfill Compliance"
          value={`${kpis.landfillDivertedPercentage}%`}
          change="Target met"
          icon={Landmark}
          tooltip="Percentage of plant solid non-hazardous streams diverted into accredited symbiosis loops"
          ecoVariant="sky"
        />
      </div>

      {/* Middle Grid: Monthly Trend Chart & Trust Score / Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 rounded-3xl p-6 shadow-xs shadow-emerald-950/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Monthly Material Redirection & Carbon Trends
              </h3>
              <p className="text-xs text-slate-500">Tonnage diverted (MT) across Tamil Nadu industrial cluster</p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 px-2.5 py-0.5 rounded-full font-bold">
              FY 2024-25
            </span>
          </div>

          {/* Responsive SVG Bar & Line Visualization */}
          <div className="pt-4 h-56 flex items-end justify-between gap-3 border-b border-slate-100 dark:border-stone-800 pb-2">
            {monthlyTrends.map((item: any) => {
              const heightPct = Math.round((item.divertedTons / maxDiverted) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="hidden group-hover:block text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded whitespace-nowrap mb-1">
                    {item.divertedTons} MT ({item.co2AbatedTons} tCO2)
                  </div>
                  <div className="w-full max-w-[42px] bg-emerald-50 dark:bg-emerald-950/40 rounded-t-lg relative flex items-end justify-center overflow-hidden h-full border border-emerald-100/60">
                    <div
                      className="w-full bg-linear-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-stone-400">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" /> Diverted By-product (MT)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-teal-400" /> CPCB Carbon Offset
              </span>
            </div>
            <Link to="/impact" className="text-emerald-700 font-bold hover:underline">
              Download CSR Certificate →
            </Link>
          </div>
        </div>

        {/* Trust Score & Accreditations */}
        <div className="bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 rounded-3xl p-6 shadow-xs shadow-emerald-950/5 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Trust & Compliance</h3>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <TrustScoreCard
              score={profile?.trustScore || 94}
              rating={profile?.rating || 4.8}
              reviewCount={profile?.reviewCount || 31}
            />

            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                Accredited Badges
              </span>
              <div className="flex flex-wrap gap-2">
                {(profile?.badges || ['PCB Verified', 'ISO 14001', 'Zero Landfill Partner']).map((b) => (
                  <TrustBadge key={b} type={b} />
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/60 dark:bg-stone-800/60 rounded-2xl border border-emerald-100 dark:border-stone-700 text-xs text-slate-600 dark:text-stone-300">
            <span className="font-bold text-emerald-900 dark:text-white block mb-0.5">
              TNPCB CTO Consent: Active
            </span>
            <span>Validity until 31 Mar 2027 · Order #TNPCB/CO/TRY/HAZ-8821</span>
          </div>
        </div>
      </div>

      {/* Recent Deals Table in pristine White & Green */}
      <div className="bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 rounded-3xl p-6 shadow-xs shadow-emerald-950/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Symbiosis Deals</h3>
            <p className="text-xs text-slate-500">Live contracts and shipments in progress</p>
          </div>
          <Link
            to="/deals"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All Deals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-stone-800 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Deal ID & Batch</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Counterparty</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-stone-800">
              {(data?.recentDeals || []).map((deal: any) => (
                <tr key={deal.id} className="hover:bg-emerald-50/30 dark:hover:bg-stone-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 dark:text-white block">#{deal.id}</span>
                    <span className="text-[11px] text-slate-400">{deal.batchCode}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-stone-200">
                    {deal.wasteName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-stone-400">
                    {deal.sellerName}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {formatNumber(deal.quantityTons)} MT
                  </td>
                  <td className="py-3 px-4">
                    <StatusChip status={deal.stage} type="deal" />
                  </td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(deal.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/deals/${deal.id}`}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold rounded-lg text-xs transition inline-flex items-center gap-1 border border-emerald-200/60"
                    >
                      Deal Room
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

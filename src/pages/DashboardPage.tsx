import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
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
  FileQuestion,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Inbox,
} from 'lucide-react';

interface MonthlyData {
  month: string;
  divertedTons: number;
  co2AbatedTons: number;
  valueInr?: number;
}

export const DashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const { t, formatCurrency, formatNumber } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    dashboardApi.getDashboardData().then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const kpis = data?.kpis || {
    wasteReducedTons: 18400,
    co2SavedTons: 14720,
    moneySavedInr: 12500000,
    landfillDivertedPercentage: 99.4,
  };

  const monthlyTrends: MonthlyData[] = data?.monthlyTrends || [
    { month: 'Sep', divertedTons: 1200, co2AbatedTons: 960, valueInr: 850000 },
    { month: 'Oct', divertedTons: 1850, co2AbatedTons: 1480, valueInr: 1250000 },
    { month: 'Nov', divertedTons: 2400, co2AbatedTons: 1920, valueInr: 1680000 },
    { month: 'Dec', divertedTons: 2900, co2AbatedTons: 2320, valueInr: 2100000 },
    { month: 'Jan', divertedTons: 3600, co2AbatedTons: 2880, valueInr: 2650000 },
    { month: 'Feb', divertedTons: 4100, co2AbatedTons: 3280, valueInr: 3050000 },
  ];

  const recentDeals = data?.recentDeals || [];

  return (
    <div className="w-full space-y-6 py-2">
      {/* Welcome header with White & Emerald quick actions */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 p-6 rounded-2xl shadow-xs shadow-emerald-950/5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Operations & ESG Dashboard
            </h1>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Live Facility
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Circular material monitoring for{' '}
            <span className="font-bold text-slate-800 dark:text-stone-200">
              {profile?.name || user?.industryName || 'Facility Member'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/listings/new"
            aria-label="List new industrial by-product"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-emerald-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List By-Product</span>
          </Link>
          <Link
            to="/rfq"
            aria-label="Post request for quotation"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-emerald-50 dark:bg-stone-800 hover:text-emerald-800 text-slate-700 dark:text-stone-300 rounded-xl text-xs font-semibold border border-slate-200 dark:border-stone-700 transition"
          >
            <FileQuestion className="w-4 h-4 text-emerald-600" />
            <span>Post RFQ</span>
          </Link>
        </div>
      </header>

      {/* KPI Cards in clean White & Green */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-white dark:bg-stone-900 border border-slate-200/80 dark:border-stone-800 rounded-2xl p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="h-4 bg-slate-200 dark:bg-stone-800 rounded w-1/2" />
                <div className="h-8 bg-slate-200 dark:bg-stone-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-stone-800 rounded w-1/3" />
              </div>
            ))}
          </>
        ) : (
          <>
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
          </>
        )}
      </section>

      {/* Middle Grid: Monthly Trend Chart & Trust Score / Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Monthly Trend Chart */}
        <section
          aria-label="Monthly Material Redirection & Carbon Trends"
          className="lg:col-span-2 bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 rounded-2xl p-6 shadow-xs shadow-emerald-950/5 flex flex-col justify-between space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Monthly Material Redirection & Carbon Trends
              </h2>
              <p className="text-xs text-slate-500">
                Tonnage diverted (MT) across Tamil Nadu industrial cluster
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              Sep - Feb
            </span>
          </div>

          {/* Recharts Bar Chart with 300px fixed height, padding so bars never clip */}
          <div className="w-full h-[300px] pt-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyTrends}
                margin={{ top: 20, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.6} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dy={4}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  unit=" MT"
                  width={58}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    const label =
                      name === 'divertedTons'
                        ? 'Diverted By-product (MT)'
                        : name === 'co2AbatedTons'
                        ? 'CPCB Carbon Offset'
                        : name;
                    return [`${value} MT`, label];
                  }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    borderColor: '#10b981',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={36}
                  formatter={(value: string) => {
                    if (value === 'divertedTons') return 'Diverted By-product (MT)';
                    if (value === 'co2AbatedTons') return 'CPCB Carbon Offset';
                    return value;
                  }}
                  wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}
                />
                <Bar
                  dataKey="divertedTons"
                  name="divertedTons"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                />
                <Bar
                  dataKey="co2AbatedTons"
                  name="co2AbatedTons"
                  fill="#14b8a6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-stone-800 gap-2">
            <span className="text-[11px] text-slate-400">
              *Verified against CPCB primary emission factors and NABL certified weight bridges.
            </span>
            <Link
              to="/impact"
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Download CSR Certificate</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>

        {/* Trust Score & Accreditations (Fully visible, proper padding, aligned with badges) */}
        <section
          aria-label="Trust & Compliance Card"
          className="bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 rounded-2xl p-6 shadow-xs shadow-emerald-950/5 flex flex-col justify-between space-y-5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Trust & Compliance
                </h2>
                <p className="text-xs text-slate-500">Verified institutional credential</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Score Card: 94, 4.8 stars, 31 verified reviews */}
            <TrustScoreCard
              score={profile?.trustScore || 94}
              rating={profile?.rating || 4.8}
              reviewCount={profile?.reviewCount || 31}
            />

            {/* Badges Section */}
            <div className="pt-2 space-y-2.5">
              <span className="text-xs font-bold text-slate-600 dark:text-stone-300 block uppercase tracking-wider">
                Accredited Badges
              </span>
              <div className="flex flex-wrap gap-2">
                {(profile?.badges || ['PCB Verified', 'ISO 14001', 'Zero Landfill Partner']).map(
                  (b: string) => (
                    <TrustBadge key={b} type={b} />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 dark:bg-stone-800/60 rounded-2xl border border-emerald-100 dark:border-stone-700 text-xs text-slate-600 dark:text-stone-300">
            <span className="font-bold text-emerald-900 dark:text-white block mb-0.5">
              TNPCB CTO Consent: Active
            </span>
            <span className="text-[11px] leading-relaxed block">
              Validity until 31 Mar 2027 · Order #TNPCB/CO/TRY/HAZ-8821
            </span>
          </div>
        </section>
      </div>

      {/* Active Symbiosis Deals Section (No overlapping cards, overflow-x container, sticky header, mobile stacked cards) */}
      <section
        aria-label="Active Symbiosis Deals"
        className="bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 rounded-2xl p-6 shadow-xs shadow-emerald-950/5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Active Symbiosis Deals
            </h2>
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

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-slate-100 dark:bg-stone-800/60 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && recentDeals.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-stone-800 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">No active symbiosis deals yet</p>
              <p className="text-xs text-slate-500 mt-0.5">Explore the circular marketplace or post a material RFQ to begin trading.</p>
            </div>
            <div className="pt-1 flex items-center justify-center gap-3">
              <Link
                to="/marketplace"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        )}

        {/* Desktop & Tablet Table (Sticky header, min-width, overflow-x auto, no mid-word break) */}
        {!loading && recentDeals.length > 0 && (
          <>
            <div className="hidden md:block overflow-x-auto max-w-full">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="sticky top-0 bg-slate-50 dark:bg-stone-800 text-slate-600 dark:text-stone-300 uppercase tracking-wider font-bold z-10">
                  <tr>
                    <th scope="col" className="py-3 px-4 rounded-l-xl whitespace-nowrap">
                      Deal ID & Batch
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Material
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Counterparty
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Quantity
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Stage
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Total Value
                    </th>
                    <th scope="col" className="py-3 px-4 rounded-r-xl text-right whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-stone-800">
                  {recentDeals.map((deal: any) => (
                    <tr
                      key={deal.id}
                      className="hover:bg-emerald-50/40 dark:hover:bg-stone-800/40 transition"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block whitespace-nowrap">
                          #{deal.id}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                          {deal.batchCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-stone-200 whitespace-nowrap">
                        {deal.wasteName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-stone-400 whitespace-nowrap">
                        {deal.sellerName}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatNumber(deal.quantityTons)} MT
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusChip status={deal.stage} type="deal" />
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                        {formatCurrency(deal.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/deals/${deal.id}`}
                          aria-label={`Open deal room for contract ${deal.id}`}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5 border border-emerald-200/70"
                        >
                          <span>Deal Room</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards Layout (under 768px) */}
            <div className="md:hidden space-y-3">
              {recentDeals.map((deal: any) => (
                <div
                  key={deal.id}
                  className="p-4 bg-slate-50/70 dark:bg-stone-800/40 rounded-2xl border border-slate-200/80 dark:border-stone-800 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white block whitespace-nowrap">
                        #{deal.id} · {deal.batchCode}
                      </span>
                      <p className="font-bold text-sm text-slate-800 dark:text-stone-200 mt-0.5">
                        {deal.wasteName}
                      </p>
                    </div>
                    <StatusChip status={deal.stage} type="deal" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-stone-400 pt-1 border-t border-slate-200/60 dark:border-stone-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Counterparty
                      </span>
                      <span className="font-medium text-slate-800 dark:text-stone-200 truncate block">
                        {deal.sellerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Quantity
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatNumber(deal.quantityTons)} MT
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Total Value
                      </span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(deal.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/deals/${deal.id}`}
                      aria-label={`Open deal room for contract ${deal.id}`}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Open Deal Room</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};


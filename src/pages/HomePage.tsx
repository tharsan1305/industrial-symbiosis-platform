import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ArrowRight,
  Factory,
  CheckCircle2,
  QrCode,
  FileText,
  Truck,
  Leaf,
  Layers,
  Sparkles,
} from 'lucide-react';
import { publicApi } from '../api';
import { useTranslation } from '../i18n/translations';
import { MatchScoreBadge } from '../components/common/MatchScoreBadge';

export const HomePage: React.FC = () => {
  const { t, formatNumber, formatCurrency } = useTranslation();
  const [stats, setStats] = useState({
    totalWasteDivertedTons: 254350,
    totalCo2SavedTons: 203480,
    totalEconomicValueInr: 184500000,
    activeIndustriesCount: 42,
    activeListingsCount: 18,
    completedSymbiosisDeals: 164,
  });

  useEffect(() => {
    publicApi.getStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

  const symbiosisPairs = [
    {
      producer: 'Sugar Mills (Erode / Tiruchy)',
      waste: 'Depithed Cane Bagasse',
      consumer: 'Paper & Pulp Mills (Namakkal)',
      application: 'Virgin wood substitute for kraft paper & board',
      abatement: '0.95 tCO2e / MT',
    },
    {
      producer: 'Thermal Power Stations (Ennore / Tuticorin)',
      waste: 'Dry Pozzolanic Fly Ash (Class F)',
      consumer: 'Cement Works (Ariyalur)',
      application: 'Portland Pozzolana Cement (PPC) clinker blend',
      abatement: '0.82 tCO2e / MT',
    },
    {
      producer: 'Delta Agro Mills (Thanjavur)',
      waste: 'High-Calorific Paddy Husk',
      consumer: 'Biomass Energy & Boilers',
      application: 'Clean industrial heat replacing fossil coal',
      abatement: '1.15 tCO2e / MT',
    },
    {
      producer: 'Sugar Mills & Distilleries',
      waste: 'Organic Press Mud / Bio-Sludge',
      consumer: 'Bio-Compost & Granulation Units',
      application: 'Soil conditioner restoring Cauvery delta organic matter',
      abatement: '0.74 tCO2e / MT',
    },
  ];

  return (
    <div className="space-y-14 py-3">
      {/* Hero Section: Crisp White & Emerald Modern Aesthetic */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white p-8 sm:p-14 border border-emerald-800/60 shadow-xl shadow-emerald-950/20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Industrial Symbiosis Exchange · Tamil Nadu Corridor</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Turn industrial by-products into{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-teal-200">
              circular revenue.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            Directly discover, verify, and trade industrial waste — from bagasse and fly ash to press mud and spent carbon. Fully compliant with TNPCB, tracked with verifiable Digital Material Passports.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              Explore Waste Marketplace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition backdrop-blur-xs"
            >
              <Factory className="w-4 h-4 text-emerald-300" />
              Register Industry Facility
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-emerald-200/80 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              TNPCB & NABL Lab Integrated
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Simulated Escrow Settlement
            </span>
            <span className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-400" />
              QR Provenance Passports
            </span>
          </div>
        </div>
      </section>

      {/* Live Counter Stats in Crisp White & Green */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 shadow-xs shadow-emerald-950/5">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Waste Diverted</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {formatNumber(stats.totalWasteDivertedTons)} <span className="text-sm font-semibold text-slate-500">MT</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Diverted from landfills across TN</p>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 shadow-xs shadow-emerald-950/5">
          <div className="flex items-center justify-between text-emerald-700 dark:text-teal-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">CO2 Abated</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {formatNumber(stats.totalCo2SavedTons)} <span className="text-sm font-semibold text-slate-500">tCO2e</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Verified Scope 3 emission reductions</p>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 shadow-xs shadow-emerald-950/5">
          <div className="flex items-center justify-between text-emerald-700 dark:text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Economic Value</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {formatCurrency(stats.totalEconomicValueInr)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Saved by secondary feedstock buyers</p>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 shadow-xs shadow-emerald-950/5">
          <div className="flex items-center justify-between text-emerald-700 dark:text-sky-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Plants</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center">
              <Factory className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.activeIndustriesCount} <span className="text-sm font-semibold text-slate-500">Facilities</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">{stats.completedSymbiosisDeals} closed circular deals</p>
        </div>
      </section>

      {/* How It Works (4 Clean Steps in White & Green) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How ReLoop Works
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Bridging waste generators and secondary raw material buyers with institutional trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Facility Verification',
              desc: 'Factories upload GSTIN, Factory License, and TNPCB Consent Orders with client-side SHA-256 integrity validation.',
              icon: ShieldCheck,
            },
            {
              step: '02',
              title: 'Feedstock Listing & Lab Assay',
              desc: 'Generators list by-products with NABL lab reports (moisture, calorific value, LOI, ash content).',
              icon: FileText,
            },
            {
              step: '03',
              title: 'Symbiosis Matching & Deal Room',
              desc: 'AI compatibility scoring, live in-app negotiation, simulated escrow lock, and transporter dispatching.',
              icon: Truck,
            },
            {
              step: '04',
              title: 'Digital QR Passport & CSR',
              desc: 'Weighbridge confirmation issues an immutable QR material passport and verifiable CSR carbon certificate.',
              icon: QrCode,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 shadow-xs shadow-emerald-950/5 space-y-3 hover:border-emerald-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {item.step}
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                  <item.icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-stone-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example Industrial Symbiosis Pairs */}
      <section className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-emerald-100 dark:border-stone-800 shadow-xs shadow-emerald-950/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Proven Symbiosis Pathways in Tamil Nadu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active material loops operating between manufacturing belts.
            </p>
          </div>
          <Link
            to="/network"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Explore Interactive Symbiosis Graph →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {symbiosisPairs.map((pair, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-emerald-100 dark:border-stone-800 bg-slate-50/60 dark:bg-stone-800/40 space-y-3 hover:bg-emerald-50/30 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                  {pair.waste}
                </span>
                <span className="text-xs font-semibold text-slate-500">Abatement: {pair.abatement}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Generator:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{pair.producer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Consumer:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{pair.consumer}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-stone-400 pt-2 border-t border-slate-200 dark:border-stone-700">
                <span className="font-semibold text-slate-800 dark:text-stone-300">Circular Impact:</span> {pair.application}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-linear-to-r from-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-950/10">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-3xl font-black tracking-tight">Ready to monetize your industrial waste streams?</h2>
          <p className="text-sm text-emerald-100">
            Join 40+ verified manufacturing units in Tamil Nadu exchanging by-products with guaranteed compliance and automated carbon accounting.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/register"
            className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
          >
            Get Started Now
          </Link>
          <Link
            to="/passport/RLP-2025-BAG-TN08-041"
            className="px-5 py-3.5 bg-emerald-900/80 hover:bg-emerald-950 text-white rounded-xl font-bold text-sm border border-emerald-600 transition"
          >
            View Sample Passport
          </Link>
        </div>
      </section>
    </div>
  );
};

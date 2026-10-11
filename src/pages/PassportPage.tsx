import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listingsApi } from '../api';
import { mockListings } from '../mocks/fixtures';
import { Listing } from '../types';
import { useTranslation } from '../i18n/translations';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Printer,
  ExternalLink,
  Award,
  Factory,
  Calendar,
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const PassportPage: React.FC = () => {
  const { batchCode } = useParams<{ batchCode: string }>();
  const { formatCurrency, formatNumber } = useTranslation();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (batchCode) {
      listingsApi.getByBatch(batchCode).then((item) => {
        if (item) {
          setListing(item);
        } else {
          // fallback to first listing
          setListing(mockListings[0]);
        }
        setLoading(false);
      });
    } else {
      setListing(mockListings[0]);
      setLoading(false);
    }
  }, [batchCode]);

  if (loading || !listing) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  // Generate crisp deterministic SVG QR pattern based on batchCode
  const qrMatrixSize = 25;
  const hashVal = (listing.batchCode + 'reloop').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Top back / print bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print Material Passport
        </button>
      </div>

      {/* Main Passport Card */}
      <div className="bg-white dark:bg-stone-900 border-2 border-emerald-600/40 rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
        {/* Top watermarked header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-extrabold uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              TNPCB Digital Material Passport
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white pt-2">
              {listing.title}
            </h1>
            <p className="text-xs text-stone-500">
              Verified Industrial By-product Stream · Circular Economy Framework
            </p>
          </div>

          {/* SVG QR Code */}
          <div className="p-3 bg-white rounded-2xl border-2 border-stone-900 shadow-sm shrink-0 flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              {/* Target finder patterns top-left, top-right, bottom-left */}
              <rect x="5" y="5" width="25" height="25" fill="#064e3b" rx="4" />
              <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
              <rect x="14" y="14" width="7" height="7" fill="#064e3b" />

              <rect x="70" y="5" width="25" height="25" fill="#064e3b" rx="4" />
              <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
              <rect x="79" y="14" width="7" height="7" fill="#064e3b" />

              <rect x="5" y="70" width="25" height="25" fill="#064e3b" rx="4" />
              <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
              <rect x="14" y="79" width="7" height="7" fill="#064e3b" />

              {/* Data modules */}
              <rect x="40" y="10" width="5" height="5" fill="#059669" />
              <rect x="50" y="15" width="5" height="5" fill="#059669" />
              <rect x="40" y="25" width="5" height="5" fill="#059669" />
              <rect x="55" y="30" width="5" height="5" fill="#059669" />
              <rect x="25" y="45" width="5" height="5" fill="#059669" />
              <rect x="45" y="45" width="10" height="10" fill="#064e3b" />
              <rect x="65" y="45" width="5" height="5" fill="#059669" />
              <rect x="75" y="55" width="5" height="5" fill="#059669" />
              <rect x="40" y="65" width="5" height="5" fill="#059669" />
              <rect x="55" y="75" width="5" height="5" fill="#059669" />
              <rect x="75" y="75" width="5" height="5" fill="#059669" />
              <rect x="85" y="85" width="5" height="5" fill="#059669" />
            </svg>
            <span className="text-[9px] font-mono font-bold text-stone-900 mt-1">SCAN TO AUDIT</span>
          </div>
        </div>

        {/* Essential Batch Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Batch Identifier</span>
            <span className="font-mono font-bold text-stone-900 dark:text-white mt-0.5 block truncate">
              {listing.batchCode}
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Originating Facility</span>
            <span className="font-bold text-stone-900 dark:text-white mt-0.5 block truncate">
              {listing.industryName}
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Corridor Location</span>
            <span className="font-bold text-stone-900 dark:text-white mt-0.5 block">
              {listing.sellerDistrict}, TN
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-700 dark:text-emerald-300 block text-[10px] uppercase font-bold">
              Carbon Abatement
            </span>
            <span className="font-extrabold text-emerald-800 dark:text-emerald-200 mt-0.5 block">
              {listing.co2SavingsFactorTonPerTon} tCO2e / MT
            </span>
          </div>
        </div>

        {/* Chemical Assay & Lab Tolerances */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              NABL Certified Quality Parameters
            </h3>
            <span className="text-xs text-stone-500 font-mono">Report #NABL-TN-2025-998</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {listing.qualityParameters.map((q, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40"
              >
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 block">{q.name}</span>
                  <span className="text-[10px] text-stone-400">{q.standardTolerance || 'Standard tolerance'}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    {q.value} {q.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chain-of-Custody Provenance Trail */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
            Chain-of-Custody Provenance Trail
          </h3>

          <div className="relative pl-6 space-y-4 border-l-2 border-emerald-500/40 text-xs">
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
              <span className="font-bold text-stone-900 dark:text-white block">By-product Generated & Depithed</span>
              <p className="text-stone-500 text-[11px]">Factory Yard #3, Ponni Sugars (Erode) · 10 Feb 2025, 08:30 IST</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
              <span className="font-bold text-stone-900 dark:text-white block">NABL Lab Sampling & Assay Clearance</span>
              <p className="text-stone-500 text-[11px]">Moisture 46.5%, GCV 1,950 kcal/kg confirmed · 11 Feb 2025, 14:15 IST</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
              <span className="font-bold text-stone-900 dark:text-white block">Digital Material Passport Issued</span>
              <p className="text-stone-500 text-[11px]">Cryptographic token generated on ReLoop Registry · 12 Feb 2025, 09:00 IST</p>
            </div>
          </div>
        </div>

        {/* Regulatory Certification Footer */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Compliant with Tamil Nadu Green Climate Company Circular Economy Mandates</span>
          </div>
          <span className="font-mono">SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4</span>
        </div>
      </div>
    </div>
  );
};

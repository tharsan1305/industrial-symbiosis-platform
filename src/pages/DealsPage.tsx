import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Deal } from '../types';
import { dealsApi } from '../api';
import { useTranslation } from '../i18n/translations';
import { StatusChip } from '../components/common/StatusChip';
import {
  Handshake,
  ArrowRight,
  Truck,
  Leaf,
  ShieldCheck,
  Star,
  FileText,
} from 'lucide-react';

export const DealsPage: React.FC = () => {
  const { formatCurrency, formatNumber, formatDate } = useTranslation();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealsApi.getAll().then((data) => {
      setDeals(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Industrial Deals & Contracts Room
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track negotiated contracts, manage dispatch manifests, simulate escrow funding, and view chain-of-custody logs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs hover:border-emerald-500/50 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-stone-900 dark:text-white">
                  Contract #{deal.id}
                </span>
                <span className="text-stone-300">·</span>
                <span className="font-mono text-[11px] text-stone-400">{deal.batchCode}</span>
                <StatusChip status={deal.stage} type="deal" />
                {deal.isHazardous && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    Hazardous Stream
                  </span>
                )}
              </div>

              <h3 className="text-lg font-black text-stone-900 dark:text-white">
                {deal.wasteName} ({formatNumber(deal.quantityTons)} MT)
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 dark:text-stone-400">
                <span>
                  Seller: <strong className="text-stone-800 dark:text-stone-200">{deal.sellerName}</strong>
                </span>
                <span>·</span>
                <span>
                  Buyer: <strong className="text-stone-800 dark:text-stone-200">{deal.buyerName}</strong>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <Leaf className="w-3.5 h-3.5" />
                  {deal.co2SavedTons} tCO2e abated
                </span>
              </div>

              {deal.transporterInfo && (
                <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg inline-flex">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Transporter: <strong>{deal.transporterInfo.transporterName}</strong> ({deal.transporterInfo.vehicleRegistrationNo})
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col md:items-end justify-between gap-3 shrink-0">
              <div className="text-left md:text-right">
                <span className="text-xs text-stone-400 block">Total Contract Value</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(deal.totalAmount)}
                </span>
                <span className="text-[11px] text-stone-500 block">
                  @ {formatCurrency(deal.agreedPricePerTon)} / MT
                </span>
              </div>

              <div className="flex items-center gap-2">
                {deal.stage === 'completed' && !deal.reviewedByBuyer && (
                  <Link
                    to={`/reviews/${deal.id}`}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    Submit Review
                  </Link>
                )}
                <Link
                  to={`/deals/${deal.id}`}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  Enter Deal Room
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

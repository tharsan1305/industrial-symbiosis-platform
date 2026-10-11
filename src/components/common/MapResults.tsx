import React from 'react';
import { Listing } from '../../types';
import { MapPin, Navigation, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MatchScoreBadge } from './MatchScoreBadge';
import { useTranslation } from '../../i18n/translations';

interface MapResultsProps {
  listings: Listing[];
  userLat?: number;
  userLng?: number;
  onSelectListing: (listing: Listing) => void;
}

// Calculate Haversine distance in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Estimate transport cost per ton based on TN freight rates (avg ₹4.5 / ton-km with min ₹350)
export function estimateTransportCostPerTon(distanceKm: number): number {
  return Math.max(350, Math.round(distanceKm * 4.5));
}

export const MapResults: React.FC<MapResultsProps> = ({
  listings,
  userLat = 10.825,
  userLng = 78.718,
  onSelectListing,
}) => {
  const { formatCurrency } = useTranslation();
  const [activeListing, setActiveListing] = React.useState<Listing | null>(listings[0] || null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm">
      {/* Map visual display */}
      <div className="lg:col-span-2 relative h-[480px] bg-slate-950 rounded-xl overflow-hidden border border-stone-800">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, #064e3b 0%, #042f2e 40%, #020617 100%)',
          }}
        />

        <div className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-lg text-white text-xs border border-stone-700 z-10 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>Origin: Your Plant at Tiruchirappalli (10.82° N, 78.71° E)</span>
        </div>

        {/* User Plant marker */}
        <div
          style={{
            top: `${((13.5 - userLat) / (13.5 - 8.0)) * 100}%`,
            left: `${((userLng - 76.2) / (80.4 - 76.2)) * 100}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        >
          <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/40 animate-ping" />
          <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap block">
            Your Facility
          </span>
        </div>

        {/* Listings on map */}
        {listings.map((l) => {
          const topPercent = Math.min(95, Math.max(5, ((13.5 - l.latitude) / (13.5 - 8.0)) * 100));
          const leftPercent = Math.min(95, Math.max(5, ((l.longitude - 76.2) / (80.4 - 76.2)) * 100));
          const isSelected = activeListing?.id === l.id;
          const dist = calculateDistanceKm(userLat, userLng, l.latitude, l.longitude);

          return (
            <div
              key={l.id}
              style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
              onClick={() => {
                setActiveListing(l);
                onSelectListing(l);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition group"
            >
              <div
                className={`p-1.5 rounded-full border shadow-lg transition-transform group-hover:scale-125 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-900 border-white ring-4 ring-amber-400/50 scale-125'
                    : 'bg-emerald-600 text-white border-emerald-300'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 bg-stone-900 text-white text-xs px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-30">
                <span className="font-bold">{l.wasteName}</span> ({dist} km)
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Listing Detail Sidecard */}
      <div className="flex flex-col justify-between space-y-4">
        {activeListing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {activeListing.category}
              </span>
              <MatchScoreBadge score={92} />
            </div>

            <h3 className="text-lg font-bold text-stone-900 dark:text-white leading-snug">
              {activeListing.title}
            </h3>

            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Supplier:</span>
                <span className="font-semibold text-stone-900 dark:text-white">{activeListing.industryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Location:</span>
                <span className="font-semibold text-stone-900 dark:text-white">{activeListing.sellerDistrict}, TN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Available:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{activeListing.quantityAvailable} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Unit Price:</span>
                <span className="font-bold text-stone-900 dark:text-white">{formatCurrency(activeListing.pricePerTon)} / ton</span>
              </div>
            </div>

            {/* Freight analysis */}
            {(() => {
              const distance = calculateDistanceKm(userLat, userLng, activeListing.latitude, activeListing.longitude);
              const freightEst = estimateTransportCostPerTon(distance);
              const landedCostEst = activeListing.pricePerTon + freightEst;

              return (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <Truck className="w-4 h-4" />
                    <span>Logistics & Freight Analysis (Estimate)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-500 block">Distance:</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{distance} km</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Freight per ton:</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{formatCurrency(freightEst)}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex justify-between text-xs">
                    <span className="font-medium text-stone-600 dark:text-stone-400">Total Landed Cost:</span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-300">{formatCurrency(landedCostEst)} / MT</span>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2">
              <Link
                to={`/listings/${activeListing.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition"
              >
                Inspect Material & Negotiate
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-500">Select a map pin to view facility logistics details.</p>
        )}
      </div>
    </div>
  );
};

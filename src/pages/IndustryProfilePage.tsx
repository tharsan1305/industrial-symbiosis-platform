import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { industriesApi, listingsApi, reviewsApi } from '../api';
import { IndustryProfile, Listing, ReviewItem } from '../types';
import { useTranslation } from '../i18n/translations';
import { TrustBadge, TrustScoreCard } from '../components/common/TrustBadge';
import {
  Factory,
  MapPin,
  ShieldCheck,
  Star,
  Package,
  Calendar,
  ArrowRight,
  ExternalLink,
  Award,
} from 'lucide-react';

export const IndustryProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { formatCurrency, formatNumber } = useTranslation();
  const [profile, setProfile] = useState<IndustryProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([
        industriesApi.getProfile(id),
        listingsApi.getAll(),
        reviewsApi.getForIndustry(id),
      ]).then(([p, allListings, revs]) => {
        setProfile(p);
        setListings(allListings.filter((l) => l.industryId === id));
        setReviews(revs);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full uppercase">
                {profile.category}
              </span>
              <span className="text-xs text-stone-400">· {profile.district}, Tamil Nadu</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              {profile.name}
            </h1>

            <p className="text-xs text-stone-500 max-w-xl leading-relaxed">
              {profile.address}, {profile.district} - {profile.pincode}. Registered under Factory License No: <span className="font-mono font-semibold">{profile.factoryLicenseNo}</span>.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {profile.badges.map((b) => (
                <TrustBadge key={b} type={b} />
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <TrustScoreCard
              score={profile.trustScore}
              rating={profile.rating}
              reviewCount={profile.reviewCount}
            />
          </div>
        </div>

        {/* Environmental impact metrics banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Landfill Diverted</span>
            <span className="text-lg font-black text-stone-900 dark:text-white">
              {formatNumber(profile.totalDivertedTons)} MT
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">CO2e Scope 3 Abated</span>
            <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
              {formatNumber(profile.totalCo2SavedTons)} tCO2e
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">GSTIN Registered</span>
            <span className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
              {profile.gstin}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">TNPCB Order</span>
            <span className="font-mono text-xs font-bold text-emerald-700">
              Valid & Active
            </span>
          </div>
        </div>
      </div>

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-900 dark:text-white">
          Active By-Product Streams ({listings.length})
        </h3>

        {listings.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border rounded-2xl p-8 text-center text-xs text-stone-500">
            No active public listings currently published by this plant.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((l) => (
              <div
                key={l.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex justify-between items-center"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">{l.category}</span>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white mt-0.5">{l.title}</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Available: <strong className="text-stone-800 dark:text-stone-200">{formatNumber(l.quantityAvailable)} MT</strong> · Rate:{' '}
                    <strong className="text-stone-800 dark:text-stone-200">{formatCurrency(l.pricePerTon)}/MT</strong>
                  </p>
                </div>
                <Link
                  to={`/listings/${l.id}`}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  View
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-900 dark:text-white">
          Verified Counterparty Reviews ({reviews.length})
        </h3>

        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 border rounded-2xl p-8 text-center text-xs text-stone-500">
              No counterparty reviews filed yet.
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-white">{rev.reviewerName}</span>
                    <span className="text-amber-500 font-bold">★ {rev.overallRating}.0</span>
                  </div>
                  <span className="text-stone-400 text-[11px]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 italic">"{rev.comment}"</p>
                <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-stone-400">
                  <span>Quality: {rev.qualityRating}/5</span>
                  <span>Quantity: {rev.quantityAccuracyRating}/5</span>
                  <span>On-Time: {rev.onTimeDeliveryRating}/5</span>
                  <span>Communication: {rev.communicationRating}/5</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

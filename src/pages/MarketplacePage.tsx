import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Listing, WasteCategory, SavedSearch } from '../types';
import { listingsApi } from '../api';
import { useTranslation } from '../i18n/translations';
import { MatchScoreBadge } from '../components/common/MatchScoreBadge';
import { StatusChip } from '../components/common/StatusChip';
import { MapResults, calculateDistanceKm, estimateTransportCostPerTon } from '../components/common/MapResults';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Truck,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  List,
  Map as MapIcon,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  QrCode,
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { t, formatCurrency, formatNumber } = useTranslation();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isHazardousOnly, setIsHazardousOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'match' | 'price_asc' | 'price_desc' | 'distance'>('match');
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // User reference plant (Tiruchirappalli)
  const userLat = 10.825;
  const userLng = 78.718;

  useEffect(() => {
    loadListings();
    listingsApi.getSavedSearches().then(setSavedSearches);
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await listingsApi.getAll();
      setListings(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrentSearch = async () => {
    const s = await listingsApi.saveSearch(searchQuery || 'Active Filter', selectedCategory !== 'All' ? selectedCategory : undefined, isHazardousOnly);
    setSavedSearches((prev) => [...prev, s]);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Filter & sort logic
  const filteredListings = listings
    .filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (isHazardousOnly && !item.isHazardous) return false;
      if (item.pricePerTon > maxPrice) return false;

      const dist = calculateDistanceKm(userLat, userLng, item.latitude, item.longitude);
      if (dist > maxDistanceKm) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.wasteName.toLowerCase().includes(q) ||
          item.sellerDistrict.toLowerCase().includes(q) ||
          item.suggestedApplications.some((a) => a.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const distA = calculateDistanceKm(userLat, userLng, a.latitude, a.longitude);
      const distB = calculateDistanceKm(userLat, userLng, b.latitude, b.longitude);

      if (sortBy === 'price_asc') return a.pricePerTon - b.pricePerTon;
      if (sortBy === 'price_desc') return b.pricePerTon - a.pricePerTon;
      if (sortBy === 'distance') return distA - distB;
      // default: match score pseudo-heuristic (closer + higher co2 factor)
      return b.co2SavingsFactorTonPerTon - a.co2SavingsFactorTonPerTon;
    });

  const categories: string[] = [
    'All',
    'Agro-Industrial',
    'Combustion By-products',
    'Mineral & Construction',
    'Chemical & Sludge',
  ];

  return (
    <div className="space-y-6 py-2">
      {/* Top Search bar & View Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Industrial Waste & By-product Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified industrial feedstocks with NABL lab reports and live freight distance calculators
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* List / Map View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-stone-800 p-1 rounded-xl border border-emerald-100 dark:border-stone-700">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              TN Map
            </button>
          </div>

          <button
            onClick={handleSaveCurrentSearch}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 dark:bg-stone-800 hover:text-emerald-800 text-slate-700 dark:text-stone-300 rounded-xl text-xs font-semibold border border-emerald-100 dark:border-stone-700 transition cursor-pointer"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4 text-slate-400" />}
            <span>{isSaved ? 'Saved!' : 'Save Filter'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card in Crisp White & Green */}
      <div className="bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs shadow-emerald-950/5 space-y-4">
        {/* Main search input */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by-products (bagasse, fly ash, press mud, rice husk, silica)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-stone-300 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="match">Sort: Symbiosis Match Score</option>
              <option value="distance">Sort: Logistical Distance (Closest)</option>
              <option value="price_asc">Sort: Price Low to High</option>
              <option value="price_desc">Sort: Price High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Sliders */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-stone-800 text-xs">
          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-stone-800 text-slate-600 dark:text-stone-400 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hazardous checkbox & sliders */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isHazardousOnly}
                onChange={(e) => setIsHazardousOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Hazardous Stream (TNPCB Schedule)
              </span>
            </label>

            {/* Radius Slider */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Radius:</span>
              <input
                type="range"
                min="50"
                max="600"
                step="25"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-24 accent-emerald-600"
              />
              <span className="font-bold text-slate-900 dark:text-white font-mono">{maxDistanceKm} km</span>
            </div>

            {/* Price Cap */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Max Rate:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {formatCurrency(maxPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Saved Searches Chips */}
        {savedSearches.length > 0 && (
          <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
            <span className="font-bold text-slate-400">Saved Searches:</span>
            {savedSearches.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSearchQuery(s.query);
                  if (s.category) setSelectedCategory(s.category);
                }}
                className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-stone-800 hover:bg-emerald-100 text-emerald-800 dark:text-stone-300 transition"
              >
                {s.query} {s.category ? `(${s.category})` : ''}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Results View */}
      {viewMode === 'map' ? (
        <MapResults
          listings={filteredListings}
          userLat={userLat}
          userLng={userLng}
          onSelectListing={(l) => {}}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredListings.length} circular waste stream results</span>
            <span className="text-slate-400">Reference Point: Your Facility at Tiruchirappalli (10.82° N, 78.71° E)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const distance = calculateDistanceKm(userLat, userLng, listing.latitude, listing.longitude);
              const freightEst = estimateTransportCostPerTon(distance);
              const landedCostEst = listing.pricePerTon + freightEst;

              return (
                <div
                  key={listing.id}
                  className="bg-white dark:bg-stone-900 border border-emerald-100/90 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs shadow-emerald-950/5 hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between group"
                >
                  {/* Card top banner with image and badge */}
                  <div className="relative h-44 bg-slate-100 dark:bg-stone-800 overflow-hidden">
                    <img
                      src={listing.images[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {listing.category}
                      </span>
                      {listing.isHazardous && (
                        <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          PCB Sched
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <MatchScoreBadge score={listing.id.includes('bagasse') ? 95 : 88} />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{listing.sellerDistrict}, Tamil Nadu</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{listing.industryName}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {listing.title}
                      </h3>

                      {/* Quality Param tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {listing.moisturePercentage !== undefined && (
                          <span className="text-[10px] bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 px-2 py-0.5 rounded-md font-mono">
                            Moisture: {listing.moisturePercentage}%
                          </span>
                        )}
                        {listing.calorificValueKcalKg && (
                          <span className="text-[10px] bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 px-2 py-0.5 rounded-md font-mono">
                            GCV: {listing.calorificValueKcalKg} kcal/kg
                          </span>
                        )}
                        {listing.ashContentPercentage !== undefined && (
                          <span className="text-[10px] bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 px-2 py-0.5 rounded-md font-mono">
                            Ash: {listing.ashContentPercentage}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Logistics and Pricing Box */}
                    <div className="pt-3 border-t border-slate-100 dark:border-stone-800 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-slate-500">Ex-Plant Price:</span>
                          <p className="text-lg font-black text-slate-900 dark:text-white">
                            {formatCurrency(listing.pricePerTon)}
                            <span className="text-xs font-normal text-slate-500"> / MT</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500">Available:</span>
                          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                            {formatNumber(listing.quantityAvailable)} MT
                          </p>
                        </div>
                      </div>

                      {/* Transport & Distance Estimate */}
                      <div className="p-2.5 bg-emerald-50/50 dark:bg-stone-800/60 rounded-xl border border-emerald-100/70 dark:border-stone-700/50 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-600 dark:text-stone-300">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Truck className="w-3.5 h-3.5 text-emerald-600" />
                            Distance ({distance} km):
                          </span>
                          <span className="font-semibold text-[11px]">~{formatCurrency(freightEst)} / MT</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-emerald-100 dark:border-stone-700/50">
                          <span className="text-slate-500 text-[11px] font-medium">Est. Landed Cost:</span>
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                            {formatCurrency(landedCostEst)} / MT
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <Link
                          to={`/listings/${listing.id}`}
                          className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-xs shadow-emerald-600/20"
                        >
                          <span>Inspect Material</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/passport/${listing.batchCode}`}
                          className="p-2.5 bg-slate-100 hover:bg-emerald-50 dark:bg-stone-800 text-slate-700 hover:text-emerald-800 dark:text-stone-300 rounded-xl border border-slate-200 dark:border-stone-700 transition"
                          title="View Digital Material Passport"
                        >
                          <QrCode className="w-4 h-4 text-emerald-600" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

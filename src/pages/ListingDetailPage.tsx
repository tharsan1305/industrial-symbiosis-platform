import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Listing, IndustryProfile } from '../types';
import { listingsApi, industriesApi, requestsApi } from '../api';
import { useTranslation } from '../i18n/translations';
import { useAuth } from '../context/AuthContext';
import { MatchScoreBadge } from '../components/common/MatchScoreBadge';
import { TrustBadge } from '../components/common/TrustBadge';
import { calculateDistanceKm, estimateTransportCostPerTon } from '../components/common/MapResults';
import {
  FileText,
  ShieldCheck,
  QrCode,
  MapPin,
  Truck,
  TrendingUp,
  HelpCircle,
  MessageSquare,
  Send,
  ArrowLeft,
  Download,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { t, formatCurrency, formatNumber } = useTranslation();

  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<IndustryProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Request modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqQuantity, setReqQuantity] = useState('100');
  const [reqPrice, setReqPrice] = useState('2400');
  const [reqNotes, setReqNotes] = useState('');
  const [isSendingReq, setIsSendingReq] = useState(false);
  const [reqSuccess, setReqSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      listingsApi.getById(id).then(async (l) => {
        setListing(l);
        setReqPrice(String(l.pricePerTon));
        setReqQuantity(String(l.minimumOrderQuantity || 100));
        try {
          const s = await industriesApi.getProfile(l.industryId);
          setSeller(s);
        } catch {
          // fallback
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !listing) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  const userLat = 10.825;
  const userLng = 78.718;
  const distance = calculateDistanceKm(userLat, userLng, listing.latitude, listing.longitude);
  const freightEst = estimateTransportCostPerTon(distance);
  const landedCost = listing.pricePerTon + freightEst;

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingReq(true);
    try {
      await requestsApi.create({
        listingId: listing.id,
        listingTitle: listing.title,
        wasteName: listing.wasteName,
        senderId: profile?.id || 'ind-demo-current',
        senderName: profile?.name || 'Kothari Bio-Energy',
        receiverId: listing.industryId,
        receiverName: listing.industryName,
        proposedQuantityTons: parseFloat(reqQuantity) || 100,
        proposedPricePerTon: parseFloat(reqPrice) || listing.pricePerTon,
        deliveryDistrict: profile?.district || 'Tiruchirappalli',
        notes: reqNotes,
      });
      setReqSuccess(true);
      setTimeout(() => {
        setShowRequestModal(false);
        setReqSuccess(false);
        navigate('/requests');
      }, 1500);
    } finally {
      setIsSendingReq(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Back button & top crumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/passport/${listing.batchCode}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold transition"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            Digital Material Passport
          </Link>
        </div>
      </div>

      {/* Main Grid: Gallery + Core Info & Pricing Sidecard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image gallery + Quality parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery Banner */}
          <div className="relative h-80 bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-md">
            <img
              src={listing.images[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-stone-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg">
                {listing.category}
              </span>
              {listing.isHazardous && (
                <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  TNPCB Hazardous Stream
                </span>
              )}
            </div>
          </div>

          {/* Heading & Basic info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-500 font-bold">Batch: {listing.batchCode}</span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-emerald-700 font-semibold">{listing.physicalState} Physical Form</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight">
              {listing.title}
            </h1>
          </div>

          {/* Quality Parameters Table */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Certified Chemical & Physical Assay
                </h3>
                <p className="text-xs text-stone-500">Tested according to Bureau of Indian Standards (BIS / IS)</p>
              </div>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-lg">
                NABL Accredited
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4 rounded-l-lg">Parameter</th>
                    <th className="py-2.5 px-4">Measured Value</th>
                    <th className="py-2.5 px-4">Unit</th>
                    <th className="py-2.5 px-4 rounded-r-lg">Standard Tolerance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {listing.qualityParameters.map((q, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50">
                      <td className="py-3 px-4 font-semibold text-stone-800 dark:text-stone-200">{q.name}</td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-white">{q.value}</td>
                      <td className="py-3 px-4 text-stone-500">{q.unit}</td>
                      <td className="py-3 px-4 text-stone-500">{q.standardTolerance || 'Standard specification'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Lab report download link (simulated presigned URL) */}
            {listing.labReportUrl && (
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {listing.labReportName || 'NABL_Certified_Lab_Assay_Report.pdf'}
                  </span>
                </div>
                <a
                  href={listing.labReportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-emerald-800 dark:text-emerald-400 font-bold rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Certificate (Pre-signed)
                </a>
              </div>
            )}
          </div>

          {/* Symbiosis Match Breakdown Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Industrial Symbiosis Compatibility Breakdown
              </h3>
              <MatchScoreBadge score={94} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl space-y-1">
                <span className="text-stone-500 block font-medium">Chemistry Match: 96%</span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  Moisture and ash contents align precisely with boiler co-firing standards.
                </p>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl space-y-1">
                <span className="text-stone-500 block font-medium">Logistics Radius: 92%</span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  Under 150 km haulage along the NH-81 corridor ensures low freight footprint.
                </p>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl space-y-1">
                <span className="text-stone-500 block font-medium">Compliance Gate: 100%</span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  Seller holds current TNPCB consent order for by-product dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Distance, Send Request & Seller Profile Card */}
        <div className="space-y-6">
          {/* Commercial Order Box */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-md space-y-5">
            <div>
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider block mb-1">
                Ex-Factory Commercial Rate
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900 dark:text-white">
                  {formatCurrency(listing.pricePerTon)}
                </span>
                <span className="text-xs font-semibold text-stone-500">/ Metric Ton</span>
              </div>

              {/* Price Suggestion Hint with Tooltip */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold">
                  Fair Price Range: {formatCurrency(listing.suggestedPriceRange.min)} – {formatCurrency(listing.suggestedPriceRange.max)}
                </span>
                <span className="relative group cursor-help ml-auto">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block w-52 p-2 bg-stone-900 text-white text-[11px] rounded shadow-lg z-30 font-normal">
                    Estimated using recent closed deals in Tamil Nadu and substitute virgin fuel parity.
                  </div>
                </span>
              </div>
            </div>

            {/* Supply availability stats */}
            <div className="space-y-2 py-3 border-y border-stone-100 dark:border-stone-800 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Quantity In Stock:</span>
                <span className="font-bold text-stone-900 dark:text-white">{formatNumber(listing.quantityAvailable)} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Minimum Order Quantity:</span>
                <span className="font-bold text-stone-900 dark:text-white">{listing.minimumOrderQuantity} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Carbon Abatement Factor:</span>
                <span className="font-bold text-emerald-700">{listing.co2SavingsFactorTonPerTon} tCO2e / MT</span>
              </div>
            </div>

            {/* Freight analysis from user plant */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Freight Estimate to Your Plant</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Distance:</span>
                <span className="font-semibold text-stone-900 dark:text-white">{distance} km</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Transport Tariff:</span>
                <span className="font-semibold text-stone-900 dark:text-white">~{formatCurrency(freightEst)} / MT</span>
              </div>
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between font-bold">
                <span>Est. Landed Cost:</span>
                <span className="text-emerald-700 dark:text-emerald-400">{formatCurrency(landedCost)} / MT</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowRequestModal(true)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Send Purchase Request
              </button>
              <Link
                to="/deals/deal-active-01"
                className="w-full py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Open Live Deal Room
              </Link>
            </div>
          </div>

          {/* Seller Profile Card */}
          {seller && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Verified Facility
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                  Score: {seller.trustScore}/100
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 dark:text-white">{seller.name}</h4>
                <p className="text-xs text-stone-500 mt-0.5">{seller.category} · {seller.district}, Tamil Nadu</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {seller.badges.map((b) => (
                  <TrustBadge key={b} type={b} size="sm" />
                ))}
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between text-xs text-stone-500">
                <span>Diverted: <strong className="text-stone-800 dark:text-stone-200">{formatNumber(seller.totalDivertedTons)} MT</strong></span>
                <span>Rating: <strong className="text-amber-500">★ {seller.rating}</strong> ({seller.reviewCount})</span>
              </div>

              <Link
                to={`/industries/${seller.id}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline pt-1"
              >
                <span>View Full Industry Compliance Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Send Purchase Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-stone-900 max-w-md w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Send Purchase Request to {listing.industryName}
            </h3>

            {reqSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">Request Dispatched Successfully!</p>
                <p>Navigating to your Requests dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Requested Quantity (Metric Tons)
                  </label>
                  <input
                    type="number"
                    required
                    min={listing.minimumOrderQuantity || 1}
                    max={listing.quantityAvailable}
                    value={reqQuantity}
                    onChange={(e) => setReqQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs text-stone-900 dark:text-white"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    Available: {listing.quantityAvailable} MT · MOQ: {listing.minimumOrderQuantity} MT
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Offered Unit Price per MT (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={reqPrice}
                    onChange={(e) => setReqPrice(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Procurement Notes & Delivery Requirement
                  </label>
                  <textarea
                    rows={3}
                    value={reqNotes}
                    onChange={(e) => setReqNotes(e.target.value)}
                    placeholder="Describe your plant destination, boiler intake rate, or lab sampling requests..."
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs text-stone-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReq}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
                  >
                    {isSendingReq ? 'Sending...' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

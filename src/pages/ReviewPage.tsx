import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dealsApi, reviewsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Deal, ReviewItem } from '../types';
import { Star, CheckCircle2, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReviewPage: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [overallRating, setOverallRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [quantityRating, setQuantityRating] = useState<number>(5);
  const [deliveryRating, setDeliveryRating] = useState<number>(5);
  const [commRating, setCommRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (dealId) {
      dealsApi.getById(dealId).then((d) => {
        setDeal(d);
        if (d.reviewedByBuyer) {
          setAlreadyReviewed(true);
        }
      });
    }
  }, [dealId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deal) return;
    setIsSubmitting(true);

    try {
      await reviewsApi.create({
        dealId: deal.id,
        targetIndustryId: deal.sellerId,
        reviewerIndustryId: profile?.id || deal.buyerId,
        reviewerName: profile?.name || deal.buyerName,
        overallRating,
        qualityRating,
        quantityAccuracyRating: quantityRating,
        onTimeDeliveryRating: deliveryRating,
        communicationRating: commRating,
        comment,
      });

      setSuccess(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        navigate(`/deals/${deal.id}`);
      }, 1600);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarInput = (val: number, setVal: (n: number) => void) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setVal(star)}
          className="p-1 text-stone-300 hover:text-amber-400 transition cursor-pointer"
        >
          <Star
            className={`w-5 h-5 ${
              star <= val ? 'text-amber-500 fill-amber-400' : 'text-stone-300 dark:text-stone-700'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <Link
        to={dealId ? `/deals/${dealId}` : '/deals'}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Deal Room
      </Link>

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Verified Counterparty Feedback
          </span>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
            Review By-Product Transaction
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Supplier: <strong className="text-stone-800 dark:text-stone-200">{deal?.sellerName}</strong> · Material: {deal?.wasteName} ({deal?.quantityTons} MT)
          </p>
        </div>

        {alreadyReviewed ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
              Review Already Submitted
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Only one verified review per executed deal is allowed on ReLoop to safeguard integrity and eliminate duplicate rating bias.
            </p>
            <Link
              to={`/deals/${dealId}`}
              className="inline-block mt-2 font-bold text-emerald-700 underline text-xs"
            >
              Back to Deal Room
            </Link>
          </div>
        ) : success ? (
          <div className="p-6 bg-emerald-50 text-emerald-900 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold">Review Published to Platform Trust Score</h3>
            <p className="text-xs">Returning to your deal room...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-stone-900 dark:text-white block">
                  Overall Rating
                </span>
                <span className="text-xs text-stone-500">General transaction experience</span>
              </div>
              {renderStarInput(overallRating, setOverallRating)}
            </div>

            {/* Sub criteria */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                <span>Feedstock Quality & Chemical Lab Accuracy</span>
                {renderStarInput(qualityRating, setQualityRating)}
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                <span>Weighbridge & Quantity Accuracy</span>
                {renderStarInput(quantityRating, setQuantityRating)}
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                <span>Loading & On-Time Fleet Dispatch</span>
                {renderStarInput(deliveryRating, setDeliveryRating)}
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                <span>Operational Communication & Transporter Safety</span>
                {renderStarInput(commRating, setCommRating)}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Detailed Feedback (Public on Supplier Profile)
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share specific observations about ash content, packaging, moisture variation, weighbridge matching..."
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
            >
              {isSubmitting ? 'Submitting Review...' : 'Publish Verified Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

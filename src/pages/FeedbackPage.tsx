import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, CheckCircle2, MessageSquare, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FeedbackPage: React.FC = () => {
  const { profile } = useAuth();
  const [category, setCategory] = useState<'Bug' | 'Feature Suggestion' | 'Regulatory Policy' | 'Other'>('Feature Suggestion');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 50, spread: 50 });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-white">
          Platform Feedback & Symbiosis Suggestions
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Help improve ReLoop's matching engine, freight calculations, and regulatory reporting
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-xs">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              Thank You for Your Feedback!
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Your suggestion has been logged with the platform engineering and environmental operations team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
              >
                <option value="Feature Suggestion">Feature Suggestion / Workflow Enhancement</option>
                <option value="Regulatory Policy">TNPCB / CPCB Regulatory Alignment</option>
                <option value="Bug">Technical Glitch / Bug Report</option>
                <option value="Other">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Platform Experience Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-500 fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Your Thoughts or Request
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your suggestions for new material types, lab parameters, or regional transporter routes..."
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl text-xs dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

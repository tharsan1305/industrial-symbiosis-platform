import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, Factory, Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [industryName, setIndustryName] = useState('');
  const [category, setCategory] = useState('Sugar Mill');
  const [gstin, setGstin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // GSTIN format check for Tamil Nadu (starts with 33)
    if (gstin.length !== 15) {
      setError('Indian GSTIN must be exactly 15 alphanumeric characters (e.g., 33AABCP1234F1Z1).');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email,
        industryName,
        category,
        gstin: gstin.toUpperCase(),
      });
      // Route straight to onboarding wizard
      navigate('/onboarding');
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <Factory className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-white">Register Industry Facility</h2>
          <p className="text-xs text-stone-500">
            Join the circular industrial network to trade by-products and obtain verified carbon credits
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Registered Company / Plant Name
            </label>
            <input
              type="text"
              required
              value={industryName}
              onChange={(e) => setIndustryName(e.target.value)}
              placeholder="e.g. Cauvery Bio-Refineries Pvt Ltd"
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Industrial Sector
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="Sugar Mill">Sugar Mill & Bagasse</option>
              <option value="Thermal Power">Thermal Power & Fly Ash</option>
              <option value="Rice Mill">Rice Mill & Biomass Husk</option>
              <option value="Cement Plant">Cement Plant & Kiln Co-processing</option>
              <option value="Bio-Energy & Distillery">Bio-Energy & Distillery</option>
              <option value="Chemical">Chemical & Solvents</option>
              <option value="Brick Kiln">Brick Kiln & AAC Blocks</option>
              <option value="Paper & Pulp">Paper & Pulp</option>
              <option value="Other">Other Manufacturing</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              15-Digit Indian GSTIN
            </label>
            <input
              type="text"
              required
              maxLength={15}
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="33AABCC1234D1Z5"
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Official Contact Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sustainability@company.com"
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Portal Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{isSubmitting ? 'Registering Facility...' : 'Proceed to Onboarding Wizard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">Reset Account Password</h2>
        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2">
            <p className="font-bold">Password recovery link dispatched!</p>
            <p>If an account exists for {email}, instructions to reset credentials have been delivered.</p>
            <Link to="/login" className="inline-block mt-2 font-bold underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <p className="text-xs text-stone-500">
              Enter your registered corporate email to receive a password reset instruction.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
            >
              Send Reset Instructions
            </button>
            <div className="text-center">
              <Link to="/login" className="text-xs text-stone-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">Set New Password</h2>
        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2">
            <p className="font-bold">Password updated successfully!</p>
            <Link to="/login" className="inline-block mt-2 font-bold underline">
              Proceed to Sign In
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSuccess(true);
            }}
            className="space-y-4"
          >
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter at least 8 characters"
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

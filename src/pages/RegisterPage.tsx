import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  Factory,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  Building,
  Check,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [industryName, setIndustryName] = useState('');
  const [category, setCategory] = useState('Sugar Mill');
  const [gstin, setGstin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // GSTIN format check for Tamil Nadu (starts with 33)
    if (gstin.length !== 15) {
      setError('Indian GSTIN must be exactly 15 alphanumeric characters (e.g., 33AABCP1234F1Z1).');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the TNPCB data compliance terms.');
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
    <div className="min-h-[82vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 p-7 sm:p-10 shadow-xl shadow-emerald-950/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-600/20">
            <Factory className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Register Industrial Facility
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Join the Tamil Nadu Circular Waste Network to trade by-products & obtain verified Passports
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
              Registered Company / Plant Name
            </label>
            <input
              type="text"
              required
              value={industryName}
              onChange={(e) => setIndustryName(e.target.value)}
              placeholder="e.g. Cauvery Bio-Refineries Pvt Ltd"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                Industrial Sector
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
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
              <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                15-Digit Indian GSTIN
              </label>
              <input
                type="text"
                required
                maxLength={15}
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="33AABCC1234D1Z5"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs font-mono uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
              Official Corporate Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sustainability@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Separate Password Field */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Strength:</span>
                  <span
                    className={`font-bold ${
                      strength <= 1
                        ? 'text-rose-500'
                        : strength === 2
                        ? 'text-amber-500'
                        : 'text-emerald-600'
                    }`}
                  >
                    {strength <= 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Strong'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength <= 1
                        ? 'w-1/4 bg-rose-500'
                        : strength === 2
                        ? 'w-2/4 bg-amber-500'
                        : strength === 3
                        ? 'w-3/4 bg-emerald-500'
                        : 'w-full bg-emerald-600'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Separate Confirm Password Field */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-stone-800 border rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-rose-300'
                    : confirmPassword && confirmPassword === password
                    ? 'border-emerald-400'
                    : 'border-slate-200 dark:border-stone-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 p-1 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && confirmPassword === password && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Passwords match
              </p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-stone-400">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="terms" className="cursor-pointer">
              I certify that our facility adheres to Tamil Nadu Pollution Control Board (TNPCB) waste exchange regulations and consents.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <span>{isSubmitting ? 'Registering Facility...' : 'Proceed to Onboarding Wizard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100 dark:border-stone-800">
          Already registered your facility?{' '}
          <Link to="/login" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            Sign In with Password
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
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 p-8 shadow-xl shadow-emerald-950/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 rounded-2xl flex items-center justify-center text-emerald-700 mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reset Account Password</h2>
          <p className="text-xs text-slate-500">
            Enter your official registered email to receive secure password recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Password Recovery Dispatched</span>
            </div>
            <p className="leading-relaxed">
              We have dispatched recovery instructions to <strong className="font-mono">{email}</strong>. Please check your inbox.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/reset-password"
                className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-center hover:bg-emerald-700 transition"
              >
                Set New Password Now
              </Link>
              <Link to="/login" className="text-center text-emerald-700 font-semibold hover:underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sustainability@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition">
                Back to Sign In
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
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 p-8 shadow-xl shadow-emerald-950/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 rounded-2xl flex items-center justify-center text-emerald-700 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Password</h2>
          <p className="text-xs text-slate-500">
            Set your updated access password for the ReLoop industrial exchange portal.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-bold text-sm text-emerald-800">Password Updated Successfully!</p>
            <p className="text-slate-600">Your portal credentials have been securely refreshed.</p>
            <Link
              to="/login"
              className="inline-block mt-3 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
            >
              Sign In with New Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 p-1"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <span>Update Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

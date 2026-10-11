import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, Lock, Mail, KeyRound, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('sustainability@kotharibio.in');
  const [password, setPassword] = useState('password123');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfaInput, setShowMfaInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password, mfaCode || undefined);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoPreset = (type: 'industry' | 'admin') => {
    if (type === 'admin') {
      setEmail('admin@tnpcb.gov.in');
      setPassword('adminPass2025');
    } else {
      setEmail('sustainability@kotharibio.in');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <Recycle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-white">Sign In to ReLoop</h2>
          <p className="text-xs text-stone-500">
            Access your B2B industrial symbiosis portal and trade verified by-products
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
          <span className="font-semibold text-stone-500 block mb-1.5 text-[11px] uppercase">
            Quick Demo Autofill:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoPreset('industry')}
              className="flex-1 py-1.5 px-2 bg-emerald-100/70 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 text-emerald-800 rounded-lg font-bold text-xs transition cursor-pointer"
            >
              Industry (Kothari Bio)
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('admin')}
              className="flex-1 py-1.5 px-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300 text-amber-900 rounded-lg font-bold text-xs transition cursor-pointer"
            >
              TNPCB Admin Desk
            </button>
          </div>
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
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@industry.co.in"
                className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* MFA 2FA field */}
          <div>
            <button
              type="button"
              onClick={() => setShowMfaInput(!showMfaInput)}
              className="text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {showMfaInput ? 'Hide TOTP 2FA Token' : '+ Enter TOTP 2FA Authenticator Token (Optional)'}
            </button>
            {showMfaInput && (
              <div className="mt-2 relative">
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="6-digit authenticator code (e.g. 842109)"
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono text-stone-900 dark:text-white"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-500">
          New industry in Tamil Nadu?{' '}
          <Link to="/register" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            Register your facility
          </Link>
        </div>
      </div>
    </div>
  );
};

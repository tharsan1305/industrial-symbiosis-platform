import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Factory,
  Shield,
  CheckCircle2,
  HelpCircle,
  Building2,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Active Login Section: 'industry' or 'admin'
  const [activePortal, setActivePortal] = useState<'industry' | 'admin'>('industry');

  // Separate form state for Industry Login
  const [industryEmail, setIndustryEmail] = useState('sustainability@kotharibio.in');
  const [industryPassword, setIndustryPassword] = useState('password123');
  const [showIndustryPassword, setShowIndustryPassword] = useState(false);
  const [industryRemember, setIndustryRemember] = useState(true);

  // Separate form state for Admin Regulatory Login
  const [adminEmail, setAdminEmail] = useState('admin@tnpcb.gov.in');
  const [adminPassword, setAdminPassword] = useState('adminPass2025');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminRemember, setAdminRemember] = useState(true);
  const [adminMfaCode, setAdminMfaCode] = useState('');
  const [showAdminMfa, setShowAdminMfa] = useState(false);

  const [capsLockActive, setCapsLockActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleIndustrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(industryEmail, industryPassword);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Industry credentials could not be verified.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(adminEmail, adminPassword, adminMfaCode || undefined);
      navigate('/admin/verification');
    } catch (err: any) {
      setError(err?.message || 'Admin authentication failed. Invalid officer clearance credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 p-7 sm:p-10 shadow-xl shadow-emerald-950/5 space-y-6">
        {/* Brand & Header in White & Green */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-600/25">
            <Recycle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign In to <span className="text-emerald-600">ReLoop</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto">
            Tamil Nadu B2B Industrial Circular Waste & Symbiosis Exchange
          </p>
        </div>

        {/* Dedicated Separate Login Portal Switcher */}
        <div className="bg-slate-100/90 dark:bg-stone-800 p-1.5 rounded-2xl border border-emerald-100 dark:border-stone-700 grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setActivePortal('industry');
              setError(null);
            }}
            className={`py-2.5 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activePortal === 'industry'
                ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-sm border border-emerald-100 dark:border-stone-600'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-stone-200'
            }`}
          >
            <Factory className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <span className="block leading-tight">Industry Facility</span>
              <span className="text-[10px] text-slate-400 font-normal">Mills & Plants</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePortal('admin');
              setError(null);
            }}
            className={`py-2.5 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activePortal === 'admin'
                ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-sm border border-emerald-100 dark:border-stone-600'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-stone-200'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <span className="block leading-tight">TNPCB Admin</span>
              <span className="text-[10px] text-slate-400 font-normal">Officer Desk</span>
            </div>
          </button>
        </div>

        {/* Portal Information Badge */}
        <div className="px-4 py-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-semibold">
            {activePortal === 'industry' ? (
              <>
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Industrial Sellers & Buyers</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>TNPCB Regulatory Desk & Compliance Officers</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-300 border border-emerald-100 font-bold">
            {activePortal === 'industry' ? 'TNPCB SECURE' : 'RESTRICTED'}
          </span>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {capsLockActive && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] font-medium flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Caps Lock is ON</span>
          </div>
        )}

        {/* PORTAL 1: SEPARATE INDUSTRY FACILITY LOGIN WITH PASSWORD */}
        {activePortal === 'industry' && (
          <form onSubmit={handleIndustrySubmit} className="space-y-4">
            {/* Industry Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1.5">
                Corporate Facility Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={industryEmail}
                  onChange={(e) => setIndustryEmail(e.target.value)}
                  placeholder="sustainability@kotharibio.in"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition"
                />
              </div>
            </div>

            {/* Industry Password with dedicated Eye toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-stone-300">
                  Facility Access Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showIndustryPassword ? 'text' : 'password'}
                  required
                  value={industryPassword}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyDown}
                  onChange={(e) => setIndustryPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition"
                />
                <button
                  type="button"
                  onClick={() => setShowIndustryPassword(!showIndustryPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 p-1 cursor-pointer"
                  title={showIndustryPassword ? 'Hide password' : 'Show password'}
                >
                  {showIndustryPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-stone-400 font-medium">
                <input
                  type="checkbox"
                  checked={industryRemember}
                  onChange={(e) => setIndustryRemember(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remember this facility browser</span>
              </label>

              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                TLS 1.3 256-bit Encrypted
              </span>
            </div>

            {/* Industry Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <span>{isSubmitting ? 'Authenticating Facility...' : 'Sign In to Industry Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick autofill buttons for Industry demo */}
            <div className="pt-3 border-t border-slate-100 dark:border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Demo Facility Accounts:</span>
                <span className="text-slate-400">Click to autofill</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIndustryEmail('sustainability@kotharibio.in');
                    setIndustryPassword('password123');
                  }}
                  className="p-2 text-left rounded-xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition cursor-pointer"
                >
                  <p className="font-bold text-slate-800 text-[11px] truncate">Kothari Bio-Energy</p>
                  <p className="text-[10px] text-emerald-700 truncate">Sugar & Bagasse Mill</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIndustryEmail('procurement@tnpl.co.in');
                    setIndustryPassword('password123');
                  }}
                  className="p-2 text-left rounded-xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition cursor-pointer"
                >
                  <p className="font-bold text-slate-800 text-[11px] truncate">TN Newsprint & Paper</p>
                  <p className="text-[10px] text-emerald-700 truncate">Paper Pulp Consumer</p>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* PORTAL 2: SEPARATE TNPCB REGULATORY ADMIN LOGIN WITH PASSWORD */}
        {activePortal === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            {/* Admin Official Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1.5">
                TNPCB Official Officer Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@tnpcb.gov.in"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition"
                />
              </div>
            </div>

            {/* Admin Password with Eye toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-stone-300">
                  Officer Security Clearance Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Officer Help Desk
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyDown}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 p-1 cursor-pointer"
                  title={showAdminPassword ? 'Hide password' : 'Show password'}
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2FA Option & Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-stone-400 font-medium">
                <input
                  type="checkbox"
                  checked={adminRemember}
                  onChange={(e) => setAdminRemember(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remember Officer Session</span>
              </label>

              <button
                type="button"
                onClick={() => setShowAdminMfa(!showAdminMfa)}
                className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                {showAdminMfa ? 'Hide 2FA' : 'Use 2FA Token'}
              </button>
            </div>

            {/* TOTP 2FA Token input */}
            {showAdminMfa && (
              <div className="p-3 bg-emerald-50/50 dark:bg-stone-800 rounded-xl border border-emerald-100 dark:border-stone-700 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-stone-300 block">
                  6-Digit Authenticator Token (TOTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={adminMfaCode}
                  onChange={(e) => setAdminMfaCode(e.target.value)}
                  placeholder="842109"
                  className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-700 rounded-lg text-xs font-mono font-bold tracking-widest text-center focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Admin Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20"
            >
              <span>{isSubmitting ? 'Verifying Clearance...' : 'Access TNPCB Regulatory Desk'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Quick autofill for Admin demo */}
            <div className="pt-3 border-t border-slate-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Admin Demo: admin@tnpcb.gov.in</span>
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('admin@tnpcb.gov.in');
                  setAdminPassword('adminPass2025');
                }}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Autofill Officer Login
              </button>
            </div>
          </form>
        )}

        {/* Footer Registration Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-stone-800">
          Manufacturing or processing plant in Tamil Nadu?{' '}
          <Link to="/register" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            Register your industrial facility
          </Link>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Recycle,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Handshake,
  Inbox,
  FileQuestion,
  Network,
  Award,
  AlertOctagon,
  Settings,
  ShieldCheck,
  Bell,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  FileCheck2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation, Language } from '../../i18n/translations';
import { StatusChip } from './StatusChip';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, logout, switchRoleForDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Vehicle Scheduled', desc: 'Cauvery Freight assigned truck TN-33-AU-8890 for Bagasse lot', unread: true },
    { id: '2', title: 'New RFQ Quote Received', desc: 'Cauvery Delta Rice Mill submitted quote ₹3,500/MT', unread: true },
  ]);

  const navLinks = [
    { to: '/marketplace', label: t('marketplace'), icon: ShoppingBag },
    { to: '/listings', label: t('listings'), icon: Package },
    { to: '/deals', label: t('deals'), icon: Handshake, badge: '3' },
    { to: '/requests', label: t('requests'), icon: Inbox },
    { to: '/rfq', label: t('rfq'), icon: FileQuestion },
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/network', label: t('symbiosisNetwork'), icon: Network },
    { to: '/impact', label: t('impactLeaderboard'), icon: Award },
    { to: '/complaints', label: t('complaints'), icon: AlertOctagon },
  ];

  const adminLinks = [
    { to: '/admin/verification', label: t('adminVerification'), icon: ShieldCheck, badge: '2' },
    { to: '/admin/complaints', label: t('adminComplaints'), icon: AlertTriangle },
    { to: '/admin/fraud', label: t('adminFraud'), icon: AlertOctagon },
    { to: '/admin/audit', label: t('adminAudit'), icon: FileCheck2 },
    { to: '/admin/emission-factors', label: t('adminEmissions'), icon: Recycle },
    { to: '/admin/analytics', label: t('adminAnalytics'), icon: LayoutDashboard },
  ];

  const status = profile?.status || 'pending';

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col">
      {/* Top Demo & Mock Notice Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between z-40 border-b border-emerald-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded uppercase">
            {t('mockBannerTitle')}
          </span>
          <span className="truncate hidden sm:inline">
            {t('mockBannerDesc')}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] opacity-80 hidden md:inline">Demo Persona:</span>
          <button
            onClick={() => switchRoleForDemo(user?.role === 'admin' ? 'industry' : 'admin')}
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-[11px] px-2.5 py-0.5 rounded border border-emerald-600 transition cursor-pointer"
          >
            Switch to {user?.role === 'admin' ? 'Industry (Kothari Bio)' : 'TNPCB Admin Desk'}
          </button>
        </div>
      </div>

      {/* Verification Status Warning Banner for Industry users */}
      {user?.role === 'industry' && status !== 'approved' && (
        <div
          className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
            status === 'pending'
              ? 'bg-amber-500/15 border-amber-300 text-amber-900 dark:text-amber-200'
              : status === 'rejected'
              ? 'bg-rose-500/15 border-rose-300 text-rose-900 dark:text-rose-200'
              : 'bg-stone-500/15 border-stone-300 text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {status === 'pending' && <Clock className="w-4 h-4 shrink-0 text-amber-600" />}
            {status === 'rejected' && <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>
              {status === 'pending' && t('statusPendingBanner')}
              {status === 'rejected' && t('statusRejectedBanner', { reason: profile?.rejectionReason || 'Document mismatch' })}
              {status === 'suspended' && t('statusSuspendedBanner')}
            </span>
          </div>
          <Link
            to="/onboarding"
            className="font-bold underline ml-2 shrink-0 hover:opacity-80"
          >
            Review Onboarding
          </Link>
        </div>
      )}

      {/* Main Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-stone-900 dark:text-white">
                  Re<span className="text-emerald-700 dark:text-emerald-500">Loop</span>
                </span>
                <span className="hidden sm:block text-[10px] text-stone-500 font-semibold tracking-wider uppercase">
                  Circular Symbiosis Exchange
                </span>
              </div>
            </Link>
          </div>

          {/* Quick desktop search and top controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md font-bold transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-400 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-1 rounded-md font-bold transition cursor-pointer ${
                  language === 'ta'
                    ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-400 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Dark/Light mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications popover toggle */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-xs font-bold">Notifications</span>
                    <button
                      onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
                      className="text-[10px] text-emerald-600 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2.5 text-xs">
                        <p className="font-bold text-stone-900 dark:text-white">{n.title}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Account menu */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
                <Link
                  to={user.role === 'admin' ? '/admin/verification' : '/settings'}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                    {user.role === 'admin' ? 'A' : user.industryName ? user.industryName[0] : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-xs font-bold block leading-none truncate max-w-[140px]">
                      {user.role === 'admin' ? 'TNPCB Admin' : user.industryName}
                    </span>
                    <span className="text-[10px] text-stone-500 leading-tight">
                      {user.role === 'admin' ? 'Regulatory Desk' : (profile?.district || 'Tamil Nadu')}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-emerald-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Layout with Desktop Sidebar & Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-60 shrink-0 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-3 shadow-xs">
            <span className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Exchange Operations
            </span>
            <nav className="mt-1 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Admin Desk Links */}
            {user?.role === 'admin' && (
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                <span className="px-3 py-1 text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  Regulatory Desk
                </span>
                <nav className="mt-1 space-y-1">
                  {adminLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              isActive ? 'bg-white text-amber-900' : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Utility links */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-1">
              <Link
                to="/settings"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  location.pathname === '/settings'
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{t('settings')}</span>
              </Link>
              <Link
                to="/feedback"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  location.pathname === '/feedback'
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{t('feedback')}</span>
              </Link>
            </div>
          </div>

          {/* Environmental passport quick banner */}
          <div className="bg-linear-to-br from-emerald-900 to-teal-950 p-4 rounded-2xl text-white space-y-2 text-xs border border-emerald-800 shadow-xs">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Material Passport</span>
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              Every dispatched lot is cryptographically logged with lab purity and CO2 savings proof.
            </p>
            <Link
              to="/passport/RLP-2025-BAG-TN08-041"
              className="inline-block mt-1 font-bold text-emerald-400 hover:text-emerald-300 underline text-[11px]"
            >
              View Sample QR Passport →
            </Link>
          </div>
        </aside>

        {/* Mobile Flyout Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="w-72 max-w-[85vw] h-full bg-white dark:bg-stone-900 p-4 space-y-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-3 border-b border-stone-200 dark:border-stone-800">
                <span className="font-bold text-base text-stone-900 dark:text-white">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-stone-800"
                  >
                    <link.icon className="w-4 h-4 text-emerald-600" />
                    <span>{link.label}</span>
                  </Link>
                ))}
                {user?.role === 'admin' && (
                  <>
                    <div className="pt-3 pb-1 text-xs font-bold text-amber-600 uppercase">Admin Desk</div>
                    {adminLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-50"
                      >
                        <link.icon className="w-4 h-4 text-amber-600" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic page content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 dark:text-white">ReLoop Platform</span>
            <span>·</span>
            <span>B2B Industrial Symbiosis & Circular Economy Network (Tamil Nadu & S. India)</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/passport/RLP-2025-BAG-TN08-041" className="hover:underline">Digital Passport Verification</Link>
            <Link to="/impact" className="hover:underline">CSR Certificate Registry</Link>
            <Link to="/feedback" className="hover:underline">Submit Feedback</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

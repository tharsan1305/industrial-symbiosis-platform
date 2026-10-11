import React, { useState, useEffect } from 'react';
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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  Shield,
  Factory,
  Eye,
  CheckCircle2,
  ExternalLink,
  Lock,
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

  // Sidebar visibility mode: 'full' | 'collapsed' | 'hidden'
  const [sidebarMode, setSidebarMode] = useState<'full' | 'collapsed' | 'hidden'>(() => {
    const saved = localStorage.getItem('reloop_sidebar_mode');
    if (saved === 'full' || saved === 'collapsed' || saved === 'hidden') return saved;
    return 'full';
  });

  const updateSidebarMode = (mode: 'full' | 'collapsed' | 'hidden') => {
    setSidebarMode(mode);
    localStorage.setItem('reloop_sidebar_mode', mode);
  };

  const toggleSidebarCollapse = () => {
    if (sidebarMode === 'hidden') {
      updateSidebarMode('full');
    } else if (sidebarMode === 'full') {
      updateSidebarMode('collapsed');
    } else {
      updateSidebarMode('full');
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Vehicle Scheduled', desc: 'Cauvery Freight assigned truck TN-33-AU-8890 for Bagasse lot', unread: true },
    { id: '2', title: 'New RFQ Quote Received', desc: 'Cauvery Delta Rice Mill submitted quote ₹3,500/MT', unread: true },
  ]);

  const navLinks = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/marketplace', label: t('marketplace'), icon: ShoppingBag },
    { to: '/listings', label: t('listings'), icon: Package },
    { to: '/deals', label: t('deals'), icon: Handshake, badge: '3' },
    { to: '/requests', label: t('requests'), icon: Inbox },
    { to: '/rfq', label: t('rfq'), icon: FileQuestion },
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Verification Status Banner (Only shown if pending/rejected for industry) */}
      {user?.role === 'industry' && status !== 'approved' && (
        <div
          className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
            status === 'pending'
              ? 'bg-amber-500/10 border-amber-200 text-amber-900 dark:text-amber-200'
              : status === 'rejected'
              ? 'bg-rose-500/10 border-rose-200 text-rose-900 dark:text-rose-200'
              : 'bg-slate-500/10 border-slate-200 text-slate-900'
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
            className="font-bold underline ml-2 shrink-0 hover:opacity-80 text-emerald-800 dark:text-emerald-300"
          >
            Review Onboarding
          </Link>
        </div>
      )}

      {/* Main Top Bar: Professional Clean White & Emerald Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100/90 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open mobile navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Dashboard Navigation / Sidebar Toggle Button (visible on md: and up) */}
            {user ? (
              <button
                onClick={toggleSidebarCollapse}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  sidebarMode === 'hidden'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 hover:bg-emerald-700'
                    : sidebarMode === 'collapsed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-400'
                    : 'bg-white text-emerald-800 border-emerald-200/90 hover:bg-emerald-50 dark:bg-slate-800 dark:border-slate-700'
                }`}
                title={
                  sidebarMode === 'hidden'
                    ? 'Open Dashboard Sidebar'
                    : sidebarMode === 'collapsed'
                    ? 'Expand Sidebar'
                    : 'Collapse Sidebar'
                }
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Dashboard</span>
                {sidebarMode === 'hidden' ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500 text-white font-extrabold uppercase">
                    Open
                  </span>
                ) : sidebarMode === 'collapsed' ? (
                  <PanelLeftOpen className="w-3.5 h-3.5 opacity-80" />
                ) : (
                  <PanelLeftClose className="w-3.5 h-3.5 opacity-80" />
                )}
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50 dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-400 shadow-2xs transition"
                title="Sign in required to access Operations Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Dashboard</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Sign In
                </span>
              </Link>
            )}

            {/* Logo: Crisp White & Emerald */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30 group-hover:scale-105 transition">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Re<span className="text-emerald-600">Loop</span>
                </span>
                <span className="hidden sm:block text-[9px] text-emerald-700 dark:text-emerald-400 font-bold tracking-wider uppercase">
                  Circular Industrial Exchange
                </span>
              </div>
            </Link>
          </div>

          {/* Right Controls: Role chip, Language, Theme, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick links when sidebar is hidden */}
            {sidebarMode === 'hidden' && (
              <div className="hidden lg:flex items-center gap-1 border-r border-emerald-100 dark:border-stone-800 pr-3 mr-1">
                <Link
                  to="/marketplace"
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition"
                >
                  Marketplace
                </Link>
                <Link
                  to="/deals"
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition"
                >
                  Deals
                </Link>
              </div>
            )}

            {/* Persona Switcher Pill (Clean Emerald Green - only for authenticated demo session) */}
            {user && (
              <button
                onClick={() => switchRoleForDemo(user.role === 'admin' ? 'industry' : 'admin')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
                title="Click to toggle between Industrial Member and TNPCB Admin view"
              >
                {user.role === 'admin' ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin Desk</span>
                  </>
                ) : (
                  <>
                    <Factory className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kothari Bio-Energy</span>
                  </>
                )}
              </button>
            )}

            {/* Language Toggle (EN / தமிழ்) */}
            <div className="flex items-center bg-slate-100 dark:bg-stone-800 p-0.5 rounded-xl border border-slate-200 dark:border-stone-700 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  language === 'ta'
                    ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Dark/Light mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Popover (only for authenticated user) */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-stone-800 transition relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.some((n) => n.unread) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white dark:ring-stone-900" />
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-emerald-100 dark:border-stone-800 p-3.5 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-stone-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                      <button
                        onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
                        className="text-[10px] text-emerald-600 hover:underline cursor-pointer font-semibold"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-stone-800 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="py-2.5 text-xs">
                          <p className="font-bold text-slate-900 dark:text-white">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-stone-800 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.role === 'admin' ? 'A' : user.industryName ? user.industryName[0] : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-xs font-bold block leading-none text-slate-900 dark:text-white truncate max-w-[130px]">
                      {user.role === 'admin' ? 'TNPCB Admin' : user.industryName}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-tight">
                      {user.role === 'admin' ? 'Regulatory Desk' : (profile?.district || 'Tamil Nadu')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-emerald-100 dark:border-stone-800 p-2 z-50 space-y-1 text-xs">
                    <div className="p-2 border-b border-slate-100 dark:border-stone-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                      <p className="text-[10px] text-emerald-700 capitalize font-semibold">{user.role} role</p>
                    </div>

                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-stone-800 transition"
                    >
                      <Settings className="w-4 h-4 text-emerald-600" />
                      <span>{t('settings')}</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        switchRoleForDemo(user.role === 'admin' ? 'industry' : 'admin');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition text-left cursor-pointer"
                    >
                      <Factory className="w-4 h-4 text-emerald-600" />
                      <span>Switch to {user.role === 'admin' ? 'Industry' : 'Admin'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-stone-300 hover:text-emerald-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs shadow-emerald-600/30 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Layout with Collapsible & Dismissible Desktop Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Responsive Collapsible Sidebar (Only shown when user is authenticated) */}
        {user && sidebarMode !== 'hidden' && (
          <aside
            className={`hidden md:block shrink-0 transition-all duration-300 ${
              sidebarMode === 'collapsed' ? 'w-20' : 'w-64'
            }`}
          >
            <div className="sticky top-22 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100/90 dark:border-slate-800 p-3.5 shadow-sm shadow-emerald-950/5 space-y-4">
              {/* Sidebar Header with Dashboard Icon & Close Buttons */}
              <div className="flex items-center justify-between px-2 pt-1 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  {sidebarMode === 'full' && (
                    <div>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 block leading-tight">
                        Dashboard
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                        Operations
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Toggle Collapse */}
                  <button
                    onClick={toggleSidebarCollapse}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                    title={sidebarMode === 'collapsed' ? 'Expand Sidebar' : 'Collapse to Icons'}
                  >
                    {sidebarMode === 'collapsed' ? (
                      <ChevronRight className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <PanelLeftClose className="w-4 h-4 text-slate-600" />
                    )}
                  </button>

                  {/* Complete Close / Hide Sidebar Button */}
                  <button
                    onClick={() => updateSidebarMode('hidden')}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                    title="Close Sidebar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Exchange Operations Links */}
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      title={sidebarMode === 'collapsed' ? link.label : undefined}
                      className={`flex items-center rounded-2xl text-xs font-semibold transition group ${
                        sidebarMode === 'collapsed'
                          ? 'justify-center p-3'
                          : 'justify-between px-3.5 py-2.5'
                      } ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-700/25 font-bold'
                          : 'text-slate-600 dark:text-stone-400 hover:bg-emerald-50/70 dark:hover:bg-stone-800 hover:text-emerald-800 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                        {sidebarMode === 'full' && <span className="truncate">{link.label}</span>}
                      </div>

                      {sidebarMode === 'full' && link.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white text-emerald-800'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Admin Desk Links (if admin role) */}
              {user?.role === 'admin' && (
                <div className="pt-3 border-t border-slate-100 dark:border-stone-800">
                  {sidebarMode === 'full' && (
                    <span className="px-2 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                      Regulatory Desk
                    </span>
                  )}
                  <nav className="mt-1 space-y-1">
                    {adminLinks.map((link) => {
                      const isActive = location.pathname === link.to;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          title={sidebarMode === 'collapsed' ? link.label : undefined}
                          className={`flex items-center rounded-2xl text-xs font-semibold transition group ${
                            sidebarMode === 'collapsed'
                              ? 'justify-center p-3'
                              : 'justify-between px-3.5 py-2.5'
                          } ${
                            isActive
                              ? 'bg-amber-600 text-white shadow-xs font-bold'
                              : 'text-slate-600 dark:text-stone-400 hover:bg-amber-50 dark:hover:bg-stone-800 hover:text-amber-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                            {sidebarMode === 'full' && <span className="truncate">{link.label}</span>}
                          </div>
                          {sidebarMode === 'full' && link.badge && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
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

              {/* Utility / Settings Links */}
              <div className="pt-3 border-t border-slate-100 dark:border-stone-800 space-y-1">
                <Link
                  to="/settings"
                  title={sidebarMode === 'collapsed' ? t('settings') : undefined}
                  className={`flex items-center rounded-2xl text-xs font-semibold transition ${
                    sidebarMode === 'collapsed' ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                  } ${
                    location.pathname === '/settings'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-600 dark:text-stone-400 hover:bg-emerald-50/70 dark:hover:bg-stone-800 hover:text-emerald-800'
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0 text-slate-500" />
                  {sidebarMode === 'full' && <span>{t('settings')}</span>}
                </Link>
                <Link
                  to="/feedback"
                  title={sidebarMode === 'collapsed' ? t('feedback') : undefined}
                  className={`flex items-center rounded-2xl text-xs font-semibold transition ${
                    sidebarMode === 'collapsed' ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                  } ${
                    location.pathname === '/feedback'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-600 dark:text-stone-400 hover:bg-emerald-50/70 dark:hover:bg-stone-800 hover:text-emerald-800'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 shrink-0 text-slate-500" />
                  {sidebarMode === 'full' && <span>{t('feedback')}</span>}
                </Link>
              </div>
            </div>
          </aside>
        )}

        {/* If sidebar is completely hidden and user is authenticated, provide floating restore pill */}
        {user && sidebarMode === 'hidden' && (
          <div className="fixed bottom-6 left-6 z-40 hidden md:block">
            <button
              onClick={() => updateSidebarMode('full')}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-xl shadow-emerald-700/30 transition hover:scale-105 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open Dashboard Sidebar</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        )}

        {/* Mobile Flyout Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="w-72 max-w-[85vw] h-full bg-white dark:bg-stone-900 p-5 space-y-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-3 border-b border-emerald-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                    <Recycle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">ReLoop Navigation</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Auth Status Callout */}
              {!user && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Login Required for Dashboard</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2 text-center text-xs font-bold bg-white text-emerald-800 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2 text-center text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-stone-800 hover:text-emerald-800"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-4 h-4 text-emerald-600" />
                      <span>{link.label}</span>
                    </div>
                    {!user && link.to !== '/marketplace' && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </Link>
                ))}

                {user?.role === 'admin' && (
                  <>
                    <div className="pt-3 pb-1 text-xs font-bold text-amber-700 uppercase">TNPCB Admin</div>
                    {adminLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-50"
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

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Footer: Crisp White & Emerald */}
      <footer className="mt-auto border-t border-emerald-100/80 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">ReLoop Platform</span>
            <span>·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">B2B Circular Industrial Symbiosis & Material Passport Exchange</span>
          </div>
          <div className="flex items-center gap-4 font-semibold text-slate-600 dark:text-slate-400">
            <Link to="/passport/RLP-2025-BAG-TN08-041" className="hover:text-emerald-700">Digital Passport Verification</Link>
            <Link to="/impact" className="hover:text-emerald-700">CSR Green Registry</Link>
            <Link to="/feedback" className="hover:text-emerald-700">Feedback</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

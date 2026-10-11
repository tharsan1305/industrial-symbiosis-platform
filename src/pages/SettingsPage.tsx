import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation, Language } from '../i18n/translations';
import {
  Settings,
  Shield,
  KeyRound,
  Globe,
  Bell,
  Smartphone,
  LogOut,
  CheckCircle2,
  QrCode,
  Laptop,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { language, setLanguage } = useTranslation();

  const [activeTab, setActiveTab] = useState<'security' | 'profile' | 'preferences'>('security');
  const [totpEnabled, setTotpEnabled] = useState(user?.isMfaEnabled || true);
  const [showTotpEnrollModal, setShowTotpEnrollModal] = useState(false);
  const [testOtp, setTestOtp] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Active sessions mock list
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'Chrome on macOS (Current)', ip: '157.48.210.14', location: 'Tiruchirappalli, India', current: true },
    { id: 'sess-2', device: 'ReLoop PWA on Android', ip: '49.207.218.66', location: 'Erode, India', current: false },
  ]);

  const handleLogoutAllOther = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    alert('Logged out all other remote sessions.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      <div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-white">
          Account & Security Settings
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage regulatory credentials, TOTP two-factor authentication, active sessions, and notification channels
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'security'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Security & 2FA MFA
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Industry Facility Profile
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'preferences'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Language & Alerts
        </button>
      </div>

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* TOTP 2FA card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-600" />
                  TOTP Two-Factor Authentication (2FA)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Protects legal signatures, bank settlement details, and hazardous waste dispatch authorisations
                </p>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  totpEnabled
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {totpEnabled ? 'MFA ACTIVE' : 'DISABLED'}
              </span>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  Authenticator App (Google Authenticator / Authy)
                </span>
                <span className="text-stone-500">
                  {totpEnabled ? 'Configured with 6-digit rotating time-based tokens' : 'Not configured'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTotpEnrollModal(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition cursor-pointer"
              >
                {totpEnabled ? 'Re-enroll Authenticator' : 'Enroll 2FA Now'}
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-emerald-600" />
                  Active Device Sessions
                </h3>
                <p className="text-xs text-stone-500">Authorized browsers and mobile terminals logged into your facility account</p>
              </div>
              <button
                onClick={handleLogoutAllOther}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Log Out All Other Devices
              </button>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {sessions.map((sess) => (
                <div key={sess.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white block">{sess.device}</span>
                    <span className="text-stone-500">{sess.location} · IP: {sess.ip}</span>
                  </div>
                  {sess.current ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      This Device
                    </span>
                  ) : (
                    <button
                      onClick={() => setSessions((prev) => prev.filter((s) => s.id !== sess.id))}
                      className="text-stone-400 hover:text-rose-600 font-semibold"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">Facility Compliance Record</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-stone-500 block">Facility Name:</span>
              <span className="font-bold text-stone-900 dark:text-white">{profile?.name}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Sector Category:</span>
              <span className="font-bold text-stone-900 dark:text-white">{profile?.category}</span>
            </div>
            <div>
              <span className="text-stone-500 block">GSTIN:</span>
              <span className="font-mono font-bold">{profile?.gstin}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Factory License:</span>
              <span className="font-mono font-bold">{profile?.factoryLicenseNo}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">Language & Regional Formatting</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setLanguage('en')}
              className={`p-4 rounded-xl border text-left flex-1 font-bold ${
                language === 'en' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-stone-200'
              }`}
            >
              English (India - INR ₹)
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`p-4 rounded-xl border text-left flex-1 font-bold ${
                language === 'ta' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-stone-200'
              }`}
            >
              தமிழ் (Tamil Nadu)
            </button>
          </div>
        </div>
      )}

      {/* 2FA Enrollment Modal */}
      {showTotpEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-stone-900 max-w-sm w-full p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Enroll TOTP Authenticator
            </h3>
            <p className="text-xs text-stone-500">
              Scan this QR code with Google Authenticator or Microsoft Authenticator
            </p>

            {/* QR Mockup */}
            <div className="w-40 h-40 mx-auto p-2 border-2 border-stone-900 rounded-2xl bg-white flex items-center justify-center">
              <QrCode className="w-32 h-32 text-emerald-900" />
            </div>

            <p className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300">
              KEY: JBSWY3DPEHPK3PXP
            </p>

            <div className="space-y-2">
              <input
                type="text"
                maxLength={6}
                value={testOtp}
                onChange={(e) => setTestOtp(e.target.value)}
                placeholder="Enter 6-digit code to verify"
                className="w-full px-3.5 py-2 text-center font-mono font-bold text-base bg-stone-50 dark:bg-stone-800 border rounded-xl"
              />
              <button
                type="button"
                onClick={() => {
                  setTotpEnabled(true);
                  setShowTotpEnrollModal(false);
                }}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
              >
                Verify & Activate MFA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

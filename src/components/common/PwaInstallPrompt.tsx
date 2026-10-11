import React, { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('reloop_pwa_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Register Service Worker if supported
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {});
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem('reloop_pwa_dismissed', 'true');
      } catch {}
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('reloop_pwa_dismissed', 'true');
    } catch {}
  };

  if (isInstalled || isDismissed) return null;

  return (
    <aside
      aria-label="Install ReLoop PWA"
      className="fixed bottom-4 right-4 z-30 max-w-sm w-[calc(100vw-2rem)] sm:w-auto bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl shadow-xl shadow-emerald-950/10 p-3.5 flex items-center gap-3 transition-all"
    >
      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 shrink-0">
        <Smartphone className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 dark:text-white">Install ReLoop PWA</p>
        <p className="text-[11px] text-slate-500 dark:text-stone-400 truncate">Offline passport scans & live alerts</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          aria-label="Install ReLoop App"
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss ReLoop PWA Banner"
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-stone-800 rounded-lg transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};


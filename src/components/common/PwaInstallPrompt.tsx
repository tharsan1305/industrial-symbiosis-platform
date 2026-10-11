import React, { useState, useEffect } from 'react';
import { Download, Check, X, Smartphone } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('SW registered successfully', reg.scope))
        .catch((err) => console.log('SW registration error:', err));
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
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

  if (isInstalled || isDismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm bg-white dark:bg-stone-900 border border-emerald-500/40 rounded-xl shadow-xl p-3.5 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
        <Smartphone className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-stone-900 dark:text-white">Install ReLoop PWA</p>
        <p className="text-[11px] text-stone-500 truncate">Access offline passport scans & rapid listings</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleInstallClick}
          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
        >
          Install
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-stone-400 hover:text-stone-600 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

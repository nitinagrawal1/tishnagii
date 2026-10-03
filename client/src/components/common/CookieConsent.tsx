import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ShieldCheck, X } from 'lucide-react';
import { handleInternalLinkClick } from '../../utils/navigation';

export const CookieConsent: React.FC = () => {
  const { navigateTo } = useShop();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('tishnagii_cookie_consent');
      if (!consent) {
        // Show after a subtle dwell period (2 seconds)
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem('tishnagii_cookie_consent', type);
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie & Privacy Consent"
      className="fixed bottom-[calc(1rem_+_env(safe-area-inset-bottom))] left-[calc(1rem_+_env(safe-area-inset-left))] right-[calc(1rem_+_env(safe-area-inset-right))] z-40 rounded-xs border border-[#C49A45]/40 bg-[#2A0814] p-4 text-[#FAF7F2] shadow-2xl transition-[opacity,transform] animate-fade-in touch-manipulation md:left-[calc(1.5rem_+_env(safe-area-inset-left))] md:right-auto md:max-w-md"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#C49A45] shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-[#D4AE58] font-semibold">
              Privacy & Cookies
            </span>
            <button
              type="button"
              onClick={() => handleAccept('essential')}
              className="flex min-h-11 min-w-11 items-center justify-center text-[#FAF7F2]/50 hover:text-[#FAF7F2] p-0.5 cursor-pointer -mr-1"
              aria-label="Dismiss privacy notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#FAF7F2]/80 leading-relaxed font-light">
            We use essential cookies to maintain your shopping bag and wishlist securely. No third-party data profiling or ad trackers are deployed.{' '}
            <a
              href="/privacy"
              onClick={(event) => handleInternalLinkClick(event, () => navigateTo('privacy'))}
              className="inline-flex min-h-11 items-center text-[#D4AE58] hover:underline"
            >
              Read our Privacy Charter
            </a>
            .
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleAccept('all')}
              className="min-h-11 px-4 bg-[#C49A45] hover:bg-[#D4AE58] text-[#2A0814] text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
            >
              Accept Preferences
            </button>
            <button
              type="button"
              onClick={() => handleAccept('essential')}
              className="min-h-11 px-3 border border-[#380E1C] hover:border-[#C49A45]/40 text-[#FAF7F2]/80 text-[11px] uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

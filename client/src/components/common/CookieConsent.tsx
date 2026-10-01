import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ShieldCheck, X } from 'lucide-react';

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
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40 bg-[#2A0814] text-[#FAF7F2] border border-[#C49A45]/40 rounded-xs shadow-2xl p-4 transition-all animate-fade-in"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#C49A45] shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-[#D4AE58] font-semibold">
              Privacy & Cookies
            </span>
            <button
              onClick={() => handleAccept('essential')}
              className="text-[#FAF7F2]/50 hover:text-[#FAF7F2] p-0.5 cursor-pointer -mr-1"
              aria-label="Dismiss privacy notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#FAF7F2]/80 leading-relaxed font-light">
            We use essential cookies to maintain your shopping bag and wishlist securely. No third-party data profiling or ad trackers are deployed.{' '}
            <button
              onClick={() => navigateTo('privacy')}
              className="text-[#D4AE58] hover:underline cursor-pointer"
            >
              Read our Privacy Charter
            </button>
            .
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleAccept('all')}
              className="py-1.5 px-4 bg-[#C49A45] hover:bg-[#D4AE58] text-[#2A0814] text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
            >
              Accept Preferences
            </button>
            <button
              onClick={() => handleAccept('essential')}
              className="py-1.5 px-3 border border-[#380E1C] hover:border-[#C49A45]/40 text-[#FAF7F2]/80 text-[11px] uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

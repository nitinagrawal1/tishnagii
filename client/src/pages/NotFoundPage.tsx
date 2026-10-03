import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Compass } from 'lucide-react';
import { handleInternalLinkClick } from '../utils/navigation';

export const NotFoundPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-[#F4EFEA] border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45] mx-auto font-serif text-3xl">
        ति
      </div>

      <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block">
        404 · Uncharted Route
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#2A0814] leading-tight">
        The Piece You Seek Has Returned to Our Vault
      </h1>

      <p className="text-xs sm:text-sm text-[#4A1525]/75 font-light leading-relaxed max-w-md mx-auto">
        The page or collection you are looking for may have been moved, renamed, or temporarily reserved. Allow us to guide you back to our curated jewellery suites.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <a
          href="/"
          onClick={(event) => handleInternalLinkClick(event, () => navigateTo('home'))}
          className="flex min-h-11 w-full items-center justify-center rounded-xs bg-[#2A0814] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] transition-colors hover:bg-[#380E1C] sm:w-auto"
        >
          Return to Sanctuary (Home)
        </a>
        <a
          href="/shop"
          onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop'))}
          className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xs border border-[#EADBCE] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#2A0814] transition-colors hover:bg-[#F4EFEA] sm:w-auto"
        >
          <span>Explore All Jewellery</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

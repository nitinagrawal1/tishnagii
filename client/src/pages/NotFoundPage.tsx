import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Compass } from 'lucide-react';

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
        <button
          onClick={() => navigateTo('home')}
          className="w-full sm:w-auto py-3 px-6 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
        >
          Return to Sanctuary (Home)
        </button>
        <button
          onClick={() => navigateTo('shop')}
          className="w-full sm:w-auto py-3 px-6 border border-[#EADBCE] text-[#2A0814] hover:bg-[#F4EFEA] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Explore All Jewellery</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

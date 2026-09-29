import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ASSETS } from '../../data/mockData';

export const PreFooterCTA: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section className="bg-[#FAF7F2] py-8 sm:py-12 md:py-16 px-3 sm:px-6 lg:px-8 border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto">
        {/* Outer Framed Matting with Thin Outline Border matching reference aesthetic */}
        <div className="bg-[#FAF7F2] p-2 sm:p-3 md:p-3.5 border border-[#2A0814]/30 rounded-xs shadow-sm">
          
          {/* Inner Image Container with High-Flash Candid Banquet Photography */}
          <div className="relative overflow-hidden aspect-[16/7] sm:aspect-[21/9] md:aspect-[24/9] min-h-[280px] sm:min-h-[340px] md:min-h-[400px] flex items-center justify-center text-center rounded-xs group">
            
            {/* Banquet Table Background Image */}
            <img
              src={ASSETS.banquetCelebrationTable}
              alt="Celebratory feast table with TISHNAGII handcrafted jewellery and crystal tableware"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center select-none group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />

            {/* Darkened Cinematic Contrast Vignette for Crisp White Typography */}
            <div className="absolute inset-0 bg-black/45 sm:bg-black/40 backdrop-blur-[0.5px] transition-colors group-hover:bg-black/40" />

            {/* Centered Editorial Typography Overlay */}
            <div className="relative z-10 px-4 max-w-3xl mx-auto space-y-4 sm:space-y-5">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[72px] font-normal tracking-tight text-[#FAF7F2] leading-[1.08] drop-shadow-md">
                <span>want </span>
                <span className="italic font-light tracking-wide text-white drop-shadow-sm font-serif">
                  tishnagii
                </span>
                <span> on</span>
                <br />
                <span>your menu?</span>
              </h2>

              {/* Dotted Underline Inquiry Link matching reference design */}
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={() => navigateTo('contact')}
                  className="inline-block font-serif text-xs sm:text-sm md:text-base text-[#FAF7F2] hover:text-[#D4AE58] transition-colors border-b border-dotted border-white/80 hover:border-[#D4AE58] pb-1 cursor-pointer tracking-wider font-light"
                >
                  Wholesale Inquiries
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ASSETS } from '../../data/mockData';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BoldGraphicHero: React.FC = () => {
  const { navigateTo } = useShop();

  const tickerItems = [
    { text: '22K Antique Micron Gold', bold: true },
    { text: 'Jaipur Karigari', bold: false },
    { text: '100% Hypoallergenic Brass', bold: true },
    { text: 'Zero Bank Locker Fear', bold: false },
    { text: 'Transit Insured Express', bold: true },
    { text: '7-Day Doorstep Returns', bold: false },
    { text: 'Persian Meenakari Enamelling', bold: true },
    { text: 'Hydro-Cut Nizam Polki', bold: false },
    { text: 'No Heavy Ear Tension', bold: true },
    { text: 'Signature Velvet Box', bold: false },
  ];

  return (
    <section className="w-full px-3 sm:px-6 md:px-8 pt-2 sm:pt-4 pb-4">
      {/* Massive Rounded Hero Card */}
      <div className="relative rounded-[26px] sm:rounded-[36px] overflow-hidden min-h-[580px] sm:min-h-[660px] md:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-[#18050D] shadow-2xl select-none">
        
        {/* Full-bleed Candid Background Image */}
        <img
          src={ASSETS.heroCandidKundan}
          alt="Artisanal 22K Kundan choker necklace being fastened in an intimate moment"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-[center_35%] select-none scale-100 hover:scale-[1.01] transition-transform duration-1000 ease-out"
        />

        {/* Cinematic Film Vignette & Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60 pointer-events-none" />

        {/* UPPER ROW: 3-Line Punchy Statement (Left) & Narrative + CTA Pill (Right) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2 sm:pt-4">
          
          {/* Left: Punchy 3-line statement */}
          <div className="lg:col-span-7">
            <h1 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-[58px] text-white leading-[1.08] tracking-tight drop-shadow-md">
              Real Heritage.<br />
              Antique 22K Finish.<br />
              Zero Locker Fear.
            </h1>
          </div>

          {/* Right: Narrative Story & Pill Action Button */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-start space-y-4 pt-1 sm:pt-2">
            <p className="text-xs sm:text-sm md:text-[15px] text-white/90 font-normal leading-relaxed max-w-sm drop-shadow-sm">
              Tishnagii pairs centuries-old Jaipur karigari with hypoallergenic brass matrices and 22-karat antique micron gold to liberate royal adornment for the modern woman.
            </p>

            <button
              onClick={() => navigateTo('shop')}
              className="mt-2 inline-flex items-center gap-2 bg-[#C84414] hover:bg-[#D94F1D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-8 rounded-full shadow-xl hover:scale-105 transition-all cursor-pointer group"
            >
              <span>Shop Tishnagii</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* LOWER ROW: Colossal Bold Graphic Wordmark spanning bottom edge */}
        <div className="relative z-10 w-full text-center overflow-hidden leading-none pt-12 pb-0 -mb-2 sm:-mb-5 md:-mb-7 pointer-events-none select-none">
          <span className="font-sans font-black text-[17vw] sm:text-[16vw] md:text-[15.5vw] leading-[0.72] tracking-tighter text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] block lowercase">
            tishnagii
          </span>
        </div>

      </div>

      {/* 3. Infinite Smooth Marquee Ticker running right below the card */}
      <div className="w-full bg-[#FAF7F2] text-[#2A0814] py-3.5 overflow-hidden border-y border-[#EADBCE] mt-3 rounded-xl shadow-xs">
        <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap text-xs sm:text-[13px] tracking-wider uppercase">
          {/* Loop twice for continuous infinite marquee */}
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-8 sm:gap-12 shrink-0">
              <span className={item.bold ? 'font-bold text-[#2A0814]' : 'font-normal text-[#4A1525]/75'}>
                {item.text}
              </span>
              <span className="text-[#C49A45] font-serif text-sm">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

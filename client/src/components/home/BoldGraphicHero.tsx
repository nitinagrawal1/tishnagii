import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ASSETS } from '@shared/data/mockData';
import { ArrowRight } from 'lucide-react';

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
      <div className="w-full rounded-[26px] border border-[#EADBCE] bg-[#FAF7F2] p-4 sm:rounded-[36px] sm:p-7 md:p-10 lg:p-12 xl:p-14">
        <div className="grid min-w-0 grid-cols-1 items-start gap-6 pb-8 sm:gap-8 sm:pb-10 md:pb-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-center lg:gap-12 xl:gap-16">
          <h1 className="font-serif text-3xl font-medium leading-[1.02] text-[#2A0814] sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl">
            <span className="block">Real Heritage.</span>
            <span className="block">Antique 22K Finish.</span>
            <span className="block">Made for Today.</span>
          </h1>

          <div className="flex min-w-0 flex-col items-start gap-5 sm:gap-6 lg:pt-2">
            <p className="max-w-md text-sm leading-7 text-[#59463F] sm:text-base md:text-lg md:leading-8">
              Centuries-old Jaipur karigari meets hypoallergenic brass and 22-karat antique micron gold for modern adornment.
            </p>

            <button
              onClick={() => navigateTo('shop')}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#2A0814] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] transition-colors hover:bg-[#380E1C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C49A45] sm:text-sm group"
            >
              <span>Shop Tishnagii</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl">
          <img
            src={ASSETS.heroCandidKundan}
            alt="Artisanal 22K Kundan choker necklace being fastened in an intimate moment"
            referrerPolicy="no-referrer"
            className="block h-auto w-full select-none"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-1 pb-2 sm:pb-3 md:pb-8">
            <span className="block whitespace-nowrap font-sans text-[clamp(2rem,14.5vw,14rem)] font-black leading-none text-white drop-shadow-md">
              TISHNAGII
            </span>
          </div>
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

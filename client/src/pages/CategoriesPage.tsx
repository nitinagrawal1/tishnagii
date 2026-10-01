import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '@shared/data/mockData';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block">
          The Jewellery Suites
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#2A0814]">
          Our Craftsmanship Categories
        </h1>
        <p className="text-xs sm:text-sm text-[#4A1525]/75 font-light leading-relaxed">
          From regal polki chokers to delicate temple jhumkas, explore our meticulously curated jewellery suites engineered with heritage Rajasthani craftsmanship.
        </p>
      </div>

      {/* Categories Grid (Asymmetrical / Editorial aesthetic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((category) => (
          <div
            key={category.id}
            onClick={() => navigateTo('shop', undefined, category.id)}
            className="group cursor-pointer bg-[#FAF7F2] border border-[#EADBCE] rounded-xs overflow-hidden flex flex-col justify-between hover:border-[#C49A45] hover:shadow-lg transition-all duration-300"
          >
            {/* Visual Container */}
            <div className="relative aspect-4/3 overflow-hidden bg-[#F4EFEA]">
              <img
                src={category.image}
                alt={category.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0814]/70 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[#FAF7F2]">
                <span className="text-xs font-serif tracking-wider text-[#D4AE58]">
                  {category.hindiName}
                </span>
                <span className="text-[11px] font-mono tabular-nums bg-[#2A0814]/80 px-2 py-0.5 border border-[#380E1C] rounded-xs">
                  {category.itemCount} Designs
                </span>
              </div>
            </div>

            {/* Editorial Content */}
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#C49A45] font-medium mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{category.featureTag}</span>
                </div>
                <h2 className="font-serif text-2xl font-medium text-[#2A0814] group-hover:text-[#4A1525] transition-colors">
                  {category.name}
                </h2>
                <p className="text-xs text-[#4A1525]/75 mt-2 leading-relaxed font-light">
                  {category.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-[#EADBCE] flex items-center justify-between text-xs font-semibold text-[#2A0814] group-hover:text-[#C49A45] transition-colors">
                <span>Explore This Suite</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

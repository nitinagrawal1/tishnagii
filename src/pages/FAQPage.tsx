import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FAQS } from '../data/mockData';
import { AskAwayFAQ } from '../components/home/AskAwayFAQ';
import { Plus, X, Search, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { navigateTo } = useShop();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Orders & Shipping',
    'Jewellery Care',
    'Materials & Quality',
    'Custom Bridal',
    'Returns & Exchange',
  ];

  const filteredFaqs = FAQS.filter((faq) => {
    if (activeCategory !== 'All' && faq.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-16">
      {/* 1. Primary "Ask Away" Editorial Showcase (Matching Reference Design) */}
      <AskAwayFAQ />

      {/* 2. Detailed Searchable Knowledge Directory */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C49A45] font-semibold block">
            Jaipur Atelier Knowledge Base
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2A0814]">
            Browse by Topic or Search Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-[#4A1525]/75 font-light max-w-lg mx-auto">
            Deep-dive into our hallmarking standards, shipping logistics, international customs, and return policies.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <Search className="w-4 h-4 text-[#4A1525]/50 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search e.g. tarnish, COD, shipping time, hypoallergenic..."
            className="w-full bg-[#FAF7F2] border border-[#EADBCE] pl-10 pr-4 py-2.5 text-xs text-[#2A0814] placeholder-[#4A1525]/40 rounded-xs focus:outline-none focus:border-[#C49A45]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#EADBCE]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#2A0814] text-[#FAF7F2]'
                  : 'bg-[#F4EFEA] text-[#2A0814] hover:bg-[#EADBCE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Category Accordion */}
        <div className="divide-y divide-[#EADBCE] border-y border-[#EADBCE]">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="group py-1">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full py-4 sm:py-5 text-left flex items-start justify-between gap-4 cursor-pointer hover:text-[#C49A45] transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#C49A45] font-semibold block">
                        {faq.category}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg text-[#2A0814] group-hover:text-[#C49A45] font-normal leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <span className="shrink-0 pt-1 text-[#4A1525]/60 group-hover:text-[#C49A45]">
                      {isOpen ? (
                        <X className="w-4 h-4 stroke-[1.5]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[1.5]" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-5 text-xs sm:text-sm text-[#4A1525]/85 leading-relaxed font-light animate-fade-in pr-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#F4EFEA] rounded-xs p-6 space-y-2">
              <HelpCircle className="w-8 h-8 text-[#C49A45] mx-auto" />
              <p className="font-serif text-base text-[#2A0814]">No questions matched your search.</p>
              <p className="text-xs text-[#4A1525]/60">
                Our Jaipur Concierge is available to answer any custom inquiry.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="p-8 bg-[#2A0814] text-[#FAF7F2] rounded-xs text-center space-y-4 shadow-sm border border-[#380E1C]">
          <div className="w-10 h-10 rounded-full bg-[#C49A45]/20 text-[#C49A45] flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FAF7F2]">
            Still Have a Specific Question?
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF7F2]/75 max-w-md mx-auto font-light leading-relaxed">
            Our master artisans and bridal stylists are available for 1-on-1 video consultations, custom dori cord adjustments, and trousseau pairings.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('contact')}
              className="py-3 px-8 bg-[#FAF7F2] hover:bg-[#EADBCE] text-[#2A0814] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Connect with Our Concierge</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

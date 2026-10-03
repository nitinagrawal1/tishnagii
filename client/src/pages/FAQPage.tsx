import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FAQS } from '@shared/data/mockData';
import { AskAwayFAQ } from '../components/home/AskAwayFAQ';
import { Plus, X, Search, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import { handleInternalLinkClick } from '../utils/navigation';

export const FAQPage: React.FC = () => {
  const { navigateTo } = useShop();
  const categories = [
    'All',
    'Orders & Shipping',
    'Jewellery Care',
    'Materials & Quality',
    'Custom Bridal',
    'Returns & Exchange',
  ];

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const category = new URLSearchParams(window.location.search).get('category');
    return category && categories.includes(category) ? category : 'All';
  });
  const [openQuestion, setOpenQuestion] = useState<string | null>(() => {
    const question = new URLSearchParams(window.location.search).get('faq');
    return question && FAQS.some((faq) => faq.question === question) ? question : null;
  });
  const [searchQuery, setSearchQuery] = useState(
    () => new URLSearchParams(window.location.search).get('q') || '',
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeCategory === 'All') url.searchParams.delete('category');
    else url.searchParams.set('category', activeCategory);
    if (openQuestion) url.searchParams.set('faq', openQuestion);
    else url.searchParams.delete('faq');
    if (searchQuery) url.searchParams.set('q', searchQuery);
    else url.searchParams.delete('q');
    window.history.replaceState(window.history.state, '', url);
  }, [activeCategory, openQuestion, searchQuery]);

  useEffect(() => {
    const restoreUrlState = () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      const question = params.get('faq');
      setActiveCategory(category && categories.includes(category) ? category : 'All');
      setSearchQuery(params.get('q') || '');
      setOpenQuestion(question && FAQS.some((faq) => faq.question === question) ? question : null);
    };
    window.addEventListener('popstate', restoreUrlState);
    return () => window.removeEventListener('popstate', restoreUrlState);
  }, []);

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
            name="faq-search"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search frequently asked questions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search e.g. tarnish, COD, shipping time…"
            className="w-full bg-[#FAF7F2] border border-[#EADBCE] pl-10 pr-4 py-2.5 text-xs text-[#2A0814] placeholder-[#4A1525]/40 rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#EADBCE]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenQuestion(null);
              }}
              aria-pressed={activeCategory === cat}
              className={`min-h-11 px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
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
            filteredFaqs.map((faq) => {
              const faqIndex = FAQS.indexOf(faq);
              const questionId = `faq-question-${faqIndex}`;
              const answerId = `faq-answer-${faqIndex}`;
              const isOpen = openQuestion === faq.question;
              return (
                <div key={faq.question} className="group py-1">
                  <h3>
                    <button
                      id={questionId}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenQuestion(isOpen ? null : faq.question)}
                      className="flex min-h-11 w-full cursor-pointer items-start justify-between gap-4 py-4 text-left transition-colors hover:text-[#C49A45] sm:py-5"
                    >
                      <span className="space-y-1">
                        <span className="block text-[10px] uppercase tracking-wider text-[#C49A45] font-semibold">
                          {faq.category}
                        </span>
                        <span className="block font-serif text-base sm:text-lg text-[#2A0814] group-hover:text-[#C49A45] font-normal leading-snug">
                          {faq.question}
                        </span>
                      </span>
                      <span aria-hidden="true" className="shrink-0 pt-1 text-[#4A1525]/60 group-hover:text-[#C49A45]">
                        {isOpen ? (
                          <X className="w-4 h-4 stroke-[1.5]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[1.5]" />
                        )}
                      </span>
                    </button>
                  </h3>

                  {isOpen && (
                    <div id={answerId} role="region" aria-labelledby={questionId} className="pb-5 text-xs sm:text-sm text-[#4A1525]/85 leading-relaxed font-light animate-fade-in pr-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#F4EFEA] rounded-xs p-6 space-y-2" role="status">
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
            <a
              href="/contact"
              onClick={(event) => handleInternalLinkClick(event, () => navigateTo('contact'))}
              className="inline-flex min-h-11 items-center gap-2 rounded-xs bg-[#FAF7F2] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[#2A0814] transition-colors hover:bg-[#EADBCE]"
            >
              <span>Connect with Our Concierge</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

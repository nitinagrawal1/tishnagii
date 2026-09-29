import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS, CATEGORIES, BLOG_POSTS } from '../../data/mockData';
import { Search, X, ArrowRight, Tag, BookOpen } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingProducts = trimmed
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.tags.some((t) => t.toLowerCase().includes(trimmed)) ||
          p.description.toLowerCase().includes(trimmed)
      )
    : [];

  const matchingCategories = trimmed
    ? CATEGORIES.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.description.toLowerCase().includes(trimmed)
      )
    : [];

  const matchingArticles = trimmed
    ? BLOG_POSTS.filter(
        (b) =>
          b.title.toLowerCase().includes(trimmed) ||
          b.tags.some((t) => t.toLowerCase().includes(trimmed))
      )
    : [];

  const popularSearches = ['Kundan Choker', 'Temple Jhumkas', 'Bridal Suite', 'Meenakari Kadas', 'Chaand Tikka'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-xs shadow-2xl border border-[#EADBCE] z-10 overflow-hidden">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-[#EADBCE] flex items-center gap-3 bg-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#C49A45] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search polki chokers, temple jhumkas, bridal sets..."
            className="w-full bg-transparent text-sm sm:text-base text-[#2A0814] placeholder-[#4A1525]/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#4A1525]/50 hover:text-[#2A0814] text-xs p-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="p-1 text-[#2A0814] hover:text-[#C49A45] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Searches when query is empty */}
        {!query && (
          <div className="p-6 space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#4A1525]/60 font-semibold">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 text-xs text-[#2A0814] bg-[#F4EFEA] hover:bg-[#EADBCE] border border-[#EADBCE] rounded-xs transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#EADBCE]">
              <p className="text-xs uppercase tracking-widest text-[#4A1525]/60 font-semibold mb-3">
                Featured Suites
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('shop', undefined, cat.id);
                    }}
                    className="p-2 text-left bg-[#F4EFEA]/60 hover:bg-[#F4EFEA] border border-[#EADBCE]/60 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-serif text-[#2A0814]">{cat.name}</span>
                    <span className="text-[10px] text-[#C49A45]">Explore</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results view when query is typed */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
            {/* Products matches */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
                <span className="text-xs uppercase tracking-widest text-[#4A1525]/70 font-semibold">
                  Jewellery Creations ({matchingProducts.length})
                </span>
              </div>
              {matchingProducts.length === 0 ? (
                <p className="text-xs text-[#4A1525]/60 py-3">No matching pieces found.</p>
              ) : (
                <div className="divide-y divide-[#EADBCE]/60">
                  {matchingProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateTo('product-detail', prod.slug);
                      }}
                      className="py-3 flex items-center justify-between hover:bg-[#F4EFEA] px-2 rounded-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-xs border border-[#EADBCE] shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-serif font-medium text-[#2A0814]">
                            {prod.name}
                          </h4>
                          <span className="text-[11px] text-[#C49A45]">
                            {prod.categoryLabel}
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums text-xs font-semibold text-[#2A0814]">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Matching Categories */}
            {matchingCategories.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 pb-2 border-b border-[#EADBCE] text-xs uppercase tracking-widest text-[#4A1525]/70 font-semibold">
                  <Tag className="w-3.5 h-3.5 text-[#C49A45]" />
                  <span>Collections ({matchingCategories.length})</span>
                </div>
                <div className="divide-y divide-[#EADBCE]/60">
                  {matchingCategories.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateTo('shop', undefined, c.id);
                      }}
                      className="flex items-start justify-between gap-2 rounded-xs px-2 py-2.5 hover:bg-[#F4EFEA] cursor-pointer"
                    >
                      <span className="text-xs font-medium text-[#2A0814]">{c.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C49A45]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Articles */}
            {matchingArticles.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 pb-2 border-b border-[#EADBCE] text-xs uppercase tracking-widest text-[#4A1525]/70 font-semibold">
                  <BookOpen className="w-3.5 h-3.5 text-[#C49A45]" />
                  <span>Journal Stories ({matchingArticles.length})</span>
                </div>
                <div className="divide-y divide-[#EADBCE]/60">
                  {matchingArticles.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateTo('blog-detail', b.slug);
                      }}
                      className="py-2.5 flex items-center justify-between hover:bg-[#F4EFEA] px-2 rounded-xs cursor-pointer"
                    >
                      <span className="min-w-0 flex-1 break-words text-xs font-serif text-[#2A0814]">
                        {b.title}
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-[10px] text-[#4A1525]/60">
                        {b.readTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

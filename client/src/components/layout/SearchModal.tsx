import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS, CATEGORIES, BLOG_POSTS } from '@shared/data/mockData';
import { Search, X, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { handleInternalLinkClick } from '../../utils/navigation';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useDialogFocus<HTMLElement>(isSearchOpen, () => setIsSearchOpen(false), {
    initialFocus: () => window.matchMedia('(min-width: 768px)').matches ? inputRef.current : null,
  });

  useEffect(() => {
    if (!isSearchOpen) setQuery('');
  }, [isSearchOpen]);

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
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-20 flex justify-center items-start">
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
        aria-label="Close search"
      />

      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-xs shadow-2xl border border-[#EADBCE] z-10 overflow-hidden"
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-[#EADBCE] flex items-center gap-3 bg-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#C49A45] shrink-0" />
          <h2 id="search-dialog-title" className="sr-only">Search TISHNAGII</h2>
          <input
            ref={inputRef}
            name="search"
            type="text"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search products, collections, and articles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search polki chokers, temple jhumkas, bridal sets…"
            className="w-full bg-transparent text-sm sm:text-base text-[#2A0814] placeholder-[#4A1525]/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#4A1525]/50 hover:text-[#2A0814] text-xs p-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
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
                  type="button"
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
                    type="button"
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
          <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-4 space-y-6">
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
                    <a
                      key={prod.id}
                      href={`/product/${prod.slug}`}
                      onClick={(event) => handleInternalLinkClick(event, () => {
                        setIsSearchOpen(false);
                        navigateTo('product-detail', prod.slug);
                      })}
                      className="flex min-h-14 items-center justify-between rounded-xs px-2 py-3 transition-colors hover:bg-[#F4EFEA]"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          width={48}
                          height={48}
                          loading="lazy"
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
                        <span className="tabular-nums">₹{prod.price.toLocaleString('en-IN')}</span>
                      </div>
                    </a>
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
                    <a
                      key={c.id}
                      href={`/shop?category=${encodeURIComponent(c.id)}`}
                      onClick={(event) => handleInternalLinkClick(event, () => {
                        setIsSearchOpen(false);
                        navigateTo('shop', undefined, c.id);
                      })}
                      className="flex min-h-11 items-start justify-between gap-2 rounded-xs px-2 py-2.5 hover:bg-[#F4EFEA]"
                    >
                      <span className="text-xs font-medium text-[#2A0814]">{c.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C49A45]" />
                    </a>
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
                    <a
                      key={b.id}
                      href={`/blog/${b.slug}`}
                      onClick={(event) => handleInternalLinkClick(event, () => {
                        setIsSearchOpen(false);
                        navigateTo('blog-detail', b.slug);
                      })}
                      className="flex min-h-11 items-center justify-between rounded-xs px-2 py-2.5 hover:bg-[#F4EFEA]"
                    >
                      <span className="min-w-0 flex-1 break-words text-xs font-serif text-[#2A0814]">
                        {b.title}
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-[10px] text-[#4A1525]/60">
                        {b.readTime}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {query && matchingProducts.length === 0 && matchingCategories.length === 0 && matchingArticles.length === 0 && (
              <p className="px-4 pb-5 text-sm text-[#4A1525]/70" role="status">
                No results for “{query.trim()}”. Try a product name, collection, or jewellery style.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

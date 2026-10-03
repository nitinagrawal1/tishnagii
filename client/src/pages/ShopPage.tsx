import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES } from '@shared/data/mockData';
import { ProductCard } from '../components/common/ProductCard';
import { RotateCcw, Search, Sparkles, ArrowUpDown } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { currentCategorySlug, navigateTo } = useShop();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('category') || currentCategorySlug || 'all';
    }
    return currentCategorySlug || 'all';
  });
  const [sortBy, setSortBy] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('sort') || 'featured';
    }
    return 'featured';
  });
  const [inStockOnly, setInStockOnly] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('inStock') === 'true';
    }
    return false;
  });
  const [searchFilter, setSearchFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('q') || '';
    }
    return '';
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (selectedCategory !== 'all') url.searchParams.set('category', selectedCategory);
    else url.searchParams.delete('category');
    if (sortBy !== 'featured') url.searchParams.set('sort', sortBy);
    else url.searchParams.delete('sort');

    if (inStockOnly) url.searchParams.set('inStock', 'true');
    else url.searchParams.delete('inStock');
    if (searchFilter.trim()) url.searchParams.set('q', searchFilter);
    else url.searchParams.delete('q');

    window.history.replaceState(window.history.state, '', url);
  }, [selectedCategory, sortBy, inStockOnly, searchFilter]);

  // Handle category change if passed from props or state
  React.useEffect(() => {
    setSelectedCategory(currentCategorySlug || 'all');
  }, [currentCategorySlug]);

  React.useEffect(() => {
    const restoreFiltersFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      const sort = params.get('sort');
      setSelectedCategory(
        category && CATEGORIES.some((item) => item.id === category) ? category : 'all',
      );
      setSortBy(
        sort && ['price-low', 'price-high', 'rating', 'newest'].includes(sort)
          ? sort
          : 'featured',
      );
      setInStockOnly(params.get('inStock') === 'true');
      setSearchFilter(params.get('q') || '');
    };
    window.addEventListener('popstate', restoreFiltersFromUrl);
    return () => window.removeEventListener('popstate', restoreFiltersFromUrl);
  }, []);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // In stock filter
      if (inStockOnly && !product.inStock) return false;

      // Search keyword filter
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, sortBy, inStockOnly, searchFilter]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSortBy('featured');
    setInStockOnly(false);
    setSearchFilter('');
  };

  const currentCategoryInfo = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Category Header Banner */}
      <div className="bg-[#2A0814] text-[#FAF7F2] p-8 sm:p-12 rounded-xs border border-[#380E1C] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AE58] font-medium block">
            {currentCategoryInfo ? currentCategoryInfo.hindiName : 'सम्पूर्ण आभूषण संग्रह'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#FAF7F2]">
            {currentCategoryInfo ? currentCategoryInfo.name : 'Artisanal Jewellery Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
            {currentCategoryInfo
              ? currentCategoryInfo.description
              : 'Handcrafted in hypoallergenic brass with 22K antique micron gold and oxidised silver finishes, engineered for effortless royal celebrations.'}
          </p>
        </div>
      </div>

      {/* Interactive Category Segmented Tabs */}
      <div className="shop-collection-filters flex w-full min-w-0 snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain pb-3 scrollbar-none border-b border-[#EADBCE]" role="group" aria-label="Filter by collection">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          aria-pressed={selectedCategory === 'all'}
          className={`min-h-11 shrink-0 snap-start rounded-xs border px-4 py-2 text-[13px] font-semibold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'border-[#C49A45] bg-[#2A0814] text-[#FAF7F2]'
              : 'border-transparent bg-[#F4EFEA] text-[#2A0814] hover:bg-[#EADBCE]'
          }`}
        >
          All Jewellery ({PRODUCTS.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            aria-pressed={selectedCategory === cat.id}
            className={`min-h-11 shrink-0 snap-start rounded-xs border px-4 py-2 text-[13px] font-semibold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'border-[#C49A45] bg-[#2A0814] text-[#FAF7F2]'
                : 'border-transparent bg-[#F4EFEA] text-[#2A0814] hover:bg-[#EADBCE]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Control Bar: Search refinement, In-Stock, Sort */}
      <div className="bg-[#FAF7F2] p-4 border border-[#EADBCE] rounded-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Refinement */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#4A1525]/50 absolute left-3 top-2.5" />
          <label htmlFor="shop-search" className="sr-only">Search products in this collection</label>
          <input
            id="shop-search"
            name="q"
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search this collection, e.g. kundan…"
            className="min-h-11 w-full bg-[#F4EFEA] border border-[#EADBCE] pl-9 pr-12 py-1.5 text-xs text-[#2A0814] placeholder-[#4A1525]/40 rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45]"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-1 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-xs text-[#4A1525]/70 hover:text-[#2A0814]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters & Sorting Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort By Selector */}
          <div className="flex items-center gap-1.5 text-sm text-[#2A0814]">
            <span className="text-[#4A1525]/60 hidden sm:inline">Sort:</span>
            <select
              name="sort"
              aria-label="Sort products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="min-h-11 bg-[#F4EFEA] border border-[#EADBCE] px-3 py-1.5 text-sm text-[#2A0814] rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45] cursor-pointer"
            >
              <option value="featured">Featured Suites</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>

          {/* In Stock Only Checkbox */}
          <label className="flex min-h-11 items-center gap-2 text-sm text-[#2A0814] cursor-pointer select-none">
            <input
              name="inStock"
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="size-5 accent-[#380E1C] rounded-xs"
            />
            <span>In Stock Only</span>
          </label>

          {/* Reset Filters */}
          {(selectedCategory !== 'all' || inStockOnly || searchFilter) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-[#4A1525] hover:text-[#C49A45] underline ml-auto sm:ml-0 cursor-pointer touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Count & Feedback */}
      <h2 className="sr-only">Handcrafted jewellery designs</h2>
      <div aria-live="polite" className="flex flex-col gap-1 text-xs text-[#4A1525]/70 font-mono sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="min-w-0">
          Showing <strong className="text-[#2A0814]">{filteredProducts.length}</strong> handcrafted pieces
        </span>
        <span className="min-w-0 break-words text-[#C49A45] sm:text-right">
          All pieces include lifetime plating care support
        </span>
      </div>

      {/* Product Grid (3-4 columns balanced) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-[#F4EFEA] border border-[#EADBCE] rounded-xs p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45] mx-auto font-serif text-2xl">
            ति
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-[#2A0814] tabular-nums">
              No Pieces Found
            </h3>
            <p className="text-xs text-[#4A1525]/70 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="py-2 px-6 bg-[#2A0814] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#380E1C] transition-colors cursor-pointer touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

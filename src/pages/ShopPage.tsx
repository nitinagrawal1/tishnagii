import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';
import { RotateCcw, Search, Sparkles, ArrowUpDown } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { currentCategorySlug, navigateTo } = useShop();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentCategorySlug || 'all'
  );
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Handle category change if passed from props or state
  React.useEffect(() => {
    if (currentCategorySlug) {
      setSelectedCategory(currentCategorySlug);
    }
  }, [currentCategorySlug]);

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
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#EADBCE]">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#2A0814] text-[#FAF7F2]'
              : 'bg-[#F4EFEA] text-[#2A0814] hover:bg-[#EADBCE]'
          }`}
        >
          All Jewellery ({PRODUCTS.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#2A0814] text-[#FAF7F2]'
                : 'bg-[#F4EFEA] text-[#2A0814] hover:bg-[#EADBCE]'
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
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search within this collection..."
            className="w-full bg-[#F4EFEA] border border-[#EADBCE] pl-9 pr-3 py-1.5 text-xs text-[#2A0814] placeholder-[#4A1525]/40 rounded-xs focus:outline-none focus:border-[#C49A45]"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-2 text-[10px] text-[#4A1525]/60 hover:text-[#2A0814]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters & Sorting Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort By Selector */}
          <div className="flex items-center gap-1.5 text-xs text-[#2A0814]">
            <span className="text-[#4A1525]/60 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F4EFEA] border border-[#EADBCE] px-3 py-1.5 text-xs text-[#2A0814] rounded-xs focus:outline-none focus:border-[#C49A45] cursor-pointer"
            >
              <option value="featured">Featured Suites</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>

          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-1.5 text-xs text-[#2A0814] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#380E1C] rounded-xs"
            />
            <span>In Stock Only</span>
          </label>

          {/* Reset Filters */}
          {(selectedCategory !== 'all' || inStockOnly || searchFilter) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-[#4A1525] hover:text-[#C49A45] underline ml-auto sm:ml-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Count & Feedback */}
      <div className="flex items-center justify-between text-xs text-[#4A1525]/70 font-mono">
        <span>
          Showing <strong className="text-[#2A0814]">{filteredProducts.length}</strong> handcrafted pieces
        </span>
        <span className="text-[#C49A45]">All pieces include lifetime plating care support</span>
      </div>

      {/* Product Grid (3-4 columns balanced) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-[#F4EFEA] border border-[#EADBCE] rounded-xs p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45] mx-auto font-serif text-2xl">
            ति
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-[#2A0814]">
              No Pieces Found
            </h3>
            <p className="text-xs text-[#4A1525]/70 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="py-2 px-6 bg-[#2A0814] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#380E1C] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};


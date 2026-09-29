import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { addToCart, toggleWishlist, isInWishlist, navigateTo, showToast } = useShop();

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'care' | 'reviews'>('specs');

  // Review submission state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState(product.reviews);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please provide your name and review remarks', 'error');
      return;
    }
    const createdReview = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      location: newReviewCity.trim() || 'India',
      rating: newReviewRating,
      title: 'Verified Customer Review',
      comment: newReviewComment.trim(),
      date: 'Just now',
      verified: true,
    };
    setReviewsList([createdReview, ...reviewsList]);
    setReviewSubmitted(true);
    setNewReviewAuthor('');
    setNewReviewCity('');
    setNewReviewComment('');
    showToast('Thank you for sharing your experience!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation (Unboxed text with /) */}
      <nav className="flex items-center gap-2 text-xs text-[#4A1525]/60 font-medium">
        <button
          onClick={() => navigateTo('home')}
          className="hover:text-[#2A0814] transition-colors"
        >
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={() => navigateTo('shop')}
          className="hover:text-[#2A0814] transition-colors"
        >
          All Jewellery
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={() => navigateTo('shop', undefined, product.category)}
          className="hover:text-[#2A0814] transition-colors"
        >
          {product.categoryLabel}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#2A0814] truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Contiguous Purchase Module & Gallery (Desktop: 2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Visual Gallery (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Display Viewport */}
          <div className="relative aspect-4/3 sm:aspect-square bg-[#F4EFEA] border border-[#EADBCE] rounded-xs overflow-hidden shadow-xs">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={`${product.name} detailed view`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* In Stock & Plating Stamp */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#2A0814] bg-[#FAF7F2]/90 backdrop-blur-xs px-2.5 py-1 border border-[#EADBCE]">
                {product.inStock ? 'Ready for Dispatch' : 'Vault Reserved'}
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-[#C49A45] bg-[#2A0814]/90 backdrop-blur-xs px-2.5 py-1 border border-[#380E1C]">
                22K Antique Micron Plated
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xs border overflow-hidden shrink-0 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#C49A45] ring-2 ring-[#C49A45]/30'
                      : 'border-[#EADBCE] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module (5 cols on desktop, sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C49A45] text-[#C49A45]" />
                <span className="font-mono tabular-nums text-xs font-semibold text-[#2A0814]">
                  {product.rating}
                </span>
                <span className="text-xs text-[#4A1525]/60">
                  ({reviewsList.length} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2A0814] font-medium leading-tight">
              {product.name}
            </h1>

            {product.hindiName && (
              <p className="text-sm font-light text-[#4A1525]/60">
                {product.hindiName}
              </p>
            )}
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-[#F4EFEA] border border-[#EADBCE] rounded-xs flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#2A0814] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-mono text-sm text-[#4A1525]/50 line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discountPercent > 0 && (
              <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                Save {product.discountPercent}%
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#4A1525]/80 leading-relaxed font-light">
            {product.description}
          </p>

          {product.editorialNote && (
            <div className="p-3 bg-[#FAF7F2] border-l-2 border-[#C49A45] text-xs text-[#2A0814] italic">
              "{product.editorialNote}"
            </div>
          )}

          {/* Quantity Selector & Purchase CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#EADBCE] bg-[#FAF7F2] rounded-xs h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 text-[#2A0814] hover:bg-[#F4EFEA] h-full transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-sm px-4 tabular-nums font-semibold text-[#2A0814]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 text-[#2A0814] hover:bg-[#F4EFEA] h-full transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Primary Add to Cart Button */}
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 h-12 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              {/* Wishlist Toggle Button */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Save to Wishlist"
                className={`w-12 h-12 rounded-xs border flex items-center justify-center transition-colors cursor-pointer ${
                  isFavorited
                    ? 'bg-[#4A1525] border-[#4A1525] text-[#FAF7F2]'
                    : 'border-[#EADBCE] bg-[#FAF7F2] text-[#2A0814] hover:border-[#C49A45]'
                }`}
              >
                <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Quick buy / COD note */}
            <div className="flex items-center justify-between text-[11px] text-[#4A1525]/70 pt-1">
              <span>COD Available · Free Express Delivery</span>
              <span className="text-emerald-800 font-medium">In Stock ({product.stockCount} left)</span>
            </div>
          </div>

          {/* PDP Trust Markers */}
          <div className="border-t border-[#EADBCE] pt-4 space-y-2 text-xs text-[#2A0814]/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C49A45] shrink-0" />
              <span>Ships next business day in signature velvet presentation box</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C49A45] shrink-0" />
              <span>100% Hypoallergenic — Zero Lead, Nickel or Cadmium</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#C49A45] shrink-0" />
              <span>7-Day Doorstep Reverse Pickup & Exchange Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications / Care / Reviews */}
      <div className="border-t border-[#EADBCE] pt-12">
        <div className="flex items-center gap-4 sm:gap-8 border-b border-[#EADBCE] pb-3 text-sm">
          <button
            onClick={() => setActiveTab('specs')}
            className={`font-serif pb-2 text-base sm:text-lg transition-colors cursor-pointer relative ${
              activeTab === 'specs'
                ? 'text-[#2A0814] font-medium'
                : 'text-[#4A1525]/60 hover:text-[#2A0814]'
            }`}
          >
            <span>Jewellery Specifications</span>
            {activeTab === 'specs' && (
              <span className="absolute bottom-[-13px] inset-x-0 h-0.5 bg-[#C49A45]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('care')}
            className={`font-serif pb-2 text-base sm:text-lg transition-colors cursor-pointer relative ${
              activeTab === 'care'
                ? 'text-[#2A0814] font-medium'
                : 'text-[#4A1525]/60 hover:text-[#2A0814]'
            }`}
          >
            <span>Artisan Care & Storage</span>
            {activeTab === 'care' && (
              <span className="absolute bottom-[-13px] inset-x-0 h-0.5 bg-[#C49A45]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`font-serif pb-2 text-base sm:text-lg transition-colors cursor-pointer relative ${
              activeTab === 'reviews'
                ? 'text-[#2A0814] font-medium'
                : 'text-[#4A1525]/60 hover:text-[#2A0814]'
            }`}
          >
            <span>Verified Reviews ({reviewsList.length})</span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-[-13px] inset-x-0 h-0.5 bg-[#C49A45]" />
            )}
          </button>
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div className="py-8 max-w-3xl">
            <dl className="divide-y divide-[#EADBCE]/60 text-xs sm:text-sm">
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-[#4A1525]/70">Base Matrix Metal</dt>
                <dd className="sm:col-span-2 text-[#2A0814]">
                  {product.specifications.metalBase}
                </dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-[#4A1525]/70">Plating & Shield</dt>
                <dd className="sm:col-span-2 text-[#2A0814]">
                  {product.specifications.plating}
                </dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-[#4A1525]/70">Stones & Embellishments</dt>
                <dd className="sm:col-span-2 text-[#2A0814]">
                  {product.specifications.stones}
                </dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-[#4A1525]/70">Finish & Reverse</dt>
                <dd className="sm:col-span-2 text-[#2A0814]">
                  {product.specifications.finish}
                </dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-[#4A1525]/70">Weight</dt>
                <dd className="sm:col-span-2 text-[#2A0814] font-mono tabular-nums">
                  {product.specifications.weightGrams} grams
                </dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-[#4A1525]/70">Dimensions</dt>
                <dd className="sm:col-span-2 text-[#2A0814]">
                  {product.specifications.dimensions}
                </dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-[#4A1525]/70">Fastening / Closure</dt>
                <dd className="sm:col-span-2 text-[#2A0814]">
                  {product.specifications.closure}
                </dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-[#4A1525]/70">Hypoallergenic Certified</dt>
                <dd className="sm:col-span-2 text-emerald-800 font-medium">
                  {product.specifications.hypoallergenic ? 'Yes — Skin friendly & tested' : 'Standard'}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Tab 2: Care & Storage */}
        {activeTab === 'care' && (
          <div className="py-8 max-w-3xl space-y-4 text-xs sm:text-sm text-[#4A1525]/80 leading-relaxed font-light">
            <p>
              To ensure your TISHNAGII piece preserves its original royal sheen across seasons, follow our Karigar preservation rituals:
            </p>
            <ul className="space-y-3 list-disc pl-5">
              <li>
                <strong>Last On, First Off:</strong> Wear your jewellery only after perfumes, cosmetics, and hairsprays have settled completely.
              </li>
              <li>
                <strong>Dry Microfibre Wipe:</strong> After each wear, wipe away perspiration and ambient dust using the soft lint-free chamois provided.
              </li>
              <li>
                <strong>Airtight Storage:</strong> Always store individual pieces separated in the cushioned zip-pouch inside the TISHNAGII velvet chest to prevent friction and humidity.
              </li>
              <li>
                <strong>No Water Immersion:</strong> Never wash artificial jewellery in water, soap, or chemical cleaners.
              </li>
            </ul>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[#C49A45]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#4A1525]/60 font-mono">{rev.date}</span>
                  </div>
                  <h4 className="font-serif text-sm font-medium text-[#2A0814]">{rev.title}</h4>
                  <p className="text-xs text-[#4A1525]/80 leading-relaxed font-light">
                    "{rev.comment}"
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#4A1525]/60">
                    <span>
                      {rev.author} · {rev.location}
                    </span>
                    {rev.verified && (
                      <span className="text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5 bg-[#F4EFEA] p-6 border border-[#EADBCE] rounded-xs h-fit space-y-4">
              <h4 className="font-serif text-lg font-medium text-[#2A0814]">
                Share Your Experience
              </h4>
              {reviewSubmitted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  Thank you! Your verified review has been published.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#2A0814] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Radhika M."
                      className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-1.5 text-xs text-[#2A0814] rounded-xs focus:outline-none focus:border-[#C49A45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#2A0814] mb-1">Your City</label>
                    <input
                      type="text"
                      value={newReviewCity}
                      onChange={(e) => setNewReviewCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-1.5 text-xs text-[#2A0814] rounded-xs focus:outline-none focus:border-[#C49A45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#2A0814] mb-1">Rating</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-1.5 text-xs text-[#2A0814] rounded-xs focus:outline-none focus:border-[#C49A45]"
                    >
                      <option value={5}>5 Stars - Royal Perfection</option>
                      <option value={4}>4 Stars - Very Satisfied</option>
                      <option value={3}>3 Stars - Average</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#2A0814] mb-1">Review Remarks *</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="How did the piece look and feel during your event?"
                      className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-1.5 text-xs text-[#2A0814] rounded-xs focus:outline-none focus:border-[#C49A45]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#EADBCE] pt-12 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold block mb-0.5">
                Coordinated Adornments
              </span>
              <h2 className="font-serif text-2xl font-medium text-[#2A0814]">
                Complete The Royal Suite
              </h2>
            </div>
            <button
              onClick={() => navigateTo('shop', undefined, product.category)}
              className="text-xs font-semibold text-[#2A0814] hover:text-[#C49A45] transition-colors"
            >
              View More in {product.categoryLabel}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Buy Bar on Mobile (Ecommerce Guideline Compliance) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EADBCE] p-3 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[11px] text-[#4A1525]/70 line-clamp-1">{product.name}</span>
          <span className="font-mono text-sm font-bold text-[#2A0814] tabular-nums">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>
        <button
          onClick={() => addToCart(product, 1)}
          className="py-2.5 px-6 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
};

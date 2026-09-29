import React, { useState } from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist } = useShop();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentImage =
    isHovered && product.images.length > 1
      ? product.images[1]
      : product.images[0];

  return (
    <div
      className="group relative flex flex-col bg-[#FAF7F2] border border-[#EADBCE] rounded-sm overflow-hidden transition-all duration-300 hover:border-[#C49A45]/60 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Container (65-75% height) */}
      <div className="relative aspect-4/3 sm:aspect-square bg-[#F4EFEA] overflow-hidden">
        {!imageError ? (
          <img
            src={currentImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F4EFEA]">
            <div className="w-12 h-12 rounded-full border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45] mb-2 font-serif text-lg">
              ति
            </div>
            <p className="font-serif text-xs text-[#2A0814]/70">{product.name}</p>
          </div>
        )}

        {/* Quiet, unboxed subtle status tag (Zero-pill rule: not a pill, simple clean text) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.isBestSeller && (
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#2A0814] bg-[#FAF7F2]/90 backdrop-blur-xs px-2 py-0.5 border border-[#EADBCE]">
              Bestseller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#4A1525] bg-[#FAF7F2]/90 backdrop-blur-xs px-2 py-0.5 border border-[#EADBCE]">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isFavorited
              ? 'bg-[#4A1525] text-[#FAF7F2]'
              : 'bg-[#FAF7F2]/80 hover:bg-[#FAF7F2] text-[#2A0814] hover:text-[#4A1525]'
          }`}
        >
          <Heart className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View & Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={() => navigateTo('product-detail', product.slug)}
            className="flex-1 py-2 px-3 bg-[#FAF7F2]/95 hover:bg-[#FAF7F2] text-[#2A0814] text-xs font-medium tracking-wide border border-[#EADBCE] rounded-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
          <button
            onClick={() => addToCart(product)}
            className="py-2 px-3 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs font-medium tracking-wide rounded-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          {/* Category kicker & rating (Clean unboxed metadata) */}
          <div className="flex items-center justify-between text-xs text-[#4A1525]/70 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-medium text-[#C49A45]">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#C49A45] text-[#C49A45]" />
              <span className="font-mono tabular-nums text-[11px] text-[#2A0814] font-medium">
                {product.rating}
              </span>
              <span className="text-[10px] text-[#4A1525]/50">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => navigateTo('product-detail', product.slug)}
            className="font-serif text-base text-[#1C1819] hover:text-[#4A1525] font-medium transition-colors cursor-pointer break-words leading-snug"
          >
            {product.name}
          </h3>

          {/* Hindi Script subtitled mark */}
          {product.hindiName && (
            <p className="text-[11px] text-[#4A1525]/60 font-light mt-0.5">
              {product.hindiName}
            </p>
          )}
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-3 mt-2 border-t border-[#EADBCE]/60 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono tabular-nums text-base font-semibold text-[#2A0814]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="font-mono tabular-nums text-xs text-[#4A1525]/50 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="sm:hidden text-xs text-[#2A0814] font-medium underline hover:text-[#C49A45] cursor-pointer"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

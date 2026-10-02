import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigateTo, addToCart } = useShop();

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => addToCart(product, 1));
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${wishlist.length > 0 ? 'py-12 space-y-10' : 'py-20'}`}>
      {/* Header */}
      {wishlist.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#EADBCE] gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block mb-1">
            Curated Treasures
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#2A0814]">
            My Saved Creations
          </h1>
          <p className="text-xs text-[#4A1525]/70 mt-1 font-light">
            {wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'} saved in your private vault
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="py-2.5 px-6 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add All To Bag</span>
          </button>
        )}
        </div>
      )}

      {/* Grid or Empty State */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart className="w-7 h-7" />}
          title="Your Wishlist is Empty"
          description="Explore our royal Kundan chokers, temple jhumkas, and bridal suites, and tap the heart icon on any creation to save it here."
          actionLabel="Explore Jewellery Collections"
          onAction={() => navigateTo('shop')}
        />
      )}
    </div>
  );
};

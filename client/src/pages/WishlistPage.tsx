import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigateTo, addToCart } = useShop();

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => addToCart(product, 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
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
            className="py-2.5 px-6 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add All To Bag</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#F4EFEA] border border-[#EADBCE] rounded-xs p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45] mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#2A0814]">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-[#4A1525]/70 mt-1.5 max-w-sm mx-auto font-light leading-relaxed">
              Explore our royal Kundan chokers, temple jhumkas, and bridal suites, and tap the heart icon on any creation to save it here.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="py-3 px-8 bg-[#2A0814] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#380E1C] transition-colors cursor-pointer"
          >
            Explore Jewellery Collections
          </button>
        </div>
      )}
    </div>
  );
};

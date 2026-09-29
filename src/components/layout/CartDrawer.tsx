import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartCount,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    finalTotal,
    navigateTo,
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon) return;
    const res = applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCoupon('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EADBCE] flex items-center justify-between bg-[#F4EFEA]">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-medium text-[#2A0814]">Your Shopping Bag</h2>
            <span className="text-xs font-mono text-[#4A1525]/70 tabular-nums">
              ({cartCount} {cartCount === 1 ? 'piece' : 'pieces'})
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close cart"
            className="p-1.5 text-[#2A0814] hover:text-[#C49A45] rounded-full hover:bg-[#EADBCE]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-[#2A0814] text-[#FAF7F2] text-xs">
          {amountNeededForFreeShipping > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span>Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> for Free Express Delivery</span>
                <span className="text-[#C49A45] font-mono tabular-nums">{Math.round(shippingProgress)}%</span>
              </div>
              <div className="w-full bg-[#1B060D] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#C49A45] h-full transition-all duration-300"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#D4AE58]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>You have unlocked <strong>Free Pan-India Express Delivery</strong>!</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F4EFEA] border border-[#EADBCE] flex items-center justify-center text-[#C49A45] font-serif text-2xl">
                ति
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-[#2A0814]">Your bag is empty</h3>
                <p className="text-xs text-[#4A1525]/70 mt-1 max-w-xs">
                  Immerse yourself in our handcrafted polki, Kundan, and temple jewellery suites.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('shop');
                }}
                className="py-2.5 px-6 bg-[#2A0814] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium hover:bg-[#380E1C] transition-colors cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 pb-4 border-b border-[#EADBCE] last:border-0"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-xs border border-[#EADBCE] shrink-0 bg-[#F4EFEA]"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4
                        onClick={() => {
                          setIsCartDrawerOpen(false);
                          navigateTo('product-detail', product.slug);
                        }}
                        className="text-xs font-serif font-medium text-[#2A0814] hover:text-[#C49A45] line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        aria-label="Remove item"
                        className="text-[#4A1525]/40 hover:text-red-700 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-[#4A1525]/60 uppercase tracking-wider">
                      {product.categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#EADBCE] bg-[#FAF7F2] rounded-xs">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1 hover:bg-[#F4EFEA] text-[#2A0814] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs px-2.5 tabular-nums font-medium text-[#2A0814]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1 hover:bg-[#F4EFEA] text-[#2A0814] transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right font-mono tabular-nums">
                      <span className="text-xs font-semibold text-[#2A0814]">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#EADBCE] bg-[#F4EFEA] space-y-3">
            {/* Coupon Code Section */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between text-xs bg-[#FAF7F2] p-2 border border-[#C49A45]/50 text-[#2A0814] rounded-xs">
                  <div className="flex items-center gap-1.5 text-[#C49A45]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{couponCode}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-700 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon (e.g. ROYAL10)"
                    className="flex-1 bg-[#FAF7F2] border border-[#EADBCE] px-3 py-1.5 text-xs text-[#2A0814] placeholder-[#4A1525]/40 rounded-xs uppercase focus:outline-none focus:border-[#C49A45]"
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-3 bg-[#2A0814] text-[#FAF7F2] text-xs font-medium rounded-xs hover:bg-[#380E1C] cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#4A1525]/80 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Royal Privilege Discount</span>
                  <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Insured Shipping</span>
                <span className="tabular-nums">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#2A0814] pt-2 border-t border-[#EADBCE]">
                <span>Total Amount</span>
                <span className="tabular-nums font-mono text-base">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('cart');
                }}
                className="w-full py-2 bg-transparent text-[#2A0814] hover:text-[#C49A45] text-xs font-medium text-center transition-colors cursor-pointer"
              >
                View Detailed Cart Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

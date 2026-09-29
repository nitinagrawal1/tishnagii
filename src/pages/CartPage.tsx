import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, Truck } from 'lucide-react';

interface CartPageProps {
  onOpenCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onOpenCheckout }) => {
  const {
    cart,
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

  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon) return;
    const res = applyCoupon(inputCoupon);
    if (!res.success) setCouponError(res.message);
    else setInputCoupon('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center py-20 bg-[#F4EFEA] border border-[#EADBCE] rounded-xs p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45] mx-auto font-serif text-2xl">
            ति
          </div>
          <div>
            <h2 className="font-serif text-2xl font-medium text-[#2A0814]">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs text-[#4A1525]/70 mt-1 max-w-sm mx-auto font-light leading-relaxed">
              Discover our timeless polki, Kundan, and temple jewellery suites to adorn your special moments.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="py-3 px-8 bg-[#2A0814] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#380E1C] transition-colors cursor-pointer"
          >
            Explore All Jewellery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="pb-4 border-b border-[#EADBCE]">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block mb-1">
          Review Order
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#2A0814]">
          Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="p-4 bg-[#2A0814] text-[#FAF7F2] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {amountNeeded > 0 ? (
          <div className="space-y-1.5 flex-1 max-w-xl">
            <div className="flex justify-between">
              <span>Add <strong>₹{amountNeeded.toLocaleString('en-IN')}</strong> more for Free Pan-India Express Delivery</span>
              <span className="text-[#C49A45] font-mono tabular-nums">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-[#1B060D] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C49A45] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[#D4AE58]">
            <Truck className="w-4 h-4 shrink-0" />
            <span>You have unlocked <strong>Free Pan-India Insured Express Delivery</strong>!</span>
          </div>
        )}
        <span className="text-[11px] text-[#FAF7F2]/60">Dispatch: Next business day via Air</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Itemized List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-[#EADBCE] border border-[#EADBCE] rounded-xs bg-[#FAF7F2] overflow-hidden">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xs border border-[#EADBCE] shrink-0 bg-[#F4EFEA]"
                  />
                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#C49A45] font-semibold">
                      {product.categoryLabel}
                    </span>
                    <h3
                      onClick={() => navigateTo('product-detail', product.slug)}
                      className="break-words font-serif text-base sm:text-lg font-medium text-[#2A0814] hover:text-[#4A1525] cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#4A1525]/60 font-mono tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EADBCE]/50">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#EADBCE] bg-[#FAF7F2] rounded-xs h-9">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-2.5 text-[#2A0814] hover:bg-[#F4EFEA] h-full transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs px-3 font-semibold text-[#2A0814] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-2.5 text-[#2A0814] hover:bg-[#F4EFEA] h-full transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right font-mono tabular-nums min-w-[90px]">
                    <span className="text-sm font-semibold text-[#2A0814]">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    aria-label="Remove item"
                    className="text-[#4A1525]/40 hover:text-red-700 p-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs">
            <button
              onClick={() => navigateTo('shop')}
              className="text-[#2A0814] hover:text-[#C49A45] font-semibold underline cursor-pointer"
            >
              ← Continue Curating Jewellery
            </button>
          </div>
        </div>

        {/* Order Summary Module (4 cols, sticky) */}
        <div className="lg:col-span-4 bg-[#F4EFEA] p-6 border border-[#EADBCE] rounded-xs space-y-6">
          <h3 className="font-serif text-xl font-medium text-[#2A0814] pb-3 border-b border-[#EADBCE]">
            Order Summary
          </h3>

          {/* Coupon Input */}
          <div>
            {couponCode ? (
              <div className="flex items-center justify-between text-xs bg-[#FAF7F2] p-2.5 border border-[#C49A45]/50 text-[#2A0814] rounded-xs">
                <div className="flex items-center gap-1.5 text-[#C49A45]">
                  <Tag className="w-4 h-4" />
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
              <form onSubmit={handleApply} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon (e.g. ROYAL10)"
                    className="flex-1 bg-[#FAF7F2] border border-[#EADBCE] px-3 py-2 text-xs text-[#2A0814] uppercase rounded-xs focus:outline-none focus:border-[#C49A45]"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 bg-[#2A0814] text-[#FAF7F2] text-xs font-semibold rounded-xs hover:bg-[#380E1C] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                )}
                <span className="text-[10px] text-[#4A1525]/60 block">
                  Tip: Use <strong>ROYAL10</strong> for 10% off your initial order.
                </span>
              </form>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-[#4A1525]/80 font-mono">
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span className="tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Royal Privilege Discount</span>
                <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Express Shipping</span>
              <span className="tabular-nums">
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between text-[#2A0814] font-semibold text-base pt-3 border-t border-[#EADBCE]">
              <span>Estimated Total</span>
              <span className="tabular-nums font-mono">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="space-y-3">
            <button
              onClick={onOpenCheckout}
              className="w-full py-3.5 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#4A1525]/70">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C49A45]" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

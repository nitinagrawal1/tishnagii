import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowRight, Truck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, finalTotal, subtotal, shippingFee, discountAmount, clearCart, showToast } = useShop();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [orderId, setOrderId] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Delhi',
    pinCode: '',
    paymentMethod: 'upi',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.length < 10)
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    if (!formData.email.trim() || !formData.email.includes('@'))
      newErrors.email = 'Please enter a valid email for order invoice';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pinCode.trim() || formData.pinCode.length < 6)
      newErrors.pinCode = 'Valid 6-digit PIN code required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      setStep('payment');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `TSH-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsSubmitting(false);
      setStep('confirmed');
      clearCart();
      showToast(`Order ${generatedId} placed successfully!`);
    }, 900);
  };

  const resetAndClose = () => {
    setStep('details');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex justify-center items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={resetAndClose}
      />

      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-xs shadow-2xl border border-[#EADBCE] z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EADBCE] flex items-center justify-between bg-[#F4EFEA]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-medium text-[#2A0814]">
                TISHNAGII Express Checkout
              </span>
              <span className="text-[10px] bg-[#380E1C] text-[#FAF7F2] px-2 py-0.5 rounded-xs tracking-wider uppercase font-mono">
                256-Bit SSL
              </span>
            </div>
            <p className="text-[11px] text-[#4A1525]/70">
              {step === 'details' && 'Step 1 of 2: Shipping Destination'}
              {step === 'payment' && 'Step 2 of 2: Secure Payment & Verification'}
              {step === 'confirmed' && 'Order Placed & Confirmed'}
            </p>
          </div>
          <button
            onClick={resetAndClose}
            aria-label="Close checkout"
            className="p-1.5 text-[#2A0814] hover:text-[#C49A45] rounded-full hover:bg-[#EADBCE]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2A0814] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Gayatri Devi"
                    className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-2 text-xs text-[#2A0814] focus:outline-none focus:border-[#C49A45] rounded-xs"
                  />
                  {errors.fullName && (
                    <span className="text-[10px] text-red-600">{errors.fullName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2A0814] mb-1">
                    Mobile Phone (for delivery tracking) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 98200 12345"
                    className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-2 text-xs text-[#2A0814] focus:outline-none focus:border-[#C49A45] rounded-xs"
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-600">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2A0814] mb-1">
                  Email Address (for tax invoice & tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-2 text-xs text-[#2A0814] focus:outline-none focus:border-[#C49A45] rounded-xs"
                />
                {errors.email && (
                  <span className="text-[10px] text-red-600">{errors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2A0814] mb-1">
                  Delivery Address & Apartment / Landmark *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House/Villa No., Street, Landmark..."
                  className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-2 text-xs text-[#2A0814] focus:outline-none focus:border-[#C49A45] rounded-xs"
                />
                {errors.address && (
                  <span className="text-[10px] text-red-600">{errors.address}</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#2A0814] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. New Delhi"
                    className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-2 text-xs text-[#2A0814] focus:outline-none focus:border-[#C49A45] rounded-xs"
                  />
                  {errors.city && (
                    <span className="text-[10px] text-red-600">{errors.city}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2A0814] mb-1">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-2 py-2 text-xs text-[#2A0814] focus:outline-none focus:border-[#C49A45] rounded-xs"
                  >
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2A0814] mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    placeholder="110001"
                    className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-2 text-xs text-[#2A0814] focus:outline-none focus:border-[#C49A45] rounded-xs font-mono"
                  />
                  {errors.pinCode && (
                    <span className="text-[10px] text-red-600">{errors.pinCode}</span>
                  )}
                </div>
              </div>

              {/* Order quick recap */}
              <div className="p-3 bg-[#F4EFEA] rounded-xs border border-[#EADBCE] flex items-center justify-between text-xs font-mono">
                <span className="text-[#4A1525]">Total payable ({cart.length} items):</span>
                <span className="font-semibold text-sm text-[#2A0814]">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2A0814] hover:bg-[#380E1C] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A1525] mb-2">
                  Select Payment Option
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-3 border rounded-xs cursor-pointer transition-colors ${
                      formData.paymentMethod === 'upi'
                        ? 'border-[#C49A45] bg-[#F4EFEA]'
                        : 'border-[#EADBCE] bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        className="accent-[#380E1C]"
                      />
                      <div>
                        <span className="text-xs font-medium text-[#2A0814] block">
                          Instant UPI / QR / Google Pay / PhonePe
                        </span>
                        <span className="text-[11px] text-[#4A1525]/60">
                          Zero surcharge · Fastest dispatch
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      Recommended
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 border rounded-xs cursor-pointer transition-colors ${
                      formData.paymentMethod === 'card'
                        ? 'border-[#C49A45] bg-[#F4EFEA]'
                        : 'border-[#EADBCE] bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        className="accent-[#380E1C]"
                      />
                      <div>
                        <span className="text-xs font-medium text-[#2A0814] block">
                          Credit / Debit Card (Visa, MasterCard, RuPay, Amex)
                        </span>
                        <span className="text-[11px] text-[#4A1525]/60">
                          Secured by 256-bit encryption
                        </span>
                      </div>
                    </div>
                    <Lock className="w-3.5 h-3.5 text-[#C49A45]" />
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 border rounded-xs cursor-pointer transition-colors ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#C49A45] bg-[#F4EFEA]'
                        : 'border-[#EADBCE] bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        className="accent-[#380E1C]"
                      />
                      <div>
                        <span className="text-xs font-medium text-[#2A0814] block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-[#4A1525]/60">
                          Pay cash or UPI to the courier upon delivery
                        </span>
                      </div>
                    </div>
                    <Truck className="w-3.5 h-3.5 text-[#C49A45]" />
                  </label>
                </div>
              </div>

              {/* Order breakdown summary */}
              <div className="p-3 bg-[#F4EFEA] border border-[#EADBCE] rounded-xs space-y-1 text-xs font-mono">
                <div className="flex justify-between text-[#4A1525]/80">
                  <span>Cart Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount Applied</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#4A1525]/80">
                  <span>Express Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-[#2A0814] font-bold pt-1 border-t border-[#EADBCE]">
                  <span>Total Amount Due</span>
                  <span className="text-sm">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="py-3 px-4 border border-[#EADBCE] text-xs font-medium text-[#2A0814] hover:bg-[#F4EFEA] rounded-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#2A0814] hover:bg-[#380E1C] disabled:opacity-60 text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Securing Order...</span>
                  ) : (
                    <span>Confirm & Authorise ₹{finalTotal.toLocaleString('en-IN')}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'confirmed' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-medium text-[#2A0814]">
                  Thank You, {formData.fullName}!
                </h3>
                <p className="text-xs text-[#4A1525]/70 mt-1">
                  Your artisanal order has been registered in our Jaipur atelier.
                </p>
              </div>

              <div className="p-4 bg-[#F4EFEA] border border-[#EADBCE] rounded-xs text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#4A1525]/70">Order Reference:</span>
                  <span className="font-bold text-[#2A0814]">{orderId}</span>
                </div>
                <div className="flex flex-wrap justify-between gap-x-2">
                  <span className="text-[#4A1525]/70">Delivery Address:</span>
                  <span className="min-w-0 max-w-full break-words text-right text-[#2A0814]">
                    {formData.address}, {formData.city} - {formData.pinCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A1525]/70">Payment Mode:</span>
                  <span className="text-[#2A0814] uppercase">{formData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A1525]/70">Estimated Delivery:</span>
                  <span className="text-emerald-800 font-medium">2–4 Business Days via Air</span>
                </div>
              </div>

              <p className="text-xs text-[#4A1525]/70 max-w-sm mx-auto">
                A confirmation with your tax invoice and real-time transit tracking link has been dispatched to <strong>{formData.email}</strong> and mobile <strong>{formData.phone}</strong>.
              </p>

              <button
                onClick={resetAndClose}
                className="py-3 px-8 bg-[#2A0814] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#380E1C] rounded-xs transition-colors cursor-pointer"
              >
                Continue Browsing Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

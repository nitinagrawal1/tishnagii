import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, ShieldCheck, Lock, ArrowRight, Truck } from 'lucide-react';
import type { CustomerAddress } from '../../services/account';
import type { CustomerOrder } from '../../services/account';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: { description?: string };
}

interface VerifiedOrderResponse {
  verified?: boolean;
  historySaved?: boolean;
  historyMessage?: string;
  error?: string;
  order_id?: string;
  payment_id?: string;
  amount?: number;
  amountPaise?: number;
  currency?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  shipping?: number;
  items?: CustomerOrder['items'];
  customer?: CustomerOrder['customer'];
  paymentMethod?: string;
  paymentMethodDetails?: string;
  paymentStatus?: string;
  status?: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
  handler: (response: RazorpaySuccessResponse) => void;
}

interface RazorpayCheckout {
  open: () => void;
  on: (event: 'payment.failed', callback: (response: RazorpayFailureResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

let razorpayScriptPromise: Promise<NonNullable<Window['Razorpay']>> | null = null;

const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise<NonNullable<Window['Razorpay']>>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => window.Razorpay
        ? resolve(window.Razorpay)
        : reject(new Error('Razorpay Checkout did not load.'));
      script.onerror = () => reject(new Error('Could not load Razorpay Checkout. Check your connection and try again.'));
      document.head.appendChild(script);
    }).catch((error: unknown) => {
      razorpayScriptPromise = null;
      throw error;
    });
  }
  return razorpayScriptPromise;
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { user, cart, finalTotal, subtotal, shippingFee, discountAmount, couponCode, clearCart, showToast, setLastOrder, navigateTo } = useShop();

  const [step, setStep] = useState<'details' | 'payment'>('details');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Delhi',
    pinCode: '',
    country: 'India',
    paymentMethod: 'upi',
  });

  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const paymentHandledRef = useRef(false);
  const codRequestIdRef = useRef('');

  useEffect(() => {
    if (isOpen) codRequestIdRef.current = '';
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !user) return;
    let isCurrent = true;

    const loadSavedDetails = async () => {
      try {
        const { getCustomerAddresses, getCustomerProfile } = await import('../../services/account');
        const [profile, addresses] = await Promise.all([
          getCustomerProfile(user.uid, {
            fullName: user.displayName || '',
            phone: '',
            gender: '',
            dateOfBirth: '',
            photoURL: user.photoURL || '',
            emailUpdates: true,
            smsUpdates: false,
          }),
          getCustomerAddresses(user.uid),
        ]);
        if (!isCurrent) return;
        setSavedAddresses(addresses);
        const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddress?.id || '');
        setFormData((current) => ({
          ...current,
          fullName: profile?.fullName || user.displayName || current.fullName,
          phone: profile?.phone || current.phone,
          email: user.email || current.email,
          ...(defaultAddress ? {
            fullName: defaultAddress.fullName || profile?.fullName || user.displayName || current.fullName,
            phone: defaultAddress.phone || profile?.phone || current.phone,
            address: [defaultAddress.house, defaultAddress.street].filter(Boolean).join(', '),
            city: defaultAddress.city,
            state: defaultAddress.state,
            pinCode: defaultAddress.pinCode,
            country: defaultAddress.country || 'India',
          } : {}),
        }));
      } catch {
        if (isCurrent) showToast('Saved checkout details are unavailable. You can still enter them here.', 'info');
      }
    };

    void loadSavedDetails();
    return () => { isCurrent = false; };
  }, [isOpen, user, showToast]);

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
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      setStep('payment');
    }
  };

  const completeOrder = (order: CustomerOrder) => {
    setIsSubmitting(false);
    setLastOrder(order);
    clearCart();
    showToast(`Order ${order.orderId} placed successfully!`);
    onClose();
    navigateTo('order-success', order.orderId);
  };

  const getCustomerDetails = () => ({
    fullName: formData.fullName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    address: [formData.address, formData.city, formData.state, formData.pinCode, formData.country]
      .filter(Boolean)
      .join(', '),
  });

  const getCartSnapshot = () => cart.map(({ product, quantity }) => ({
    product_id: product.id,
    quantity,
  }));

  const handlePaymentSuccess = async (payment: RazorpaySuccessResponse) => {
    setIsSubmitting(true);
    try {
      const token = user ? await user.getIdToken() : '';
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...payment,
          cart_items: getCartSnapshot(),
          coupon_code: couponCode,
          customer: getCustomerDetails(),
        }),
      });
      const result = await response.json() as VerifiedOrderResponse;
      if (!response.ok || !result.verified) {
        throw new Error(result.error || 'Payment could not be verified. Please contact support before retrying.');
      }
      const order: CustomerOrder = {
        id: payment.razorpay_order_id,
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
        createdAt: new Date(),
        status: result.status || 'confirmed',
        paymentStatus: result.paymentStatus || 'verified',
        paymentMethod: result.paymentMethod || 'unknown',
        paymentMethodDetails: result.paymentMethodDetails,
        amount: result.amount ?? finalTotal,
        currency: result.currency || 'INR',
        subtotal: result.subtotal ?? subtotal,
        discount: result.discount ?? discountAmount,
        tax: result.tax ?? 0,
        shipping: result.shipping ?? shippingFee,
        items: result.items || cart.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          image: product.images[0],
          quantity,
          price: product.price,
        })),
        customer: result.customer || getCustomerDetails(),
      };
      completeOrder(order);
      if (user && !result.historySaved) {
        showToast(result.historyMessage || 'Payment confirmed, but your order history could not be synchronized.', 'error');
      }
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment verification failed. Please contact support.');
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    if (formData.paymentMethod === 'cod') {
      if (user) {
        if (!codRequestIdRef.current) codRequestIdRef.current = crypto.randomUUID();
        setIsSubmitting(true);
        try {
          const response = await fetch('/api/create-cod-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
            body: JSON.stringify({
              cart_items: getCartSnapshot(),
              coupon_code: couponCode,
              idempotency_key: codRequestIdRef.current,
              customer: getCustomerDetails(),
            }),
          });
          const result = await response.json() as VerifiedOrderResponse;
          if (!response.ok || !result.order_id) {
            throw new Error(result.error || 'Unable to save your COD order. Please try again.');
          }
          completeOrder({
            id: result.order_id,
            orderId: result.order_id,
            paymentId: '',
            createdAt: new Date(),
            status: result.status || 'confirmed',
            paymentStatus: result.paymentStatus || 'pending',
            paymentMethod: result.paymentMethod || 'cod',
            paymentMethodDetails: result.paymentMethodDetails,
            amount: result.amount ?? finalTotal,
            currency: result.currency || 'INR',
            subtotal: result.subtotal ?? subtotal,
            discount: result.discount ?? discountAmount,
            tax: result.tax ?? 0,
            shipping: result.shipping ?? shippingFee,
            items: result.items || [],
            customer: result.customer || getCustomerDetails(),
          });
        } catch (error) {
          setPaymentError(error instanceof Error ? error.message : 'Unable to place your COD order.');
          setIsSubmitting(false);
        }
      } else {
        const guestOrderId = `TSH-${Math.floor(100000 + Math.random() * 900000)}`;
        completeOrder({
          id: guestOrderId,
          orderId: guestOrderId,
          paymentId: '',
          createdAt: new Date(),
          status: 'confirmed',
          paymentStatus: 'pending',
          paymentMethod: 'cod',
          amount: finalTotal,
          currency: 'INR',
          subtotal,
          discount: discountAmount,
          tax: 0,
          shipping: shippingFee,
          items: cart.map(({ product, quantity }) => ({ productId: product.id, name: product.name, image: product.images[0], quantity, price: product.price })),
          customer: getCustomerDetails(),
        });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error('Razorpay is not configured for this site.');

      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${await user.getIdToken()}` } : {}),
        },
        body: JSON.stringify({
          items: cart.map(({ product, quantity }) => ({ product_id: product.id, quantity })),
          coupon_code: couponCode,
        }),
      });
      const orderResult = await orderResponse.json() as {
        order_id?: string;
        amount?: number;
        currency?: string;
        error?: string;
      };
      if (!orderResponse.ok || !orderResult.order_id || !orderResult.amount || !orderResult.currency) {
        throw new Error(orderResult.error || 'Unable to create a payment order. Please try again.');
      }

      const Razorpay = await loadRazorpay();
      paymentHandledRef.current = false;
      const checkout = new Razorpay({
        key,
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: 'TISHNAGII',
        description: 'Artisanal jewellery order',
        order_id: orderResult.order_id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#2A0814' },
        modal: {
          ondismiss: () => {
            if (!paymentHandledRef.current) {
              setPaymentError('Checkout was cancelled. No payment was confirmed.');
            }
            setIsSubmitting(false);
          },
        },
        handler: (payment) => {
          paymentHandledRef.current = true;
          void handlePaymentSuccess(payment);
        },
      });
      checkout.on('payment.failed', (failure) => {
        paymentHandledRef.current = true;
        setPaymentError(failure.error?.description || 'Payment failed. Please try another payment method.');
        setIsSubmitting(false);
      });
      checkout.open();
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Unable to start payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep('details');
    setPaymentError('');
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

              {savedAddresses.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-[#2A0814] mb-1" htmlFor="checkout-saved-address">
                    Use a saved address
                  </label>
                  <select
                    id="checkout-saved-address"
                    value={selectedAddressId}
                    onChange={(event) => {
                      const address = savedAddresses.find((item) => item.id === event.target.value);
                      setSelectedAddressId(event.target.value);
                      if (!address) return;
                      setFormData((current) => ({
                        ...current,
                        fullName: address.fullName,
                        phone: address.phone,
                        address: [address.house, address.street].filter(Boolean).join(', '),
                        city: address.city,
                        state: address.state,
                        pinCode: address.pinCode,
                        country: address.country || 'India',
                      }));
                    }}
                    className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-2 text-xs text-[#2A0814] focus:outline-none focus:border-[#C49A45] rounded-xs"
                  >
                    {savedAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.label} · {address.house}, {address.city} {address.isDefault ? '(Default)' : ''}
                      </option>
                    ))}
                    <option value="">Use a different address</option>
                  </select>
                </div>
              )}

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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

                <div>
                  <label className="block text-xs font-medium text-[#2A0814] mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EADBCE] px-3 py-2 text-xs text-[#2A0814] focus:outline-none focus:border-[#C49A45] rounded-xs"
                  />
                  {errors.country && <span className="text-[10px] text-red-600">{errors.country}</span>}
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
              {paymentError && (
                <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  {paymentError}
                </p>
              )}
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
                    <span>Opening Secure Checkout...</span>
                  ) : (
                    <span>
                      {formData.paymentMethod === 'cod' ? 'Place COD Order' : 'Pay Securely'} · ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

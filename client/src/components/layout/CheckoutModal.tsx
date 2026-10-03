import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, ShieldCheck, Lock, ArrowRight, Truck, RefreshCw } from 'lucide-react';
import type { CustomerAddress } from '../../services/account';
import type { CustomerOrder } from '../../services/account';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';

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

const initialCheckoutForm = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: 'Delhi',
  pinCode: '',
  country: 'India',
  paymentMethod: 'upi',
};

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
  const {
    user,
    authLoading,
    setIsAuthModalOpen,
    setIsCheckoutAuthRequired,
    cart,
    finalTotal,
    subtotal,
    shippingFee,
    discountAmount,
    couponCode,
    clearCart,
    showToast,
    setLastOrder,
    navigateTo,
  } = useShop();

  const [step, setStep] = useState<'details' | 'payment'>('details');

  // Form State
  const [formData, setFormData] = useState(initialCheckoutForm);
  const [hasDraft, setHasDraft] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const paymentHandledRef = useRef(false);
  const codRequestIdRef = useRef('');
  const pendingPaymentRef = useRef<RazorpaySuccessResponse | null>(null);
  const authPromptedRef = useRef(false);
  const { confirmDiscard: confirmDiscardDraft, markClean } = useUnsavedChanges(isOpen && hasDraft, 'checkout-draft');
  const requestCheckoutAuth = () => {
    authPromptedRef.current = true;
    setIsCheckoutAuthRequired(true);
    setIsAuthModalOpen(true);
  };

  const updateFormField = <K extends keyof typeof initialCheckoutForm>(
    field: K,
    value: (typeof initialCheckoutForm)[K],
  ) => {
    setHasDraft(true);
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const resetAndClose = () => {
    if (!confirmDiscardDraft()) return;
    setHasDraft(false);
    setFormData(initialCheckoutForm);
    setSelectedAddressId('');
    setErrors({});
    setStep('details');
    setPaymentError('');
    onClose();
  };
  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen, resetAndClose);

  useEffect(() => {
    if (!isOpen) {
      authPromptedRef.current = false;
      setIsCheckoutAuthRequired(false);
      return;
    }
    codRequestIdRef.current = '';
    if (user) {
      authPromptedRef.current = false;
      setIsCheckoutAuthRequired(false);
      return;
    }
    if (!authLoading && !authPromptedRef.current) {
      authPromptedRef.current = true;
      setIsCheckoutAuthRequired(true);
      setIsAuthModalOpen(true);
    }
  }, [isOpen, authLoading, user, setIsAuthModalOpen, setIsCheckoutAuthRequired]);

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
    } else {
      // Focus first error field after state update
      requestAnimationFrame(() => {
        const firstError = document.querySelector<HTMLElement>('[aria-invalid="true"]');
        firstError?.focus();
      });
    }
  };

  const completeOrder = (order: CustomerOrder) => {
    markClean();
    setHasDraft(false);
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
      if (!user) {
        pendingPaymentRef.current = payment;
        requestCheckoutAuth();
        throw new Error('Sign in again to verify your payment. Your order is not complete yet.');
      }
      const token = await user.getIdToken();
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
      if (response.status === 401) {
        pendingPaymentRef.current = payment;
        requestCheckoutAuth();
        throw new Error(result.error || 'Sign in again to verify your payment. Your order is not complete yet.');
      }
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

  useEffect(() => {
    if (!isOpen || !user || !pendingPaymentRef.current) return;
    const payment = pendingPaymentRef.current;
    pendingPaymentRef.current = null;
    void handlePaymentSuccess(payment);
  }, [isOpen, user]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    const customerUser = user;
    if (!customerUser) {
      setPaymentError('Sign in or create an account to place this order. Your shopping bag will be saved.');
      requestCheckoutAuth();
      return;
    }
    if (formData.paymentMethod === 'cod') {
      if (!codRequestIdRef.current) codRequestIdRef.current = crypto.randomUUID();
      setIsSubmitting(true);
      try {
        const idToken = await customerUser.getIdToken();
        const response = await fetch('/api/create-cod-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            cart_items: getCartSnapshot(),
            coupon_code: couponCode,
            idempotency_key: codRequestIdRef.current,
            customer: getCustomerDetails(),
          }),
        });
        const result = await response.json() as VerifiedOrderResponse;
        if (response.status === 401) {
          setPaymentError(result.error || 'Sign in again to place your order.');
          requestCheckoutAuth();
          setIsSubmitting(false);
          return;
        }
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
      return;
    }

    setIsSubmitting(true);
    try {
      const idToken = await customerUser.getIdToken();
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error('Razorpay is not configured for this site.');

      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
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
      if (orderResponse.status === 401) {
        setPaymentError(orderResult.error || 'Sign in again to place your order.');
        requestCheckoutAuth();
        setIsSubmitting(false);
        return;
      }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain p-2 sm:items-center sm:p-6 md:p-12">
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={resetAndClose}
        aria-label="Close checkout"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-dialog-title"
        aria-busy={isSubmitting}
        tabIndex={-1}
        className="relative flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xs border border-[#EADBCE] bg-[#FAF7F2] shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#EADBCE] bg-[#F4EFEA] p-3 sm:p-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-medium text-[#2A0814] sm:text-lg">
                <span id="checkout-dialog-title">TISHNAGII Express Checkout</span>
              </span>
              <span className="hidden rounded-xs bg-[#380E1C] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#FAF7F2] min-[360px]:inline">
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
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full p-1.5 text-[#2A0814] transition-colors hover:bg-[#EADBCE]/50 hover:text-[#C49A45] cursor-pointer touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="checkout-body min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-6">
          {cart.length === 0 ? (
            <div className="space-y-4 py-5 text-center">
              <p className="font-serif text-xl text-[#2A0814]">Your shopping bag is empty</p>
              <p className="text-sm text-[#4A1525]">Add a piece to your bag before continuing to checkout.</p>
              <button type="button" onClick={resetAndClose} className="min-h-11 px-5 text-sm font-medium text-[#2A0814] underline underline-offset-4">
                Return to shopping
              </button>
            </div>
          ) : authLoading ? (
            <p className="py-8 text-center text-sm text-[#4A1525]" role="status">Checking your account…</p>
          ) : !user ? (
            <div className="mx-auto max-w-md space-y-4 py-5 text-center">
              <Lock className="mx-auto h-7 w-7 text-[#6A4D1D]" aria-hidden="true" />
              <h3 className="font-serif text-xl text-[#2A0814]">Sign in to continue</h3>
              {paymentError && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-left text-xs text-red-800">{paymentError}</p>}
              <p className="text-sm leading-relaxed text-[#4A1525]">
                Sign in or create an account to secure your order, save delivery details, and view its status. Your shopping bag is preserved while you sign in.
              </p>
              <button
                type="button"
                onClick={requestCheckoutAuth}
                className="min-h-11 w-full bg-[#2A0814] px-5 py-3 text-sm font-semibold text-[#FAF7F2] transition-colors hover:bg-[#380E1C]"
              >
                Sign in or create an account
              </button>
              <button type="button" onClick={resetAndClose} className="min-h-11 px-5 text-sm text-[#2A0814] underline underline-offset-4">
                Return to shopping
              </button>
            </div>
          ) : (
            <>
          {step === 'details' && (
            <form noValidate onSubmit={handleDetailsSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label htmlFor="checkout-name" className="block text-xs font-medium text-[#2A0814] mb-1">
                    Full Name *
                  </label>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(e) => updateFormField('fullName', e.target.value)}
                    placeholder="e.g. Gayatri Devi…"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'checkout-name-error' : undefined}
                    className="w-full rounded-xs border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-base text-[#2A0814] focus:border-[#C49A45] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] sm:text-sm"
                  />
                  {errors.fullName && (
                    <span id="checkout-name-error" className="text-[10px] text-red-600" aria-live="polite">{errors.fullName}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-medium text-[#2A0814] mb-1">
                    Mobile Phone (for delivery tracking) *
                  </label>
                  <input
                    id="checkout-phone"
                    name="tel"
                    type="tel"
                    autoComplete="tel"
                    inputMode="numeric"
                    value={formData.phone}
                    onChange={(e) => updateFormField('phone', e.target.value)}
                    placeholder="e.g. 98200 12345…"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                    className="w-full rounded-xs border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-base text-[#2A0814] focus:border-[#C49A45] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] sm:text-sm"
                  />
                  {errors.phone && (
                    <span id="checkout-phone-error" className="text-[10px] text-red-600" aria-live="polite">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="checkout-email" className="block text-xs font-medium text-[#2A0814] mb-1">
                  Email Address (for tax invoice &amp; tracking) *
                </label>
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={formData.email}
                  onChange={(e) => updateFormField('email', e.target.value)}
                  placeholder="name@domain.com…"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                  className="w-full rounded-xs border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-base text-[#2A0814] focus:border-[#C49A45] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] sm:text-sm"
                />
                {errors.email && (
                  <span id="checkout-email-error" className="text-[10px] text-red-600" aria-live="polite">{errors.email}</span>
                )}
              </div>

              {savedAddresses.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-[#2A0814] mb-1" htmlFor="checkout-saved-address">
                    Use a saved address
                  </label>
                  <select
                    id="checkout-saved-address"
                    name="savedAddress"
                    value={selectedAddressId}
                    onChange={(event) => {
                      const address = savedAddresses.find((item) => item.id === event.target.value);
                      setSelectedAddressId(event.target.value);
                      if (!address) return;
                      setHasDraft(true);
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
                    className="w-full rounded-xs border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-base text-[#2A0814] focus:border-[#C49A45] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] sm:text-sm"
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
                <label htmlFor="checkout-address" className="block text-xs font-medium text-[#2A0814] mb-1">
                  Delivery Address & Apartment / Landmark *
                </label>
                <textarea
                  id="checkout-address"
                  name="streetAddress"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => updateFormField('address', e.target.value)}
                  placeholder="House/Villa No., Street, Landmark…"
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? 'checkout-address-error' : undefined}
                  className="w-full resize-y overflow-y-auto rounded-xs border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2 text-base text-[#2A0814] focus:border-[#C49A45] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] sm:text-sm"
                />
                {errors.address && (
                  <span id="checkout-address-error" className="text-[10px] text-red-600" aria-live="polite">{errors.address}</span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:grid-cols-4">
                <div>
                  <label htmlFor="checkout-city" className="block text-xs font-medium text-[#2A0814] mb-1">City *</label>
                  <input
                    id="checkout-city"
                    name="address-level2"
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormField('city', e.target.value)}
                    placeholder="e.g. New Delhi…"
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? 'checkout-city-error' : undefined}
                    className="w-full rounded-xs border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-base text-[#2A0814] focus:border-[#C49A45] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] sm:text-sm"
                  />
                  {errors.city && (
                    <span id="checkout-city-error" className="text-[10px] text-red-600" aria-live="polite">{errors.city}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-state" className="block text-xs font-medium text-[#2A0814] mb-1">State *</label>
                  <select
                    id="checkout-state"
                    name="address-level1"
                    value={formData.state}
                    onChange={(e) => updateFormField('state', e.target.value)}
                    className="w-full min-w-0 rounded-xs border border-[#EADBCE] bg-[#FAF7F2] px-2 py-2.5 text-base text-[#2A0814] focus:border-[#C49A45] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] sm:text-sm"
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
                  <label htmlFor="checkout-pin-code" className="block text-xs font-medium text-[#2A0814] mb-1">
                    <span>PIN Code *</span>
                  </label>
                  <input
                    id="checkout-pin-code"
                    name="postal-code"
                    type="text"
                    inputMode="numeric"
                    spellCheck={false}
                    value={formData.pinCode}
                    onChange={(e) => updateFormField('pinCode', e.target.value)}
                    placeholder="110001…"
                    aria-invalid={!!errors.pinCode}
                    aria-describedby={errors.pinCode ? 'checkout-pin-code-error' : undefined}
                    className="w-full rounded-xs border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 font-mono text-base text-[#2A0814] focus:border-[#C49A45] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] sm:text-sm"
                  />
                  {errors.pinCode && (
                    <span id="checkout-pin-code-error" className="text-[10px] text-red-600" aria-live="polite">{errors.pinCode}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-country" className="block text-xs font-medium text-[#2A0814] mb-1">Country *</label>
                  <input
                    id="checkout-country"
                    name="country-name"
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateFormField('country', e.target.value)}
                    aria-invalid={!!errors.country}
                    aria-describedby={errors.country ? 'checkout-country-error' : undefined}
                    className="w-full rounded-xs border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-base text-[#2A0814] focus:border-[#C49A45] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] sm:text-sm"
                  />
                  {errors.country && <span id="checkout-country-error" className="text-[10px] text-red-600" aria-live="polite">{errors.country}</span>}
                </div>
              </div>

              {/* Order quick recap */}
              <div className="p-3 bg-[#F4EFEA] rounded-xs border border-[#EADBCE] flex items-center justify-between text-xs font-mono">
                <span className="text-[#4A1525]">Total payable ({cart.length} items):</span>
                <span className="font-semibold text-sm text-[#2A0814]">
                  <span className="tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
                </span>
              </div>

              <button
                type="submit"
                className="flex min-h-11 min-w-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xs bg-[#2A0814] py-3 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] transition-colors hover:bg-[#380E1C] touch-manipulation"
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
                          updateFormField('paymentMethod', e.target.value)
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
                          updateFormField('paymentMethod', e.target.value)
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
                          updateFormField('paymentMethod', e.target.value)
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
                  <span><span className="tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span></span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount Applied</span>
                    <span>-<span className="tabular-nums">₹{discountAmount.toLocaleString('en-IN')}</span></span>
                  </div>
                )}
                <div className="flex justify-between text-[#4A1525]/80">
                  <span>Express Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-[#2A0814] font-bold pt-1 border-t border-[#EADBCE]">
                  <span>Total Amount Due</span>
                  <span className="text-sm"><span className="tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span></span>
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
                  className="flex min-h-11 min-w-11 flex-1 items-center justify-center gap-2 rounded-xs bg-[#2A0814] py-3 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] shadow-sm transition-[background-color,opacity] hover:bg-[#380E1C] disabled:opacity-60"
                >
                  {isSubmitting && <span aria-hidden="true" className="inline-flex animate-spin"><RefreshCw className="h-4 w-4" /></span>}
                  <span>
                    {formData.paymentMethod === 'cod' ? 'Place COD Order' : 'Pay Securely'} · <span className="tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </span>
                </button>
              </div>
            </form>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

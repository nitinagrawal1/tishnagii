import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { Product, CartItem, PageRoute } from '@shared/types';
import { PRODUCTS } from '@shared/data/mockData';
import { auth } from '../firebase';

interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface ShopContextType {
  user: User | null;
  authLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;

  // Navigation & Routing
  currentPage: PageRoute;
  currentSlug: string | null;
  currentCategorySlug: string | null;
  navigateTo: (page: PageRoute, slug?: string, categorySlug?: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  finalTotal: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Toast
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1499;
const STANDARD_SHIPPING_FEE = 150;

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser);
    setAuthLoading(false);
  }), []);

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  // Route state
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [currentCategorySlug, setCurrentCategorySlug] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tishnagii_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tishnagii_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem('tishnagii_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persist Wishlist
  useEffect(() => {
    try {
      localStorage.setItem('tishnagii_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Handle URL sync & popstate for clean client routing
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        setCurrentPage('home');
        setCurrentSlug(null);
      } else if (path.startsWith('/shop')) {
        setCurrentPage('shop');
      } else if (path.startsWith('/categories')) {
        setCurrentPage('categories');
      } else if (path.startsWith('/product/')) {
        const slug = path.replace('/product/', '').trim();
        setCurrentPage('product-detail');
        setCurrentSlug(slug);
      } else if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').trim();
        setCurrentPage('blog-detail');
        setCurrentSlug(slug);
      } else if (path.startsWith('/blog')) {
        setCurrentPage('blog');
      } else if (path.startsWith('/about')) {
        setCurrentPage('about');
      } else if (path.startsWith('/contact')) {
        setCurrentPage('contact');
      } else if (path.startsWith('/faq')) {
        setCurrentPage('faq');
      } else if (path.startsWith('/wishlist')) {
        setCurrentPage('wishlist');
      } else if (path.startsWith('/cart')) {
        setCurrentPage('cart');
      } else if (path.startsWith('/shipping')) {
        setCurrentPage('shipping');
      } else if (path.startsWith('/returns')) {
        setCurrentPage('returns');
      } else if (path.startsWith('/privacy')) {
        setCurrentPage('privacy');
      } else if (path.startsWith('/terms')) {
        setCurrentPage('terms');
      } else if (path.startsWith('/sitemap')) {
        setCurrentPage('sitemap');
      } else {
        setCurrentPage('404');
      }
    };

    parseUrl();
    const handlePopState = () => parseUrl();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (page: PageRoute, slug?: string, categorySlug?: string) => {
    setCurrentPage(page);
    setCurrentSlug(slug || null);
    if (categorySlug !== undefined) {
      setCurrentCategorySlug(categorySlug);
    }

    let urlPath = '/';
    if (page === 'shop') urlPath = '/shop';
    else if (page === 'categories') urlPath = '/categories';
    else if (page === 'product-detail' && slug) urlPath = `/product/${slug}`;
    else if (page === 'blog') urlPath = '/blog';
    else if (page === 'blog-detail' && slug) urlPath = `/blog/${slug}`;
    else if (page === 'about') urlPath = '/about';
    else if (page === 'contact') urlPath = '/contact';
    else if (page === 'faq') urlPath = '/faq';
    else if (page === 'wishlist') urlPath = '/wishlist';
    else if (page === 'cart') urlPath = '/cart';
    else if (page === 'shipping') urlPath = '/shipping';
    else if (page === 'returns') urlPath = '/returns';
    else if (page === 'privacy') urlPath = '/privacy';
    else if (page === 'terms') urlPath = '/terms';
    else if (page === 'sitemap') urlPath = '/sitemap';
    else if (page === '404') urlPath = '/404';

    try {
      window.history.pushState({}, '', urlPath);
    } catch {
      // ignore
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
    setDiscountPercent(0);
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // Coupon handling
  const applyCoupon = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'TISHNAGII10' || cleaned === 'ROYAL10') {
      setCouponCode(cleaned);
      setDiscountPercent(10);
      showToast('10% Royal Welcome Discount Applied!');
      return { success: true, message: '10% discount applied to your order!' };
    }
    if (cleaned === 'BRIDAL15') {
      setCouponCode(cleaned);
      setDiscountPercent(15);
      showToast('15% Bridal Celebration Privilege Applied!');
      return { success: true, message: '15% bridal celebration discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try ROYAL10' };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountPercent(0);
    showToast('Coupon removed', 'info');
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <ShopContext.Provider
      value={{
        user,
        authLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOutUser,
        currentPage,
        currentSlug,
        currentCategorySlug,
        navigateTo,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartCount,
        subtotal,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        finalTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

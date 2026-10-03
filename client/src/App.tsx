import React, { lazy, Suspense, useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { SEOHead } from './components/common/SEOHead';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { SearchModal } from './components/layout/SearchModal';
import { CheckoutModal } from './components/layout/CheckoutModal';
import { ToastContainer } from './components/common/ToastContainer';
import { CookieConsent } from './components/common/CookieConsent';
import { PreFooterCTA } from './components/common/PreFooterCTA';

import { PRODUCTS, BLOG_POSTS, CATEGORIES } from '@shared/data/mockData';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then((module) => ({ default: module.ShopPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then((module) => ({ default: module.CategoriesPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then((module) => ({ default: module.BlogPage })));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage').then((module) => ({ default: module.BlogDetailPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then((module) => ({ default: module.FAQPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then((module) => ({ default: module.WishlistPage })));
const CartPage = lazy(() => import('./pages/CartPage').then((module) => ({ default: module.CartPage })));
const ShippingPage = lazy(() => import('./pages/ShippingPage').then((module) => ({ default: module.ShippingPage })));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage').then((module) => ({ default: module.ReturnsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((module) => ({ default: module.TermsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const SitemapPage = lazy(() => import('./pages/SitemapPage').then((module) => ({ default: module.SitemapPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then((module) => ({ default: module.AccountPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then((module) => ({ default: module.OrderSuccessPage })));

const AppContent: React.FC = () => {
  const { currentPage, currentSlug, currentCategorySlug } = useShop();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const currentProduct =
    currentPage === 'product-detail' && currentSlug
      ? PRODUCTS.find((p) => p.slug === currentSlug) || PRODUCTS[0]
      : null;

  const currentPost =
    currentPage === 'blog-detail' && currentSlug
      ? BLOG_POSTS.find((b) => b.slug === currentSlug) || BLOG_POSTS[0]
      : null;

  const currentCategory = currentCategorySlug
    ? CATEGORIES.find((c) => c.id === currentCategorySlug)?.name
    : null;

  return (
    <div className="min-h-screen flex flex-col pb-[env(safe-area-inset-bottom)] bg-[#FAF7F2] text-[#1C1819] selection:bg-[#380E1C] selection:text-[#FAF7F2]">
      {/* Skip to main content (keyboard/screenreader) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#2A0814] focus:text-[#FAF7F2] focus:rounded focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Dynamic SEO & JSON-LD Structured Data */}
      <SEOHead
        page={currentPage}
        product={currentProduct}
        post={currentPost}
        categoryName={currentCategory}
      />

      {/* Strict 3-zone Header & Dismissible Banner */}
      <Header />

      {/* Main Page Content Router */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center px-4 py-24 text-center text-sm text-[#4A1525]/70" role="status">Loading page…</div>}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'shop' && <ShopPage />}
        {currentPage === 'categories' && <CategoriesPage />}
        {currentPage === 'product-detail' && (
          <ProductDetailPage slug={currentSlug || PRODUCTS[0].slug} />
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'blog' && <BlogPage />}
        {currentPage === 'blog-detail' && (
          <BlogDetailPage slug={currentSlug || BLOG_POSTS[0].slug} />
        )}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'faq' && <FAQPage />}
        {currentPage === 'wishlist' && <WishlistPage />}
        {currentPage === 'cart' && (
          <CartPage onOpenCheckout={() => setIsCheckoutOpen(true)} />
        )}
        {currentPage === 'account' && (
          <AccountPage />
        )}
        {currentPage === 'order-success' && (
          <OrderSuccessPage orderId={currentSlug || ''} />
        )}
        {currentPage === 'shipping' && <ShippingPage />}
        {currentPage === 'returns' && <ReturnsPage />}
        {currentPage === 'privacy' && <PrivacyPage />}
        {currentPage === 'terms' && <TermsPage />}
        {currentPage === 'sitemap' && <SitemapPage />}
        {currentPage === '404' && <NotFoundPage />}
        </Suspense>
      </main>

      {/* Pre-Footer Editorial CTA Section (Displayed across Home & All Pages) */}
      <PreFooterCTA />

      {/* Comprehensive Footer */}
      <Footer />

      {/* Slide-out Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Instant Search Modal */}
      <SearchModal />

      {/* Express Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Unobtrusive Notifications */}
      <ToastContainer />

      {/* Privacy & Cookie Preference Notice */}
      <CookieConsent />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

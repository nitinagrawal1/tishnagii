import React, { useState } from 'react';
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

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { ShippingPage } from './pages/ShippingPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SitemapPage } from './pages/SitemapPage';

import { PRODUCTS, BLOG_POSTS, CATEGORIES } from './data/mockData';

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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1819] selection:bg-[#380E1C] selection:text-[#FAF7F2]">
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
      <main className="flex-1">
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
        {currentPage === 'shipping' && <ShippingPage />}
        {currentPage === 'returns' && <ReturnsPage />}
        {currentPage === 'privacy' && <PrivacyPage />}
        {currentPage === 'terms' && <TermsPage />}
        {currentPage === 'sitemap' && <SitemapPage />}
        {currentPage === '404' && <NotFoundPage />}
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

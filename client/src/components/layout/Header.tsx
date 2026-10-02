import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, UserRound, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const {
    currentPage,
    user,
    authLoading,
    isAuthModalOpen,
    setIsAuthModalOpen,
    signOutUser,
    navigateTo,
    cartCount,
    wishlist,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    showToast,
  } = useShop();

  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop All', page: 'shop' as const },
    { label: 'Collections', page: 'categories' as const },
    { label: 'About TISHNAGII', page: 'about' as const },
    { label: 'Concierge', page: 'contact' as const },
  ];

  const handleNavClick = (page: typeof navLinks[0]['page']) => {
    navigateTo(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. Slim Dismissible Top Notification Banner (<40px) */}
      {!isBannerDismissed && (
        <div className="bg-[#2A0814] text-[#FAF7F2] text-xs py-2 px-4 border-b border-[#380E1C] flex items-center justify-between">
          <div className="mx-auto text-center font-normal tracking-wide flex items-center gap-2">
            <span>Complimentary Insured Express Delivery across India on orders above <span className="tabular-nums">₹1,499</span></span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span className="hidden sm:inline text-[#D4AE58]">Signature Velvet Keepsake Box with every order</span>
          </div>
          <button
            onClick={() => setIsBannerDismissed(true)}
            aria-label="Dismiss banner"
            className="text-[#FAF7F2]/60 hover:text-[#FAF7F2] p-0.5 ml-2 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Strict One-Row Three-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADBCE] transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark in display face */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden -ml-1.5 p-1.5 text-[#2A0814] transition-colors hover:text-[#C49A45] sm:-ml-2 sm:p-2"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
              className="group flex min-w-0 flex-col items-start text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45]"
            >
              <span className="whitespace-nowrap font-serif text-xl font-medium leading-tight tracking-[0.12em] text-[#2A0814] transition-colors group-hover:text-[#4A1525] sm:text-3xl sm:tracking-[0.22em] tabular-nums">
                TISHNAGII
              </span>
              <span className="-mt-0.5 whitespace-nowrap text-[8px] font-light tracking-[0.15em] text-[#C49A45] sm:text-[10px] sm:tracking-[0.3em]">
                तिश्नगी · ARTISANAL LUXURY
              </span>
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links with subtle hover underlines */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.page)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#2A0814] font-semibold'
                      : 'text-[#4A1525]/80 hover:text-[#2A0814]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C49A45]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions (Search, Wishlist, Cart) */}
          <div className="flex shrink-0 items-center gap-0 sm:gap-2">
            {/* Search Affordance */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search jewellery collection"
              className="rounded-full p-1.5 text-[#2A0814] transition-colors hover:bg-[#F4EFEA] hover:text-[#C49A45] sm:p-2"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  if (user) setIsAccountMenuOpen((open) => !open);
                  else setIsAuthModalOpen(true);
                }}
                aria-label={user ? 'Open account menu' : 'Sign in or create account'}
                aria-expanded={user ? isAccountMenuOpen : undefined}
                disabled={authLoading}
                className="rounded-full p-1.5 text-[#2A0814] transition-colors hover:bg-[#F4EFEA] hover:text-[#C49A45] disabled:opacity-60 sm:p-2"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : user ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C49A45] text-[10px] font-semibold text-[#2A0814]">
                    {(user.displayName || user.email || 'T').charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserRound className="w-5 h-5" />
                )}
              </button>
              {user && isAccountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 border border-[#EADBCE] bg-[#FAF7F2] p-2 shadow-xl">
                  <div className="border-b border-[#EADBCE] px-3 py-2">
                    <p className="truncate text-sm font-medium text-[#2A0814]">{user.displayName || 'TISHNAGII customer'}</p>
                    <p className="truncate text-xs text-[#4A1525]/65">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      navigateTo('account');
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-[#2A0814] transition-colors hover:bg-[#F4EFEA]"
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      navigateTo('wishlist');
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-[#2A0814] transition-colors hover:bg-[#F4EFEA]"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      navigateTo('cart');
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-[#2A0814] transition-colors hover:bg-[#F4EFEA]"
                  >
                    Shopping Bag
                  </button>
                  <button
                    onClick={() => {
                      void signOutUser().then(() => {
                        setIsAccountMenuOpen(false);
                        showToast('You have been signed out.', 'info');
                      }).catch(() => showToast('Unable to sign out. Please try again.', 'error'));
                    }}
                    className="mt-1 flex w-full items-center gap-2 border-t border-[#EADBCE] px-3 py-2 text-left text-sm text-[#4A1525] transition-colors hover:bg-[#F4EFEA]"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <button
              onClick={() => navigateTo('wishlist')}
              aria-label="View saved wishlist"
              className="relative rounded-full p-1.5 text-[#2A0814] transition-colors hover:bg-[#F4EFEA] hover:text-[#C49A45] sm:p-2"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#4A1525] text-[#FAF7F2] text-[10px] font-medium rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="View shopping bag"
              className="relative flex items-center rounded-full p-1.5 text-[#2A0814] transition-colors hover:bg-[#F4EFEA] hover:text-[#C49A45] sm:p-2"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C49A45] text-[#2A0814] text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-full max-w-xs bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EADBCE]">
                <a
                  href="/"
                  onClick={(event) => {
                    event.preventDefault();
                    navigateTo('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block"
                >
                  <span className="font-serif text-2xl tracking-[0.2em] text-[#2A0814]">TISHNAGII</span>
                  <div className="text-[10px] tracking-widest text-[#C49A45]">तिश्नगी</div>
                </a>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-[#2A0814] hover:text-[#C49A45]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-xs uppercase tracking-widest text-[#4A1525]/60 font-semibold mb-2">
                  Navigation
                </p>
                {navLinks.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.page)}
                    className="w-full text-left py-2 text-base font-medium text-[#2A0814] hover:text-[#C49A45] flex items-center justify-between transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </button>
                ))}

                <div className="pt-6 border-t border-[#EADBCE]">
                  <p className="text-xs uppercase tracking-widest text-[#4A1525]/60 font-semibold mb-3">
                    Featured Suites
                  </p>
                  <div className="space-y-2.5 text-sm text-[#4A1525]">
                    <button
                      onClick={() => {
                        navigateTo('shop', undefined, 'necklaces');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left hover:text-[#C49A45]"
                    >
                      Kundan & Polki Chokers
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('shop', undefined, 'earrings');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left hover:text-[#C49A45]"
                    >
                      Temple Gold Jhumkas
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('shop', undefined, 'bridal-sets');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left hover:text-[#C49A45]"
                    >
                      Royal Bridal Suites
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('shop', undefined, 'bangles');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left hover:text-[#C49A45]"
                    >
                      Jaipuri Openable Kadas
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EADBCE] text-xs text-[#4A1525]/70 space-y-2">
              <div className="flex items-center justify-between">
                <span>Direct WhatsApp Concierge:</span>
                <a href="tel:+919820012345" className="font-medium text-[#2A0814] hover:text-[#C49A45] transition-colors touch-manipulation">
                  +91 98200 12345
                </a>
              </div>
              <div className="text-[11px] text-[#4A1525]/60">
                Jaipur Atelier · Mon - Sat (10 AM - 7 PM IST)
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

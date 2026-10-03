import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, UserRound, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { handleInternalLinkClick } from '../../utils/navigation';
import { useDialogFocus } from '../../hooks/useDialogFocus';

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
  const accountMenuRootRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useDialogFocus<HTMLDivElement>(isMobileMenuOpen, () => setIsMobileMenuOpen(false));

  useEffect(() => {
    if (!isAccountMenuOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!accountMenuRootRef.current?.contains(event.target as Node)) setIsAccountMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsAccountMenuOpen(false);
      document.getElementById('header-account-trigger')?.focus();
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isAccountMenuOpen]);

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
            className="ml-2 flex min-h-11 min-w-11 items-center justify-center text-[#FAF7F2]/60 transition-colors hover:text-[#FAF7F2]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Strict One-Row Three-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADBCE]">
        <div className="header-inner max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-[4.5rem] sm:h-20 flex items-center justify-between gap-1">
          
          {/* Zone 1: Single text element wordmark in display face */}
          <div className="header-brand flex min-w-0 items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="header-menu-trigger lg:hidden flex h-11 w-11 shrink-0 items-center justify-center text-[#2A0814] transition-colors hover:text-[#C49A45]"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu className="h-5 w-5 shrink-0" />
            </button>
            <a
              href="/"
              onClick={(event) => handleInternalLinkClick(event, () => navigateTo('home'))}
              className="header-wordmark-link group flex min-w-0 flex-col items-start text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45]"
            >
              <span translate="no" className="header-wordmark whitespace-nowrap font-serif text-lg font-medium leading-tight tracking-[0.08em] text-[#2A0814] transition-colors group-hover:text-[#4A1525] sm:text-3xl sm:tracking-[0.22em]">
                TISHNAGII
              </span>
              <span className="header-tagline -mt-0.5 whitespace-nowrap text-[7px] font-light tracking-[0.1em] text-[#C49A45] sm:text-[10px] sm:tracking-[0.3em]">
                तिश्नगी · ARTISANAL LUXURY
              </span>
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links with subtle hover underlines */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <a
                  key={item.label}
                  href={`/${item.page}`}
                  onClick={(event) => handleInternalLinkClick(event, () => handleNavClick(item.page))}
                  className={`relative py-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#2A0814] font-semibold'
                      : 'text-[#4A1525]/80 hover:text-[#2A0814]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C49A45]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions (Search, Wishlist, Cart) */}
          <div className="header-actions flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Search Affordance */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search jewellery collection"
              className="mobile-header-action relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#2A0814] transition-colors hover:bg-[#F4EFEA] hover:text-[#C49A45]"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="relative" ref={accountMenuRootRef}>
              <button
                id="header-account-trigger"
                type="button"
                onClick={() => {
                  if (user) setIsAccountMenuOpen((open) => !open);
                  else setIsAuthModalOpen(true);
                }}
                aria-label={user ? 'Open account menu' : 'Sign in or create account'}
                aria-expanded={user ? isAccountMenuOpen : undefined}
                aria-controls={user && isAccountMenuOpen ? 'account-dropdown' : undefined}
                disabled={authLoading}
                className="mobile-header-action relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#2A0814] transition-colors hover:bg-[#F4EFEA] hover:text-[#C49A45] disabled:opacity-60"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : user ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C49A45] text-[10px] font-semibold text-[#2A0814]">
                    {(user.displayName || user.email || 'T').charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserRound className="w-5 h-5" />
                )}
              </button>
              {user && isAccountMenuOpen && (
                <div id="account-dropdown" className="account-dropdown fixed right-2 top-[calc(env(safe-area-inset-top)+4.75rem)] z-50 w-[min(18rem,calc(100vw-1rem))] max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain border border-[#EADBCE] bg-[#FAF7F2] p-2 shadow-xl sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-64 sm:max-h-[calc(100dvh-7rem)]">
                  <div className="border-b border-[#EADBCE] px-3 py-2">
                    <p className="break-words text-sm font-medium text-[#2A0814]">{user.displayName || 'TISHNAGII customer'}</p>
                    <p className="break-all text-xs text-[#4A1525]/65">{user.email}</p>
                  </div>
                  <a
                    href="/account"
                    onClick={(event) => handleInternalLinkClick(event, () => { setIsAccountMenuOpen(false); navigateTo('account'); })}
                    className="flex min-h-11 w-full items-center break-words px-3 py-3 text-left text-sm text-[#2A0814] transition-colors hover:bg-[#F4EFEA]"
                  >
                    My Account
                  </a>
                  <a
                    href="/wishlist"
                    onClick={(event) => handleInternalLinkClick(event, () => { setIsAccountMenuOpen(false); navigateTo('wishlist'); })}
                    className="flex min-h-11 w-full items-center break-words px-3 py-3 text-left text-sm text-[#2A0814] transition-colors hover:bg-[#F4EFEA]"
                  >
                    Wishlist
                  </a>
                  <a
                    href="/cart"
                    onClick={(event) => handleInternalLinkClick(event, () => { setIsAccountMenuOpen(false); navigateTo('cart'); })}
                    className="flex min-h-11 w-full items-center break-words px-3 py-3 text-left text-sm text-[#2A0814] transition-colors hover:bg-[#F4EFEA]"
                  >
                    Shopping Bag
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      void signOutUser().then(() => {
                        setIsAccountMenuOpen(false);
                        showToast('You have been signed out.', 'info');
                      }).catch(() => showToast('Unable to sign out. Please try again.', 'error'));
                    }}
                    className="mt-1 flex min-h-11 w-full items-center gap-2 border-t border-[#EADBCE] px-3 py-3 text-left text-sm text-[#4A1525] transition-colors hover:bg-[#F4EFEA]"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <a
              href="/wishlist"
              onClick={(event) => handleInternalLinkClick(event, () => navigateTo('wishlist'))}
              aria-label="View saved wishlist"
              className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full p-1.5 text-[#2A0814] transition-colors hover:bg-[#F4EFEA] hover:text-[#C49A45] sm:p-2"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#4A1525] text-[#FAF7F2] text-[10px] font-medium rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </a>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="View shopping bag"
              className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full p-1.5 text-[#2A0814] transition-colors hover:bg-[#F4EFEA] hover:text-[#C49A45] sm:p-2"
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
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />

        <div id="mobile-navigation" ref={mobileMenuRef} className="relative flex h-dvh w-[min(20rem,calc(100vw-2rem))] min-h-0 flex-col justify-between overflow-y-auto overscroll-contain bg-[#FAF7F2] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl sm:p-6 sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))]" role="dialog" aria-modal="true" aria-labelledby="mobile-navigation-title" tabIndex={-1}>
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EADBCE]">
                <a
                  href="/"
                  onClick={(event) => handleInternalLinkClick(event, () => {
                    navigateTo('home');
                    setIsMobileMenuOpen(false);
                  })}
                  className="block"
                >
                  <span id="mobile-navigation-title" translate="no" className="font-serif text-2xl tracking-[0.2em] text-[#2A0814]">TISHNAGII</span>
                  <div className="text-[10px] tracking-widest text-[#C49A45]">तिश्नगी</div>
                </a>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-11 min-w-11 items-center justify-center p-1.5 text-[#2A0814] hover:text-[#C49A45]"
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
                  <a
                    key={item.label}
                    href={`/${item.page}`}
                    onClick={(event) => handleInternalLinkClick(event, () => handleNavClick(item.page))}
                    className="flex min-h-11 w-full items-center justify-between break-words py-3 text-left text-base font-medium text-[#2A0814] transition-colors hover:text-[#C49A45]"
                    aria-current={currentPage === item.page ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </a>
                ))}

                <div className="pt-6 border-t border-[#EADBCE]">
                  <p className="text-xs uppercase tracking-widest text-[#4A1525]/60 font-semibold mb-3">
                    Featured Suites
                  </p>
                  <div className="space-y-2.5 text-sm text-[#4A1525]">
                    <a href="/shop?category=necklaces" onClick={(event) => handleInternalLinkClick(event, () => { navigateTo('shop', undefined, 'necklaces'); setIsMobileMenuOpen(false); })} className="block min-h-11 w-full break-words py-3 text-left hover:text-[#C49A45]">
                      Kundan &amp; Polki Chokers
                    </a>
                    <a href="/shop?category=earrings" onClick={(event) => handleInternalLinkClick(event, () => { navigateTo('shop', undefined, 'earrings'); setIsMobileMenuOpen(false); })} className="block min-h-11 w-full break-words py-3 text-left hover:text-[#C49A45]">
                      Temple Gold Jhumkas
                    </a>
                    <a href="/shop?category=bridal-sets" onClick={(event) => handleInternalLinkClick(event, () => { navigateTo('shop', undefined, 'bridal-sets'); setIsMobileMenuOpen(false); })} className="block min-h-11 w-full break-words py-3 text-left hover:text-[#C49A45]">
                      Royal Bridal Suites
                    </a>
                    <a href="/shop?category=bangles" onClick={(event) => handleInternalLinkClick(event, () => { navigateTo('shop', undefined, 'bangles'); setIsMobileMenuOpen(false); })} className="block min-h-11 w-full break-words py-3 text-left hover:text-[#C49A45]">
                      Jaipuri Openable Kadas
                    </a>
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

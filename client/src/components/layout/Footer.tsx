import React, { useRef, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ShieldCheck, Sparkles, Truck, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { handleInternalLinkClick } from '../../utils/navigation';

export const Footer: React.FC = () => {
  const { navigateTo, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const newsletterEmailRef = useRef<HTMLInputElement>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterError('Enter a valid email address.');
      newsletterEmailRef.current?.focus();
      return;
    }
    setNewsletterError('');
    setIsSubscribed(true);
    showToast('Welcome to the TISHNAGII Gazette! Check your inbox for your 10% welcome code.');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#2A0814] text-[#FAF7F2] border-t border-[#380E1C] mt-24">
      {/* Trust & Craftsmanship Bar */}
      <div className="border-b border-[#380E1C]/80 py-8 bg-[#230611]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#380E1C] border border-[#C49A45]/30 flex items-center justify-center shrink-0 text-[#C49A45]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-serif tracking-wide text-[#FAF7F2]">Insured Express Delivery</h4>
                <p className="text-xs text-[#FAF7F2]/60 mt-0.5">Complimentary pan-India over <span className="tabular-nums">₹1,499</span></p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#380E1C] border border-[#C49A45]/30 flex items-center justify-center shrink-0 text-[#C49A45]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-serif tracking-wide text-[#FAF7F2]">22K Antique Micron Gold</h4>
                <p className="text-xs text-[#FAF7F2]/60 mt-0.5">Electro-shielded anti-tarnish finish</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#380E1C] border border-[#C49A45]/30 flex items-center justify-center shrink-0 text-[#C49A45]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-serif tracking-wide text-[#FAF7F2]">100% Hypoallergenic</h4>
                <p className="text-xs text-[#FAF7F2]/60 mt-0.5">Lead, nickel & cadmium-free brass core</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#380E1C] border border-[#C49A45]/30 flex items-center justify-center shrink-0 text-[#C49A45]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-serif tracking-wide text-[#FAF7F2]">7-Day Doorstep Returns</h4>
                <p className="text-xs text-[#FAF7F2]/60 mt-0.5">Hassle-free reverse pick-up</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Story Column (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="/" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('home'))} className="block min-h-11 min-w-11 text-left touch-manipulation focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45]">
              <span className="font-serif text-3xl font-medium tracking-[0.25em] text-[#FAF7F2]">
                TISHNAGII
              </span>
              <div className="text-xs tracking-[0.25em] text-[#C49A45] mt-1 font-light">
                तिश्नगी · ETERNAL YEARNING FOR BEAUTY
              </div>
            </a>

            <p className="text-sm text-[#FAF7F2]/70 leading-relaxed max-w-sm">
              Born from the poetic Urdu word <em className="text-[#C49A45] font-serif not-italic">Tishnagi</em>, representing a deep, insatiable thirst for timeless art. We unite 400-year-old Rajasthani karigar traditions with contemporary comfort, making regal Kundan, Polki, and temple jewellery effortless to wear and cherish.
            </p>

            <div className="pt-2 text-xs text-[#FAF7F2]/60 space-y-1">
              <div>Atelier: Johari Bazaar & C-Scheme, Jaipur, Rajasthan, India</div>
              <div>
                Client Care:{' '}
                <a href="mailto:care@tishnagii.com" className="text-[#D4AE58] hover:underline touch-manipulation">
                  care@tishnagii.com
                </a>{' '}
                ·{' '}
                <a href="tel:+919820012345" className="text-[#D4AE58] hover:underline touch-manipulation">
                  +91 98200 12345
                </a>
              </div>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold">
              Collections
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF7F2]/80">
              <li>
                <a href="/shop?category=necklaces" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop', undefined, 'necklaces'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Necklaces & Chokers
                </a>
              </li>
              <li>
                <a href="/shop?category=earrings" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop', undefined, 'earrings'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Earrings & Temple Jhumkas
                </a>
              </li>
              <li>
                <a href="/shop?category=bridal-sets" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop', undefined, 'bridal-sets'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Royal Bridal Suites
                </a>
              </li>
              <li>
                <a href="/shop?category=bangles" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop', undefined, 'bangles'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Bangles & Screw Kadas
                </a>
              </li>
              <li>
                <a href="/shop?category=maang-tikka" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop', undefined, 'maang-tikka'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Maang Tikka & Passa
                </a>
              </li>
              <li>
                <a href="/shop?category=rings" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop', undefined, 'rings'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Cocktail Rings
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF7F2]/80">
              <li>
                <a href="/contact" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('contact'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Bespoke Bridal Concierge
                </a>
              </li>
              <li>
                <a href="/faq" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('faq'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="/shipping" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shipping'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Shipping & Pan-India Delivery
                </a>
              </li>
              <li>
                <a href="/returns" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('returns'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  7-Day Returns & Refunds
                </a>
              </li>
              <li>
                <a href="/about" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('about'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Our Karigars & Craft Story
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('blog'))} className="hover:text-[#FAF7F2] hover:underline transition-colors text-left">
                  Journal
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold">
              The Gazette
            </h4>
            <p className="text-xs text-[#FAF7F2]/70 leading-relaxed">
              Subscribe to receive private preview invitations to rare limited-batch editions and receive 10% off your inaugural order.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#380E1C] border border-[#C49A45]/40 rounded text-xs text-[#FAF7F2]">
                <CheckCircle2 className="w-4 h-4 text-[#C49A45]" />
                <span>You are subscribed. Use code <strong>ROYAL10</strong> at checkout!</span>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    ref={newsletterEmailRef}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    spellCheck={false}
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      setNewsletterError('');
                    }}
                    placeholder="name@example.com…"
                    aria-label="Email for newsletter"
                    aria-invalid={Boolean(newsletterError)}
                    aria-describedby={newsletterError ? 'newsletter-email-error' : undefined}
                    className="w-full bg-[#1B060D] border border-[#380E1C] px-3 py-2 text-xs text-[#FAF7F2] placeholder-[#FAF7F2]/40 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45]"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#C49A45] text-[#2A0814] font-medium text-xs rounded hover:bg-[#D4AE58] transition-colors flex items-center cursor-pointer touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {newsletterError && (
                  <p id="newsletter-email-error" className="text-xs text-[#FFD5D5]" role="alert" aria-live="polite">
                    {newsletterError}
                  </p>
                )}
                <span className="text-[11px] text-[#FAF7F2]/50 block">
                  We respect your privacy. Zero spam ever.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-12 mt-12 border-t border-[#380E1C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F2]/50 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} TISHNAGII JEWELS LLP. All rights reserved.</span>
            <span>·</span>
            <a href="/privacy" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('privacy'))} className="hover:text-[#FAF7F2] transition-colors underline">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="/terms" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('terms'))} className="hover:text-[#FAF7F2] transition-colors underline">
              Terms of Service
            </a>
            <span>·</span>
            <a href="/sitemap" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('sitemap'))} className="hover:text-[#FAF7F2] transition-colors underline">
              Sitemap & Search Index
            </a>
          </div>

          <div className="text-[11px] text-[#FAF7F2]/60">
            Handcrafted with Pride in Jaipur, India
          </div>
        </div>
      </div>
    </footer>
  );
};

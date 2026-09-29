import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ShieldCheck, Sparkles, Truck, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
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
                <p className="text-xs text-[#FAF7F2]/60 mt-0.5">Complimentary pan-India over ₹1,499</p>
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
            <div className="cursor-pointer" onClick={() => navigateTo('home')}>
              <span className="font-serif text-3xl font-medium tracking-[0.25em] text-[#FAF7F2]">
                TISHNAGII
              </span>
              <div className="text-xs tracking-[0.25em] text-[#C49A45] mt-1 font-light">
                तिश्नगी · ETERNAL YEARNING FOR BEAUTY
              </div>
            </div>

            <p className="text-sm text-[#FAF7F2]/70 leading-relaxed max-w-sm">
              Born from the poetic Urdu word <em className="text-[#C49A45] font-serif not-italic">Tishnagi</em>, representing a deep, insatiable thirst for timeless art. We unite 400-year-old Rajasthani karigar traditions with contemporary comfort, making regal Kundan, Polki, and temple jewellery effortless to wear and cherish.
            </p>

            <div className="pt-2 text-xs text-[#FAF7F2]/60 space-y-1">
              <div>Atelier: Johari Bazaar & C-Scheme, Jaipur, Rajasthan, India</div>
              <div>
                Client Care:{' '}
                <a href="mailto:care@tishnagii.com" className="text-[#D4AE58] hover:underline">
                  care@tishnagii.com
                </a>{' '}
                ·{' '}
                <a href="tel:+919820012345" className="text-[#D4AE58] hover:underline">
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
                <button
                  onClick={() => navigateTo('shop', undefined, 'necklaces')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Necklaces & Chokers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'earrings')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Earrings & Temple Jhumkas
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'bridal-sets')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Royal Bridal Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'bangles')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Bangles & Screw Kadas
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'maang-tikka')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Maang Tikka & Passa
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'rings')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Cocktail Rings
                </button>
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
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Bespoke Bridal Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shipping')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Shipping & Pan-India Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('returns')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  7-Day Returns & Refunds
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  Our Karigars & Craft Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('blog')}
                  className="hover:text-[#FAF7F2] hover:underline transition-colors text-left"
                >
                  The TISHNAGII Gazette
                </button>
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
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    aria-label="Email for newsletter"
                    className="w-full bg-[#1B060D] border border-[#380E1C] px-3 py-2 text-xs text-[#FAF7F2] placeholder-[#FAF7F2]/40 rounded focus:outline-none focus:border-[#C49A45]"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#C49A45] text-[#2A0814] font-medium text-xs rounded hover:bg-[#D4AE58] transition-colors flex items-center cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
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
            <button
              onClick={() => navigateTo('privacy')}
              className="hover:text-[#FAF7F2] transition-colors underline"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('terms')}
              className="hover:text-[#FAF7F2] transition-colors underline"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('sitemap')}
              className="hover:text-[#FAF7F2] transition-colors underline"
            >
              Sitemap & Search Index
            </button>
          </div>

          <div className="text-[11px] text-[#FAF7F2]/60">
            Handcrafted with Pride in Jaipur, India
          </div>
        </div>
      </div>
    </footer>
  );
};

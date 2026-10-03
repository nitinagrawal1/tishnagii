import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES, ASSETS } from '@shared/data/mockData';
import { ProductCard } from '../components/common/ProductCard';
import { AskAwayFAQ } from '../components/home/AskAwayFAQ';
import { BoldGraphicHero } from '../components/home/BoldGraphicHero';
import { ArrowRight } from 'lucide-react';
import { handleInternalLinkClick } from '../utils/navigation';

const patronTestimonials = [
  {
    name: 'Amelia',
    occasion: 'Destination Wedding',
    image: ASSETS.patronSangeet,
    imageAlt: 'Tishnagii patron wearing a Kundan necklace at a wedding',
    quotes: [
      'These should be staple for every Indian wedding guest.',
      'They actually look and feel like 22K ancestral gold. The polki lustre is so soft and candlelit, you might mistake them for family heirlooms yourself.',
    ],
  },
  {
    name: 'Hamna',
    occasion: 'Sangeet Night',
    image: ASSETS.patronTempleJhumka,
    imageAlt: 'Tishnagii patron wearing temple jhumkas',
    quotes: [
      'I have the hardest time wearing heavy artificial sets without allergic itching. It’s like my skin can smell nickel and immediately flares up.',
      'I love my Tishnagii pieces though! Danced 5 hours at the Sangeet with zero pinching or redness. The silicone cushions on the jhumkas are pure magic.',
    ],
  },
  {
    name: 'Dior',
    occasion: 'Jaipur Heritage',
    image: ASSETS.patronEmerald,
    imageAlt: 'Tishnagii patron dressed in an emerald bridal suite',
    quotes: [
      'Dior will perform acts and tricks for these jewels! The weight feels so substantial yet balanced, and the meenakari on the reverse is immaculate.',
    ],
  },
  {
    name: 'Sylo',
    occasion: 'Royal Bride',
    image: ASSETS.patronFestiveKadas,
    imageAlt: 'Tishnagii patron wearing festive kadas',
    quotes: [
      'My family absolutely loves Tishnagii! As soon as the package arrived, my mother ran over with her magnifying glass.',
      "They're clearly one of my all-time favorites, and I love knowing I'm wearing hypoallergenic pieces that look so regal in our wedding portraits. Definitely a staple in our house!",
    ],
  },
];

export const HomePage: React.FC = () => {
  const { navigateTo } = useShop();

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Bold Graphic D2C Hero Section (Matching Reference Design) */}
      <BoldGraphicHero />

      {/* 2. Curated Jewellery Suites / Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#EADBCE]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2A0814] font-medium">
              Explore by Jewellery Suite
            </h2>
          </div>
          <a
            href="/categories"
            onClick={(event) => handleInternalLinkClick(event, () => navigateTo('categories'))}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-[#2A0814] transition-colors hover:text-[#C49A45] md:mt-0 group"
          >
            <span>View All Categories</span>
            <span className="transition-transform group-hover:translate-x-1"><ArrowRight className="w-3.5 h-3.5" /></span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.id)}`}
              onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop', undefined, cat.id))}
              className="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xs border border-[#EADBCE] bg-[#F4EFEA] transition-colors hover:border-[#C49A45]"
            >
              <div className="aspect-square overflow-hidden bg-[#FAF7F2]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  width={600}
                  height={600}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-serif text-sm font-medium text-[#2A0814] group-hover:text-[#4A1525] break-words">
                  {cat.name}
                </h3>
                <span className="mt-0.5 block text-xs font-mono tabular-nums text-[#4A1525]/70">
                  {cat.itemCount} Designs
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 3. Featured New Arrivals (3-4 columns balanced grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EADBCE]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold block mb-1">
              New Editions
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2A0814] font-medium">
              Heirloom Statements of the Season
            </h2>
          </div>
          <a
            href="/shop"
            onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop'))}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-[#2A0814] transition-colors hover:text-[#C49A45] md:mt-0 group"
          >
            <span>Browse Full Catalogue</span>
            <span className="transition-transform group-hover:translate-x-1"><ArrowRight className="w-3.5 h-3.5" /></span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Editorial Craftsmanship Story Spotlight */}
      <section className="bg-[#2A0814] text-[#FAF7F2] py-16 sm:py-24 border-y border-[#380E1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Documentary Image of Jaipur Artisan */}
            <div className="lg:col-span-6">
              <div className="relative aspect-4/3 rounded-xs overflow-hidden border border-[#C49A45]/30 shadow-2xl">
                <img
                  src={ASSETS.artisanCraftsmanship}
                  alt="Master Karigar handcrafting TISHNAGII jewellery in Jaipur"
                  width={1200}
                  height={900}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0814]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 text-xs text-[#FAF7F2]/90">
                  <span className="font-serif text-sm block">Hand Taksal & Meenakari Enamelling</span>
                  <span className="text-xs text-[#F7EFCF]">Johari Bazaar Workshop, Jaipur</span>
                </div>
              </div>
            </div>

            {/* Editorial Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AE58] font-semibold block">
                The Karigar Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-medium leading-tight">
                Why Carry the Weight of Fear When You Can Wear the Majesty of Art?
              </h2>
              <p className="text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
                Traditional fine jewellery locks millions into bank lockers, weighed down by high insurance costs and wedding day anxiety. TISHNAGII was established to liberate the Indian woman’s relationship with royal adornment.
              </p>
              <p className="text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
                Each creation begins with a hypoallergenic jeweller’s brass matrix, electro-plated with 22-karat antique micron gold and sealed against oxidation. Real Jaipur karigars set every hydro-cut polki stone by hand and paint the reverse with Persian meenakari motifs.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#380E1C] text-center font-mono">
                <div>
                  <span className="text-2xl font-serif text-[#D4AE58] block">400+</span>
                  <span className="text-xs text-[#FAF7F2]/80 uppercase tracking-wider">Years of Craft Heritage</span>
                </div>
                <div>
                  <span className="text-2xl font-serif text-[#D4AE58] block">22K</span>
                  <span className="text-xs text-[#FAF7F2]/80 uppercase tracking-wider">Micron Gold Finish</span>
                </div>
                <div>
                  <span className="text-2xl font-serif text-[#D4AE58] block">100%</span>
                  <span className="text-xs text-[#FAF7F2]/80 uppercase tracking-wider">Nickel & Lead Free</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/about"
                  onClick={(event) => handleInternalLinkClick(event, () => navigateTo('about'))}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xs bg-[#FAF7F2] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#2A0814] transition-colors hover:bg-[#EADBCE]"
                >
                  <span>Read The TISHNAGII Story</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EADBCE]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold block mb-1">
              Beloved by Brides & Connoisseurs
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2A0814] font-medium">
              The TISHNAGII Bestsellers
            </h2>
          </div>
          <a
            href="/shop"
            onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop'))}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-[#2A0814] transition-colors hover:text-[#C49A45] md:mt-0 group"
          >
            <span>View All Bestsellers</span>
            <span className="transition-transform group-hover:translate-x-1"><ArrowRight className="w-3.5 h-3.5" /></span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. Instagram Community Testimonials (@tishnagii) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#181517] p-5 text-white shadow-2xl sm:rounded-3xl sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
            <a
              href="https://instagram.com/tishnagii"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 group cursor-pointer touch-manipulation"
            >
              {/* Instagram Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
                <div className="w-full h-full bg-[#181517] rounded-[10px] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
              </div>

              <div>
                <h2 className="min-w-0 break-words text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#C49A45] flex items-center gap-2 sm:text-2xl md:text-3xl">
                  Follow us @tishnagii
                </h2>
                <p className="text-xs uppercase tracking-[0.18em] text-[#C49A45] font-semibold sm:tracking-[0.25em]">
                  REAL PATRONS. REAL OPINIONS.
                </p>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-white/70 max-w-sm hidden md:block text-right font-light leading-relaxed">
              The comments section, but lovelier. Dressed in heritage, captured in celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex min-h-72 flex-col justify-between rounded-2xl bg-[#C73D14] p-6 text-white shadow-sm sm:min-h-0">
              <span translate="no" className="font-serif text-2xl font-bold tracking-normal">
                tishnagii
              </span>
              <p className="font-sans text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Real feedback.
              </p>
            </div>

            {patronTestimonials.map((testimonial) => (
              <article key={testimonial.name} className="min-w-0 overflow-hidden rounded-2xl bg-white text-[#1C1819] shadow-sm">
                <figure className="flex h-full flex-col">
                  <div className="aspect-[4/3] overflow-hidden bg-[#2A0814]">
                    <img
                      src={testimonial.image}
                      alt={testimonial.imageAlt}
                      width={600}
                      height={450}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <figcaption className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-base font-bold leading-tight text-[#1C1819] sm:text-lg">
                      {testimonial.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#4A1525]">
                      {testimonial.occasion}
                    </p>
                    <blockquote className="mt-4 space-y-3 text-sm leading-relaxed text-[#30292A]">
                      {testimonial.quotes.map((quote) => <p key={quote}>{quote}</p>)}
                    </blockquote>
                  </figcaption>
                </figure>
              </article>
            ))}

            <figure className="group relative min-h-72 overflow-hidden rounded-2xl bg-[#2A0814] shadow-sm sm:min-h-0">
              <img
                src={ASSETS.heroCampaign}
                alt="Tishnagii bridal patron celebrating"
                width={600}
                height={800}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1B060D]/90 to-transparent px-5 pb-5 pt-12 text-sm font-medium text-white">
                TISHNAGII at the celebration
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 7. Ask Away (FAQ Showcase matching reference design) */}
      <AskAwayFAQ />
    </div>
  );
};

import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES, BLOG_POSTS, ASSETS } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';
import { AskAwayFAQ } from '../components/home/AskAwayFAQ';
import { BoldGraphicHero } from '../components/home/BoldGraphicHero';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Star, Award, Compass } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo } = useShop();

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);
  const featuredPost = BLOG_POSTS[0];
  const journalListPosts = BLOG_POSTS.slice(1, 4);

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
          <button
            onClick={() => navigateTo('categories')}
            className="mt-3 md:mt-0 text-xs font-semibold text-[#2A0814] hover:text-[#C49A45] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('shop', undefined, cat.id)}
              className="group cursor-pointer flex flex-col bg-[#F4EFEA] border border-[#EADBCE] rounded-xs overflow-hidden hover:border-[#C49A45] transition-all"
            >
              <div className="aspect-square overflow-hidden bg-[#FAF7F2]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-serif text-sm font-medium text-[#2A0814] group-hover:text-[#4A1525] break-words">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-[#4A1525]/60 mt-0.5 block font-mono tabular-nums">
                  {cat.itemCount} Designs
                </span>
              </div>
            </div>
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
          <button
            onClick={() => navigateTo('shop')}
            className="mt-3 md:mt-0 text-xs font-semibold text-[#2A0814] hover:text-[#C49A45] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
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
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0814]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 text-xs text-[#FAF7F2]/90">
                  <span className="font-serif text-sm block">Hand Taksal & Meenakari Enamelling</span>
                  <span className="text-[10px] text-[#D4AE58]">Johari Bazaar Workshop, Jaipur</span>
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
                  <span className="text-[10px] text-[#FAF7F2]/60 uppercase tracking-wider">Years of Craft Heritage</span>
                </div>
                <div>
                  <span className="text-2xl font-serif text-[#D4AE58] block">22K</span>
                  <span className="text-[10px] text-[#FAF7F2]/60 uppercase tracking-wider">Micron Gold Finish</span>
                </div>
                <div>
                  <span className="text-2xl font-serif text-[#D4AE58] block">100%</span>
                  <span className="text-[10px] text-[#FAF7F2]/60 uppercase tracking-wider">Nickel & Lead Free</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('about')}
                  className="py-3 px-6 bg-[#FAF7F2] hover:bg-[#EADBCE] text-[#2A0814] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Read The TISHNAGII Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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
          <button
            onClick={() => navigateTo('shop')}
            className="mt-3 md:mt-0 text-xs font-semibold text-[#2A0814] hover:text-[#C49A45] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. Instagram Community Testimonials (@tishnagii) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#181517] text-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-2xl border border-white/5 space-y-6 sm:space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
            <a
              href="https://instagram.com/tishnagii"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 group cursor-pointer"
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
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-[#C49A45] transition-colors flex items-center gap-2">
                  Follow us @tishnagii
                </h2>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C49A45] font-semibold">
                  REAL PATRONS. REAL OPINIONS.
                </p>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-white/70 max-w-sm hidden md:block text-right font-light leading-relaxed">
              The comments section, but lovelier. Dressed in heritage, captured in celebration.
            </p>
          </div>

          {/* 2x5 Grid of Testimonials & Patron Moments */}
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[230px] sm:auto-cols-[260px] lg:grid-rows-none lg:grid-flow-row lg:grid-cols-5 gap-3.5 sm:gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
            
            {/* ROW 1: Card 1 - Anchor Terracotta Brand Card */}
            <div className="bg-[#C73D14] text-white rounded-[20px] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden aspect-[3/4] select-none shadow-sm">
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-normal text-white">
                tishnagii
              </span>
              <div className="absolute bottom-6 left-16 origin-bottom-left -rotate-90 sm:left-18 lg:bottom-4 lg:left-20">
                <p className="font-sans font-bold text-3xl sm:text-4xl lg:text-[40px] leading-[0.88] tracking-tight text-white whitespace-nowrap">
                  Real<br />feedback.
                </p>
              </div>
            </div>

            {/* ROW 1: Card 2 - Patron Photo 1 */}
            <div className="rounded-[20px] overflow-hidden aspect-[3/4] bg-[#2A0814] shadow-sm">
              <img
                src={ASSETS.patronSangeet}
                alt="Tishnagii patron wearing Kundan necklace at a wedding"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* ROW 1: Card 3 - White Quote Card 1 (Amelia) */}
            <div className="bg-white text-[#1C1819] rounded-[20px] p-5 sm:p-6 flex flex-col justify-start shadow-sm">
              <h3 className="font-sans font-bold text-base sm:text-lg text-black leading-tight">
                Amelia<br />
                <span className="text-xs sm:text-sm font-semibold text-black/70">(Destination Wedding)</span>
              </h3>
              <div className="mt-4 space-y-2.5 text-xs sm:text-[13px] text-black/85 leading-relaxed">
                <p>These should be staple for every Indian wedding guest.</p>
                <p>They actually look and feel like 22K ancestral gold. The polki lustre is so soft and candlelit, you might mistake them for family heirlooms yourself.</p>
              </div>
            </div>

            {/* ROW 1: Card 4 - Patron Photo 2 */}
            <div className="rounded-[20px] overflow-hidden aspect-[3/4] bg-[#2A0814] shadow-sm">
              <img
                src={ASSETS.patronTempleJhumka}
                alt="Tishnagii patron wearing temple jhumkas"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* ROW 1: Card 5 - White Quote Card 2 (Hamna) */}
            <div className="bg-white text-[#1C1819] rounded-[20px] p-5 sm:p-6 flex flex-col justify-start shadow-sm">
              <h3 className="font-sans font-bold text-base sm:text-lg text-black leading-tight">
                Hamna<br />
                <span className="text-xs sm:text-sm font-semibold text-black/70">(Sangeet Night)</span>
              </h3>
              <div className="mt-3 space-y-2 text-xs sm:text-[12.5px] text-black/85 leading-relaxed">
                <p>I have the hardest time wearing heavy artificial sets without allergic itching. It’s like my skin can smell nickel and immediately flares up.</p>
                <p>I love my Tishnagii pieces though! Danced 5 hours at the Sangeet with zero pinching or redness. The silicone cushions on the jhumkas are pure magic.</p>
              </div>
            </div>

            {/* ROW 2: Card 6 - Patron Photo 3 */}
            <div className="rounded-[20px] overflow-hidden aspect-[3/4] bg-[#2A0814] shadow-sm">
              <img
                src={ASSETS.patronEmerald}
                alt="Tishnagii patron dressed in emerald bridal suite"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* ROW 2: Card 7 - White Quote Card 3 (Dior) */}
            <div className="bg-white text-[#1C1819] rounded-[20px] p-5 sm:p-6 flex flex-col justify-start shadow-sm">
              <h3 className="font-sans font-bold text-base sm:text-lg text-black leading-tight">
                Dior<br />
                <span className="text-xs sm:text-sm font-semibold text-black/70">(Jaipur Heritage)</span>
              </h3>
              <div className="mt-4 space-y-2 text-xs sm:text-[13px] text-black/85 leading-relaxed">
                <p>Dior will perform acts and tricks for these jewels! The weight feels so substantial yet balanced, and the meenakari on the reverse is immaculate.</p>
              </div>
            </div>

            {/* ROW 2: Card 8 - Patron Photo 4 with Instagram Badge */}
            <div className="rounded-[20px] overflow-hidden aspect-[3/4] bg-[#2A0814] relative shadow-sm group">
              <img
                src={ASSETS.patronFestiveKadas}
                alt="Tishnagii festive patrons sharing on Instagram"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg">
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
                <span className="text-[10px] tracking-widest text-white font-mono font-bold uppercase mt-2 drop-shadow-md">
                  @tishnagii
                </span>
              </div>
            </div>

            {/* ROW 2: Card 9 - White Quote Card 4 (Sylo) */}
            <div className="bg-white text-[#1C1819] rounded-[20px] p-5 sm:p-6 flex flex-col justify-start shadow-sm">
              <h3 className="font-sans font-bold text-base sm:text-lg text-black leading-tight">
                Sylo<br />
                <span className="text-xs sm:text-sm font-semibold text-black/70">(Royal Bride)</span>
              </h3>
              <div className="mt-3 space-y-2 text-xs sm:text-[12.5px] text-black/85 leading-relaxed">
                <p>My family absolutely loves Tishnagii! As soon as the package arrived, my mother ran over with her magnifying glass.</p>
                <p>They're clearly one of my all-time favorites, and I love knowing I'm wearing hypoallergenic pieces that look so regal in our wedding portraits. Definitely a staple in our house!</p>
              </div>
            </div>

            {/* ROW 2: Card 10 - Patron Photo 5 */}
            <div className="rounded-[20px] overflow-hidden aspect-[3/4] bg-[#2A0814] shadow-sm">
              <img
                src={ASSETS.heroCampaign}
                alt="Tishnagii bridal patron celebrating"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 7. Journal & Styling Highlights (Stories & styling notes) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C49A45] font-semibold block mb-2">
              The Journal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#380E1C] tracking-tight">
              Stories & styling notes
            </h2>
          </div>
          <button
            onClick={() => navigateTo('blog')}
            className="text-xs sm:text-sm text-[#2A0814] hover:text-[#C49A45] transition-colors flex items-center gap-1.5 cursor-pointer font-normal group self-start sm:self-end pb-1"
          >
            <span>Read the journal</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* 2-Column Asymmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          {/* Left Column: Dominant Featured Article */}
          {featuredPost && (
            <article
              onClick={() => navigateTo('blog-detail', featuredPost.slug)}
              className="lg:col-span-7 group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#2A0814] rounded-xs shadow-xs">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              </div>
              <div className="pt-5 space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C49A45] font-semibold block">
                  {featuredPost.shortCategory || 'STYLING'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#2A0814] font-normal leading-snug group-hover:text-[#4A1525] transition-colors">
                  {featuredPost.title}
                </h3>
              </div>
            </article>
          )}

          {/* Right Column: 3 Editorial Stories Stacked with Dividers */}
          <div className="lg:col-span-5 divide-y divide-[#EADBCE]">
            {journalListPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigateTo('blog-detail', post.slug)}
                className="group cursor-pointer py-5 first:pt-0 last:pb-0 flex items-start gap-4 sm:gap-5"
              >
                {/* Thumbnail Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 aspect-square overflow-hidden bg-[#F4EFEA] rounded-xs">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5 space-y-1 sm:space-y-1.5">
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#C49A45] font-semibold block">
                    {post.shortCategory || post.category}
                  </span>
                  <h4 className="font-serif text-base sm:text-lg text-[#2A0814] font-normal leading-snug group-hover:text-[#4A1525] transition-colors break-words">
                    {post.title}
                  </h4>
                  <span className="text-xs text-[#4A1525]/60 font-light block pt-1">
                    {post.date}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Ask Away (FAQ Showcase matching reference design) */}
      <AskAwayFAQ />
    </div>
  );
};

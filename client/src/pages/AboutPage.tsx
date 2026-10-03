import React from 'react';
import { useShop } from '../context/ShopContext';
import { ASSETS } from '@shared/data/mockData';
import { Sparkles, Shield, HeartHandshake, Compass, ArrowRight } from 'lucide-react';
import { handleInternalLinkClick } from '../utils/navigation';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="space-y-20 py-10">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block">
          The Genesis of TISHNAGII
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2A0814] font-medium leading-tight">
          Born from the Poetic Yearning for Sublime Artistry
        </h1>
        <p className="text-sm sm:text-base text-[#4A1525]/80 max-w-2xl mx-auto font-light leading-relaxed">
          In classical Urdu poetry, <strong className="font-serif text-[#2A0814]">तिश्नगी (Tishnagi)</strong> evokes a beautiful, unquenched thirst—a longing for that which transcends the ordinary.
        </p>
      </section>

      {/* Narrative Section 1: The Dilemma & The Liberation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold block">
              The Philosophy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2A0814] font-medium leading-snug">
              Jewellery is Meant to Be Celebrated, Not Imprisoned in Bank Lockers.
            </h2>
            <p className="text-xs sm:text-sm text-[#4A1525]/80 leading-relaxed font-light">
              For generations, royal Indian fine jewellery has carried an unspoken shadow: fear. Families carry multi-lakh bullion ornaments to destination weddings with armed guards, spend evenings terrified of misplaced earrings, and immediately rush them back to velvet bank vaults the morning after.
            </p>
            <p className="text-xs sm:text-sm text-[#4A1525]/80 leading-relaxed font-light">
              TISHNAGII was created to shatter this cage. We asked a fundamental question: <em className="italic text-[#2A0814]">What makes jewellery magnificent?</em> Is it the cold financial weight of bullion, or the centuries of human soul, symmetry, and poetic craftsmanship poured into every curve?
            </p>
            <p className="text-xs sm:text-sm text-[#4A1525]/80 leading-relaxed font-light">
              By replacing bullion with dense, hypoallergenic jeweller’s brass and encasing it in 22-karat antique micron gold, we give women the royal grandeur of Maharani Gayatri Devi with absolute peace of mind.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 rounded-xs overflow-hidden border border-[#EADBCE] shadow-xl">
              <img
                src={ASSETS.heroCampaign}
                alt="TISHNAGII royal adornment aesthetic"
                width={1200}
                height={900}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section 2: Jaipur Atelier & Karigars */}
      <section className="bg-[#2A0814] text-[#FAF7F2] py-16 sm:py-24 border-y border-[#380E1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-4/3 rounded-xs overflow-hidden border border-[#C49A45]/30 shadow-2xl">
                <img
                  src={ASSETS.artisanCraftsmanship}
                  alt="Jaipur Karigar at work"
                  width={1200}
                  height={900}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AE58] font-semibold block">
                The Karigar Collective
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-medium leading-tight">
                Preserving 400 Years of Jaipur Metalcraft
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
                Our workshop is nestled in the historic havelis of Johari Bazaar in Jaipur. Here, third and fourth-generation karigars practice the exacting arts of <strong className="text-[#D4AE58]">Taksal</strong> (hand metal chiseling), <strong className="text-[#D4AE58]">Jhadai</strong> (hand stone-setting with pure silver leafing), and <strong className="text-[#D4AE58]">Meenakari</strong> (mineral enamel firing at 800°C).
              </p>
              <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
                Every single TISHNAGII creation takes between 14 to 36 hours of patient human craft. We provide fair living wages, healthcare, and workshop micro-grants to our master karigars, ensuring these endangered historic crafts flourish for another generation.
              </p>

              <div className="pt-2">
                <a
                  href="/shop"
                  onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop'))}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xs bg-[#C49A45] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#2A0814] transition-colors hover:bg-[#D4AE58]"
                >
                  <span>Experience The Craft</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Craftsmanship Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#C49A45] font-semibold block mb-1">
            Our Standards
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2A0814] font-medium">
            The Anatomy of TISHNAGII Luxury
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F4EFEA] border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#2A0814]">
              22K Antique Micron Gold Plating
            </h3>
            <p className="text-xs text-[#4A1525]/75 leading-relaxed font-light">
              Unlike cheap flash-plated imitation jewellery that fades in months, we apply substantial 22-karat electroplated micron gold sealed with an invisible hydrophobic e-coating.
            </p>
          </div>

          <div className="p-6 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F4EFEA] border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#2A0814]">
              100% Skin Safe & Hypoallergenic
            </h3>
            <p className="text-xs text-[#4A1525]/75 leading-relaxed font-light">
              Certified zero lead, zero nickel, and zero cadmium. Our surgical-grade alloy posts and silicone stabilizers guarantee zero green discoloration or earlobe irritation.
            </p>
          </div>

          <div className="p-6 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F4EFEA] border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#2A0814]">
              Ethical Karigar Collective
            </h3>
            <p className="text-xs text-[#4A1525]/75 leading-relaxed font-light">
              We eliminate exploitative middlemen, working directly with master jewellery families in Jaipur, Kolkata, and Madurai with guaranteed fair wages and ethical workshop conditions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

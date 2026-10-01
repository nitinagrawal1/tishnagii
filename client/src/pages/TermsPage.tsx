import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-[#EADBCE] pb-6">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block">
          Client Agreement
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#2A0814]">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#4A1525]/60 font-mono">
          TISHNAGII JEWELS LLP · Johari Bazaar, Jaipur, Rajasthan
        </p>
      </div>

      <div className="bg-[#FAF7F2] p-8 border border-[#EADBCE] rounded-xs space-y-6 text-xs sm:text-sm text-[#4A1525]/85 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            1. Nature of Products & Artificial Jewellery Disclosure
          </h2>
          <p>
            TISHNAGII (तिश्नगी) explicitly manufactures and markets artisanal high-fashion and imitation artificial jewellery. Our pieces are crafted using jeweller’s brass alloys, copper matrices, hydro-cut simulated polki glass, faux cultured pearls, and lab-created stones, electroplated with 22K/24K antique micron gold. Unless explicitly stated otherwise, items do not contain solid mined bullion gold or certified mined diamonds.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            2. Handcrafted Variations
          </h2>
          <p>
            Due to the traditional hand-taksal, jhadai stone-setting, and hand-painted meenakari enameling practiced by our Jaipur karigars, slight nuances in stone shade, enamel brushstrokes, and metal patina may occur. These are authentic hallmarks of human craftsmanship, not industrial defects.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            3. Pricing & Taxes
          </h2>
          <p>
            All prices listed on the storefront are denominated in Indian Rupees (INR) and inclusive of all applicable Goods and Services Tax (GST). Delivery charges, where applicable, are calculated and clearly shown prior to order confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            4. Plating Care & Warranty
          </h2>
          <p>
            Every piece is protected by our hydrophobic anti-tarnish barrier. Longevity of plating depends on adhering to our care rituals (avoiding direct exposure to perfumes, alcohol-based sanitisers, lotions, chlorine, or immersion in liquids).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            5. Intellectual Property & Brand Trademarks
          </h2>
          <p>
            The trademark TISHNAGII, the Devanagari script logomark, product photography, editorial prose, and design motifs are the proprietary intellectual property of TISHNAGII JEWELS LLP. Unauthorized reproduction is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            6. Governing Jurisdiction
          </h2>
          <p>
            Any disputes arising out of purchases or platform usage shall be subject to the exclusive jurisdiction of the competent courts in Jaipur, Rajasthan, India.
          </p>
        </section>
      </div>
    </div>
  );
};

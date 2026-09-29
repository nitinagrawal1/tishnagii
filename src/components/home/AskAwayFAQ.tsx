import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';
import { Plus, X } from 'lucide-react';

export interface FAQItemData {
  question: string;
  answer: string;
}

export const ASK_AWAY_FAQS: FAQItemData[] = [
  {
    question: 'Will the 22K antique gold plating fade, tarnish, or turn black?',
    answer:
      'Every TISHNAGII creation undergoes a rigorous triple-tier plating ritual: a nickel-free hypoallergenic jeweller’s brass matrix, electroplated with real 22-karat antique micron gold, and vacuum-sealed with an invisible ceramic anti-oxidation shield. With our simple "last on, first off" care ritual, your piece retains its warm heritage luster across years of celebrations.',
  },
  {
    question: 'Does artificial jewellery look authentic in wedding photography and real life?',
    answer:
      'Indistinguishable to the naked eye. We use hand-cut hydro-polki glass stones that replicate the exact refractive candlelit depth of uncut Nizam diamonds, combined with authentic Jaipur taksal foil settings and hand-painted Persian meenakari enameling on the reverse. You enjoy the grandeur of royal jewellery with zero bank-locker anxiety.',
  },
  {
    question: 'Is your jewellery heavy? Will statement jhumkas hurt my earlobes?',
    answer:
      'Never. We deliberately engineer our statement earrings and chokers using lightweight hollow-core brass alloys. All chandelier earrings and jhumkas arrive fitted with medical-grade hypoallergenic silicone earlobe cushions and balanced weight distribution for 8+ hours of effortless festive wear.',
  },
  {
    question: 'What if the jewellery gets damaged during transit across India or abroad?',
    answer:
      'Every shipment is 100% transit-insured. Our jewellery is nested in shock-absorbing velvet inserts within reinforced, wax-sealed keepsake gift boxes. In the rare event of transit damage, simply share an unboxing photo within 48 hours for a complimentary immediate express replacement.',
  },
  {
    question: 'Do you offer Cash on Delivery (COD) and what is your return policy?',
    answer:
      'Yes! COD is available across 19,000+ pin codes in India. We also offer a seamless 7-day doorstep return and exchange window. If a necklace does not match your blouse neckline or lehenga palette, our courier collects it directly from your doorstep at zero charge.',
  },
  {
    question: 'Can I request bridal customizations or video consultations before ordering?',
    answer:
      'Absolutely. Our Jaipur Atelier bridal concierge offers complimentary 1-on-1 WhatsApp video consultations. You can show us your outfit fabric, and our master stylists will drape matching suites, adjust dori cord lengths, and customize stone drops to match your shade perfectly.',
  },
  {
    question: 'Is TISHNAGII jewellery completely hypoallergenic for sensitive skin?',
    answer:
      '100% certified nickel-free, cadmium-free, and lead-free. Our proprietary skin-contact alloys comply with international dermal safety standards, ensuring zero itching, skin discoloration, or irritation even in humid Indian monsoon weddings.',
  },
];

export const AskAwayFAQ: React.FC = () => {
  // First item open by default, exactly as shown in reference design
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-[#1A1416] text-[#FAF7F2] py-20 sm:py-28 overflow-hidden relative">
      {/* Subtle background ambient warmth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C49A45]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#380E1C]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Styled Editorial Artwork with Offset Perspective Wireframe */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/5] sm:aspect-[4/5] flex items-center justify-center">
              
              {/* Offset Perspective Geometric Outline Wireframe Frame */}
              <div 
                className="absolute inset-4 sm:inset-6 rounded-2xl border border-white/20 sm:border-white/25 pointer-events-none transform -rotate-3 translate-x-2 -translate-y-2 sm:translate-x-3 sm:-translate-y-3 transition-transform duration-700 ease-out"
                style={{
                  clipPath: 'polygon(0% 4%, 96% 0%, 100% 96%, 4% 100%)',
                }}
              />

              {/* Secondary delicate gold wireframe layer */}
              <div 
                className="absolute inset-2 sm:inset-3 rounded-2xl border border-[#C49A45]/30 pointer-events-none transform rotate-1 -translate-x-1 translate-y-1 transition-transform duration-700"
              />

              {/* Main Angled Editorial Image Container */}
              <div 
                className="relative w-5/6 h-5/6 rounded-2xl overflow-hidden shadow-2xl bg-[#2A0814] transform -rotate-1 hover:rotate-0 transition-transform duration-500 ease-out border border-white/10"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
                }}
              >
                <img
                  src={ASSETS.askAwayEditorial}
                  alt="Radiant woman laughing joyfully in handcrafted jewellery"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                
                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1416]/50 via-transparent to-transparent pointer-events-none" />
              </div>

            </div>
          </div>

          {/* Right Column: "Ask away" Serif Header & Accordion List */}
          <div className="lg:col-span-7 space-y-2">
            
            {/* Elegant Main Heading */}
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#FAF7F2] tracking-tight mb-8 sm:mb-10">
              Ask away
            </h2>

            {/* Accordion List with Thin Dividers */}
            <div className="divide-y divide-white/10 border-t border-white/10">
              {ASK_AWAY_FAQS.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="group">
                    <button
                      onClick={() => toggleItem(idx)}
                      className="w-full py-5 sm:py-6 text-left flex items-start justify-between gap-6 cursor-pointer group-hover:text-[#C49A45] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-base sm:text-lg text-[#FAF7F2] group-hover:text-[#C49A45] transition-colors font-normal leading-relaxed pr-2">
                        {faq.question}
                      </span>
                      
                      {/* Plus / X Icon exactly as shown in reference design */}
                      <span className="shrink-0 pt-1 text-white/50 group-hover:text-[#C49A45] transition-colors">
                        {isOpen ? (
                          <X className="w-4 h-4 stroke-[1.5]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[1.5]" />
                        )}
                      </span>
                    </button>

                    {/* Collapsible Answer */}
                    {isOpen && (
                      <div className="pb-6 sm:pb-7 pr-6 sm:pr-10 text-xs sm:text-sm text-[#FAF7F2]/75 font-light leading-relaxed animate-fade-in">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

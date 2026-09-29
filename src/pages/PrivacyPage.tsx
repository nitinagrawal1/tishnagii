import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-[#EADBCE] pb-6">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block">
          Legal Transparency
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#2A0814]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#4A1525]/60 font-mono">
          Last Updated: February 2026 · Compliant with DPDP Act & Global Privacy Standards
        </p>
      </div>

      <div className="bg-[#FAF7F2] p-8 border border-[#EADBCE] rounded-xs space-y-6 text-xs sm:text-sm text-[#4A1525]/85 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            1. Information We Collect
          </h2>
          <p>
            When you interact with TISHNAGII, we collect information necessary to fulfill your orders and enhance your shopping journey. This includes your name, shipping address, contact phone number, email address, and order history.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            2. Payment Information & 256-Bit SSL Security
          </h2>
          <p>
            All financial transactions (UPI, Credit/Debit cards, Net Banking) are processed through PCI-DSS Level 1 certified banking gateways. TISHNAGII never stores, views, or records your credit card numbers, CVV codes, or UPI PINs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            3. Use of Personal Data
          </h2>
          <p>
            Your information is used exclusively to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process, assemble, and deliver your artificial jewellery orders.</li>
            <li>Send real-time SMS and WhatsApp dispatch notifications and invoices.</li>
            <li>Provide concierge styling and customer care assistance.</li>
            <li>Send editorial journal issues if you opt into The Gazette (unsubscribe at any time).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            4. Absolute Non-Disclosure & Zero-Spam Guarantee
          </h2>
          <p>
            We strictly do not sell, rent, or lease patron records to third-party marketing firms or data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-[#2A0814]">
            5. Contact Our Data Protection Officer
          </h2>
          <p>
            For any queries or requests to review or purge your personal data from our systems, contact privacy@tishnagii.com.
          </p>
        </section>
      </div>
    </div>
  );
};

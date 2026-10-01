import React from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ReturnsPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block">
          Peace of Mind Guarantee
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#2A0814]">
          7-Day Hassle-Free Returns & Refunds
        </h1>
        <p className="text-xs sm:text-sm text-[#4A1525]/75 font-light max-w-xl mx-auto leading-relaxed">
          We want you to adore your TISHNAGII creation. If any piece does not surpass your expectations, our seamless reverse pickup process ensures total confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-2">
          <span className="font-serif text-2xl text-[#C49A45] font-semibold">01</span>
          <h3 className="font-serif text-base font-medium text-[#2A0814]">Raise Request</h3>
          <p className="text-xs text-[#4A1525]/75 font-light">
            Within 7 days of delivery, message our concierge on WhatsApp (+91 98200 12345) or email care@tishnagii.com with your Order ID.
          </p>
        </div>

        <div className="p-6 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-2">
          <span className="font-serif text-2xl text-[#C49A45] font-semibold">02</span>
          <h3 className="font-serif text-base font-medium text-[#2A0814]">Free Doorstep Pickup</h3>
          <p className="text-xs text-[#4A1525]/75 font-light">
            Our courier partner arrives at your address to securely collect the parcel with digital OTP verification.
          </p>
        </div>

        <div className="p-6 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-2">
          <span className="font-serif text-2xl text-[#C49A45] font-semibold">03</span>
          <h3 className="font-serif text-base font-medium text-[#2A0814]">Prompt Refund</h3>
          <p className="text-xs text-[#4A1525]/75 font-light">
            Upon swift verification at our atelier, your full refund is processed within 2–4 business days to original payment method or bank account.
          </p>
        </div>
      </div>

      <div className="bg-[#FAF7F2] p-8 border border-[#EADBCE] rounded-xs space-y-6 text-xs sm:text-sm text-[#4A1525]/85 leading-relaxed font-light">
        <h3 className="font-serif text-xl font-medium text-[#2A0814]">
          Return Eligibility Conditions
        </h3>
        <ul className="space-y-2 list-disc pl-5">
          <li>The jewellery piece must be unworn and in its original, undamaged condition.</li>
          <li>All original brand security tags, velvet gift box, and microfiber care cloth must be included in the return packet.</li>
          <li>Customised bridal pieces with bespoke alteration requests cannot be returned unless manufacturing damage is evident.</li>
        </ul>

        <h3 className="font-serif text-xl font-medium text-[#2A0814] pt-2">
          Damaged in Transit Protection
        </h3>
        <p>
          In the exceptionally rare event that your package arrives damaged or tempered with, simply photograph the exterior box and notify us within 24 hours. We dispatch an immediate priority replacement via Air Express with zero charge.
        </p>

        <div className="pt-4 border-t border-[#EADBCE] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#2A0814] font-medium">
            Need to initiate a return or exchange now?
          </span>
          <button
            onClick={() => navigateTo('contact')}
            className="py-2.5 px-6 bg-[#2A0814] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#380E1C] cursor-pointer"
          >
            Connect With Concierge
          </button>
        </div>
      </div>
    </div>
  );
};

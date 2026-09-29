import React from 'react';
import { Truck, Clock, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';

export const ShippingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block">
          Pan-India & International
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#2A0814]">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#4A1525]/75 font-light max-w-xl mx-auto leading-relaxed">
          Every TISHNAGII creation travels fully insured in our signature tamper-evident velvet packaging to ensure immaculate arrival.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-2 text-center">
          <Truck className="w-6 h-6 text-[#C49A45] mx-auto" />
          <h3 className="font-serif text-base font-medium text-[#2A0814]">Complimentary Pan-India</h3>
          <p className="text-xs text-[#4A1525]/75 font-light">
            Free express delivery on all orders above ₹1,499 across all 19,000+ Indian pincodes.
          </p>
        </div>

        <div className="p-6 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-2 text-center">
          <Clock className="w-6 h-6 text-[#C49A45] mx-auto" />
          <h3 className="font-serif text-base font-medium text-[#2A0814]">Air Express Timelines</h3>
          <p className="text-xs text-[#4A1525]/75 font-light">
            Metro cities: 2–4 business days. Rest of India: 4–6 business days via Blue Dart & Delhivery Air.
          </p>
        </div>

        <div className="p-6 bg-[#FAF7F2] border border-[#EADBCE] rounded-xs space-y-2 text-center">
          <Globe className="w-6 h-6 text-[#C49A45] mx-auto" />
          <h3 className="font-serif text-base font-medium text-[#2A0814]">Worldwide Express</h3>
          <p className="text-xs text-[#4A1525]/75 font-light">
            Global express transit to USA, UK, Canada, Australia, and UAE via DHL Express in 5–8 days.
          </p>
        </div>
      </div>

      <div className="bg-[#FAF7F2] p-8 border border-[#EADBCE] rounded-xs space-y-6 text-xs sm:text-sm text-[#4A1525]/85 leading-relaxed font-light">
        <h3 className="font-serif text-xl font-medium text-[#2A0814]">
          Dispatch & Verification Protocol
        </h3>
        <p>
          Each order is inspected under optical magnification by our Jaipur quality team before being enclosed in a velvet-lined jewelry presentation box, shrink-wrapped, and sealed inside a tamper-evident transit pouch with security holograms.
        </p>

        <h3 className="font-serif text-xl font-medium text-[#2A0814] pt-2">
          Tracking & WhatsApp Alerts
        </h3>
        <p>
          Upon dispatch from our Jaipur atelier, an automated SMS and WhatsApp dispatch alert containing your direct courier tracking AWB link is transmitted. You can monitor every checkpoint from origin to your doorstep.
        </p>

        <h3 className="font-serif text-xl font-medium text-[#2A0814] pt-2">
          Cash on Delivery (COD) Guidelines
        </h3>
        <p>
          COD is available for orders up to ₹10,000. Prior to shipping, an automated verification message will be sent to your mobile phone. Cash on Delivery orders must be paid in full to the courier personnel before inspecting parcel contents, in accordance with standard air courier guidelines.
        </p>
      </div>
    </div>
  );
};

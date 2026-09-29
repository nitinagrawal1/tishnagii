import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Check, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast, navigateTo } = useShop();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(true);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Live Local Ticking Clock for Jaipur Atelier & User
  const [timeString, setTimeString] = useState({ time: '12:00:00', meridiem: 'PM' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Asia/Kolkata (Jaipur Atelier) or local time
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const parts = timeFormatter.formatToParts(now);
      const hour = parts.find((p) => p.type === 'hour')?.value || '12';
      const minute = parts.find((p) => p.type === 'minute')?.value || '00';
      const second = parts.find((p) => p.type === 'second')?.value || '00';
      const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || 'PM';

      setTimeString({
        time: `${hour}:${minute}:${second}`,
        meridiem: dayPeriod.toUpperCase(),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showToast('Please provide your name and email address', 'error');
      return;
    }
    if (!acceptPrivacy) {
      showToast('Please accept the Privacy Policy to proceed', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('Your message has been received by our Jaipur Concierge.');
  };

  return (
    <div className="min-h-screen bg-[#230711] text-[#FAF7F2] relative px-6 sm:px-12 md:px-16 lg:px-24 py-12 md:py-20 flex flex-col justify-between overflow-hidden selection:bg-[#C49A45] selection:text-[#230711]">
      
      {/* Background Subtle Atmospheric Accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#380E1C]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-[#C49A45]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Giant Rotated "US" on Far-Right Margin (Matching Reference Design) */}
      <div 
        aria-hidden="true" 
        className="hidden lg:block absolute right-10 xl:right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none font-serif text-8xl xl:text-9xl text-[#FAF7F2]/20 font-light tracking-widest rotate-90"
      >
        US
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 w-full max-w-4xl">
        
        {/* Top-Left Monumental Editorial Heading */}
        <header className="mb-10 sm:mb-14">
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[108px] tracking-tight text-[#FAF7F2] font-light leading-none">
            CONTACT
          </h1>
        </header>

        {/* Brand Editorial Philosophy Intro */}
        <div className="mb-8 sm:mb-12 max-w-xl">
          <p className="text-sm sm:text-[15px] text-[#FAF7F2]/80 font-light leading-relaxed">
            TISHNAGII approaches each heirloom creation with intention, reverence, and care. Whether you’re interested in upcoming bridal trousseau consultations, custom styling, or boutique wholesale orders, we begin with a conversation to ensure alignment for both patron and atelier.
          </p>
        </div>

        {/* Contact Form or Confirmation Box */}
        {isSubmitted ? (
          <div className="bg-[#2D0B17] border border-[#4E1628] rounded-xs p-8 sm:p-12 text-left space-y-5 max-w-xl animate-fade-in shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#C49A45]/20 border border-[#C49A45] text-[#D4AE58] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-3xl font-normal text-[#FAF7F2]">
              Inquiry Dispatched
            </h3>
            <p className="text-sm text-[#FAF7F2]/80 font-light leading-relaxed">
              Thank you, <strong>{firstName} {lastName}</strong>. A dedicated TISHNAGII stylist from our Jaipur Atelier will review your notes and contact you at <strong>{email}</strong> {phone && `or WhatsApp at ${phone}`} within 4 business hours.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFirstName('');
                  setLastName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
                className="py-3 px-6 border border-dashed border-[#FAF7F2]/40 hover:border-[#D4AE58] text-xs uppercase tracking-widest text-[#FAF7F2] hover:text-[#D4AE58] transition-colors rounded-xs cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 max-w-2xl">
            
            {/* ROW 1: First name* / Last name* */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                  First name*
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs px-4 py-3.5 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                  Last name*
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs px-4 py-3.5 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* ROW 2: E-mail address* / Phone number (optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                  E-mail address*
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter e-mail address"
                  className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs px-4 py-3.5 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                  Phone number (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                  className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs px-4 py-3.5 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* ROW 3: Message */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                Message
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
                className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs p-4 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none transition-colors resize-y min-h-[140px]"
              />
            </div>

            {/* ROW 4: Checkboxes matching reference design */}
            <div className="space-y-3 pt-1">
              {/* Checkbox 1: Privacy Policy */}
              <label className="flex items-center gap-3 cursor-pointer select-none text-xs sm:text-sm text-[#FAF7F2]/85 font-light">
                <div 
                  onClick={() => setAcceptPrivacy(!acceptPrivacy)}
                  className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors cursor-pointer ${
                    acceptPrivacy 
                      ? 'bg-[#FAF7F2] border-[#FAF7F2] text-[#230711]' 
                      : 'border-[#FAF7F2]/40 bg-transparent'
                  }`}
                >
                  {acceptPrivacy && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>
                <span>
                  I have read and accept the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('privacy');
                    }}
                    className="underline hover:text-[#D4AE58] transition-colors"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {/* Checkbox 2: Updates */}
              <label className="flex items-center gap-3 cursor-pointer select-none text-xs sm:text-sm text-[#FAF7F2]/85 font-light">
                <div 
                  onClick={() => setSubscribeNewsletter(!subscribeNewsletter)}
                  className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors cursor-pointer ${
                    subscribeNewsletter 
                      ? 'bg-[#FAF7F2] border-[#FAF7F2] text-[#230711]' 
                      : 'border-[#FAF7F2]/40 bg-transparent'
                  }`}
                >
                  {subscribeNewsletter && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>
                <span>Stay connected with our latest updates & atelier previews</span>
              </label>
            </div>

            {/* ROW 5: Dashed / Dotted Outline Submit Button matching reference */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 border border-dashed border-[#FAF7F2]/40 hover:border-[#D4AE58] hover:bg-[#FAF7F2]/5 text-center text-xs sm:text-sm font-light tracking-widest text-[#FAF7F2] hover:text-[#D4AE58] uppercase rounded-xs transition-all cursor-pointer"
              >
                Submit
              </button>
            </div>

          </form>
        )}
      </div>

      {/* FOOTER BAR: LIVE TICKING CLOCK & LEGAL LINKS */}
      <footer className="mt-16 sm:mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        
        {/* Bottom Left: Live Real-Time Atelier Clock (Matching Reference Design) */}
        <div>
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#FAF7F2]/60 font-light block mb-1">
            (Jaipur Atelier Time · IST)
          </span>
          <div className="flex items-baseline gap-3 sm:gap-4 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-light text-[#FAF7F2] tracking-tight leading-none">
            <span>{timeString.time}</span>
            <span className="text-3xl sm:text-4xl md:text-5xl text-[#FAF7F2]/80">
              {timeString.meridiem}
            </span>
          </div>
        </div>

        {/* Bottom Right: Footer Meta Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-[#FAF7F2]/70 font-light">
          <button
            onClick={() => navigateTo('privacy')}
            className="hover:text-[#D4AE58] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => navigateTo('terms')}
            className="hover:text-[#D4AE58] transition-colors cursor-pointer"
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => navigateTo('shipping')}
            className="hover:text-[#D4AE58] transition-colors cursor-pointer"
          >
            Shipping Policy
          </button>
          <span className="text-[#FAF7F2]/40">
            2026 © TISHNAGII Haute Jewellery
          </span>
        </div>

      </footer>

    </div>
  );
};

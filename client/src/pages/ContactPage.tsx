import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2 } from 'lucide-react';
import { handleInternalLinkClick } from '../utils/navigation';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { markClean } = useUnsavedChanges(
    !isSubmitted && Boolean(
      firstName || lastName || email || phone || message || !acceptPrivacy || subscribeNewsletter,
    ),
    'contact-draft',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!firstName.trim()) nextErrors.firstName = 'Enter your first name.';
    if (!lastName.trim()) nextErrors.lastName = 'Enter your last name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!message.trim()) nextErrors.message = 'Enter a message for the concierge.';
    if (!acceptPrivacy) nextErrors.acceptPrivacy = 'Accept the Privacy Policy to send your inquiry.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setFirstName(firstName.trim());
    setLastName(lastName.trim());
    setEmail(email.trim());
    setPhone(phone.trim());
    setMessage(message.trim());
    markClean();
    setIsSubmitted(true);
    showToast('Your message has been received by our Jaipur Concierge.');
  };

  return (
    <div className="min-h-screen bg-[#230711] text-[#FAF7F2] relative px-6 sm:px-12 md:px-16 lg:px-24 py-12 md:py-20 flex flex-col justify-between overflow-hidden selection:bg-[#C49A45] selection:text-[#230711]">
      
      {/* Background Subtle Atmospheric Accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#380E1C]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-[#C49A45]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Vertical brand wordmark on the far-right margin */}
      <div 
        aria-hidden="true" 
        className="hidden lg:block absolute right-10 xl:right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none font-serif text-8xl xl:text-9xl text-[#FAF7F2]/20 font-light tracking-widest rotate-90"
      >
        TISHNAGII
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
                type="button"
                onClick={() => {
                  markClean();
                  setIsSubmitted(false);
                  setFirstName('');
                  setLastName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                  setAcceptPrivacy(true);
                  setSubscribeNewsletter(false);
                }}
                className="py-3 px-6 border border-dashed border-[#FAF7F2]/40 hover:border-[#D4AE58] text-xs uppercase tracking-widest text-[#FAF7F2] hover:text-[#D4AE58] transition-colors rounded-xs cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 max-w-2xl">
            
            {/* ROW 1: First name* / Last name* */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="contact-first-name" className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                  First name*
                </label>
                <input
                  type="text"
                  id="contact-first-name"
                  name="given-name"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Radhika…"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'contact-first-name-error' : undefined}
                  className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs px-4 py-3.5 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] transition-colors"
                />
                {errors.firstName && <p id="contact-first-name-error" className="text-xs text-[#FFD6D6]" aria-live="polite">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-last-name" className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                  Last name*
                </label>
                <input
                  type="text"
                  id="contact-last-name"
                  name="family-name"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Mehta…"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'contact-last-name-error' : undefined}
                  className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs px-4 py-3.5 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] transition-colors"
                />
                {errors.lastName && <p id="contact-last-name-error" className="text-xs text-[#FFD6D6]" aria-live="polite">{errors.lastName}</p>}
              </div>
            </div>

            {/* ROW 2: E-mail address* / Phone number (optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="contact-email" className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                  E-mail address*
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com…"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs px-4 py-3.5 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] transition-colors"
                />
                {errors.email && <p id="contact-email-error" className="text-xs text-[#FFD6D6]" aria-live="polite">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-phone" className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                  Phone number (optional)
                </label>
                <input
                  type="tel"
                  id="contact-phone"
                  name="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98200 12345…"
                  className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs px-4 py-3.5 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] transition-colors"
                />
              </div>
            </div>

            {/* ROW 3: Message */}
            <div className="space-y-2">
              <label htmlFor="contact-message" className="block text-xs sm:text-[13px] text-[#FAF7F2]/90 font-light">
                Message
              </label>
              <textarea
                rows={5}
                id="contact-message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Tell us how we can help…"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                className="w-full bg-[#2F0B18] border border-[#4A1527] focus:border-[#C49A45] rounded-xs p-4 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] transition-colors resize-y min-h-[140px]"
              />
              {errors.message && <p id="contact-message-error" className="text-xs text-[#FFD6D6]" aria-live="polite">{errors.message}</p>}
            </div>

            {/* ROW 4: Checkboxes matching reference design */}
            <div className="space-y-3 pt-1">
              {/* Checkbox 1: Privacy Policy */}
              <div className="flex min-h-11 items-center gap-3 text-xs font-light text-[#FAF7F2]/85 sm:text-sm">
                <input
                  id="contact-privacy"
                  name="acceptPrivacy"
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(event) => setAcceptPrivacy(event.target.checked)}
                  aria-invalid={!!errors.acceptPrivacy}
                  aria-describedby={errors.acceptPrivacy ? 'contact-privacy-error' : undefined}
                  className="h-4 w-4 accent-[#D4AE58]"
                />
                <label htmlFor="contact-privacy">I have read and accept the Privacy Policy.</label>
                <a
                  href="/privacy"
                  onClick={(event) => handleInternalLinkClick(event, () => navigateTo('privacy'))}
                  className="min-h-11 inline-flex items-center underline transition-colors hover:text-[#D4AE58]"
                >
                  Read policy
                </a>
              </div>
              {errors.acceptPrivacy && <p id="contact-privacy-error" className="text-xs text-[#FFD6D6]" aria-live="polite">{errors.acceptPrivacy}</p>}

              {/* Checkbox 2: Updates */}
              <label className="flex min-h-11 cursor-pointer select-none items-center gap-3 text-xs font-light text-[#FAF7F2]/85 sm:text-sm">
                <input
                  name="newsletterUpdates"
                  type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={(event) => setSubscribeNewsletter(event.target.checked)}
                  className="h-4 w-4 accent-[#D4AE58]"
                />
                <span>Stay connected with our latest updates & atelier previews</span>
              </label>
            </div>

            {/* ROW 5: Dashed / Dotted Outline Submit Button matching reference */}
            <div className="pt-2">
              <button
                type="submit"
                className="min-h-11 w-full cursor-pointer rounded-xs border border-dashed border-[#FAF7F2]/40 px-6 py-4 text-center text-xs font-light uppercase tracking-widest text-[#FAF7F2] transition-[background-color,border-color,color] hover:border-[#D4AE58] hover:bg-[#FAF7F2]/5 hover:text-[#D4AE58] sm:text-sm"
              >
                Submit
              </button>
            </div>

          </form>
        )}
      </div>

    </div>
  );
};

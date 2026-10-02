import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, Clock, Navigation, Globe, ShieldCheck } from 'lucide-react';
import { BRAND } from '../../data/brand';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface FooterProps {
  onOpenTrialModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTrialModal }) => {
  return (
    <footer className="bg-[#07080A] border-t border-white/10 pt-16 pb-12 relative overflow-hidden text-white">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ======================================================== */}
        {/* 9. STRONG CONTACT AREA                                   */}
        {/* ======================================================== */}
        <section
          id="contact-section"
          className="rounded-3xl bg-[#12141C] border border-[#D4AF37]/30 p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Address & Verified Information */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
                  Verified Location & Contact
                </span>
                <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                  VISIT XING FITNESS
                </h3>
              </div>

              {/* Exact Verified Address Display */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-sm text-[#94A3B8]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-base block font-display">
                      Xing Fitness
                    </strong>
                    <p className="mt-1 leading-relaxed text-gray-300">
                      4th Floor No, VV Arcade, 1st Cross Rd,<br />
                      above Kanti Sweets,<br />
                      B Block, AECS Layout,<br />
                      Brookefield, Bengaluru,<br />
                      Karnataka 560037
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider text-[10px]">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone & WhatsApp</span>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {BRAND.phone}
                  </div>
                  <div className="text-gray-400">
                    {BRAND.whatsapp}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider text-[10px]">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Official Email</span>
                  </div>
                  <div className="text-white font-semibold text-sm truncate">
                    {BRAND.email}
                  </div>
                  <div className="text-gray-400">
                    Desk & Membership Enquiries
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider text-[10px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Gym Working Hours</span>
                  </div>
                  <div className="text-white font-semibold text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span>Mon – Sat: 5:30 AM – 10:00 PM</span>
                    <span className="text-[#D4AF37]">Sun: 11:00 AM – 08:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons: CALL NOW, WHATSAPP, GET DIRECTIONS */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 justify-center">
              <a
                href={BRAND.phoneRaw}
                id="contact-call-now-btn"
                className="w-full py-4 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-black" />
                <span>CALL NOW: {BRAND.phoneDisplay}</span>
              </a>

              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-whatsapp-btn"
                className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#25D366]/20 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WHATSAPP CHAT</span>
              </a>

              <a
                href={BRAND.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-get-directions-btn"
                className="w-full py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#D4AF37]" />
                <span>GET DIRECTIONS (GOOGLE MAPS)</span>
              </a>

              <button
                type="button"
                onClick={onOpenTrialModal}
                className="w-full py-3.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 font-display font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
              >
                Book A Complimentary 1-Day Trial
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 10. FOOTER MAIN COLUMNS                                  */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center font-black text-black text-lg shadow-lg">
                X
              </div>
              <span className="font-display font-black text-2xl text-white tracking-wider">
                XING <span className="text-[#D4AF37]">FITNESS</span>
              </span>
            </Link>

            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
              Xing Fitness is a premium unisex gym in AECS Layout, Brookefield, Bengaluru (Est. 2020). Featuring commercial Matrix strength & cardio equipment, certified personal trainers, HIIT, CrossFit, Zumba, Yoga, and functional training.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 flex items-center justify-center text-gray-300 hover:text-[#D4AF37] transition-all"
                aria-label="Xing Fitness Official Instagram"
                title="Follow on Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href={BRAND.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 flex items-center justify-center text-gray-300 hover:text-[#D4AF37] transition-all"
                aria-label="Official Website"
                title="Official Website (xingfitness.in)"
              >
                <Globe className="w-5 h-5" />
              </a>

              <a
                href={BRAND.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 flex items-center justify-center text-gray-300 hover:text-[#D4AF37] transition-all"
                aria-label="Google Maps Location"
                title="View on Google Maps"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/why-xing" className="hover:text-[#D4AF37] transition-colors">
                  Why Xing
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-[#D4AF37] transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#D4AF37] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D4AF37] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#D4AF37] transition-colors">
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <a href={BRAND.phoneRaw} className="hover:text-[#D4AF37] transition-colors">
                  {BRAND.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {BRAND.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C] shrink-0" />
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4AF37] transition-colors font-medium text-white/90 hover:text-[#D4AF37]"
                >
                  @xing.fitnessclub
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-[#D4AF37] transition-colors truncate">
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>4th Floor, VV Arcade, above Kanti Sweets, B Block, AECS Layout, Brookefield 560037</span>
              </li>
            </ul>
          </div>

          {/* Working Hours Column */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">
              Working Hours
            </h4>
            <div className="space-y-2 text-xs text-[#94A3B8]">
              <p className="font-medium text-white">Monday – Saturday:</p>
              <p className="text-gray-300">5:30 AM – 10:00 PM</p>
              <p className="font-medium text-white pt-2">Sunday:</p>
              <p className="text-[#D4AF37] font-semibold">11:00 AM – 08:00 PM</p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#8F9CAE]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Verified Unisex Gym • Est. 2020</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} Xing Fitness. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href={BRAND.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors"
            >
              xingfitness.in
            </a>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors"
            >
              @xing.fitnessclub
            </a>
            <a
              href={BRAND.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Google Maps
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

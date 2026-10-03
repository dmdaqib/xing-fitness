import React from 'react';
import { MapPin, Navigation, Clock, MessageCircle, Phone, Mail, Compass, Car } from 'lucide-react';
import { BRAND } from '../../data/brand';

export const LocationSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#090A0D] border-t border-white/10 relative overflow-hidden" id="location-section">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 sm:right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 sm:left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 mb-4">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Visit Xing Fitness • Find Us
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.98] uppercase">
            FIND US IN <br />
            <span className="text-[#D4AF37]">AECS LAYOUT, BROOKEFIELD.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Situated on the 4th Floor of VV Arcade above Kanti Sweets in AECS Layout, Brookefield. Conveniently located for members from AECS Layout, Brookefield, Kundalahalli, and nearby Whitefield.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Location Info Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#14161D] border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="space-y-6">
              {/* Address Block */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>AECS Layout, Brookefield / Whitefield</span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                  Xing Fitness
                </h3>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 mt-3 space-y-1">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                    Verified Facility Address:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                    4th Floor No, VV Arcade, 1st Cross Rd,<br />
                    above Kanti Sweets, B Block, AECS Layout,<br />
                    Brookefield, Bengaluru, Karnataka 560037
                  </p>
                  <span className="text-[11px] text-[#94A3B8] block pt-1 font-mono">
                    PIN Code: 560037
                  </span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Working Hours:</span>
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Mon – Sat:</span>
                    <span className="text-white font-semibold">5:30 AM – 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sunday:</span>
                    <span className="text-[#D4AF37] font-semibold">11:00 AM – 08:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Contact Info (Phone & Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Phone Desk</span>
                  </div>
                  <a
                    href="tel:+918970000122"
                    className="text-xs font-bold text-white hover:text-[#D4AF37] transition-colors block font-mono"
                  >
                    8970000122
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Official Email</span>
                  </div>
                  <a
                    href="mailto:xing.fitnessclub@gmail.com"
                    className="text-xs font-medium text-white hover:text-[#D4AF37] transition-colors block truncate"
                    title="xing.fitnessclub@gmail.com"
                  >
                    xing.fitnessclub@gmail.com
                  </a>
                </div>
              </div>

              {/* Parking details */}
              <div className="flex items-start gap-2.5 text-xs text-gray-300">
                <Car className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Parking Information:</span>
                  <span className="text-[#94A3B8]">Dedicated on-site parking for two-wheelers and four-wheelers with security.</span>
                </div>
              </div>
            </div>

            {/* Required Action Buttons: GET DIRECTIONS, CALL NOW, WHATSAPP */}
            <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={BRAND.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-xl bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#C5A028] transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer text-center"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GET DIRECTIONS</span>
                </a>

                <a
                  href={BRAND.phoneRaw}
                  className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-white/15 cursor-pointer text-center"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>CALL NOW</span>
                </a>
              </div>

              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] hover:text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#25D366]/30 text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map Visual */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative min-h-[440px] bg-[#14161D]">
            <iframe
              title="Xing Fitness AECS Layout Brookefield Whitefield Map"
              src="https://maps.google.com/maps?q=12.9649467,77.717057&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[440px] border-0 filter invert contrast-125 opacity-85 hover:opacity-100 transition-opacity"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Overlaid location badge */}
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-xs p-4 rounded-2xl bg-black/90 backdrop-blur-md border border-white/15 text-xs text-white shadow-xl">
              <div className="font-bold flex items-center gap-1.5 text-[#D4AF37]">
                <Compass className="w-4 h-4" />
                <span>Xing Fitness AECS Layout</span>
              </div>
              <div className="text-[11px] text-gray-300 mt-1">
                4th Floor, VV Arcade, above Kanti Sweets, Brookefield
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Visit for equipment walkthrough & free trial
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

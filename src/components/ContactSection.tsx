import React from 'react';
import { MapPin, Phone, Mail, MessageSquare, ExternalLink, Clock, ShieldCheck } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';

interface ContactSectionProps {
  onBookInspectionClick: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onBookInspectionClick }) => {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-white border-t border-neutral-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-[#373E0C]">
            Direct Developer Access
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#373E0C] tracking-tight mt-2">
            Contact Consistent Experts
          </h2>
          <p className="text-base text-neutral-600 mt-3 leading-relaxed">
            Reach our property advisors through any of our four verified lines or schedule a direct site visit to Plot 20, New Asaba.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Contact Methods Grid */}
          <div className="lg:col-span-7 space-y-6">
            {/* Phone Hotlines Grid */}
            <div className="bg-[#F2F6EF] rounded-2xl p-6 sm:p-8 border border-[#373E0C]/15 space-y-5">
              <div className="flex items-center gap-2.5 text-[#373E0C] font-bold text-base sm:text-lg">
                <Phone className="w-5 h-5 text-[#E96818]" />
                <h3>Official Telephone Hotlines</h3>
              </div>
              <p className="text-xs text-neutral-600">
                Click any of our active customer enquiry lines to initiate a phone call directly:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                {DEFAULT_SITE_SETTINGS.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-between p-3.5 bg-white hover:bg-[#373E0C] hover:text-white rounded-xl border border-neutral-200 shadow-xs transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#E96818] group-hover:text-white shrink-0" />
                      <span className="text-sm font-bold tracking-wide font-mono tabular-nums">
                        {phone}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 group-hover:text-white/80 font-medium">
                      Call
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Email & Instant Messaging */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* WhatsApp Quick Chat */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp Sales Chat</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-2">
                    Connect instantly with our lead consultant for plot availability and brochure requests.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${DEFAULT_SITE_SETTINGS.primaryWhatsAppPhone}?text=${encodeURIComponent(
                    'Hello Consistent Experts, I am interested in New Dawn Smart City Estate, New Asaba.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp (+234 916 950 8000)</span>
                </a>
              </div>

              {/* Email Communication */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#373E0C] font-bold text-sm">
                    <Mail className="w-4 h-4 text-[#E96818]" />
                    <span>Official Email Enquiries</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-2">
                    Send detailed requests, institutional purchase briefs, or formal documentation verification questions.
                  </p>
                </div>
                <a
                  href={`mailto:${DEFAULT_SITE_SETTINGS.email}`}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white border border-[#373E0C]/20 rounded-xl transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{DEFAULT_SITE_SETTINGS.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Location & Physical Office Card */}
          <div className="lg:col-span-5 bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <div className="text-xs font-bold text-[#E96818] uppercase tracking-wider">
                Physical Site & Office
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                New Dawn Smart City Location
              </h3>
              <p className="text-xs text-neutral-300 mt-2 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E96818] shrink-0 mt-0.5" />
                <span>Plot 20, New Asaba, Delta State, Nigeria</span>
              </p>
            </div>

            {/* Stylized Map View Indicator */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-[#373E0C] border border-[#E96818]/40 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#E96818]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  New Asaba Growth Corridor
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Delta State, Nigeria
                </div>
              </div>
              <div className="text-[10px] text-neutral-500">
                Site visits guided by Consistent Experts field engineers
              </div>
            </div>

            {/* Site Inspection Hours */}
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Clock className="w-4 h-4 text-[#E96818]" />
                <span>Inspection & Consultation Hours</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Monday – Saturday: 9:00 AM – 5:00 PM (WAT)<br />
                Sunday: By special advance reservation
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onBookInspectionClick}
                className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-xl transition-all cursor-pointer shadow-md shadow-[#E96818]/20"
              >
                Schedule Site Visit with Our Representative
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

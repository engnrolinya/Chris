import React from 'react';
import { ShieldCheck, MapPin, FileCheck2, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface AboutSectionProps {
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick }) => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white/85 backdrop-blur-[2px] relative z-10 border-t border-neutral-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual & Brand Seal */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-md">
              <img
                src="/src/assets/images/modern_smart_villa_1792253581571.jpg"
                alt="Contemporary architectural residential design at New Dawn Smart City"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#373E0C]/90 via-[#373E0C]/30 to-transparent flex flex-col justify-end p-6 text-white">
                <Logo variant="light" size="sm" />
                <div className="text-xs text-neutral-200 mt-2">
                  New Dawn Smart City Development · Plot 20, New Asaba
                </div>
              </div>
            </div>

            {/* Verified Location Card */}
            <div className="p-5 rounded-xl bg-[#F2F6EF] border border-[#373E0C]/15 flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#373E0C]">
                  Project Location
                </div>
                <div className="text-sm font-semibold text-neutral-800 mt-0.5">
                  Plot 20, New Asaba, Delta State, Nigeria
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Strategic growth zone primed for residential development and capital preservation.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#E96818]">
                About Consistent Experts
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#373E0C] tracking-tight leading-tight">
                Building Confidence. Creating Opportunities.
              </h2>
            </div>

            {/* Core copy */}
            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed text-pretty">
              Consistent Experts presents New Dawn Smart City, a real estate development in New Asaba, Delta State, Nigeria. Our focus is to help prospective property owners explore residential property opportunities through clear information, flexible payment options, and a professional customer enquiry process.
            </p>

            {/* Company Tagline Highlight */}
            <div className="py-4 px-5 rounded-xl bg-white border border-[#373E0C]/20 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Company Motto
                </span>
                <span className="text-base font-extrabold text-[#373E0C]">
                  &ldquo;Built Right... Delivered Better...&rdquo;
                </span>
              </div>
              <span className="text-xs font-bold text-[#E96818] bg-[#E96818]/10 px-3 py-1 rounded-md">
                Consistent Experts
              </span>
            </div>

            {/* Commitments & Values */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#373E0C]">
                  <FileCheck2 className="w-4 h-4 text-[#E96818]" />
                  <span>Documentation Verification</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We support transparent buyer verification of survey diagrams, plot allotment numbers, and layout provisions.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#373E0C]">
                  <ShieldCheck className="w-4 h-4 text-[#E96818]" />
                  <span>Customer Support Channel</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Direct communication channels with our sales representatives across phone, WhatsApp, and on-site inspection desks.
                </p>
              </div>
            </div>

            {/* Editable Company Profile Notice (for business owner) */}
            <div className="pt-2">
              <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-500 flex items-center justify-between">
                <span>
                  Company Profile & Documentation Status: Operational Development Phase.
                </span>
                <button
                  onClick={onContactClick}
                  className="font-semibold text-[#373E0C] hover:text-[#E96818] flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                >
                  <span>Connect With Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

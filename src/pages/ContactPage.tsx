import React, { useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  ArrowLeft,
  CalendarCheck,
  ShieldCheck,
  ExternalLink,
  Instagram,
  Facebook,
  Compass,
} from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';
import { EnquiryFormSection } from '../components/EnquiryFormSection';
import { PaymentPlanType, EnquiryType } from '../types';

interface ContactPageProps {
  onBackToHome: () => void;
  onBookInspection: () => void;
  onOpenPrivacyPolicy: () => void;
  selectedPlan?: PaymentPlanType;
  selectedType?: EnquiryType;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onBookInspection,
  onOpenPrivacyPolicy,
  selectedPlan = '6_month_standard',
  selectedType = 'general',
}) => {
  // Scroll to top upon navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white/85 backdrop-blur-[2px] relative z-10 text-neutral-900 pb-20">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-[#F2F6EF] border-b border-neutral-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-[#373E0C] hover:text-[#E96818] font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-neutral-500 font-medium">
            <button
              onClick={onBackToHome}
              className="hover:text-[#373E0C] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#373E0C] font-bold">Contact Consistent Experts</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-[#373E0C] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E96818]">
              <MapPin className="w-4 h-4" />
              <span>New Asaba, Delta State, Nigeria</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Get in Touch with Our Property Team
            </h1>
            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl">
              Have questions regarding plot allocations, 500 SQM pricing, flexible payment schedules, or on-site inspections at New Dawn Smart City? We are here to help.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onBookInspection}
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-xl shadow-md transition-all cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Schedule Site Inspection</span>
              </button>
              <a
                href={`https://wa.me/${DEFAULT_SITE_SETTINGS.primaryWhatsAppPhone}?text=${encodeURIComponent(
                  'Hello Consistent Experts, I would like to make an inquiry regarding New Dawn Smart City.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp (+234 916 950 8000)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-96 h-96 bg-[#E96818]/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Main Grid: Direct Channels & Information */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Phone Lines & Digital Channels (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Phone Lines Card */}
            <div className="bg-[#F2F6EF] rounded-3xl p-7 sm:p-9 border border-[#373E0C]/15 space-y-5">
              <div className="flex items-center gap-3 text-[#373E0C] font-bold text-lg">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#373E0C]/15 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#E96818]" />
                </div>
                <div>
                  <h3>Direct Sales & Customer Hotlines</h3>
                  <p className="text-xs text-neutral-600 font-normal">
                    Click any line to initiate a direct call to our property advisory desk:
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                {DEFAULT_SITE_SETTINGS.phones.map((phone, idx) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-between p-4 bg-white hover:bg-[#373E0C] hover:text-white rounded-2xl border border-neutral-200/90 shadow-xs transition-all duration-200 group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 group-hover:text-white/70 block">
                        Line {idx + 1}
                      </span>
                      <span className="text-sm font-bold tracking-wide font-mono tabular-nums text-neutral-900 group-hover:text-white">
                        {phone}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#E96818] group-hover:text-white bg-[#E96818]/10 group-hover:bg-white/20 px-2.5 py-1 rounded-lg">
                      Call
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Electronic Channels: Email & WhatsApp */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* WhatsApp Business Card */}
              <div className="bg-white rounded-3xl p-7 border border-neutral-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    </div>
                    <span>WhatsApp Messaging</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    Instant brochure downloads, survey diagrams, and payment receipt verifications via WhatsApp.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${DEFAULT_SITE_SETTINGS.primaryWhatsAppPhone}?text=${encodeURIComponent(
                    'Hello Consistent Experts, I would like to enquire about New Dawn Smart City Estate.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Official Email */}
              <div className="bg-white rounded-3xl p-7 border border-neutral-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-[#373E0C] font-bold text-base">
                    <div className="w-8 h-8 rounded-lg bg-[#F2F6EF] flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#E96818]" />
                    </div>
                    <span>Official Email</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    For corporate proposals, diaspora enquiries, and formal legal due diligence requests.
                  </p>
                </div>
                <a
                  href={`mailto:${DEFAULT_SITE_SETTINGS.email}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white border border-[#373E0C]/20 rounded-xl transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{DEFAULT_SITE_SETTINGS.email}</span>
                </a>
              </div>
            </div>

            {/* Social Channels */}
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Official Social Channels
                </span>
                <div className="text-xs text-neutral-600">
                  Follow project milestones, video updates, and site construction progress.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800">
                  Instagram: <span className="text-[#E96818]">@{DEFAULT_SITE_SETTINGS.instagramHandle}</span>
                </div>
                <div className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800">
                  Facebook: <span className="text-[#373E0C]">{DEFAULT_SITE_SETTINGS.facebookName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Physical Address & Operating Hours (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-900 text-white rounded-3xl p-7 sm:p-9 space-y-6 shadow-xl">
            <div>
              <div className="text-xs font-bold text-[#E96818] uppercase tracking-wider">
                Physical Development Location
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">
                New Dawn Smart City
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2 flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                <span>Plot 20, New Asaba, Delta State, Nigeria</span>
              </p>
            </div>

            {/* Visual Location Preview Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[170px]">
              <div className="w-12 h-12 rounded-2xl bg-[#373E0C] border border-[#E96818]/40 flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#E96818]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  New Asaba Corridor
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Delta State Residential Expansion Zone
                </div>
              </div>
              <div className="text-[11px] text-neutral-500">
                Plot pegging and physical surveys conducted on site
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-3 text-xs text-neutral-300 border-t border-neutral-800 pt-5">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Clock className="w-4 h-4 text-[#E96818]" />
                <span>Working & Inspection Hours</span>
              </div>
              <ul className="space-y-1.5 text-neutral-400 text-xs pl-6 list-disc">
                <li>Monday – Friday: 8:30 AM – 5:30 PM (WAT)</li>
                <li>Saturday: 9:00 AM – 4:00 PM (Site inspections active)</li>
                <li>Sunday: By special pre-scheduled appointment</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={onBookInspection}
                className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-xl transition-all cursor-pointer shadow-lg shadow-[#E96818]/25"
              >
                Schedule Site Inspection with Site Coordinator
              </button>
            </div>
          </div>
        </div>

        {/* Customer Enquiry Form Embedded on Dedicated Contact Page */}
        <div className="pt-8 border-t border-neutral-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-[#373E0C]">
              Direct Message Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#373E0C] tracking-tight mt-1">
              Send an Official Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              Submit your inquiry directly to the Consistent Experts sales desk. You will receive an official confirmation reference code.
            </p>
          </div>

          <EnquiryFormSection
            initialPlan={selectedPlan}
            initialType={selectedType}
            onOpenPrivacyPolicy={onOpenPrivacyPolicy}
          />
        </div>
      </main>
    </div>
  );
};

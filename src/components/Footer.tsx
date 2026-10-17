import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Lock, ExternalLink } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';

interface FooterProps {
  onOpenPrivacyPolicy: () => void;
  onOpenOwnerPortal: () => void;
  onBookInspection: () => void;
  onNavigateGallery: () => void;
  onNavigateContact: () => void;
  onNavigatePlans: () => void;
  onNavigateHome: (sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacyPolicy,
  onOpenOwnerPortal,
  onBookInspection,
  onNavigateGallery,
  onNavigateContact,
  onNavigatePlans,
  onNavigateHome,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#373E0C] text-white border-t border-[#373E0C]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand Wordmark, Slogan & Address */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => onNavigateHome()}
              className="text-left cursor-pointer border-none bg-transparent p-0"
            >
              <Logo variant="light" size="md" />
            </button>

            <div className="pt-2 text-xs text-neutral-300 leading-relaxed max-w-sm">
              <strong className="text-white block font-semibold mb-1">
                New Dawn Smart City Estate
              </strong>
              A modern residential estate development in New Asaba, Delta State, Nigeria, focused on land ownership, structured payment plans, and secure community living.
            </div>

            <div className="pt-2 text-xs text-neutral-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#E96818] shrink-0 mt-0.5" />
              <span>Plot 20, New Asaba, Delta State, Nigeria</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#E96818]">
              Navigation
            </div>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button
                  onClick={() => onNavigateHome('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Consistent Experts
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigatePlans}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Payment Plans (Dedicated Page)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateHome('features')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Estate Features
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateGallery}
                  className="text-[#E96818] font-semibold hover:text-white transition-colors cursor-pointer text-left"
                >
                  Visual Gallery (Dedicated Page)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateHome('faq')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateContact}
                  className="hover:text-white transition-colors cursor-pointer text-left font-medium"
                >
                  Contact Us (Dedicated Page)
                </button>
              </li>
              <li>
                <button
                  onClick={onBookInspection}
                  className="hover:text-[#E96818] text-neutral-200 transition-colors text-left cursor-pointer"
                >
                  Book an Inspection
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Phone Lines */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#E96818]">
              Direct Hotlines
            </div>
            <ul className="space-y-2 text-xs text-neutral-300">
              {DEFAULT_SITE_SETTINGS.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 hover:text-[#E96818] transition-colors font-mono tabular-nums"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E96818] shrink-0" />
                    <span>{phone}</span>
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <a
                  href={`mailto:${DEFAULT_SITE_SETTINGS.email}`}
                  className="flex items-center gap-2 text-neutral-200 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E96818] shrink-0" />
                  <span>{DEFAULT_SITE_SETTINGS.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Channels & Legal */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#E96818]">
              Connect With Us
            </div>
            <div className="space-y-2 text-xs text-neutral-300">
              <div>
                <span className="text-neutral-400 block text-[11px]">Instagram:</span>
                <span className="font-semibold text-white">
                  @{DEFAULT_SITE_SETTINGS.instagramHandle}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Facebook:</span>
                <span className="font-semibold text-white">
                  {DEFAULT_SITE_SETTINGS.facebookName}
                </span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenPrivacyPolicy}
                  className="text-xs text-neutral-300 hover:text-white underline cursor-pointer"
                >
                  Privacy Policy & Data Notice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright Bottom Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="text-center md:text-left space-y-1">
            <p>
              &copy; {currentYear} Consistent Experts. All rights reserved. &ldquo;Built Right... Delivered Better...&rdquo;
            </p>
            <p className="text-[11px] text-neutral-400/90 italic">
              Property prices, availability, promotional offers, and other terms are subject to confirmation by Consistent Experts.
            </p>
          </div>

          {/* Discreet Owner Portal Trigger */}
          <div className="shrink-0">
            <button
              onClick={onOpenOwnerPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-neutral-400 hover:text-neutral-200 text-xs transition-colors cursor-pointer border border-white/10"
              title="Secure Owner Administration Portal"
            >
              <Lock className="w-3 h-3 text-[#E96818]" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

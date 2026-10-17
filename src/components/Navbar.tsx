import React, { useState } from 'react';
import { Logo } from './Logo';
import { Phone, MessageSquare, Menu, X, CalendarCheck, Shield } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';

interface NavbarProps {
  currentPage: 'home' | 'gallery' | 'contact' | 'plans';
  onNavigate: (page: 'home' | 'gallery' | 'contact' | 'plans', sectionId?: string) => void;
  onOpenInspection: () => void;
  onOpenOwnerPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenInspection,
  onOpenOwnerPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'About Us', page: 'home' as const, sectionId: 'about' },
    { label: 'Payment Plans', page: 'plans' as const },
    { label: 'Estate Features', page: 'home' as const, sectionId: 'features' },
    { label: 'Gallery', page: 'gallery' as const },
    { label: 'FAQ', page: 'home' as const, sectionId: 'faq' },
    { label: 'Contact', page: 'contact' as const },
  ];

  const handleLinkClick = (page: 'home' | 'gallery' | 'contact' | 'plans', sectionId?: string) => {
    onNavigate(page, sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="shrink-0 group text-left cursor-pointer border-none bg-transparent p-0"
        >
          <Logo size="md" variant="dark" />
        </button>

        {/* Zone 2: Navigation Links (single-line, clean typography) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-neutral-700">
          {navLinks.map((link) => {
            const isCurrentPage =
              (link.page === 'gallery' && currentPage === 'gallery') ||
              (link.page === 'contact' && currentPage === 'contact') ||
              (link.page === 'plans' && currentPage === 'plans');

            return (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.page, link.sectionId)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCurrentPage
                    ? 'text-[#E96818] font-bold border-b-2 border-[#E96818] pb-0.5'
                    : 'text-neutral-700 hover:text-[#E96818]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Phone Hotline */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Quick Call Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C]/10 rounded-lg transition-colors border border-[#373E0C]/15 whitespace-nowrap shrink-0 cursor-pointer"
              title="Click to view telephone hotlines"
            >
              <Phone className="w-3.5 h-3.5 text-[#E96818]" />
              <span>0916 950 8000</span>
            </button>

            {phoneDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setPhoneDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Direct Sales Hotlines
                </div>
                {DEFAULT_SITE_SETTINGS.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-[#F2F6EF] hover:text-[#E96818] rounded-lg transition-colors"
                  >
                    <Phone className="w-3 h-3 text-[#373E0C]" />
                    {phone}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Book an Inspection Primary CTA */}
          <button
            onClick={onOpenInspection}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] active:scale-98 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book an Inspection</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenInspection}
            className="p-2 text-xs font-bold text-white bg-[#E96818] rounded-lg"
            title="Book Inspection"
          >
            <CalendarCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-[#373E0C] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-5 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.page, link.sectionId)}
                className={`text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  (link.page === 'gallery' && currentPage === 'gallery') ||
                  (link.page === 'contact' && currentPage === 'contact') ||
                  (link.page === 'plans' && currentPage === 'plans')
                    ? 'bg-[#F2F6EF] text-[#E96818] font-bold'
                    : 'text-neutral-800 hover:bg-[#F2F6EF] hover:text-[#E96818]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-neutral-100 space-y-3">
            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-3">
              Sales Hotlines
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_SITE_SETTINGS.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-50 hover:bg-[#F2F6EF] rounded-lg border border-neutral-200"
                >
                  <Phone className="w-3 h-3 text-[#E96818]" />
                  {phone}
                </a>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInspection();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-lg cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                Book Inspection
              </button>
              <a
                href={`https://wa.me/${DEFAULT_SITE_SETTINGS.primaryWhatsAppPhone}?text=${encodeURIComponent(
                  'Hello Consistent Experts, I am interested in New Dawn Smart City Estate.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOwnerPortal();
                }}
                className="text-xs text-neutral-400 hover:text-neutral-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3 h-3" />
                Owner Admin Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

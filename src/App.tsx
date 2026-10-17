/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PaymentPlansSection } from './components/PaymentPlansSection';
import { EstateFeaturesSection } from './components/EstateFeaturesSection';
import { AboutSection } from './components/AboutSection';
import { EnquiryFormSection } from './components/EnquiryFormSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { InspectionModal } from './components/InspectionModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { PaymentPlansPage } from './pages/PaymentPlansPage';
import { PaymentPlanType, EnquiryType } from './types';
import { ArrowRight, Image as ImageIcon, PhoneCall } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from './data/initialData';
import { LiveChatWidget } from './components/LiveChatWidget';
import siteBackground from './assets/images/site_background.png';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery' | 'contact' | 'plans'>(() => {
    if (window.location.hash === '#/gallery') return 'gallery';
    if (window.location.hash === '#/contact') return 'contact';
    if (window.location.hash === '#/plans' || window.location.hash === '#/payment-plans') return 'plans';
    return 'home';
  });

  const [selectedPlanForForm, setSelectedPlanForForm] = useState<PaymentPlanType>('6_month_standard');
  const [selectedTypeForForm, setSelectedTypeForForm] = useState<EnquiryType>('payment_plan');

  // Modals
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#/gallery') {
        setCurrentPage('gallery');
      } else if (window.location.hash === '#/contact') {
        setCurrentPage('contact');
      } else if (window.location.hash === '#/plans' || window.location.hash === '#/payment-plans') {
        setCurrentPage('plans');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (page: 'home' | 'gallery' | 'contact' | 'plans', sectionId?: string) => {
    if (page === 'gallery') {
      setCurrentPage('gallery');
      window.location.hash = '#/gallery';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'contact') {
      setCurrentPage('contact');
      window.location.hash = '#/contact';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'plans') {
      setCurrentPage('plans');
      window.location.hash = '#/plans';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage('home');
      window.location.hash = sectionId ? `#${sectionId}` : '#';
      if (sectionId) {
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSelectPlan = (plan: PaymentPlanType) => {
    setSelectedPlanForForm(plan);
    setSelectedTypeForForm('payment_plan');
    handleNavigate('contact');
  };

  const handleSpeakToTeam = () => {
    handleNavigate('contact');
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-[#E96818]/20 selection:text-[#373E0C]">
      {/* Site-wide Fixed Transparent Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-fixed opacity-[0.14] transition-opacity duration-300"
        style={{
          backgroundImage: `url(${siteBackground}), url('https://i.imgur.com/6ZFpy75.png')`,
        }}
        aria-hidden="true"
      />

      {/* Top Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenInspection={() => setIsInspectionModalOpen(true)}
        onOpenOwnerPortal={() => setIsOwnerModalOpen(true)}
      />

      {/* Main View: Conditional Routing between Home, Dedicated Gallery Page, Dedicated Contact Page, and Dedicated Payment Plans Page */}
      {currentPage === 'gallery' ? (
        <GalleryPage
          onBackToHome={() => handleNavigate('home')}
          onBookInspection={() => setIsInspectionModalOpen(true)}
        />
      ) : currentPage === 'contact' ? (
        <ContactPage
          onBackToHome={() => handleNavigate('home')}
          onBookInspection={() => setIsInspectionModalOpen(true)}
          onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
          selectedPlan={selectedPlanForForm}
          selectedType={selectedTypeForForm}
        />
      ) : currentPage === 'plans' ? (
        <PaymentPlansPage
          onBackToHome={() => handleNavigate('home')}
          onBookInspection={() => setIsInspectionModalOpen(true)}
          onSelectPlan={(plan) => {
            setSelectedPlanForForm(plan);
            setSelectedTypeForForm('payment_plan');
            handleNavigate('contact');
          }}
          onContactDesk={() => handleNavigate('contact')}
        />
      ) : (
        <main className="flex-1 relative z-10">
          {/* 1. Hero Section */}
          <HeroSection
            onExplorePlans={() => handleNavigate('plans')}
            onBookInspection={() => setIsInspectionModalOpen(true)}
            onSpeakToTeam={handleSpeakToTeam}
          />

          {/* 2. Featured Property & Payment Plans */}
          <PaymentPlansSection
            onSelectPlan={handleSelectPlan}
            onViewFullPage={() => handleNavigate('plans')}
          />

          {/* 3. Estate Features (6 Advertised Amenities from Flyer) */}
          <EstateFeaturesSection />

          {/* 4. About Consistent Experts */}
          <AboutSection onContactClick={() => scrollToSection('contact-form')} />

          {/* Discovery Link to Dedicated Gallery Page */}
          <section className="py-12 bg-[#F2F6EF]/70 border-t border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#373E0C]/15 flex items-center justify-center shrink-0 shadow-xs">
                  <ImageIcon className="w-6 h-6 text-[#E96818]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#E96818] uppercase tracking-wider">
                    Architectural Showcase & Layouts
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#373E0C]">
                    View Our Full Visual Gallery on a Dedicated Page
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Explore conceptual renders of contemporary duplexes, entrance gatehouses, and paved road networks.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleNavigate('gallery')}
                className="flex items-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-[#373E0C] hover:bg-[#2b3109] rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Open Dedicated Gallery</span>
                <ArrowRight className="w-4 h-4 text-[#E96818]" />
              </button>
            </div>
          </section>

          {/* 5. Customer Enquiry Form (Essential Functional Feature) */}
          <EnquiryFormSection
            initialPlan={selectedPlanForForm}
            initialType={selectedTypeForForm}
            onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
          />

          {/* 6. Frequently Asked Questions */}
          <FaqSection />

          {/* 7. Contact Details & Quick Channels Strip with Link to Full Contact Page */}
          <section className="py-14 bg-white border-t border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#373E0C] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#E96818]">
                    Plot 20, New Asaba, Delta State
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Looking for Full Office Directions & Hotline Details?
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-200 max-w-xl">
                    Access all 4 sales hotlines, WhatsApp messaging, inspection appointment slots, and physical location guides on our dedicated contact page.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleNavigate('contact')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>Visit Dedicated Contact Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href={`tel:${DEFAULT_SITE_SETTINGS.phones[0].replace(/\s+/g, '')}`}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all whitespace-nowrap"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#E96818]" />
                    <span>Call Sales Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Live Chat Widget for Instant Support on New Dawn Smart City, Prices & Inspections */}
      <LiveChatWidget
        onOpenFullInspection={() => setIsInspectionModalOpen(true)}
        onOpenPaymentPlans={() => handleNavigate('plans')}
      />

      {/* Footer */}
      <Footer
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenOwnerPortal={() => setIsOwnerModalOpen(true)}
        onBookInspection={() => setIsInspectionModalOpen(true)}
        onNavigateGallery={() => handleNavigate('gallery')}
        onNavigateContact={() => handleNavigate('contact')}
        onNavigatePlans={() => handleNavigate('plans')}
        onNavigateHome={(sec) => handleNavigate('home', sec)}
      />

      {/* Modals */}
      <InspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
      />

      <OwnerDashboardModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowLeft,
  CalendarCheck,
  Phone,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { GALLERY_ITEMS, DEFAULT_SITE_SETTINGS } from '../data/initialData';

interface GalleryPageProps {
  onBackToHome: () => void;
  onBookInspection: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onBackToHome,
  onBookInspection,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Scroll to top upon entering page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const categories = ['All', 'Architecture', 'Security', 'Infrastructure'];

  const filteredItems =
    activeFilter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

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
            <span className="text-[#373E0C] font-bold">Visual Gallery</span>
          </div>
        </div>
      </div>

      {/* Page Hero Header */}
      <section className="bg-[#373E0C] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E96818]">
              <MapPin className="w-4 h-4" />
              <span>Plot 20, New Asaba, Delta State, Nigeria</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Estate Visual Gallery & Masterplan
            </h1>
            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl">
              Explore high-resolution conceptual renders, modern duplex architectural concepts, controlled security gatehouses, and planned internal road networks for New Dawn Smart City.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onBookInspection}
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-xl shadow-md transition-all cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book a Site Inspection</span>
              </button>
              <a
                href={`tel:${DEFAULT_SITE_SETTINGS.phones[0].replace(/\s+/g, '')}`}
                className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#E96818]" />
                <span>Call Sales Desk: {DEFAULT_SITE_SETTINGS.phones[0]}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#E96818]/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Main Gallery Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {/* Category Filter Controls & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
          <div>
            <h2 className="text-xl font-bold text-[#373E0C]">
              Architectural & Infrastructure Exhibits
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Showing {filteredItems.length} curated exhibits in {activeFilter} category
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#F2F6EF] border border-[#373E0C]/15 rounded-xl self-start sm:self-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-[#373E0C] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mandatory Transparency Notice */}
        <div className="mb-10 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-amber-950">
              Illustrative Architectural Renderings & Concept Photography
            </span>
            <p className="leading-relaxed text-amber-800">
              Consistent Experts maintains full transparency: the images displayed on this gallery page represent the architectural design concepts and master-planned infrastructure for New Dawn Smart City. Prospective buyers are warmly encouraged to schedule an on-site physical inspection at Plot 20, New Asaba to verify physical terrain, boundary markers, and development progress.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image Container with 16:10 Ratio */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <img
                  src={item.imagePath}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-neutral-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-3 bg-white/95 text-neutral-900 rounded-full shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-5 h-5 text-[#373E0C]" />
                  </span>
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-neutral-900/80 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                  {item.category}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#373E0C] group-hover:text-[#E96818] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">
                    New Dawn Smart City · Plot 20
                  </span>
                  <span className="text-[#373E0C] font-bold group-hover:text-[#E96818] flex items-center gap-1">
                    <span>View High-Res</span>
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Physical Inspection Booking Call-out Strip */}
        <div className="mt-16 bg-[#F2F6EF] rounded-3xl p-8 sm:p-10 border border-[#373E0C]/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-[#E96818]">
              Ready for Physical Verification?
            </div>
            <h3 className="text-2xl font-extrabold text-[#373E0C]">
              Book Your Guided Tour of Plot 20, New Asaba
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl">
              Meet our site coordinators on location to inspect plot pegging, road layouts, and nearby expansion corridors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onBookInspection}
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Book Site Inspection
            </button>
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold text-[#373E0C] bg-white border border-neutral-300 hover:bg-neutral-50 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </main>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-60 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 text-white">
              <div className="text-xs font-semibold text-neutral-300">
                {filteredItems[lightboxIndex].category} · {lightboxIndex + 1} of {filteredItems.length}
              </div>
              <button
                onClick={closeLightbox}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Lightbox Image Viewport */}
            <div className="relative aspect-[16/10] max-h-[68vh] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={filteredItems[lightboxIndex].imagePath}
                alt={filteredItems[lightboxIndex].title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next Controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightbox();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-[#E96818] transition-colors cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightbox();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-[#E96818] transition-colors cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="p-6 bg-neutral-900 text-white border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">
                  {filteredItems[lightboxIndex].title}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {filteredItems[lightboxIndex].description}
                </p>
              </div>

              <button
                onClick={() => {
                  closeLightbox();
                  onBookInspection();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Schedule Site Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
